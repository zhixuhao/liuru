// dwr proxy
Ext.namespace("Ext.ux.data");

Ext.ux.data.DWRProxy = function(config) {
	Ext.apply(this, config);
	if (!this.dwrFn)
		alert("you must give the dwrFn to run!");
	this.dwrlen = this.dwrFn.toString()/* 取得函数参数 长度 */
			.match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").length - 1;
	if (!this.limitPos)
		this.limitPos = this.dwrlen - 1;
	if (!this.startPos)
		this.startPos = this.dwrlen - 2;
	if (!this.sortPos)
		this.sortPos = this.dwrlen - 3;

	Ext.ux.data.DWRProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.data.DWRProxy, Ext.data.DataProxy, {
			re : /start|limit|sort|dir|noPage|noSort/,
			noPage : false,
			noSort : true,// this implementation doesn't support remote
			// sorting. don't set noSort to false!
			sort : '',
			dir : "",
			start : 0,
			limit : 10,
			load : function(params, reader, loadCallback, scope, arg) {
				var l = this.dwrlen, dwrFnArgs = [], flag;
				// 隔离短的请求时可能会引起的冲突
				var dataProxy = this;// for (var p in this)
				// t[p] = this[p];
				if (dataProxy.fireEvent("beforeload", dataProxy, params) !== false) {
					var loadArgs = params['dwrFnArgs'] || params;
					if (loadArgs instanceof Array) {/* 通过数组传入参数 */
						for (var i = 0; i < loadArgs.length; i++) {
							dwrFnArgs[i] = loadArgs[i];
						}
					} else {
						for (var n in loadArgs) {/* 通过对象传入参数 */
							if (dataProxy.re.exec(n)) {
								flag = true;
								dataProxy[n] = loadArgs[n];
							} else {
								dwrFnArgs.push(loadArgs[n]);
							}
						}
					}
					// 如果已经取得start,limit,sort等参数就不重复
					if (!flag)
						for (var p in params) {
							if (dataProxy.re.exec(p))
								dataProxy[p] = params[p];
						}
					// 主要针对于分页时出现的问题
					if (!dwrFnArgs.length) {/* 没有传入参数（不包含分页等） */
						if (dataProxy.initParams)/* 看看有没有初始化参数 */
							dwrFnArgs = dataProxy.initParams;
						else if (dataProxy.lastOptions) /* 看看上次成功的参数 */
							dwrFnArgs = dataProxy.lastOptions;
					}
					var l = dataProxy.dwrlen, l2 = dwrFnArgs.length;
					// 对不足位的补undefined,如果java中是基本类型，int,float就会出现错误
					for (var i = l2 - 1; i < l; i++) {
						dwrFnArgs.push({});
					}
					// 默认是采用分页，采用
					if (!dataProxy.noPage) {
						dwrFnArgs[dataProxy.startPos] = dataProxy.start;
						// 这里是为了防止分页时出现NAN值
						params.start = dataProxy.start;
						dwrFnArgs[dataProxy.limitPos] = dataProxy.limit;
						params.limit = dataProxy.limit;
					}
					if (!dataProxy.noSort) {
						var s = dataProxy.sort + " " + dataProxy.dir
						dwrFnArgs[dataProxy.noPage ? l - 1 : dataProxy.sortPos] = s;
					}

					var cb = function(response) {
						dataProxy.lastOptions = dwrFnArgs;
						var records = reader.read(response);
						dataProxy.fireEvent("load", dataProxy, response,
								loadCallback);
						loadCallback.call(scope, records, arg, true);
					}

					var eh = function(message, exception) {
						alert(exception.message);
						dataProxy.fireEvent("loadexception", dataProxy,
								message, loadCallback, exception);
						loadCallback.call(scope, null, arg, false);
					};
					dwrFnArgs[l] = {// dwr配置参数
						callback : cb,
						exceptionHandler : eh
					};
					// alert(dwrFnArgs)
					dataProxy.dwrFn.apply(Object, dwrFnArgs);
				} else {
					loadCallback.call(scope || dataProxy, null, arg, false);
				}
			}
		});

