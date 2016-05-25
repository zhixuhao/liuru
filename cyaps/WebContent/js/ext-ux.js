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
						var s = dataProxy.sort + " " + dataProxy.dir;
						dwrFnArgs[dataProxy.noPage ? l - 1 : dataProxy.sortPos] = s;
					}

					var cb = function(response) {
						dataProxy.lastOptions = dwrFnArgs;
						var records = reader.read(response);
						dataProxy.fireEvent("load", dataProxy, response,
								loadCallback);
						loadCallback.call(scope, records, arg, true);
					};

					var eh = function(message, exception) {
						alert(exception.message);
						dataProxy.fireEvent("exception", dataProxy,
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
					// preloaded json children
					var cs = node.attributes.children;
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
					// if the load is cancelled, make sure we notify
					// the node that we are done
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

// tableform
Ext.namespace('Ext.ux.layout');
Ext.ux.layout.TableFormLayout = Ext.extend(Ext.layout.TableLayout, {
			renderAll : function(ct, target) {
				var items = ct.items.items;
				for (var i = 0, len = items.length; i < len; i++) {
					var c = items[0]; // use 0 index because the array shrinks
					// by one
					// after each call to renderItem()
					if (c && (!c.rendered || !this.isValidParent(c, target))) {
						this.renderItem(c, i, target);
					}
				}
			},

			renderItem : function(c, position, target) {
				if (c && !c.rendered) {
					var td = this.getNextCell(c);
					var p = new Ext.Panel(Ext.apply(this.container.formConfig,
							{
								layout : 'form', // this is the tableform
								// layout so force each
								// cell panel to have a form layout
								items : c,
								renderTo : td
							}));
				}
			}
		});
Ext.Container.LAYOUTS['tableform'] = Ext.ux.layout.TableFormLayout;

/*******************************************************************************
 * @class Ext.form.Action.DWRLoad
 * @extends Ext.form.Action Load data from DWR function options: dwrFunction,
 *          dwrArgs
 * @constructor
 * @param {Object}
 *            form
 * @param {Object}
 *            options
 */
Ext.form.Action.DWRLoad = function(form, options) {
	Ext.form.Action.DWRLoad.superclass.constructor.call(this, form, options);
};
Ext.extend(Ext.form.Action.DWRLoad, Ext.form.Action, {
			// private
			type : 'load',
			run : function() {
				var dwrFunctionArgs = [];
				var loadArgs = this.options.dwrArgs || [];
				if (loadArgs instanceof Array) {
					// Note: can't do a foreach loop over arrays because Ext
					// added the "remove" method to Array's prototype.
					// This "remove" method gets added as an argument unless we
					// explictly use numeric indexes.
					for (var i = 0; i < loadArgs.length; i++) {
						dwrFunctionArgs.push(loadArgs[i]);
					}
				} else {
					// loadArgs should be an Object
					for (var loadArgName in loadArgs) {
						dwrFunctionArgs.push(loadArgs[loadArgName]);
					}
				}
				dwrFunctionArgs.push({
							callback : this.success.createDelegate(this, this
											.createCallback(), 1),
							exceptionHandler : this.failure.createDelegate(
									this, this.createCallback(), 1)
						});
				this.options.dwrFunction.apply(Object, dwrFunctionArgs);
			},

			success : function(response) {
				var result = this.handleResponse(response);
				if (result === true || !result.success || !result.data) {
					this.failureType = Ext.form.Action.LOAD_FAILURE;
					this.form.afterAction(this, false);
					return;
				}
				this.form.clearInvalid();
				this.form.setValues(result.data);
				this.form.afterAction(this, true);
			},

			handleResponse : function(response) {
				if (this.form.reader) {
					var rs = this.form.reader.readRecords([response]);
					var data = rs.records && rs.records[0]
							? rs.records[0].data
							: null;
					this.result = {
						success : rs.success,
						data : data
					};
					return this.result;
				}
				this.result = response;
				return this.result;
			}
		});
Ext.form.Action.ACTION_TYPES.dwrload = Ext.form.Action.DWRLoad;
/**
 * @class Ext.form.Action.DWRSubmit
 * @extends Ext.form.Action Submit data through DWR function options:
 *          dwrFunction
 * @constructor
 * @param {Object}
 *            form
 * @param {Object}
 *            options
 */
Ext.form.Action.DWRSubmit = function(form, options) {
	Ext.form.Action.Submit.superclass.constructor.call(this, form, options);
};
Ext.extend(Ext.form.Action.DWRSubmit, Ext.form.Action, {
			type : 'submit',
			// private
			run : function() {
				var o = this.options;
				if (o.clientValidation === false || this.form.isValid()) {
					var dwrFunctionArgs = [];
					dwrFunctionArgs.push(this.form.getValues());
					dwrFunctionArgs.push({
								callback : this.success.createDelegate(this,
										this.createCallback(), 1),
								exceptionHandler : this.failure.createDelegate(
										this, this.createCallback(), 1)
							});
					this.options.dwrFunction.apply(Object, dwrFunctionArgs);
				} else if (o.clientValidation !== false) { // client validation
					// failed
					this.failureType = Ext.form.Action.CLIENT_INVALID;
					this.form.afterAction(this, false);
				}
			},
			// private
			success : function(response) {
				var result = this.handleResponse(response);
				if (result === true || result.success) {
					this.form.afterAction(this, true);
					return;
				}
				if (result.errors) {
					this.form.markInvalid(result.errors);
					this.failureType = Ext.form.Action.SERVER_INVALID;
				}
				this.form.afterAction(this, false);
			},
			// private
			handleResponse : function(response) {
				if (this.form.errorReader) {
					var rs = this.form.errorReader.read([response]);
					var errors = [];
					if (rs.records) {
						for (var i = 0, len = rs.records.length; i < len; i++) {
							var r = rs.records[i];
							errors[i] = r.data;
						}
					}
					if (errors.length < 1) {
						errors = null;
					}
					this.result = {
						success : rs.success,
						errors : errors
					};
					return this.result;
				}
				this.result = response;
				return this.result;
			}
		});
Ext.form.Action.ACTION_TYPES.dwrsubmit = Ext.form.Action.DWRSubmit;