// listrange reader
Ext.ux.data.ListRangeReader = function(meta, recordType) {
	Ext.ux.data.ListRangeReader.superclass.constructor.call(this, meta,
			recordType);
	this.recordType = recordType;
};
Ext.extend(Ext.ux.data.ListRangeReader, Ext.data.DataReader, {
			getJsonAccessor : function() {
				var re = /[\[\.]/;
				return function(expr) {
					try {
						return (re.test(expr)) ? new Function("obj",
								"return obj." + expr) : function(obj) {
							return obj[expr];
						};
					} catch (e) {
					}
					return Ext.emptyFn;
				};
			}(),

			read : function(o) {
				var recordType = this.recordType, fields = recordType.prototype.fields;

				// Generate extraction functions for the totalProperty, the
				// root, the id, and for each field
				if (!this.ef) {
					if (this.meta.totalProperty) {
						this.getTotal = this
								.getJsonAccessor(this.meta.totalProperty);
					}

					if (this.meta.successProperty) {
						this.getSuccess = this
								.getJsonAccessor(this.meta.successProperty);
					}

					if (this.meta.id) {
						var g = this.getJsonAccessor(this.meta.id);
						this.getId = function(rec) {
							var r = g(rec);
							return (r === undefined || r === "") ? null : r;
						};
					} else {
						this.getId = function() {
							return null;
						};
					}
					this.ef = [];
					for (var i = 0; i < fields.length; i++) {
						f = fields.items[i];
						var map = (f.mapping !== undefined && f.mapping !== null)
								? f.mapping
								: f.name;
						this.ef[i] = this.getJsonAccessor(map);
					}
				}

				var records = [];
				var root = o.data, c = root.length, totalRecords = c, success = true;

				if (this.meta.totalProperty) {
					var v = parseInt(this.getTotal(o), 10);
					if (!isNaN(v)) {
						totalRecords = v;
					}
				}

				if (this.meta.successProperty) {
					var v = this.getSuccess(o);
					if (v === false || v === 'false') {
						success = false;
					}
				}

				for (var i = 0; i < c; i++) {
					var n = root[i];
					var values = {};
					var id = this.getId(n);
					for (var j = 0; j < fields.length; j++) {
						f = fields.items[j];
						var v = this.ef[j](n);
						values[f.name] = f.convert((v !== undefined)
								? v
								: f.defaultValue);
					}
					var record = new recordType(values, id);
					records[i] = record;
				}

				return {
					success : success,
					records : records,
					totalRecords : totalRecords
				};
			}
		});

// dwr treeloader
Ext.namespace("Ext.ux.tree");

Ext.ux.tree.DWRTreeLoader = function(config) {
	Ext.ux.tree.DWRTreeLoader.superclass.constructor.call(this, config);
};

Ext.extend(Ext.ux.tree.DWRTreeLoader, Ext.tree.TreeLoader, {
			load : function(node, callback) {
				if (this.clearOnLoad) {
					while (node.firstChild) {
						node.removeChild(node.firstChild);
					}
				}
				if (node.attributes.children) {
					// preloaded json children var cs =
					// node.attributes.children;
					for (var i = 0, len = cs.length; i < len; i++) {
						node.appendChild(this.createNode(cs[i]));
					}
					if (typeof callback == "function") {
						callback();
					}
				} else if (this.dwrCall) {
					this.requestData(node, callback);
				}
			},
			requestData : function(node, callback) {
				if (this.fireEvent("beforeload", this, node, callback) !== false) {
					// var params = this.getParams(node);
					var callParams = new Array();
					var success = this.handleResponse.createDelegate(this, [
									node, callback], 1);
					var error = this.handleFailure.createDelegate(this, [node,
									callback], 1);
					callParams.push(node.id);
					callParams.push({
								callback : success,
								errorHandler : error
							});
					this.transId = true;
					this.dwrCall.apply(this, callParams);
				} else {
					// if the load is cancelled, make sure we notify // the node
					// that we are done
					if (typeof callback == "function") {
						callback();
					}
				}
			},
			processResponse : function(response, node, callback) {
				try {
					for (var i = 0; i < response.length; i++) {
						var n = this.createNode(response[i]);
						if (n) {
							node.appendChild(n);
						}
					}
					if (typeof callback == "function") {
						callback(this, node);
					}
				} catch (e) {
					this.handleFailure(response);
				}
			},
			handleResponse : function(response, node, callback) {
				this.transId = false;
				this.processResponse(response, node, callback);
				this.fireEvent("load", this, node, response);
			},
			handleFailure : function(response, node, callback) {
				this.transId = false;
				this.fireEvent("loadexception", this, node, response);
				if (typeof callback == "function") {
					callback(this, node);
				}
			}
		});

// formtable
/**
 * @class Ext.ux.FormTableLayout
 * @extends Ext.layout.ContainerLayout
 * 
 * FormTableLayout= FormLayout + TableLayout
 * 
 * 适用于FormLayout/TableLayout适用的场合。 除拥有FormLayout/TableLayout特征外，还具有指定单元格显示功能：
 * 设置autoFlow为true，根据items项的row/col属性定位单元格排列。
 * 可以在同一单元格内显示多项item(指定row/col)为同一位置即可，按在原数组中的顺序排列。 注：
 * 1)若autoFlow为true，items项没有row或col属性的均不被显示。
 * 2)若某item的row/col设置在被融合了的单元格位置，则该项不被显示。
 * 
 */
Ext.namespace('Ext.us.layout');
Ext.us.layout.FormTableLayout = Ext.extend(Ext.layout.ContainerLayout, {
	// private
	monitorResize : false,

	/**
	 * Table列数
	 */
	columns : 2,
	/**
	 * 是否自动排列 若为true，则按行方向自动排列。 若为false，则根据item指定的[row,col]排列，无row/col属性的项被忽略显示。
	 */
	autoFlow : true,
	/**
	 * Form Element显示模板
	 */
	fieldTpl : new Ext.Template(
			'<div class="x-form-item {5}" tabIndex="-1">',
			'<label for="{0}" style="{2}" class="x-form-item-label">{1}{4}</label>',
			'<div class="x-form-element" id="x-form-el-{0}" style="{3}">',
			'</div><div class="{6}"></div>', '</div>'),

	/**
	 * 普通内容(非Form Element)显示模板
	 */
	cellContentTpl : new Ext.Template('<div class="x-form-item-label">{0}</div>'),
	hiddenTpl : new Ext.Template('<INPUT class=" x-form-hidden x-form-field" id=ext-comp-1005 type=hidden value={1} name={0} autocomplete="off">'),

	// private
	setContainer : function(ct) {
		Ext.us.layout.FormTableLayout.superclass.setContainer.call(this, ct);
		this.currentRow = 0;
		this.currentColumn = 0;
		this.spanCells = [];
		this.maxCreatedRowIndex = -1;
	},

	// private
	onLayout : function(ct, target) {
		var cs = ct.items.items, len = cs.length;

		if (!this.table) {
			// target.addClass('x-table-layout-ct');
			this.table = target.createChild({
						tag : 'table',
						cls : 'x-table-layout',
						border : 0,
						cellspacing : 3,
						cn : {
							tag : 'tbody'
						}
					}, null, true);

			if (!this.autoFlow) {
				var items = [];
				for (var i = 0; i < len; i++) {
					// 如果设置了autoFlow为true，则无row、col属性的字段将无法显示。
					if (typeof cs.row != 'undefined'
							&& typeof cs.col != 'undefined') {
						cs.__index = i;
						items.push(cs);
					}
				}
				ct.items.items = items.sort(function(item1, item2) {
							if (item1.row == item2.row) {
								if (item1.col == item2.col) {
									return item1.__index - item2.__index;
								}
								return item1.col - item2.col;
							}
							return item1.row - item2.row;
						});
			}
			this.renderAll(ct, target);
		} else {
			this.renderAll(ct, target);
		}
	},

	// private
	createRow : function(index) {
		var row = this.table.tBodies[0].childNodes[index];
		if (!row) {
			row = document.createElement('tr');
			this.table.tBodies[0].appendChild(row);
			this.maxCreatedRowIndex = Math.max(this.maxCreatedRowIndex, index);
		}
		return row;
	},

	// private
	getRow : function(index) {
		if (!this.autoFlow) {
			// 确保创建index之前的row
			for (var i = Math.max(0, this.maxCreatedRowIndex + 1); i < index; i++) {
				this.createRow(i);
			}
		}
		return this.createRow(index);
	},

	// private
	getCellAt : function(c, row, col) {
		if (this.spanCells[col] && this.spanCells[col][row]) {
			return null;
		}
		// 计算之前有多少spanCells
		var spanCount = 0;
		for (var i = 0; i < col; i++) {
			if (this.spanCells && this.spanCells[row]) {
				spanCount++;
			}
		}
		var r = this.getRow(row);

		var cell = r.childNodes[col - spanCount];
		if (cell) {
			return cell;
		}
		this.currentRow = row;
		// 预设置nextCell之前的初始列索引
		this.currentColumn = spanCount - 1;
		for (var i = spanCount; i <= col; i++) {
			this.getNextCell(c);
		}
		return r.childNodes[col - spanCount];
	},

	// private
	getNextCell : function(c) {
		var td = document.createElement('td'), row, colIndex;
		if (!this.columns) {
			row = this.getRow(0);
		} else {
			colIndex = this.currentColumn;
			if (colIndex !== 0 && (colIndex % this.columns === 0)) {
				this.currentRow++;
				colIndex = (c.colspan || 1);
			} else {
				colIndex += (c.colspan || 1);
			}

			// advance to the next non-spanning row/col position
			var cell = this.getNextNonSpan(colIndex, this.currentRow);
			this.currentColumn = cell[0];
			if (cell[1] != this.currentRow) {
				this.currentRow = cell[1];
				if (c.colspan) {
					this.currentColumn += c.colspan - 1;
				}
			}
			row = this.getRow(this.currentRow);
		}
		if (c.colspan) {
			td.colSpan = c.colspan;
		}
		td.className = 'x-table-layout-cell';
		if (c.rowspan) {
			td.rowSpan = c.rowspan;
			var rowIndex = this.currentRow, colspan = c.colspan || 1;
			// track rowspanned cells to add to the column index during the next
			// call to getNextCell
			for (var r = rowIndex + 1; r < rowIndex + c.rowspan; r++) {
				for (var col = this.currentColumn - colspan + 1; col <= this.currentColumn; col++) {
					if (!this.spanCells[col]) {
						this.spanCells[col] = [];
					}
					this.spanCells[col][r] = 1;
				}
			}
		}
		row.appendChild(td);
		return td;
	},

	// private
	getNextNonSpan : function(colIndex, rowIndex) {
		var c = (colIndex <= this.columns ? colIndex : this.columns), r = rowIndex;
		for (var i = c; i <= this.columns; i++) {
			if (this.spanCells && this.spanCells[r]) {
				if (++c > this.columns) {
					// exceeded column count, so reset to the start of the next
					// row
					return this.getNextNonSpan(1, ++r);
				}
			} else {
				break;
			}
		}
		return [c, r];
	},

	// private
	renderItem : function(c, position, target) {
		// target is form or other container
		if (c && !c.rendered) {
			var td = this.autoFlow ? this.getNextCell(c) : this.getCellAt(c,
					c.row, c.col);
			if (!td) {
				alert("超过最大允许列数！");
				// cell at[row,col] is spanCell，不渲染。(row,col设置不正确)
				return;
			}
			// if(c.isFormField && c.inputType != 'hidden'){
			if (c.inputType != 'hidden') {
				var args = [
						c.id,
						c.fieldLabel,
						c.labelStyle || this.labelStyle || '',
						this.elementStyle || '',
						typeof c.labelSeparator == 'undefined'
								? this.labelSeparator
								: c.labelSeparator,
						(c.itemCls || this.container.itemCls || '')
								+ (c.hideLabel ? ' x-hide-label' : ''),
						c.clearCls || 'x-form-clear-left'];
				if (typeof position == 'number') {
					position = target.dom.childNodes[position] || null;
				}
				if (position) {
					// this.fieldTpl.insertBefore(position, args);
					this.fieldTpl.append(td, args);
				} else {
					// this.fieldTpl.append(target, args);
					this.fieldTpl.append(td, args);
				}
				c.render('x-form-el-' + c.id);
			} else {
				// Ext.us.layout.FormTableLayout.superclass.renderItem.apply(this,
				// arguments);
				// this.cellContentTpl.append(td,[c.text||c.html||c.value]);
				this.hiddenTpl.append(td, [c.name, c.value]);

			}
		}
	},
	doLayout : function(shallow) {
		if (this.rendered && this.layout) {
			this.layout.layout();
		}
		if (shallow !== false && this.items) {
			var cs = this.items.items;
			for (var i = 0, len = cs.length; i < len; i++) {
				var c = cs;
				if (c.doLayout) {
					c.doLayout();
				}
			}
		}
	},
	add : function(comp) {
		alert("");
		if (!this.items) {
			this.initItems();
		}
		var a = arguments, len = a.length;
		if (len > 1) {
			for (var i = 0; i < len; i++) {
				this.add(a);
			}
			return;
		}
		var c = this.lookupComponent(this.applyDefaults(comp));
		var pos = this.items.length;
		if (this.fireEvent('beforeadd', this, c, pos) !== false
				&& this.onBeforeAdd(c) !== false) {
			this.items.add(c);
			c.ownerCt = this;
			this.fireEvent('add', this, c, pos);
		}
		return c;
	},
	// private
	isValidParent : function(c, target) {
		return true;
	}
});
Ext.Container.LAYOUTS['formtable'] = Ext.us.layout.FormTableLayout;