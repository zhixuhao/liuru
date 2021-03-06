﻿
// eval
Ext.define("Sch.util.Patch", {
	target : null,
	minVersion : null,
	maxVersion : null,
	reportUrl : null,
	description : null,
	applyFn : null,
	ieOnly : false,
	onClassExtended : function(a, b) {
		if (Sch.disableOverrides) {
			return
		}
		if (b.ieOnly && !Ext.isIE) {
			return
		}
		if (b.applyFn) {
			b.applyFn()
		} else {
			if ((!b.minVersion || Ext.versions.extjs.equals(b.minVersion) || Ext.versions.extjs
					.isGreaterThan(b.minVersion))
					&& (!b.maxVersion
							|| Ext.versions.extjs.equals(b.maxVersion) || Ext.versions.extjs
							.isLessThan(b.maxVersion))) {
				b.requires[0].override(b.overrides)
			}
		}
	}
});
Ext.define("Sch.patches.LoadMask", {
	extend : "Sch.util.Patch",
	requires : ["Ext.view.AbstractView"],
	minVersion : "4.1.0b3",
	reportURL : "",
	description : "",
	overrides : {}
});
Ext.define("Sch.patches.TreeView", {
			extend : "Sch.util.Patch",
			requires : ["Ext.tree.View"],
			applyFn : function() {
				Ext.tree.View.addMembers({
							providedStore : null,
							initComponent : function() {
								var a = this, b = a.panel.getStore();
								if (a.initialConfig.animate === undefined) {
									a.animate = Ext.enableFx
								}
								a.store = a.providedStore
										|| new Ext.data.NodeStore({
													treeStore : b,
													recursive : true,
													rootVisible : a.rootVisible
												});
								a.store.on({
											beforeexpand : a.onBeforeExpand,
											expand : a.onExpand,
											beforecollapse : a.onBeforeCollapse,
											collapse : a.onCollapse,
											write : a.onStoreWrite,
											datachanged : a.onStoreDataChanged,
											scope : a
										});
								if (a.node && !a.store.node) {
									a.setRootNode(a.node)
								}
								a.animQueue = {};
								a.animWraps = {};
								a.addEvents("afteritemexpand",
										"afteritemcollapse");
								a.callParent(arguments);
								a.on({
											element : "el",
											scope : a,
											delegate : a.expanderSelector,
											mouseover : a.onExpanderMouseOver,
											mouseout : a.onExpanderMouseOut
										});
								a.on({
											element : "el",
											scope : a,
											delegate : a.checkboxSelector,
											click : a.onCheckboxChange
										})
							}
						})
			}
		});
Ext.define("Sch.patches.DataOperation", {
	extend : "Sch.util.Patch",
	requires : ["Ext.data.Operation"],
	reportURL : "",
	description : "",
	maxVersion : "4.1.0",
	overrides : {
		commitRecords : function(j) {
			var g = this, h, f, a, c, b, d, e;
			if (!g.actionSkipSyncRe.test(g.action)) {
				a = g.records;
				if (a && a.length) {
					if (a.length > 1) {
						if (g.action == "update" || a[0].clientIdProperty) {
							h = new Ext.util.MixedCollection();
							h.addAll(j);
							for (f = a.length; f--;) {
								b = a[f];
								c = h.findBy(g.matchClientRec, b);
								b.copyFrom(c)
							}
						} else {
							for (d = 0, e = a.length; d < e; ++d) {
								b = a[d];
								c = j[d];
								if (b && c) {
									g.updateRecord(b, c)
								}
							}
						}
					} else {
						this.updateRecord(a[0], j[0])
					}
					if (g.actionCommitRecordsRe.test(g.action)) {
						for (f = a.length; f--;) {
							a[f].commit()
						}
					}
				}
			}
		},
		updateRecord : function(a, b) {
			if (b && (a.phantom || a.getId() === b.getId())) {
				a.copyFrom(b)
			}
		}
	}
});
Ext.define("Sch.patches.TreeStore", {
	extend : "Sch.util.Patch",
	requires : ["Ext.data.TreeStore"],
	description : "",
	maxVersion : "4.1.0",
	overrides : {
		onCreateRecords : function(c) {
			this.callParent(arguments);
			var d = 0, b = c.length, a = this.tree, e;
			for (; d < b; ++d) {
				e = c[d];
				a.onNodeIdChanged(e, null, e.getId())
			}
		},
		setRootNode : function(a, e) {
			var d = this, c = d.model, b = c.prototype.idProperty;
			a = a || {};
			if (!a.isModel) {
				Ext.applyIf(a, {
							text : "Root",
							allowDrag : false
						});
				if (a[b] === undefined) {
					a[b] = d.defaultRootId
				}
				Ext.data.NodeInterface.decorate(c);
				a = Ext.ModelManager.create(a, c)
			} else {
				if (a.isModel && !a.isNode) {
					Ext.data.NodeInterface.decorate(c)
				}
			}
			d.getProxy().getReader().buildExtractors(true);
			d.tree.setRootNode(a);
			if (e !== true && !a.isLoaded()
					&& (d.autoLoad === true || a.isExpanded())) {
				d.load({
							node : a
						})
			}
			return a
		}
	}
});
Ext.define("Sch.view.Locking", {
	extend : "Ext.grid.LockingView",
	scheduleEventRelayRe : /^(schedule|event|beforeevent|afterevent|dragcreate|beforedragcreate|afterdragcreate|beforetooltipshow)/,
	constructor : function(b) {
		this.callParent(arguments);
		var e = this, g = [], a = e.scheduleEventRelayRe, f = b.normal
				.getView(), c = f.events, d;
		for (d in c) {
			if (c.hasOwnProperty(d) && a.test(d)) {
				g.push(d)
			}
		}
		e.relayEvents(f, g)
	},
	getElementFromEventRecord : function(a) {
		return this.normal.getView().getElementFromEventRecord(a)
	},
	onClear : function() {
		this.relayFn("onClear", arguments)
	},
	beginBulkUpdate : function() {
		this.relayFn("beginBulkUpdate", arguments)
	},
	endBulkUpdate : function() {
		this.relayFn("endBulkUpdate", arguments)
	},
	refreshKeepingScroll : function() {
		this.locked.getView().refresh();
		this.normal.getView().refreshKeepingScroll()
	}
});
Ext.define("Sch.tooltip.ClockTemplate", {
	constructor : function() {
		var h = Math.PI / 180, k = Math.cos, i = Math.sin, l = 7, c = 2, d = 10, j = 6, e = 3, a = 10;
		function b(m) {
			var p = m * h, n = k(p), s = i(p), q = j * i((90 - m) * h), r = j
					* k((90 - m) * h), t = Math.min(j, j - q), o = m > 180
					? r
					: 0, u = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = "
					+ n
					+ ", M12 = "
					+ (-s)
					+ ", M21 = "
					+ s
					+ ", M22 = "
					+ n
					+ ")";
			return Ext.String.format(
					"filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", u,
					t + e, o + a)
		}
		function g(m) {
			var p = m * h, n = k(p), s = i(p), q = l * i((90 - m) * h), r = l
					* k((90 - m) * h), t = Math.min(l, l - q), o = m > 180
					? r
					: 0, u = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = "
					+ n
					+ ", M12 = "
					+ (-s)
					+ ", M21 = "
					+ s
					+ ", M22 = "
					+ n
					+ ")";
			return Ext.String.format(
					"filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", u,
					t + c, o + d)
		}
		function f(m) {
			return Ext.String
					.format(
							"transform:rotate({0}deg);-moz-transform: rotate({0}deg);-webkit-transform: rotate({0}deg);-o-transform:rotate({0}deg);",
							m)
		}
		return new Ext.XTemplate(
				'<div class="sch-clockwrap {cls}"><div class="sch-clock"><div class="sch-hourIndicator" style="{[this.getHourStyle((values.date.getHours()%12) * 30)]}">{[Ext.Date.monthNames[values.date.getMonth()].substr(0,3)]}</div><div class="sch-minuteIndicator" style="{[this.getMinuteStyle(values.date.getMinutes() * 6)]}">{[values.date.getDate()]}</div></div><span class="sch-clock-text">{text}</span></div>',
				{
					compiled : true,
					disableFormats : true,
					getMinuteStyle : Ext.isIE ? g : f,
					getHourStyle : Ext.isIE ? b : f
				})
	}
});
Ext.define("Sch.tooltip.Tooltip", {
	extend : "Ext.tip.ToolTip",
	requires : ["Sch.tooltip.ClockTemplate"],
	autoHide : false,
	anchor : "b",
	padding : "0 3 0 0",
	showDelay : 0,
	hideDelay : 0,
	quickShowInterval : 0,
	dismissDelay : 0,
	trackMouse : false,
	valid : true,
	anchorOffset : 5,
	shadow : false,
	frame : false,
	constructor : function(b) {
		var a = Ext.create("Sch.tooltip.ClockTemplate");
		this.renderTo = document.body;
		this.startDate = this.endDate = new Date();
		if (!this.template) {
			this.template = Ext
					.create(
							"Ext.XTemplate",
							'<div class="{[values.valid ? "sch-tip-ok" : "sch-tip-notok"]}">',
							'{[this.renderClock(values.startDate, values.startText, "sch-tooltip-startdate")]}',
							'{[this.renderClock(values.endDate, values.endText, "sch-tooltip-enddate")]}',
							"</div>", {
								compiled : true,
								disableFormats : true,
								renderClock : function(d, e, c) {
									return a.apply({
												date : d,
												text : e,
												cls : c
											})
								}
							})
		}
		this.callParent(arguments)
	},
	update : function(a, e, d) {
		if (this.startDate - a !== 0 || this.endDate - e !== 0
				|| this.valid !== d) {
			this.startDate = a;
			this.endDate = e;
			this.valid = d;
			var c = this.schedulerView.getFormattedDate(a), b = this.schedulerView
					.getFormattedEndDate(e, a);
			if (this.mode === "calendar"
					&& e.getHours() === 0
					&& e.getMinutes() === 0
					&& !(e.getYear() === a.getYear()
							&& e.getMonth() === a.getMonth() && e.getDate() === a
							.getDate())) {
				e = Sch.util.Date.add(e, Sch.util.Date.DAY, -1)
			}
			this.callParent([this.template.apply({
						valid : d,
						startDate : a,
						startText : c,
						endText : b,
						endDate : e
					})])
		}
	},
	show : function(b, a) {
		if (!b) {
			return
		}
		if (Sch.util.Date.compareUnits(
				this.schedulerView.getTimeResolution().unit, Sch.util.Date.DAY) >= 0) {
			this.mode = "calendar";
			this.addCls("sch-day-resolution")
		} else {
			this.mode = "clock";
			this.removeCls("sch-day-resolution")
		}
		this.mouseOffsets = [a - 18, -7];
		this.setTarget(b);
		this.callParent();
		this.alignTo(b, "bl-tl", this.mouseOffsets)
	},
	onMouseMove : function() {
		this.el.alignTo(this.target, "bl-tl", this.mouseOffsets);
		this.callParent(arguments)
	},
	afterRender : function() {
		this.callParent(arguments);
		this.el.on("mouseenter", this.onElMouseEnter, this)
	},
	onElMouseEnter : function() {
		this.alignTo(this.target, "bl-tl", this.mouseOffsets)
	}
});
Ext.define("Sch.util.Date", {
			requires : "Ext.Date",
			singleton : true,
			constructor : function() {
				var a = Ext.Date;
				var c = {
					MILLI : a.MILLI,
					SECOND : a.SECOND,
					MINUTE : a.MINUTE,
					HOUR : a.HOUR,
					DAY : a.DAY,
					WEEK : "w",
					MONTH : a.MONTH,
					QUARTER : "q",
					YEAR : a.YEAR
				};
				Ext.apply(this, c);
				var b = this;
				this.units = [b.MILLI, b.SECOND, b.MINUTE, b.HOUR, b.DAY,
						b.WEEK, b.MONTH, b.QUARTER, b.YEAR];
				for (var d in c) {
					if (c.hasOwnProperty(d)) {
						b.unitNames[c[d]] = b.unitNames[d]
					}
				}
			},
			betweenLesser : function(b, d, a) {
				var c = b.getTime();
				return d.getTime() <= c && c < a.getTime()
			},
			constrain : function(b, c, a) {
				return this.min(this.max(b, c), a)
			},
			compareUnits : function(c, b) {
				var a = Ext.Array.indexOf(this.units, c), d = Ext.Array
						.indexOf(this.units, b);
				return a > d ? 1 : (a < d ? -1 : 0)
			},
			isUnitGreater : function(b, a) {
				return this.compareUnits(b, a) > 0
			},
			copyTimeValues : function(b, a) {
				b.setHours(a.getHours());
				b.setMinutes(a.getMinutes());
				b.setSeconds(a.getSeconds());
				b.setMilliseconds(a.getMilliseconds())
			},
			add : function(b, c, e) {
				var f = Ext.Date.clone(b);
				if (!c || e === 0) {
					return f
				}
				switch (c.toLowerCase()) {
					case this.MILLI :
						f = new Date(b.getTime() + e);
						break;
					case this.SECOND :
						f = new Date(b.getTime() + (e * 1000));
						break;
					case this.MINUTE :
						f = new Date(b.getTime() + (e * 60000));
						break;
					case this.HOUR :
						f = new Date(b.getTime() + (e * 3600000));
						break;
					case this.DAY :
						f.setDate(b.getDate() + e);
						break;
					case this.WEEK :
						f.setDate(b.getDate() + e * 7);
						break;
					case this.MONTH :
						var a = b.getDate();
						if (a > 28) {
							a = Math.min(a,
									Ext.Date.getLastDateOfMonth(this.add(
											Ext.Date.getFirstDateOfMonth(b),
											this.MONTH, e)).getDate())
						}
						f.setDate(a);
						f.setMonth(f.getMonth() + e);
						break;
					case this.QUARTER :
						f = this.add(b, this.MONTH, e * 3);
						break;
					case this.YEAR :
						f.setFullYear(b.getFullYear() + e);
						break
				}
				return f
			},
			getMeasuringUnit : function(a) {
				if (a === this.WEEK) {
					return this.DAY
				}
				return a
			},
			getDurationInUnit : function(d, a, c) {
				var b;
				switch (c) {
					case this.YEAR :
						b = Math.round(this.getDurationInYears(d, a));
						break;
					case this.QUARTER :
						b = Math.round(this.getDurationInMonths(d, a) / 3);
						break;
					case this.MONTH :
						b = Math.round(this.getDurationInMonths(d, a));
						break;
					case this.WEEK :
						b = Math.round(this.getDurationInDays(d, a)) / 7;
						break;
					case this.DAY :
						b = Math.round(this.getDurationInDays(d, a));
						break;
					case this.HOUR :
						//Modified By James Zhang
//						b = Math.round(this.getDurationInHours(d, a));
						b = this.getDurationInHours(d, a);   
						break;
					case this.MINUTE :
						b = Math.round(this.getDurationInMinutes(d, a));
						break;
					case this.SECOND :
						b = Math.round(this.getDurationInSeconds(d, a));
						break;
					case this.MILLI :
						b = Math.round(this.getDurationInMilliseconds(d, a));
						break
				}
				return b
			},
			getUnitToBaseUnitRatio : function(b, a) {
				if (b === a) {
					return 1
				}
				switch (b) {
					case this.YEAR :
						switch (a) {
							case this.QUARTER :
								return 1 / 4;
							case this.MONTH :
								return 1 / 12
						}
						break;
					case this.QUARTER :
						switch (a) {
							case this.YEAR :
								return 4;
							case this.MONTH :
								return 1 / 3
						}
						break;
					case this.MONTH :
						switch (a) {
							case this.YEAR :
								return 12;
							case this.QUARTER :
								return 3
						}
						break;
					case this.WEEK :
						switch (a) {
							case this.DAY :
								return 1 / 7;
							case this.HOUR :
								return 1 / 168
						}
						break;
					case this.DAY :
						switch (a) {
							case this.WEEK :
								return 7;
							case this.HOUR :
								return 1 / 24;
							case this.MINUTE :
								return 1 / 1440
						}
						break;
					case this.HOUR :
						switch (a) {
							case this.DAY :
								return 24;
							case this.MINUTE :
								return 1 / 60
						}
						break;
					case this.MINUTE :
						switch (a) {
							case this.HOUR :
								return 60;
							case this.SECOND :
								return 1 / 60;
							case this.MILLI :
								return 1 / 60000
						}
						break;
					case this.SECOND :
						switch (a) {
							case this.MILLI :
								return 1 / 1000
						}
						break;
					case this.MILLI :
						switch (a) {
							case this.SECOND :
								return 1000
						}
						break
				}
				return -1
			},
			getDurationInMilliseconds : function(b, a) {
				return (a - b)
			},
			getDurationInSeconds : function(b, a) {
				return (a - b) / 1000
			},
			getDurationInMinutes : function(b, a) {
				return (a - b) / 60000
			},
			getDurationInHours : function(b, a) {
				return (a - b) / 3600000
			},
			getDurationInDays : function(b, a) {
				return (a - b) / 86400000
			},
			getDurationInBusinessDays : function(g, b) {
				var c = Math.round((b - g) / 86400000), a = 0, f;
				for (var e = 0; e < c; e++) {
					f = this.add(g, this.DAY, e).getDay();
					if (f !== 6 && f !== 0) {
						a++
					}
				}
				return a
			},
			getDurationInMonths : function(b, a) {
				return ((a.getFullYear() - b.getFullYear()) * 12)
						+ (a.getMonth() - b.getMonth())
			},
			getDurationInYears : function(b, a) {
				return this.getDurationInMonths(b, a) / 12
			},
			min : function(b, a) {
				return b < a ? b : a
			},
			max : function(b, a) {
				return b > a ? b : a
			},
			intersectSpans : function(c, d, b, a) {
				return this.betweenLesser(c, b, a)
						|| this.betweenLesser(b, c, d)
			},
			getNameOfUnit : function(a) {
				switch (a.toLowerCase()) {
					case this.YEAR :
						return "YEAR";
					case this.QUARTER :
						return "QUARTER";
					case this.MONTH :
						return "MONTH";
					case this.WEEK :
						return "WEEK";
					case this.DAY :
						return "DAY";
					case this.HOUR :
						return "HOUR";
					case this.MINUTE :
						return "MINUTE";
					case this.SECOND :
						return "SECOND";
					case this.MILLI :
						return "MILLI"
				}
				throw "Incorrect UnitName"
			},
			unitNames : {
				YEAR : {
					single : "year",
					plural : "years",
					abbrev : "yr"
				},
				QUARTER : {
					single : "quarter",
					plural : "quarters",
					abbrev : "q"
				},
				MONTH : {
					single : "month",
					plural : "months",
					abbrev : "mon"
				},
				WEEK : {
					single : "week",
					plural : "weeks",
					abbrev : "w"
				},
				DAY : {
					single : "day",
					plural : "days",
					abbrev : "d"
				},
				HOUR : {
					single : "hour",
					plural : "hours",
					abbrev : "h"
				},
				MINUTE : {
					single : "minute",
					plural : "minutes",
					abbrev : "min"
				},
				SECOND : {
					single : "second",
					plural : "seconds",
					abbrev : "s"
				},
				MILLI : {
					single : "ms",
					plural : "ms",
					abbrev : "ms"
				}
			},
			getReadableNameOfUnit : function(b, a) {
				return this.unitNames[b][a ? "plural" : "single"]
			},
			getShortNameOfUnit : function(a) {
				return this.unitNames[a.toUpperCase()].abbrev
			},
			getUnitByName : function(a) {
				a = a.toUpperCase();
				if (!this[a]) {
					Ext.Error.raise("Unknown unit name")
				}
				return this[a]
			},
			getNext : function(c, f, a, e) {
				var d = Ext.Date.clone(c);
				a = a || 1;
				switch (f) {
					case this.DAY :
						Ext.Date.clearTime(d);
						d = this.add(d, this.DAY, a);
						break;
					case this.WEEK :
						var b = d.getDay();
						d = this.add(d, this.DAY, (7 * (a - 1))
										+ (b < e ? (e - b) : (7 - b + e)));
						break;
					case this.MONTH :
						d = this.add(d, this.MONTH, a);
						d.setDate(1);
						break;
					case this.QUARTER :
						d = this.add(d, this.MONTH, ((a - 1) * 3)
										+ (3 - (d.getMonth() % 3)));
						break;
					case this.YEAR :
						d = new Date(d.getFullYear() + a, 0, 1);
						break;
					default :
						d = this.add(c, f, a);
						break
				}
				return d
			},
			getNumberOfMsFromTheStartOfDay : function(a) {
				return a - Ext.Date.clearTime(a, true) || 86400000
			},
			getNumberOfMsTillTheEndOfDay : function(a) {
				return this.getStartOfNextDay(a, true) - a
			},
			getStartOfNextDay : function(b, e) {
				var d = this.add(Ext.Date.clearTime(b, e), this.DAY, 1);
				if (d.getDate() == b.getDate()) {
					var c = this.add(Ext.Date.clearTime(b, e), this.DAY, 2)
							.getTimezoneOffset();
					var a = b.getTimezoneOffset();
					d = this.add(d, this.MINUTE, a - c)
				}
				return d
			},
			getEndOfPreviousDay : function(b) {
				var a = Ext.Date.clearTime(b, true);
				if (a - b) {
					return a
				} else {
					return this.add(a, this.DAY, -1)
				}
			},
			timeSpanContains : function(c, b, d, a) {
				return (d - c) >= 0 && (b - a) >= 0
			}
		});
Ext.define("Sch.util.Debug", {
	singleton : true,
	runDiagnostics : function() {
		var d;
		var a = console;
		if (a && a.log) {
			d = function() {
				a.log.apply(console, arguments)
			}
		} else {
			if (!window.schedulerDebugWin) {
				window.schedulerDebugWin = new Ext.Window({
							height : 400,
							width : 500,
							bodyStyle : "padding:10px",
							closeAction : "hide",
							autoScroll : true
						})
			}
			window.schedulerDebugWin.show();
			schedulerDebugWin.update("");
			d = function(l) {
				schedulerDebugWin
						.update((schedulerDebugWin.body.dom.innerHTML || "")
								+ l + "<br/>")
			}
		}
		var e = Ext.select(".sch-schedulerpanel");
		if (e.getCount() === 0) {
			d("No scheduler component found")
		}
		var k = Ext.getCmp(e.elements[0].id), i = k.getResourceStore(), c = k
				.getEventStore();
		if (!(c instanceof Sch.data.EventStore)) {
			d("Your event store must be or extend Sch.data.EventStore")
		}
		d("Scheduler view start: " + k.getStart() + ", end: " + k.getEnd());
		if (!i) {
			d("No store configured");
			return
		}
		if (!c) {
			d("No event store configured");
			return
		}
		d(i.getCount() + " records in the resource store");
		d(c.getCount() + " records in the eventStore");
		var j = c.model.prototype.idProperty;
		var b = i.model.prototype.idProperty;
		var h = c.model.prototype.fields.getByKey(j);
		var f = i.model.prototype.fields.getByKey(b);
		if (!(c.model.prototype instanceof Sch.model.Event)) {
			d("Your event model must extend Sch.model.Event")
		}
		if (!(i.model.prototype instanceof Sch.model.Resource)) {
			d("Your event model must extend Sch.model.Resource")
		}
		if (!h) {
			d("idProperty on the event model is incorrectly setup, value: " + j)
		}
		if (!f) {
			d("idProperty on the resource model is incorrectly setup, value: "
					+ b)
		}
		var g = k.getSchedulingView();
		d(g.el.select(g.eventSelector).getCount()
				+ " events present in the DOM");
		if (c.getCount() > 0) {
			if (!c.first().getStartDate()
					|| !(c.first().getStartDate() instanceof Date)) {
				d("The eventStore reader is misconfigured - The StartDate field is not setup correctly, please investigate");
				d("StartDate is configured with dateFormat: "
						+ c.model.prototype.fields.getByKey("StartDate").dateFormat);
				d("See Ext JS docs for information about different date formats: ")
			}
			if (!c.first().getEndDate()
					|| !(c.first().getEndDate() instanceof Date)) {
				d("The eventStore reader is misconfigured - The EndDate field is not setup correctly, please investigate");
				d("EndDate is configured with dateFormat: "
						+ c.model.prototype.fields.getByKey("EndDate").dateFormat);
				d("See Ext JS docs for information about different date formats: ")
			}
			if (c.proxy && c.proxy.reader && c.proxy.reader.jsonData) {
				d("Dumping jsonData to console");
				console.dir(c.proxy.reader.jsonData)
			}
			d("Records in the event store:");
			c.each(function(m, l) {
						d((l + 1) + ". " + m.startDateField + ":"
								+ m.getStartDate() + ", " + m.endDateField
								+ ":" + m.getEndDate() + ", "
								+ m.resourceIdField + ":" + m.getResourceId());
						if (!m.getStartDate()) {
							d(m.getStartDate())
						}
					})
		} else {
			d("Event store has no data. Has it been loaded properly?")
		}
		if (i.getCount() > 0) {
			d("Records in the resource store:");
			i.each(function(m, l) {
						d((l + 1) + ". " + m.idProperty + ":" + m.getId());
						return
					})
		} else {
			d("Resource store has no data.");
			return
		}
		d("Everything seems to be setup ok!")
	}
});
Ext.define("Sch.util.HeaderRenderers", {
	singleton : true,
	requires : ["Sch.util.Date", "Ext.XTemplate"],
	constructor : function() {
		var b = Ext
				.create(
						"Ext.XTemplate",
						'<table class="sch-nested-hdr-tbl '
								+ Ext.baseCSSPrefix
								+ 'column-header-text" cellpadding="0" cellspacing="0"><tr><tpl for="."><td style="width:{[100/xcount]}%" class="{cls} sch-dayheadercell-{dayOfWeek}">{text}</td></tpl></tr></table>')
				.compile();
		var a = Ext
				.create(
						"Ext.XTemplate",
						'<table class="sch-nested-hdr-tbl" cellpadding="0" cellspacing="0"><tr><tpl for="."><td style="width:{[100/xcount]}%" class="{cls}">{text}</td></tpl></tr></table>')
				.compile();
		return {
			quarterMinute : function(f, d, c, e) {
				c.headerCls = "sch-nested-hdr-pad";
				return '<table class="sch-nested-hdr-tbl" cellpadding="0" cellspacing="0"><tr><td>00</td><td>15</td><td>30</td><td>45</td></tr></table>'
			},
			dateCells : function(d, c, e) {
				return function(j, g, f) {
					f.headerCls = "sch-nested-hdr-nopad";
					var i = [], h = Ext.Date.clone(j);
					while (h < g) {
						i.push({
									text : Ext.Date.format(h, e)
								});
						h = Sch.util.Date.add(h, d, c)
					}
					i[0].cls = "sch-nested-hdr-cell-first";
					i[i.length - 1].cls = "sch-nested-hdr-cell-last";
					return a.apply(i)
				}
			},
			dateNumber : function(g, d, c) {
				c.headerCls = "sch-nested-hdr-nopad";
				var f = [], e = Ext.Date.clone(g);
				while (e < d) {
					f.push({
								dayOfWeek : e.getDay(),
								text : e.getDate()
							});
					e = Sch.util.Date.add(e, Sch.util.Date.DAY, 1)
				}
				return b.apply(f)
			},
			dayLetter : function(g, d, c) {
				c.headerCls = "sch-nested-hdr-nopad";
				var f = [], e = g;
				while (e < d) {
					f.push({
								dayOfWeek : e.getDay(),
								text : Ext.Date.dayNames[e.getDay()].substr(0,
										1)
							});
					e = Sch.util.Date.add(e, Sch.util.Date.DAY, 1)
				}
				f[0].cls = "sch-nested-hdr-cell-first";
				f[f.length - 1].cls = "sch-nested-hdr-cell-last";
				return b.apply(f)
			},
			dayStartEndHours : function(e, d, c) {
				c.headerCls = "sch-hdr-startend";
				return Ext.String
						.format(
								'<span class="sch-hdr-start">{0}</span><span class="sch-hdr-end">{1}</span>',
								Ext.Date.format(e, "G"), Ext.Date
										.format(d, "G"))
			}
		}
	}
});
Ext.define("Sch.util.DragTracker", {
	extend : "Ext.dd.DragTracker",
	xStep : 1,
	yStep : 1,
	setXStep : function(a) {
		this.xStep = a
	},
	setYStep : function(a) {
		this.yStep = a
	},
	getRegion : function() {
		var e = this.startXY, d = this.getXY(), b = Math.min(e[0], d[0]), f = Math
				.min(e[1], d[1]), c = Math.abs(e[0] - d[0]), a = Math.abs(e[1]
				- d[1]);
		return new Ext.util.Region(f, b + c, f + a, b)
	},
	onMouseDown : function(f, d) {
		if (this.disabled || f.dragTracked) {
			return
		}
		var c = f.getXY(), g, b, a = c[0], h = c[1];
		if (this.xStep > 1) {
			g = this.el.getX();
			a -= g;
			a = Math.round(a / this.xStep) * this.xStep;
			a += g
		}
		if (this.yStep > 1) {
			b = this.el.getY();
			h -= b;
			h = Math.round(h / this.yStep) * this.yStep;
			h += b
		}
		this.dragTarget = this.delegate ? d : this.handle.dom;
		this.startXY = this.lastXY = [a, h];
		this.startRegion = Ext.fly(this.dragTarget).getRegion();
		if (this.fireEvent("mousedown", this, f) === false
				|| this.fireEvent("beforedragstart", this, f) === false
				|| this.onBeforeStart(f) === false) {
			return
		}
		this.mouseIsDown = true;
		f.dragTracked = true;
		if (this.preventDefault !== false) {
			f.preventDefault()
		}
		Ext.getDoc().on({
					scope : this,
					mouseup : this.onMouseUp,
					mousemove : this.onMouseMove,
					selectstart : this.stopSelect
				});
		if (this.autoStart) {
			this.timer = Ext.defer(this.triggerStart, this.autoStart === true
							? 1000
							: this.autoStart, this, [f])
		}
	},
	onMouseMove : function(g, f) {
		if (this.active && Ext.isIE && !g.browserEvent.button) {
			g.preventDefault();
			this.onMouseUp(g);
			return
		}
		g.preventDefault();
		var d = g.getXY(), b = this.startXY;
		if (!this.active) {
			if (Math.max(Math.abs(b[0] - d[0]), Math.abs(b[1] - d[1])) > this.tolerance) {
				this.triggerStart(g)
			} else {
				return
			}
		}
		var a = d[0], h = d[1];
		if (this.xStep > 1) {
			a -= this.startXY[0];
			a = Math.round(a / this.xStep) * this.xStep;
			a += this.startXY[0]
		}
		if (this.yStep > 1) {
			h -= this.startXY[1];
			h = Math.round(h / this.yStep) * this.yStep;
			h += this.startXY[1]
		}
		var c = this.xStep > 1 || this.yStep > 1;
		if (!c || a !== d[0] || h !== d[1]) {
			this.lastXY = [a, h];
			if (this.fireEvent("mousemove", this, g) === false) {
				this.onMouseUp(g)
			} else {
				this.onDrag(g);
				this.fireEvent("drag", this, g)
			}
		}
	}
});
Ext.define("Sch.preset.Manager", {
			extend : "Ext.util.MixedCollection",
			requires : ["Sch.util.Date", "Sch.util.HeaderRenderers"],
			singleton : true,
			constructor : function() {
				this.callParent(arguments);
				this.registerDefaults()
			},
			registerPreset : function(b, a) {
				if (a) {
					var c = a.headerConfig;
					var d = Sch.util.Date;
					for (var e in c) {
						if (c.hasOwnProperty(e)) {
							if (d[c[e].unit]) {
								c[e].unit = d[c[e].unit.toUpperCase()]
							}
						}
					}
					if (!a.timeColumnWidth) {
						a.timeColumnWidth = 50
					}
					if (a.timeResolution && d[a.timeResolution.unit]) {
						a.timeResolution.unit = d[a.timeResolution.unit
								.toUpperCase()]
					}
					if (a.shiftUnit && d[a.shiftUnit]) {
						a.shiftUnit = d[a.shiftUnit.toUpperCase()]
					}
				}
				if (this.isValidPreset(a)) {
					if (this.containsKey(b)) {
						this.removeAtKey(b)
					}
					this.add(b, a)
				} else {
					throw "Invalid preset, please check your configuration"
				}
			},
			isValidPreset : function(a) {
				var d = Sch.util.Date, b = true, c = Sch.util.Date.units;
				for (var e in a.headerConfig) {
					if (a.headerConfig.hasOwnProperty(e)) {
						b = b
								&& Ext.Array.indexOf(c, a.headerConfig[e].unit) >= 0
					}
				}
				if (a.timeResolution) {
					b = b && Ext.Array.indexOf(c, a.timeResolution.unit) >= 0
				}
				if (a.shiftUnit) {
					b = b && Ext.Array.indexOf(c, a.shiftUnit) >= 0
				}
				return b
			},
			getPreset : function(a) {
				return this.get(a)
			},
			deletePreset : function(a) {
				this.removeAtKey(a)
			},
			registerDefaults : function() {
				var b = this, a = this.defaultPresets;
				for (var c in a) {
					b.registerPreset(c, a[c])
				}
			},
			defaultPresets : {
				hourAndDay : {
					timeColumnWidth : 60,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "G:i",
					shiftIncrement : 1,
					shiftUnit : "DAY",
					defaultSpan : 12,
					timeResolution : {
						unit : "MINUTE",
						increment : 15
					},
					headerConfig : {
						middle : {
							unit : "HOUR",
							dateFormat : "G:i"
						},
						top : {
							unit : "DAY",
							dateFormat : "D d/m"
						}
					}
				},
				dayAndWeek : {
					timeColumnWidth : 100,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "Y-m-d G:i",
					shiftUnit : "DAY",
					shiftIncrement : 1,
					defaultSpan : 5,
					timeResolution : {
						unit : "HOUR",
						increment : 1
					},
					headerConfig : {
						middle : {
							unit : "DAY",
							dateFormat : "D d M"
						},
						top : {
							unit : "WEEK",
							renderer : function(c, b, a) {
								return Sch.util.Date.getShortNameOfUnit("WEEK")
										+ "." + Ext.Date.format(c, "W M Y")
							}
						}
					}
				},
				weekAndDay : {
					timeColumnWidth : 100,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "Y-m-d",
					shiftUnit : "WEEK",
					shiftIncrement : 1,
					defaultSpan : 1,
					timeResolution : {
						unit : "DAY",
						increment : 1
					},
					headerConfig : {
						bottom : {
							unit : "DAY",
							increment : 1,
							dateFormat : "d/m"
						},
						middle : {
							unit : "WEEK",
							dateFormat : "D d M",
							align : "left"
						}
					}
				},
				weekAndMonth : {
					timeColumnWidth : 100,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "Y-m-d",
					shiftUnit : "WEEK",
					shiftIncrement : 5,
					defaultSpan : 6,
					timeResolution : {
						unit : "DAY",
						increment : 1
					},
					headerConfig : {
						middle : {
							unit : "WEEK",
							renderer : function(c, b, a) {
								a.align = "left";
								return Ext.Date.format(c, "d M")
							}
						},
						top : {
							unit : "MONTH",
							dateFormat : "M Y"
						}
					}
				},
				monthAndYear : {
					timeColumnWidth : 110,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "Y-m-d",
					shiftIncrement : 3,
					shiftUnit : "MONTH",
					defaultSpan : 12,
					timeResolution : {
						unit : "DAY",
						increment : 1
					},
					headerConfig : {
						middle : {
							unit : "MONTH",
							dateFormat : "M Y"
						},
						top : {
							unit : "YEAR",
							dateFormat : "Y"
						}
					}
				},
				year : {
					timeColumnWidth : 100,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "Y-m-d",
					shiftUnit : "YEAR",
					shiftIncrement : 1,
					defaultSpan : 1,
					timeResolution : {
						unit : "MONTH",
						increment : 1
					},
					headerConfig : {
						bottom : {
							unit : "QUARTER",
							renderer : function(c, b, a) {
								return Ext.String.format(Sch.util.Date
												.getShortNameOfUnit("QUARTER")
												.toUpperCase()
												+ "{0}", Math.floor(c
												.getMonth()
												/ 3)
												+ 1)
							}
						},
						middle : {
							unit : "YEAR",
							dateFormat : "Y"
						}
					}
				},
				weekAndDayLetter : {
					timeColumnWidth : 20,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "Y-m-d",
					shiftUnit : "WEEK",
					shiftIncrement : 1,
					defaultSpan : 10,
					timeResolution : {
						unit : "DAY",
						increment : 1
					},
					headerConfig : {
						bottom : {
							unit : "DAY",
							increment : 1,
							renderer : function(a) {
								return Ext.Date.dayNames[a.getDay()].substring(
										0, 1)
							}
						},
						middle : {
							unit : "WEEK",
							dateFormat : "D d M Y",
							align : "left"
						}
					}
				},
				weekDateAndMonth : {
					timeColumnWidth : 30,
					rowHeight : 24,
					resourceColumnWidth : 100,
					displayDateFormat : "Y-m-d",
					shiftUnit : "WEEK",
					shiftIncrement : 1,
					defaultSpan : 10,
					timeResolution : {
						unit : "DAY",
						increment : 1
					},
					headerConfig : {
						middle : {
							unit : "WEEK",
							dateFormat : "d"
						},
						top : {
							unit : "MONTH",
							dateFormat : "Y F",
							align : "left"
						}
					}
				}
			}
		});
Ext.define("Sch.preset.ViewPreset", {});
Ext.define("Sch.preset.ViewPresetHeaderRow", {});
Ext.define("Sch.feature.AbstractTimeSpan", {
	extend : "Ext.AbstractPlugin",
	lockableScope : "normal",
	schedulerView : null,
	timeAxis : null,
	containerEl : null,
	expandToFitView : false,
	disabled : false,
	cls : null,
	template : null,
	store : null,
	renderElementsBuffered : false,
	renderDelay : 15,
	constructor : function(a) {
		this.uniqueCls = this.uniqueCls || ("sch-timespangroup-" + Ext.id());
		Ext.apply(this, a)
	},
	setDisabled : function(a) {
		if (a) {
			this.removeElements()
		}
		this.disabled = a
	},
	getElements : function() {
		if (this.containerEl) {
			return this.containerEl.select("." + this.uniqueCls)
		}
		return null
	},
	removeElements : function() {
		var a = this.getElements();
		if (a) {
			a.remove()
		}
	},
	init : function(a) {
		this.timeAxis = a.getTimeAxis();
		this.schedulerView = a.getSchedulingView();
		if (!this.store) {
			Ext.Error.raise("Error: You must define a store for this plugin")
		}
		this.schedulerView.on({
					afterrender : this.onAfterRender,
					destroy : this.onDestroy,
					scope : this
				})
	},
	onAfterRender : function(b) {
		var a = this.schedulerView;
		this.containerEl = a.el;
		a.mon(this.store, {
					load : this.renderElements,
					datachanged : this.renderElements,
					clear : this.renderElements,
					add : this.renderElements,
					remove : this.renderElements,
					update : this.refreshSingle,
					scope : this
				});
		if (Ext.data.NodeStore && a.store instanceof Ext.data.NodeStore) {
			if (a.animate) {
			} else {
				a.mon(a.store, {
							expand : this.renderElements,
							collapse : this.renderElements,
							scope : this
						})
			}
		}
		a.on({
					refresh : this.renderElements,
					itemadd : this.renderElements,
					itemremove : this.renderElements,
					itemupdate : this.renderElements,
					groupexpand : this.renderElements,
					groupcollapse : this.renderElements,
					columnwidthchange : this.renderElements,
					resize : this.renderElements,
					scope : this
				});
		a.headerCt.on({
					add : this.renderElements,
					remove : this.renderElements,
					scope : this
				});
		a.ownerCt.up("panel").on({
					viewchange : this.renderElements,
					orientationchange : this.renderElements,
					scope : this
				});
		this.renderElements()
	},
	renderElements : function() {
		if (this.renderElementsBuffered || this.disabled
				|| this.schedulerView.headerCt.getColumnCount() === 0) {
			return
		}
		this.renderElementsBuffered = true;
		Ext.Function.defer(this.renderElementsInternal, this.renderDelay, this)
	},
	renderElementsInternal : function() {
		this.renderElementsBuffered = false;
		if (this.disabled || this.schedulerView.isDestroyed
				|| this.schedulerView.headerCt.getColumnCount() === 0) {
			return
		}
		this.removeElements();
		var c = this.timeAxis.getStart(), a = this.timeAxis.getEnd(), b = this
				.getElementData(c, a);
		this.template.insertFirst(this.containerEl, b)
	},
	getElementData : function(b, a) {
		throw "Abstract method call"
	},
	onDestroy : function() {
		if (this.store.autoDestroy) {
			this.store.destroy()
		}
	},
	refreshSingle : function(c, b) {
		var d = Ext.get(this.uniqueCls + "-" + b.internalId);
		if (d) {
			var f = this.timeAxis.getStart(), a = this.timeAxis.getEnd(), e = this
					.getElementData(f, a, [b])[0];
			d.setTop(e.top);
			d.setLeft(e.left);
			d.setSize(e.width, e.height)
		} else {
			this.renderElements()
		}
	}
});
Ext.define("Sch.feature.DragCreator", {
	requires : ["Ext.XTemplate", "Sch.util.Date", "Sch.util.DragTracker",
			"Sch.tooltip.Tooltip", "Sch.tooltip.ClockTemplate"],
	disabled : false,
	showHoverTip : true,
	showDragTip : true,
	dragTolerance : 2,
	validatorFn : Ext.emptyFn,
	validatorFnScope : null,
	constructor : function(a) {
		Ext.apply(this, a || {});
		this.lastTime = new Date();
		this.template = this.template
				|| Ext
						.create(
								"Ext.Template",
								'<div class="sch-dragcreator-proxy sch-event"><div class="sch-event-inner">&#160;</div></div>',
								{
									compiled : true,
									disableFormats : true
								});
		this.schedulerView.on("destroy", this.onSchedulerDestroy, this);
		this.schedulerView.el.on("mousemove", this.setupTooltips, this, {
					single : true
				});
		this.callParent([a])
	},
	setDisabled : function(a) {
		this.disabled = a;
		if (this.hoverTip) {
			this.hoverTip.setDisabled(a)
		}
		if (this.dragTip) {
			this.dragTip.setDisabled(a)
		}
	},
	getProxy : function() {
		if (!this.proxy) {
			this.proxy = this.template.append(this.schedulerView.panel.el, {},
					true)
		}
		return this.proxy
	},
	onMouseMove : function(c) {
		var a = this.hoverTip;
		if (a.disabled || this.dragging) {
			return
		}
		if (c.getTarget("." + this.schedulerView.timeCellCls, 2)) {
			var b = this.schedulerView.getDateFromDomEvent(c, "floor");
			if (b) {
				if (b - this.lastTime !== 0) {
					this.updateHoverTip(b);
					if (a.hidden) {
						a[Sch.util.Date.compareUnits(this.schedulerView
										.getTimeResolution().unit,
								Sch.util.Date.DAY) >= 0
								? "addCls"
								: "removeCls"]("sch-day-resolution");
						a.show()
					}
				}
			} else {
				a.hide();
				this.lastTime = null
			}
		} else {
			a.hide();
			this.lastTime = null
		}
	},
	updateHoverTip : function(a) {
		if (a) {
			var b = this.schedulerView.getFormattedDate(a);
			this.hoverTip.update(this.hoverTipTemplate.apply({
						date : a,
						text : b
					}));
			this.lastTime = a
		}
	},
	onBeforeDragStart : function(d, g) {
		var b = this.schedulerView, a = g.getTarget("." + b.timeCellCls, 2);
		if (a) {
			var c = b.resolveResource(a);
			var f = b.getDateFromDomEvent(g);
			if (!this.disabled && a
					&& b.fireEvent("beforedragcreate", b, c, f, g) !== false) {
				this.resourceRecord = c;
				this.originalStart = f;
				this.resourceRegion = b.getScheduleRegion(this.resourceRecord,
						this.originalStart);
				this.dateConstraints = b.getDateConstraints(
						this.resourceRecord, this.originalStart);
				return true
			}
		}
		return false
	},
	onDragStart : function() {
		var d = this, b = d.schedulerView, c = d.getProxy(), a = d.schedulerView.snapToIncrement;
		this.dragging = true;
		if (this.hoverTip) {
			this.hoverTip.disable()
		}
		d.start = d.originalStart;
		d.end = d.start;
		if (b.getOrientation() === "horizontal") {
			d.rowBoundaries = {
				top : d.resourceRegion.top,
				bottom : d.resourceRegion.bottom
			};
			c.setRegion({
						top : d.rowBoundaries.top,
						right : d.tracker.startXY[0],
						bottom : d.rowBoundaries.bottom,
						left : d.tracker.startXY[0]
					})
		} else {
			d.rowBoundaries = {
				left : d.resourceRegion.left,
				right : d.resourceRegion.right
			};
			c.setRegion({
						top : d.tracker.startXY[1],
						right : d.resourceRegion.right,
						bottom : d.tracker.startXY[1],
						left : d.resourceRegion.left
					})
		}
		c.show();
		d.schedulerView.fireEvent("dragcreatestart", d.schedulerView);
		if (d.showDragTip) {
			d.dragTip.enable();
			d.dragTip.update(d.start, d.end, true);
			d.dragTip.show(c);
			d.dragTip.el.setStyle("visibility", "visible")
		}
	},
	onDrag : function(f, h) {
		var d = this, c = d.schedulerView, b = d.tracker.getRegion()
				.constrainTo(d.resourceRegion), g = c
				.getStartEndDatesFromRegion(b, "round");
		if (!g) {
			return
		}
		d.start = g.start || d.start;
		d.end = g.end || d.end;
		var a = d.dateConstraints;
		if (a) {
			d.end = Sch.util.Date.constrain(d.end, a.start, a.end);
			d.start = Sch.util.Date.constrain(d.start, a.start, a.end)
		}
		d.valid = this.validatorFn.call(d.validatorFnScope || d,
				d.resourceRecord, d.start, d.end) !== false;
		if (d.showDragTip) {
			d.dragTip.update(d.start, d.end, d.valid)
		}
		Ext.apply(b, d.rowBoundaries);
		this.getProxy().setRegion(b)
	},
	onDragEnd : function(c, d) {
		this.dragging = false;
		var a = this.schedulerView;
		if (this.showDragTip) {
			this.dragTip.disable()
		}
		if (!this.start || !this.end || (this.end - this.start <= 0)) {
			this.valid = false
		}
		if (this.valid) {
			var b = Ext.create(this.schedulerView.eventStore.model);
			b.assign(this.resourceRecord);
			b.setStartDate(this.start);
			b.setEndDate(this.end);
			a.fireEvent("dragcreateend", a, b, this.resourceRecord, d)
		} else {
			this.proxy.hide()
		}
		this.schedulerView.fireEvent("afterdragcreate", a);
		if (this.hoverTip) {
			this.hoverTip.enable()
		}
	},
	tipCfg : {
		trackMouse : true,
		bodyCssClass : "sch-hovertip",
		autoHide : false,
		dismissDelay : 1000,
		showDelay : 300
	},
	dragging : false,
	setupTooltips : function() {
		var b = this, a = b.schedulerView;
		b.tracker = new Sch.util.DragTracker({
					el : a.el,
					tolerance : b.dragTolerance,
					listeners : {
						beforedragstart : b.onBeforeDragStart,
						dragstart : b.onDragStart,
						drag : b.onDrag,
						dragend : b.onDragEnd,
						scope : b
					}
				});
		if (this.showDragTip) {
			this.dragTip = Ext.create("Sch.tooltip.Tooltip", {
						cls : "sch-dragcreate-tip",
						schedulerView : a,
						listeners : {
							beforeshow : function() {
								return b.dragging
							}
						}
					})
		}
		if (b.showHoverTip) {
			var c = a.el;
			b.hoverTipTemplate = b.hoverTipTemplate
					|| Ext.create("Sch.tooltip.ClockTemplate");
			b.hoverTip = new Ext.ToolTip(Ext.applyIf({
						renderTo : document.body,
						target : c,
						disabled : b.disabled
					}, b.tipCfg));
			b.hoverTip.on("beforeshow", b.tipOnBeforeShow, b);
			a.mon(c, {
						mouseleave : function() {
							b.hoverTip.hide()
						},
						mousemove : b.onMouseMove,
						scope : b
					})
		}
	},
	onSchedulerDestroy : function() {
		if (this.hoverTip) {
			this.hoverTip.destroy()
		}
		if (this.dragTip) {
			this.dragTip.destroy()
		}
		if (this.tracker) {
			this.tracker.destroy()
		}
		if (this.proxy) {
			Ext.destroy(this.proxy);
			this.proxy = null
		}
	},
	tipOnBeforeShow : function(a) {
		return !this.disabled && !this.dragging && this.lastTime !== null
	}
});
Ext.define("Sch.feature.DragZone", {
	extend : "Ext.dd.DragZone",
	containerScroll : true,
	onStartDrag : function() {
		var a = this.schedulerView;
		a.fireEvent("eventdragstart", a, this.dragData.records)
	},
	getDragData : function(n) {
		var p = this.schedulerView, h = n.getTarget(p.eventSelector);
		if (h) {
			var g = p.getSelectionModel(), m = Ext.get(h), c = m
					.is(p.eventSelector) ? h : m.up(p.eventSelector).dom, o = p
					.getEventRecordFromDomId(c.id);
			if (p.fireEvent("beforeeventdrag", p, o, n) === false) {
				return null
			}
			var b, f = o.getStartDate(), l = [o], a, d = Ext
					.get(Ext.core.DomHelper.createDom({
								cls : "sch-dd-wrap",
								children : [{
											cls : "sch-dd-proxy-hd",
											html : "&nbsp"
										}]
							}));
			for (var j = 0, k = l.length; j < k; j++) {
				a = p.getElementFromEventRecord(l[j]).dom.cloneNode(true);
				a.id = Ext.id();
				d.appendChild(a)
			}
			return {
				repairXY : Ext.fly(h).getXY(),
				ddel : d.dom,
				sourceEventRecord : o,
				records : l,
				duration : o.getEndDate() - f
			}
		}
		return null
	},
	afterRepair : function() {
		this.dragging = false;
		var a = this.schedulerView;
		a.fireEvent("aftereventdrop", a)
	},
	getRepairXY : function() {
		return this.dragData.repairXY
	},
	onDragKeyDown : function(b) {
		var a = this.getProxy();
		if (b.ctrlKey
				&& (a.dropStatus === a.dropAllowed || a.dropStatus === (a.dropAllowed + " add"))) {
			a.setStatus(a.dropAllowed + " add")
		}
	},
	onDragKeyUp : function(b) {
		if (!b.ctrlKey) {
			var a = this.getProxy();
			a.setStatus(a.dropStatus.replace(" add", ""))
		}
	},
	onMouseDown : function() {
		if (this.enableCopy) {
			Ext.getBody().on({
						keydown : this.onDragKeyDown,
						keyup : this.onDragKeyUp,
						scope : this
					})
		}
	},
	onMouseUp : function() {
		var a = Ext.getBody();
		a.un("keydown", this.onDragKeyDown, this);
		a.un("keyup", this.onDragKeyUp, this)
	}
});
Ext.define("Sch.feature.DropZone", {
	extend : "Ext.dd.DropZone",
	constructor : function() {
		this.callParent(arguments);
		var a = this.schedulerView;
		this.proxyTpl = this.proxyTpl
				|| new Ext.XTemplate(
						'<span class="sch-dd-newtime">{[ this.getText(values) ]}</span>',
						{
							getText : function(b) {
								var c = a.getFormattedDate(b.StartDate);
								if (b.Duration) {
									c += " - "
											+ a
													.getFormattedEndDate(
															Sch.util.Date
																	.add(
																			b.StartDate,
																			Sch.util.Date.MILLI,
																			b.Duration),
															b.StartDate)
								}
								return c
							}
						})
	},
	validatorFn : Ext.emptyFn,
	getTargetFromEvent : function(a) {
		return a.getTarget("." + this.schedulerView.timeCellCls)
	},
	onNodeEnter : function(d, a, c, b) {
		Ext.fly(d).addCls("sch-dd-cellover")
	},
	onNodeOut : function(d, a, c, b) {
		Ext.fly(d).removeCls("sch-dd-cellover")
	},
	onNodeOver : function(i, a, h, g) {
		var d = this.schedulerView, c = d.getDateFromDomEvent(h, "round"), f;
		if (!c) {
			return this.dropNotAllowed
		}
		this.proxyTpl.overwrite(a.proxy.el.down(".sch-dd-proxy-hd"), {
					StartDate : c,
					Duration : g.duration
				});
		var b = d.resolveResource(h.getTarget("." + d.timeCellCls));
		if (this.validatorFn.call(this.validatorFnScope || this, g.records, b,
				c, g.duration, h) !== false) {
			return this.dropAllowed
					+ ((this.enableCopy && h.ctrlKey) ? " add" : "")
		} else {
			return this.dropNotAllowed
		}
	},
	onNodeDrop : function(i, c, j, g) {
		var l = this.schedulerView, b = l.resolveResource(i), f = l
				.getDateFromDomEvent(j, "round"), a = false, k = this.enableCopy
				&& j.ctrlKey;
		if (f
				&& this.validatorFn.call(this.validatorFnScope || this,
						g.records, b, f, g.duration, j) !== false) {
			var d, h = l.resourceStore.indexOf(b);
			if (k) {
				d = this.copyRecords(g.records, f, b, g.sourceEventRecord, h);
				a = true
			} else {
				a = this.updateRecords(g.records, f, b, g.sourceEventRecord, h,
						g)
			}
			if (a) {
				l.getSelectionModel().deselectAll()
			}
			l.fireEvent("eventdrop", l, k ? d : g.records, k)
		}
		l.fireEvent("aftereventdrop", l);
		return a
	},
	updateRecords : function(e, c, s, l, d, h) {
		if (e.length === 1) {
			l.beginEdit();
			l.assign(s);
			l.setStartDate(c);
			l.setEndDate(Sch.util.Date.add(c, Sch.util.Date.MILLI, h.duration));
			l.endEdit();
			return true
		}
		var j = l.getStartDate(), o = this.schedulerView.resourceStore, q = c
				- j, k = o.indexOf(l.getResource()), n, m, f, a, p, b = o
				.getCount(), g;
		for (g = 0; g < e.length; g++) {
			a = e[g];
			m = o.indexOf(a.getResource());
			p = m - k + d;
			if (p < 0 || p > b) {
				return false
			}
		}
		for (g = 0; g < e.length; g++) {
			a = e[g];
			m = o.indexOf(a.getResource());
			n = m - k;
			f = o.getAt(d + n);
			a.beginEdit();
			a.assign(f);
			a.setStartDate(Sch.util.Date.add(a.getStartDate(),
					Sch.util.Date.MILLI, q));
			a.setEndDate(Sch.util.Date.add(a.getEndDate(), Sch.util.Date.MILLI,
					q));
			a.endEdit()
		}
		return true
	},
	copyRecords : function(d, g, b, f, c) {
		var a = d[0], e = a.copy(), h = f.getEndDate() - f.getStartDate();
		e.assign(b);
		e.setStartDate(g);
		e.setEndDate(Sch.util.Date.add(g, Sch.util.Date.MILLI, h));
		return [e]
	}
});
Ext.define("Sch.feature.PointDragZone", {
	extend : "Ext.dd.DragZone",
	requires : ["Sch.tooltip.Tooltip"],
	repairHighlight : false,
	containerScroll : true,
	dropAllowed : "sch-dragproxy",
	dropNotAllowed : "sch-dragproxy",
	constructor : function(b, a) {
		this.proxy = this.proxy || Ext.create("Ext.dd.StatusProxy", {
					shadow : false,
					dropAllowed : "sch-dragproxy",
					dropNotAllowed : "sch-dragproxy"
				});
		this.callParent(arguments);
		this.isTarget = true;
		this.scroll = false;
		this.ignoreSelf = false;
		Ext.dd.ScrollManager.register(this.el)
	},
	destroy : function() {
		this.callParent(arguments);
		Ext.dd.ScrollManager.unregister(this.el)
	},
	autoOffset : function(a, e) {
		var d = this.dragData.repairXY, c = a - d[0], b = e - d[1];
		this.setDelta(c, b)
	},
	constrainTo : function(a, b) {
		this.resetConstraints();
		this.initPageX = a.left;
		this.initPageY = a.top;
		this.setXConstraint(a.left, a.right - (b.right - b.left),
				this.xTickSize);
		this.setYConstraint(a.top, a.bottom - (b.bottom - b.top),
				this.yTickSize)
	},
	constrainToResource : function(b, c, a) {
		this.resetConstraints();
		this.initPageX = b.left;
		this.initPageY = b.top;
		if (a === "horizontal") {
			this.setXConstraint(b.left, b.right - (c.right - c.left),
					this.xTickSize);
			this.setYConstraint(c.top, c.top, this.yTickSize)
		} else {
			this.setXConstraint(c.left, c.left, this.xTickSize);
			this.setYConstraint(b.top, b.bottom - (c.bottom - c.top),
					this.yTickSize)
		}
	},
	setXConstraint : function(c, b, a) {
		this.leftConstraint = c;
		this.rightConstraint = b;
		this.minX = c;
		this.maxX = b;
		if (a) {
			this.setXTicks(this.initPageX, a)
		}
		this.constrainX = true
	},
	setYConstraint : function(a, c, b) {
		this.topConstraint = a;
		this.bottomConstraint = c;
		this.minY = a;
		this.maxY = c;
		if (b) {
			this.setYTicks(this.initPageY, b)
		}
		this.constrainY = true
	},
	onDragEnter : Ext.emptyFn,
	onDragOut : Ext.emptyFn,
	resolveStartEndDates : function(e) {
		var a = this.dragData, c, d = a.origStart, b = a.origEnd;
		if (!a.startsOutsideView) {
			c = this.schedulerView.getStartEndDatesFromRegion(e, "round");
			if (c) {
				d = c.start || a.start;
				b = Sch.util.Date.add(d, Sch.util.Date.MILLI, a.duration)
			}
		} else {
			if (!a.endsOutsideView) {
				c = this.schedulerView.getStartEndDatesFromRegion(e, "round");
				if (c) {
					b = c.end || a.end;
					d = Sch.util.Date.add(b, Sch.util.Date.MILLI, -a.duration)
				}
			}
		}
		return {
			startDate : d,
			endDate : b
		}
	},
	onDragOver : function(c, d) {
		var a = this.dragData;
		if (!a.originalHidden) {
			Ext.each(a.eventEls, function(e) {
						e.hide()
					});
			a.originalHidden = true;
			a.refElement = this.proxy.el.down("#sch-id-dd-ref")
		}
		if (this.showTooltip) {
			var b = this.getDragContext(c);
			if (b) {
				this.tip.update(b.startDate, b.endDate, b.valid)
			}
		}
	},
	getDragContext : function(d) {
		var a = this.dragData;
		if (!a.refElement) {
			return
		}
		var c = this.schedulerView, f = a.refElement.getRegion();
		var b = this.resolveStartEndDates(f);
		b.resource = c.constrainDragToResource ? a.resourceRecord : this
				.resolveResource([f.left + a.offsets[0], f.top + a.offsets[1]],
						d);
		if (b.resource) {
			b.valid = this.validatorFn.call(this.validatorFnScope || this,
					a.eventRecords, b.resource, b.startDate, a.duration, d)
		} else {
			b.valid = false
		}
		return b
	},
	onStartDrag : function(b, d) {
		var c = this.schedulerView, a = this.dragData;
		this.start = a.origStart;
		this.end = a.origEnd;
		c.fireEvent("eventdragstart", c, a.eventRecords)
	},
	startDrag : function() {
		var b = this.callParent(arguments);
		if (this.showTooltip) {
			var a = this.schedulerView;
			if (!this.tip) {
				this.tip = Ext.create("Sch.tooltip.Tooltip", {
							schedulerView : a,
							cls : "sch-dragdrop-tip"
						})
			}
			this.tip.update(this.start, this.end, true);
			this.tip.el.setStyle("visibility");
			this.tip.show(this.proxy.el, this.dragData.offsets[0])
		}
		return b
	},
	getDragData : function(x) {
		var q = this.schedulerView, p = x.getTarget(q.eventSelector);
		if (!p) {
			return
		}
		var l = q.resolveEventRecord(p);
		if (l.isDraggable() === false
				|| q.fireEvent("beforeeventdrag", q, l, x) === false) {
			return null
		}
		var i = x.getXY(), a = Ext.get(p), y = a.getXY(), k = [i[0] - y[0],
				i[1] - y[1]], b = l.getResource(), m = a.getRegion(), u = q
				.getSnapPixelAmount();
		this.clearTicks();
		if (q.constrainDragToResource) {
			this.constrainToResource(q.getScheduleRegion(b, l), m, q
							.getOrientation())
		} else {
			this.constrainTo(q.getScheduleRegion(null, l), m)
		}
		if (u >= 1) {
			if (q.getOrientation() === "horizontal") {
				this.setXConstraint(this.leftConstraint, this.rightConstraint,
						u)
			} else {
				this.setYConstraint(this.topConstraint, this.bottomConstraint,
						u)
			}
		}
		var d = l.getStartDate(), n = q.timeAxis, j = n.getStart(), h = n
				.getEnd(), o = l.getEndDate(), v = d < j, r = o > h, c = Ext
				.getBody().getScroll(), g = this.getRelatedRecords(l), w = [a];
		Ext.Array.each(g, function(s) {
					var e = q.getElementFromEventRecord(s);
					if (e) {
						w.push(e)
					}
				});
		var f = {
			offsets : k,
			eventEls : w,
			repairXY : y,
			eventRecords : [l].concat(g),
			relatedEventRecords : g,
			resourceRecord : b,
			origStart : d,
			origEnd : o,
			duration : o - d,
			startsOutsideView : v,
			endsOutsideView : r,
			bodyScroll : c,
			eventObj : x
		};
		f.ddel = this.getDragElement(a, f);
		return f
	},
	getRelatedRecords : function(c) {
		var b = this.schedulerView;
		var d = b.panel.up("tablepanel").getEventSelectionModel();
		var a = [];
		if (d.selected.getCount() > 1) {
			d.selected.each(function(e) {
						if (e !== c && e.isDraggable() !== false) {
							a.push(e)
						}
					})
		}
		return a
	},
	getDragElement : function(a, e) {
		var c = this.schedulerView;
		var d = e.eventEls;
		var f;
		if (d.length > 1) {
			var b = Ext.get(Ext.core.DomHelper.createDom({
						tag : "div",
						cls : "sch-dd-wrap",
						style : {
							overflow : "visible"
						}
					}));
			Ext.Array.each(d, function(h) {
						f = h.dom.cloneNode(true);
						if (h.dom === a.dom) {
							f.id = "sch-id-dd-ref"
						} else {
							f.id = Ext.id()
						}
						b.appendChild(f);
						var g = h.getOffsetsTo(a);
						Ext.fly(f).setStyle({
									left : g[0] + "px",
									top : g[1] + "px"
								})
					});
			return b.dom
		} else {
			f = a.dom.cloneNode(true);
			f.id = "sch-id-dd-ref";
			f.style.left = 0;
			f.style.top = 0;
			return f
		}
	},
	onDragDrop : function(k, c) {
		var m = this, q = m.schedulerView, n = q.resourceStore, l = m.cachedTarget
				|| Ext.dd.DragDropMgr.getDDById(c), i = m.dragData, d = m
				.getDragContext(k), o = false;
		if (d
				&& d.valid
				&& d.startDate
				&& d.endDate
				&& this.isValidDrop(i.resourceRecord, d.resource,
						i.relatedEventRecords)) {
			var h = i.eventRecords[0], b = d.startDate, f = i.relatedEventRecords, a = b
					- i.origStart, g = d.resource;
			o = (d.startDate - i.origStart) !== 0 || g !== i.resourceRecord;
			h.beginEdit();
			if (g !== i.resourceRecord) {
				h.unassign(i.resourceRecord);
				h.assign(g)
			}
			h.setStartEndDate(d.startDate, d.endDate);
			h.endEdit();
			var j;
			var p = Ext.data.TreeStore && n instanceof Ext.data.TreeStore;
			if (p) {
				j = q.indexOf(i.resourceRecord) - q.indexOf(g)
			} else {
				j = n.indexOf(i.resourceRecord) - n.indexOf(g)
			}
			Ext.each(f, function(r) {
						r.shift(Ext.Date.MILLI, a);
						if (p) {
							var e = q.store.indexOf(r.getResource()) - j;
							r.setResource(q.store.getAt(e))
						} else {
							r.setResource(n.getAt(n.indexOf(r.getResource())
									- j))
						}
					});
			q.fireEvent("eventdrop", q, [h].concat(f), false)
		}
		if (m.tip) {
			m.tip.hide()
		}
		if (d && d.valid && o) {
			if (Ext.isIE9) {
				m.proxy.el.setStyle("visibility", "hidden");
				Ext.Function.defer(m.onValidDrop, 10, m, [l, k, c])
			} else {
				m.onValidDrop(l, k, c)
			}
			q.fireEvent("aftereventdrop", q)
		} else {
			this.onInvalidDrop(l, k, c)
		}
	},
	isValidDrop : function(e, b, c) {
		if (e === b || c.length === 0) {
			return true
		}
		var f = this, j = f.schedulerView, a = true, d, g = j.resourceStore, h, i = Ext.data.TreeStore
				&& g instanceof Ext.data.TreeStore;
		if (i) {
			d = j.indexOf(e) - j.indexOf(b)
		} else {
			d = g.indexOf(e) - g.indexOf(b)
		}
		Ext.each(c, function(k) {
					if (i) {
						h = j.store.indexOf(e) - d;
						if (h < 0 || h >= j.store.getCount()) {
							a = false;
							return false
						}
					} else {
						h = g.indexOf(e) - d;
						if (h < 0 || h >= g.getCount()) {
							a = false;
							return false
						}
					}
				});
		return a
	},
	onInvalidDrop : function() {
		var a = this.schedulerView;
		if (this.tip) {
			this.tip.hide()
		}
		Ext.each(this.dragData.eventEls, function(b) {
					b.show()
				});
		this.callParent(arguments);
		a.fireEvent("aftereventdrop", a)
	},
	resolveResource : function(f, d) {
		var b = this.proxy.el.dom;
		b.style.display = "none";
		var c = document.elementFromPoint(f[0] - this.dragData.bodyScroll.left,
				f[1] - this.dragData.bodyScroll.top);
		if (Ext.isIE8 && d && d.browserEvent.synthetic) {
			c = document.elementFromPoint(f[0] - this.dragData.bodyScroll.left,
					f[1] - this.dragData.bodyScroll.top)
		}
		b.style.display = "block";
		if (!c) {
			return null
		}
		if (!c.className.match(this.schedulerView.timeCellCls)) {
			var a = Ext.fly(c).up("." + this.schedulerView.timeCellCls);
			if (a) {
				c = a.dom;
				return this.schedulerView.resolveResource(c)
			}
			return null
		}
		return this.schedulerView.resolveResource(c)
	}
});
Ext.define("Sch.feature.DragDrop", {
			requires : ["Ext.XTemplate", "Sch.feature.PointDragZone",
					"Sch.feature.DragZone", "Sch.feature.DropZone"],
			validatorFn : function(b, a, c, f, d) {
				return true
			},
			enableCopy : false,
			useDragProxy : false,
			showTooltip : true,
			constructor : function(c, a) {
				Ext.apply(this, a);
				this.schedulerView = c;
				var b = !!document.elementFromPoint;
				if (!this.useDragProxy && !this.dragConfig.useDragProxy && b) {
					this.initProxyLessDD()
				} else {
					this.initProxyDD()
				}
				this.schedulerView.on("destroy", this.cleanUp, this);
				this.callParent([a])
			},
			cleanUp : function() {
				if (this.schedulerView.dragZone) {
					this.schedulerView.dragZone.destroy()
				}
				if (this.schedulerView.dropZone) {
					this.schedulerView.dropZone.destroy()
				}
				if (this.tip) {
					this.tip.destroy()
				}
			},
			initProxyLessDD : function() {
				var a = this.schedulerView;
				a.dragZone = Ext.create("Sch.feature.PointDragZone", a.el, Ext
								.apply({
											ddGroup : a.id,
											schedulerView : a,
											enableCopy : this.enableCopy,
											validatorFn : this.validatorFn,
											validatorFnScope : this.validatorFnScope,
											showTooltip : this.showTooltip
										}, this.dragConfig))
			},
			initProxyDD : function() {
				var b = this.schedulerView, a = b.el;
				b.dragZone = Ext.create("Sch.feature.DragZone", a, Ext.apply({
									ddGroup : b.id,
									schedulerView : b,
									enableCopy : this.enableCopy
								}, this.dragConfig));
				b.dropZone = Ext.create("Sch.feature.DropZone", a, Ext.apply({
									ddGroup : b.id,
									schedulerView : b,
									enableCopy : this.enableCopy,
									validatorFn : this.validatorFn,
									validatorFnScope : this.validatorFnScope
								}, this.dropConfig))
			}
		});
Ext.define("Sch.feature.ResizeZone", {
	extend : "Ext.util.Observable",
	requires : ["Ext.resizer.Resizer", "Sch.tooltip.Tooltip"],
	showTooltip : true,
	validatorFn : Ext.emptyFn,
	validatorFnScope : null,
	constructor : function(a) {
		Ext.apply(this, a);
		var b = this.schedulerView;
		b.on({
					destroy : this.cleanUp,
					scope : this
				});
		b.mon(b.el, {
					mousedown : this.onMouseDown,
					mouseup : this.onMouseUp,
					scope : this,
					delegate : ".sch-resizable-handle"
				});
		this.callParent(arguments)
	},
	onMouseDown : function(g, a) {
		var b = this.schedulerView;
		var f = this.eventRec = b.resolveEventRecord(a);
		var c = this.getHandlePosition(a);
		var d = f.isResizable();
		if (d === false || typeof d === "string" && !a.className.match(d)) {
			return
		}
		this.eventRec = f;
		this.handlePos = c;
		b.el.on({
					mousemove : this.onMouseMove,
					scope : this,
					single : true
				})
	},
	onMouseUp : function(c, a) {
		var b = this.schedulerView;
		b.el.un({
					mousemove : this.onMouseMove,
					scope : this,
					single : true
				})
	},
	onMouseMove : function(g, a) {
		var c = this.schedulerView;
		var f = this.eventRec;
		if (!f || c.fireEvent("beforeeventresize", c, f, g) === false) {
			return
		}
		delete this.eventRec;
		g.stopEvent();
		var d = this.handlePos, b = Ext.get(c.getElementFromEventRecord(f));
		this.resizer = this.createResizer(b, f, d, g, a);
		this.resizer.resizeTracker.onMouseDown(g, this.resizer[d].dom);
		if (this.showTooltip) {
			if (!this.tip) {
				this.tip = Ext.create("Sch.tooltip.Tooltip", {
							schedulerView : c,
							cls : "sch-resize-tip"
						})
			}
			this.tip.update(f.getStartDate(), f.getEndDate(), true);
			this.tip.show(b)
		}
		c.fireEvent("eventresizestart", c, f)
	},
	getHandlePosition : function(a) {
		if (this.schedulerView.getOrientation() === "horizontal") {
			return a.className.match("start") ? "west" : "east"
		} else {
			return a.className.match("start") ? "north" : "south"
		}
	},
	createResizer : function(c, f, b) {
		var j = this.schedulerView, e = f.getResource(), g = j
				.getSnapPixelAmount(), i = j.getScheduleRegion(e, f), a = j
				.getDateConstraints(e, f), d = {
			target : c,
			dateConstraints : a,
			resourceRecord : e,
			eventRecord : f,
			handles : b.substring(0, 1),
			minHeight : c.getHeight(),
			constrainTo : i,
			listeners : {
				resizedrag : this.partialResize,
				resize : this.afterResize,
				scope : this
			}
		};
		if (j.getOrientation() === "vertical") {
			if (g > 0) {
				Ext.apply(d, {
							minHeight : g,
							heightIncrement : g
						})
			}
		} else {
			if (g > 0) {
				Ext.apply(d, {
							minWidth : g,
							widthIncrement : g
						})
			}
		}
		var h = Ext.create("Ext.resizer.Resizer", d);
		c.setStyle("z-index", parseInt(c.getStyle("z-index"), 10) + 1);
		return h
	},
	getStartEndDates : function(f) {
		var e = this.resizer, c = e.el, d = this.schedulerView, b = e.handles[0] === "w"
				|| e.handles[0] === "n", g, a;
		if (b) {
			a = e.eventRecord.getEndDate();
			g = d.getDateFromXY([c.getLeft(), c.getTop()], "round")
		} else {
			g = e.eventRecord.getStartDate();
			a = d.getDateFromXY([c.getRight(), c.getBottom()], "round")
		}
		if (e.dateConstraints) {
			g = Sch.util.Date.constrain(g, e.dateConstraints.start,
					e.dateConstraints.end);
			a = Sch.util.Date.constrain(a, e.dateConstraints.start,
					e.dateConstraints.end)
		}
		return {
			start : g,
			end : a
		}
	},
	partialResize : function(b, d, h, g) {
		var j = this.schedulerView, i = this.getStartEndDates(g.getXY()), c = i.start, f = i.end;
		if (!c || !f || ((b.start - c === 0) && (b.end - f === 0))) {
			return
		}
		var a = this.validatorFn.call(this.validatorFnScope || this,
				b.resourceRecord, b.eventRecord, c, f) !== false;
		b.end = f;
		b.start = c;
		j.fireEvent("eventpartialresize", j, b.eventRecord, c, f, b.el);
		if (this.showTooltip) {
			this.tip.update(c, f, a)
		}
	},
	afterResize : function(a, k, f, g) {
		if (this.showTooltip) {
			this.tip.hide()
		}
		var i = a.resourceRecord, j = a.eventRecord, d = j.getStartDate(), m = j
				.getEndDate(), b = a.start || d, c = a.end || m, l = this.schedulerView;
		if (b
				&& c
				&& (c - b > 0)
				&& ((b - d !== 0) || (c - m !== 0))
				&& this.validatorFn.call(this.validatorFnScope || this, i, j,
						b, c, g) !== false) {
			j.setStartEndDate(b, c)
		} else {
			l.refreshKeepingScroll()
		}
		this.resizer.destroy();
		l.fireEvent("eventresizeend", l, j)
	},
	cleanUp : function() {
		if (this.tip) {
			this.tip.destroy()
		}
	}
});
Ext.define("Sch.feature.Scheduling", {
			extend : "Ext.grid.feature.Feature",
			alias : "feature.scheduling",
			getMetaRowTplFragments : function() {
				return {
					embedRowAttr : function() {
						return 'style="height:{rowHeight}px"'
					}
				}
			}
		});
Ext.define("Sch.column.Time", {
			extend : "Ext.grid.column.Column",
			alias : "timecolumn",
			draggable : false,
			groupable : false,
			hideable : false,
			sortable : false,
			fixed : true,
			align : "center",
			tdCls : "sch-timetd",
			menuDisabled : true,
			initComponent : function() {
				this.addEvents("timeheaderdblclick");
				this.enableBubble("timeheaderdblclick");
				this.callParent()
			},
			initRenderData : function() {
				var a = this;
				a.renderData.headerCls = a.renderData.headerCls || a.headerCls;
				return a.callParent(arguments)
			},
			onElDblClick : function(b, a) {
				this.callParent(arguments);
				this.fireEvent("timeheaderdblclick", this, this.startDate,
						this.endDate, b)
			}
		}, function() {
			Sch.column.Time.prototype.renderTpl = Sch.column.Time.prototype.renderTpl
					.replace("column-header-inner",
							"column-header-inner sch-timeheader {headerCls}")
		});
Ext.define("Sch.column.Resource", {
			extend : "Ext.grid.Column",
			alias : "widget.resourcecolumn",
			cls : "sch-resourcecolumn-header",
			align : "center",
			menuDisabled : true,
			hideable : false,
			sortable : false,
			initComponent : function() {
				this.callParent(arguments);
				this.minWidth = undefined
			}
		});
Ext.define("Sch.column.timeAxis.Horizontal", {
	extend : "Ext.grid.column.Column",
	alias : "widget.timeaxiscolumn",
	requires : ["Ext.Date", "Ext.XTemplate", "Sch.column.Time",
			"Sch.preset.Manager"],
	cls : "sch-timeaxiscolumn",
	timeAxis : null,
	renderTpl : '<div id="{id}-titleEl" class="'
			+ Ext.baseCSSPrefix
			+ 'column-header-inner"><span id="{id}-textEl" style="display:none" class="'
			+ Ext.baseCSSPrefix
			+ 'column-header-text"></span><tpl if="topHeaderCells">{topHeaderCells}</tpl><tpl if="middleHeaderCells">{middleHeaderCells}</tpl></div>{%this.renderContainer(out,values)%}',
	headerRowTpl : '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}" class="sch-header-row sch-header-row-{position}"><thead><tr>{cells}</tr></thead></table>',
	headerCellTpl : '<tpl for="."><td class="sch-column-header x-column-header {headerCls}" style="position : static; text-align: {align}; {style}" tabIndex="0" id="{headerId}" headerPosition="{position}" headerIndex="{index}"><div class="x-column-header-inner">{header}</div></td></tpl>',
	columnConfig : {},
	timeCellRenderer : null,
	timeCellRendererScope : null,
	columnWidth : null,
	previousWidth : null,
	previousHeight : null,
	initComponent : function() {
		if (!(this.headerRowTpl instanceof Ext.Template)) {
			this.headerRowTpl = Ext.create("Ext.XTemplate", this.headerRowTpl)
		}
		if (!(this.headerCellTpl instanceof Ext.Template)) {
			this.headerCellTpl = Ext
					.create("Ext.XTemplate", this.headerCellTpl)
		}
		this.columns = [{}];
		this.addEvents("timeheaderdblclick", "timeaxiscolumnreconfigured");
		this.enableBubble("timeheaderdblclick");
		this.stubForResizer = new Ext.Component({
					isOnLeftEdge : function() {
						return false
					},
					isOnRightEdge : function() {
						return false
					},
					el : {
						dom : {
							style : {}
						}
					}
				});
		this.callParent(arguments);
		this.onTimeAxisReconfigure();
		this
				.mon(this.timeAxis, "reconfigure", this.onTimeAxisReconfigure,
						this)
	},
	getSchedulingView : function() {
		return this.getOwnerHeaderCt().view
	},
	onTimeAxisReconfigure : function() {
		var e = this.timeAxis, d = e.preset.timeColumnWidth, f = this.rendered
				&& this.getSchedulingView(), g = e.headerConfig, b = e
				.getStart(), c = e.getEnd(), h = {
			renderer : this.timeColumnRenderer,
			scope : this,
			width : this.rendered ? f.calculateTimeColumnWidth(d) : d
		};
		delete this.previousWidth;
		delete this.previousHeight;
		var j = this.columnConfig = this.createColumns(this.timeAxis, g, h);
		Ext.suspendLayouts();
		this.removeAll();
		if (this.rendered) {
			var a = this.el.child(".x-column-header-inner");
			a.select("table").remove();
			var i = this.initRenderData();
			if (j.top) {
				Ext.core.DomHelper.append(a, i.topHeaderCells)
			}
			if (j.middle) {
				Ext.core.DomHelper.append(a, i.middleHeaderCells)
			}
			if (!j.top && !j.middle) {
				this.addCls("sch-header-single-row")
			} else {
				this.removeCls("sch-header-single-row")
			}
		}
		Ext.resumeLayouts();
		this.add(j.bottom);
		if (this.rendered) {
			if (this.fireEvent("timeaxiscolumnreconfigured", this) !== false) {
				f.refresh()
			}
		}
	},
	beforeRender : function() {
		var a = this.columnConfig;
		if (!a.middle && !a.top) {
			this.addCls("sch-header-single-row")
		}
		this.callParent(arguments)
	},
	timeColumnRenderer : function(i, e, f, l, d, c, k) {
		var a = "";
		if (Ext.isIE) {
			e.style += ";z-index:" + (this.items.getCount() - d)
		}
		if (this.timeCellRenderer) {
			var h = this.timeAxis, b = h.getAt(d), g = b.start, j = b.end;
			a = this.timeCellRenderer.call(this.timeCellRendererScope || this,
					e, f, l, d, c, g, j)
		}
		return a
	},
	initRenderData : function() {
		var a = this.columnConfig;
		var c = a.top ? this.headerRowTpl.apply({
					cells : this.headerCellTpl.apply(a.top),
					position : "top",
					tstyle : "border-top : 0; width : 100px"
				}) : "";
		var b = a.middle ? this.headerRowTpl.apply({
					cells : this.headerCellTpl.apply(a.middle),
					position : "middle",
					tstyle : a.top
							? "width : 100px"
							: "border-top : 0; width : 100px"
				}) : "";
		return Ext.apply(this.callParent(arguments), {
					topHeaderCells : c,
					middleHeaderCells : b
				})
	},
	defaultRenderer : function(c, b, a) {
		return Ext.Date.format(c, a)
	},
	createColumns : function(f, d, g) {
		if (!f || !d) {
			throw "Invalid parameters passed to createColumns"
		}
		var c = [], a = d.bottom || d.middle, h, e = this;
		f.forEachInterval(d.bottom ? "bottom" : "middle", function(l, j, k) {
					h = {
						align : a.align || "center",
						headerCls : "",
						startDate : l,
						endDate : j
					};
					if (a.renderer) {
						h.header = a.renderer.call(a.scope || e, l, j, h, k)
					} else {
						h.header = e.defaultRenderer(l, j, a.dateFormat)
					}
					c[c.length] = Ext
							.create("Sch.column.Time", Ext.apply(h, g))
				});
		var b = this.createHeaderRows(f, d);
		return {
			bottom : c,
			middle : b.middle,
			top : b.top
		}
	},
	createHeaderRows : function(e, c) {
		var d = {};
		if (c.top) {
			var a;
			if (c.top.cellGenerator) {
				a = c.top.cellGenerator.call(this, e.getStart(), e.getEnd())
			} else {
				a = this.createHeaderRow(e, c.top)
			}
			d.top = this.processHeaderRow(a, "top")
		}
		if (c.bottom) {
			var b;
			if (c.middle.cellGenerator) {
				b = c.middle.cellGenerator.call(this, e.getStart(), e.getEnd())
			} else {
				b = this.createHeaderRow(e, c.middle)
			}
			d.middle = this.processHeaderRow(b, "middle")
		}
		return d
	},
	processHeaderRow : function(c, a) {
		var b = this;
		Ext.each(c, function(d, e) {
					d.index = e;
					d.position = a;
					d.headerId = b.stubForResizer.id
				});
		return c
	},
	createHeaderRow : function(e, k) {
		var n = [], l, a = e.getStart(), c = e.getEnd(), m = c - a, j = [], b = a, d = 0, f, g = k.align
				|| "center", h;
		while (b < c) {
			h = Sch.util.Date.min(e.getNext(b, k.unit, k.increment || 1), c);
			l = {
				align : g,
				start : b,
				end : h,
				headerCls : ""
			};
			if (k.renderer) {
				l.header = k.renderer.call(k.scope || this, b, h, l, d)
			} else {
				l.header = this.defaultRenderer(b, h, k.dateFormat, l, d)
			}
			n.push(l);
			b = h;
			d++
		}
		return n
	},
	afterLayout : function() {
		delete this.columnWidth;
		this.callParent(arguments);
		var b = this.getWidth();
		var g = this.getHeight();
		if (b === this.previousWidth && g === this.previousHeight) {
			return
		}
		this.previousWidth = b;
		this.previousHeight = g;
		var i = this.columnConfig;
		var e = this;
		var c = this.el;
		var f = i.top;
		var d = 0;
		var a = 0;
		if (f) {
			c.select(".sch-header-row-top").setWidth(this.lastBox.width);
			c.select(".sch-header-row-top td").each(function(l, m, j) {
						var k = e.getHeaderGroupCellWidth(f[j].start, f[j].end);
						l.setVisibilityMode(Ext.Element.DISPLAY);
						if (k) {
							d += k;
							l.show();
							l.setWidth(k)
						} else {
							l.hide()
						}
					})
		}
		var h = i.middle;
		if (h) {
			c.select(".sch-header-row-middle").setWidth(this.lastBox.width);
			c.select(".sch-header-row-middle td").each(function(l, m, j) {
						var k = e.getHeaderGroupCellWidth(h[j].start, h[j].end);
						l.setVisibilityMode(Ext.Element.DISPLAY);
						if (k) {
							a += k;
							l.show();
							l.setWidth(k)
						} else {
							l.hide()
						}
					})
		}
	},
	getHeaderGroupCellWidth : function(h, b) {
		var e = this.timeAxis.unit, d = this.timeAxis.increment, c, g = Sch.util.Date
				.getMeasuringUnit(e), a = Sch.util.Date.getDurationInUnit(h, b,
				g), f = this.getSchedulingView();
		if (this.timeAxis.isContinuous()) {
			c = a * f.getSingleUnitInPixels(g) / d
		} else {
			c = f.getXYFromDate(b)[0] - f.getXYFromDate(h)[0]
		}
		return c
	},
	onElDblClick : function(d, f) {
		this.callParent(arguments);
		var e = d.getTarget(".sch-column-header");
		if (e) {
			var a = Ext.fly(e).getAttribute("headerPosition"), b = Ext.fly(e)
					.getAttribute("headerIndex"), c = this.columnConfig[a][b];
			this.fireEvent("timeheaderdblclick", this, c.start, c.end, d)
		}
	},
	getTimeColumnWidth : function() {
		if (this.columnWidth === null) {
			this.columnWidth = this.items.get(0).getWidth()
		}
		return this.columnWidth
	},
	setTimeColumnWidth : function(a) {
		this.suspendEvents();
		this.items.each(function(b) {
					b.setWidth(a)
				});
		this.resumeEvents()
	}
});
Ext.define("Sch.column.timeAxis.HorizontalSingle", {
	extend : "Sch.column.Time",
	alias : "widget.singletimeaxiscolumn",
	requires : ["Ext.Date", "Ext.XTemplate", "Sch.preset.Manager"],
	cls : "sch-simple-timeaxis",
	timeAxis : null,
	trackHeaderOver : true,
	compactCellWidthThreshold : 16,
	renderTpl : '<div id="{id}-titleEl" class="'
			+ Ext.baseCSSPrefix
			+ 'column-header-inner"><span id="{id}-textEl" style="display:none" class="'
			+ Ext.baseCSSPrefix
			+ 'column-header-text"></span><tpl if="topHeaderCells">{topHeaderCells}</tpl><tpl if="middleHeaderCells">{middleHeaderCells}</tpl><tpl if="bottomHeaderCells">{bottomHeaderCells}</tpl></div>{%this.renderContainer(out,values)%}',
	headerRowTpl : '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}" class="sch-header-row sch-header-row-{position}"><thead><tr><tpl for="cells"><td class="sch-column-header x-column-header {headerCls}" style="position : static; text-align: {align}; {style}" tabIndex="0" id="{headerId}" headerPosition="{parent.position}" headerIndex="{[xindex-1]}"><div class="sch-simple-timeheader">{header}</div></td></tpl></tr></thead></table>',
	columnConfig : {},
	columnWidth : null,
	nbrTimeColumns : null,
	initComponent : function() {
		this.tdCls += " sch-singletimetd";
		if (!(this.headerRowTpl instanceof Ext.Template)) {
			this.headerRowTpl = Ext.create("Ext.XTemplate", this.headerRowTpl)
		}
		this.addEvents("timeheaderdblclick", "timeaxiscolumnreconfigured");
		this.enableBubble("timeheaderdblclick");
		this.callParent(arguments);
		this.onTimeAxisReconfigure();
		this
				.mon(this.timeAxis, "reconfigure", this.onTimeAxisReconfigure,
						this);
		this.on("resize", this.refreshHeaderSizes, this);
		this.ownHoverCls = this.hoverCls;
		this.hoverCls = ""
	},
	getSchedulingView : function() {
		return this.getOwnerHeaderCt().view
	},
	onTimeAxisReconfigure : function() {
		var h = this.timeAxis, g = h.preset.timeColumnWidth, j = this.rendered
				&& this.getSchedulingView(), l = h.headerConfig, c = h
				.getStart(), f = h.getEnd(), d = this.rendered ? j
				.calculateTimeColumnWidth(g) : g;
		var o = this.columnConfig = this.createHeaderRows(l);
		var a = o.bottom || o.middle;
		if (this.rendered) {
			var e;
			var b = this.el.child(".x-column-header-inner");
			var i = b.dom;
			var k = i.style.display;
			var m = i.parentNode;
			i.style.display = "none";
			m.removeChild(i);
			i.innerHTML = "";
			var n = this.initRenderData();
			if (o.top) {
				e = Ext.core.DomHelper.append(b, n.topHeaderCells);
				this.refreshHeaderRow("top", e)
			}
			if (o.middle) {
				e = Ext.core.DomHelper.append(b, n.middleHeaderCells);
				this.refreshHeaderRow("middle", e)
			}
			if (o.bottom) {
				e = Ext.core.DomHelper.append(b, n.bottomHeaderCells);
				this.refreshHeaderRow("bottom", e)
			}
			if (!o.top && !o.middle) {
				this.addCls("sch-header-single-row")
			} else {
				this.removeCls("sch-header-single-row")
			}
			m.appendChild(i);
			i.style.display = k;
			if (d !== this.columnWidth || this.nbrTimeColumns !== a.length) {
				this.nbrTimeColumns = a.length;
				this.setTimeColumnWidth(d)
			}
			if (this.fireEvent("timeaxiscolumnreconfigured", this) !== false) {
				j.refreshKeepingResourceScroll(true)
			}
		} else {
			if (d !== this.columnWidth || this.nbrTimeColumns !== a.length) {
				this.nbrTimeColumns = a.length;
				this.setTimeColumnWidth(d)
			}
		}
	},
	beforeRender : function() {
		var b = this, a = this.columnConfig;
		if (!a.middle && !a.top) {
			b.addCls("sch-header-single-row")
		}
		b.callParent(arguments)
	},
	afterRender : function() {
		var a = this;
		if (this.trackHeaderOver) {
			a.el.on({
						mousemove : a.highlightCell,
						delegate : "div.sch-simple-timeheader",
						scope : a
					});
			a.el.on({
						mouseleave : a.clearHighlight,
						scope : a
					})
		}
		a.callParent(arguments)
	},
	initRenderData : function() {
		var a = this.columnConfig;
		var c = a.top ? this.headerRowTpl.apply({
					cells : a.top,
					position : "top",
					tstyle : "border-top : 0; width : 100px"
				}) : "";
		var b = a.middle ? this.headerRowTpl.apply({
					cells : a.middle,
					position : "middle",
					tstyle : a.top
							? "width : 100px"
							: "border-top : 0; width : 100px"
				}) : "";
		var d = a.bottom ? this.headerRowTpl.apply({
					cells : a.bottom,
					position : "bottom",
					tstyle : "width : 100px"
				}) : "";
		return Ext.apply(this.callParent(arguments), {
					topHeaderCells : c,
					middleHeaderCells : b,
					bottomHeaderCells : d
				})
	},
	defaultRenderer : function(c, b, a) {
		return Ext.Date.format(c, a)
	},
	createHeaderRows : function(a) {
		var b = {};
		for (var c in a) {
			if (a[c].cellGenerator) {
				b[c] = a[c].cellGenerator.call(this, this.timeAxis.getStart(),
						this.timeAxis.getEnd())
			} else {
				b[c] = this.createHeaderRow(c, a[c])
			}
		}
		return b
	},
	createHeaderRow : function(a, c) {
		var b = [], d = this, f, e = c.align || "center";
		this.timeAxis.forEachInterval(a, function(j, g, h) {
					f = {
						align : e,
						start : j,
						end : g,
						headerCls : ""
					};
					if (c.renderer) {
						f.header = c.renderer.call(c.scope || d, j, g, f, h)
					} else {
						f.header = d.defaultRenderer(j, g, c.dateFormat, f, h)
					}
					if (c.unit === Sch.util.Date.DAY
							&& (!c.increment || c.increment === 1)) {
						f.headerCls += " sch-dayheadercell-" + j.getDay()
					}
					b.push(f)
				});
		return b
	},
	afterLayout : function() {
		this.callParent(arguments);
		this.refreshHeaderSizes()
	},
	refreshHeaderSizes : function() {
		var a = this.columnConfig;
		if (a.top) {
			this.refreshHeaderRow("top")
		}
		if (a.middle) {
			this.refreshHeaderRow("middle")
		}
		if (a.bottom) {
			this.refreshHeaderRow("bottom")
		}
	},
	refreshHeaderRow : function(a, b) {
		var e = this.el;
		var f = this.columnConfig[a];
		var d = this;
		var c;
		b = b || e.down(".sch-header-row-" + a, true);
		Ext.fly(b).setWidth(d.getTotalWidth());
		Ext.fly(b).select(" thead > tr > td").each(function(h, i, g) {
					c = d.getHeaderGroupCellWidth(f[g].start, f[g].end);
					h.setVisibilityMode(Ext.Element.DISPLAY);
					if (c) {
						h.show();
						h.setWidth(c
								- (Ext.chromeVersion === 19 ? (g ? 1 : 0) : 0))
					} else {
						h.hide()
					}
				});
		if (a === "bottom") {
			if (c < this.compactCellWidthThreshold) {
				Ext.fly(b).addCls("sch-header-row-compact")
			} else {
				Ext.fly(b).removeCls("sch-header-row-compact")
			}
		}
	},
	getHeaderGroupCellWidth : function(h, b) {
		var e = this.timeAxis.unit, d = this.timeAxis.increment, c, g = Sch.util.Date
				.getMeasuringUnit(e), a = Sch.util.Date.getDurationInUnit(h, b,
				g), f = this.getSchedulingView();
		if (this.timeAxis.isContinuous()) {
			c = a * f.getSingleUnitInPixels(g) / d
		} else {
			c = f.getXYFromDate(b)[0] - f.getXYFromDate(h)[0]
		}
		return c
	},
	onElDblClick : function(d, f) {
		var e = d.getTarget(".sch-column-header");
		if (e) {
			var a = Ext.fly(e).getAttribute("headerPosition"), b = Ext.fly(e)
					.getAttribute("headerIndex"), c = this.columnConfig[a][b];
			this.fireEvent("timeheaderdblclick", this, c.start, c.end, d)
		}
	},
	getTimeColumnWidth : function() {
		if (this.columnWidth === null) {
			this.columnWidth = this.getWidth() / this.nbrTimeColumns
		}
		return this.columnWidth
	},
	setTimeColumnWidth : function(a) {
		this.columnWidth = a;
		if (this.rendered) {
			Ext.suspendLayouts();
			this.setWidth(a * this.nbrTimeColumns);
			Ext.resumeLayouts();
			this.refreshHeaderSizes();
			this.ownerCt.updateLayout()
		} else {
			this.setWidth(a * this.nbrTimeColumns)
		}
	},
	getTotalWidth : function() {
		return this.columnWidth * this.nbrTimeColumns
	},
	highlightCell : function(c, a) {
		var b = this;
		if (a !== b.highlightedCell) {
			b.clearHighlight();
			b.highlightedCell = a;
			Ext.fly(a).addCls(b.ownHoverCls)
		}
	},
	clearHighlight : function() {
		var b = this, a = b.highlightedCell;
		if (a) {
			Ext.fly(a).removeCls(b.ownHoverCls);
			delete b.highlightedCell
		}
	}
});
Ext.define("Sch.column.timeAxis.Vertical", {
			extend : "Ext.grid.column.Column",
			alias : "widget.verticaltimeaxis",
			align : "right",
			draggable : false,
			groupable : false,
			hideable : false,
			sortable : false,
			menuDisabled : true,
			dataIndex : "start",
			timeAxis : null,
			initComponent : function() {
				this.callParent(arguments);
				this.tdCls = (this.tdCls || "") + " sch-verticaltimeaxis-cell";
				this.scope = this
			},
			renderer : function(b, a, c) {
				var d = this.timeAxis.headerConfig, e = d.bottom || d.middle;
				if (e.renderer) {
					return e.renderer
							.call(e.scope || this, b, c.data.end, a, 0)
				} else {
					return Ext.Date.format(b, e.dateFormat)
				}
			}
		});
Ext.define("Sch.mixin.Lockable", {
	extend : "Ext.grid.Lockable",
	requires : ["Sch.column.timeAxis.Horizontal",
			"Sch.column.timeAxis.HorizontalSingle"],
	findEditingPlugin : function() {
		var b = this.plugins || [];
		var c = this;
		var a;
		Ext.each(b, function(e, d) {
					if (Ext.grid.plugin && Ext.grid.plugin.CellEditing
							&& e instanceof Ext.grid.plugin.CellEditing) {
						a = e;
						Ext.Array.remove(b, e);
						return false
					}
				});
		return a
	},
	processSchedulerPlugins : function() {
		var e = [];
		var d = [];
		var g = [];
		var a = this.plugins || [];
		var c = this;
		for (var b = a.length - 1; b >= 0; b--) {
			var f = a[b];
			if (f.lockableScope) {
				switch (f.lockableScope) {
					case "top" :
						g.push(f);
						break;
					case "locked" :
						e.push(f);
						break;
					case "normal" :
						d.push(f);
						break
				}
				Ext.Array.remove(a, f)
			}
		}
		if (e.length > 0) {
			c.lockedGridConfig.plugins = (c.lockedGridConfig.plugins || [])
					.concat(e)
		}
		if (d.length > 0) {
			c.normalGridConfig.plugins = (c.normalGridConfig.plugins || [])
					.concat(d)
		}
		c.topPlugins = g
	},
	injectLockable : function() {
		var d = this.findEditingPlugin();
		var i = this;
		var f = Ext.data.TreeStore && i.store instanceof Ext.data.TreeStore;
		var j = i.store.buffered;
		var c = i.getEventSelectionModel ? i.getEventSelectionModel() : i
				.getSelectionModel();
		i.lockedGridConfig = i.lockedGridConfig || {};
		i.normalGridConfig = i.schedulerConfig || i.normalGridConfig || {};
		var a = i.lockedGridConfig, h = i.normalGridConfig;
		Ext.applyIf(i.lockedGridConfig, {
					enableLocking : false,
					lockable : false,
					useArrows : true,
					xtype : i.lockedXType,
					columnLines : i.columnLines,
					rowLines : i.rowLines,
					stateful : i.stateful,
					id : i.id + "_locked",
					delayScroll : function() {
						if (this.rendered) {
							return this.self.prototype.delayScroll.apply(this,
									arguments)
						}
					},
					split : true,
					animCollapse : false,
					collapseDirection : "left",
					region : "west"
				});
		if (d) {
			i.lockedGridConfig.plugins = (i.lockedGridConfig.plugins || [])
					.concat(d)
		}
		i.processSchedulerPlugins();
		Ext.applyIf(i.normalGridConfig, {
					layout : "fit",
					xtype : i.normalXType,
					viewType : i.viewType,
					enableLocking : false,
					lockable : false,
					sortableColumns : false,
					enableColumnMove : false,
					enableColumnResize : false,
					enableColumnHide : false,
					selModel : c,
					eventSelModel : c,
					_top : i,
					orientation : i.orientation,
					viewPreset : i.viewPreset,
					timeAxis : i.timeAxis,
					columnLines : i.columnLines,
					rowLines : i.rowLines,
					collapseDirection : "right",
					animCollapse : false,
					region : "center"
				});
		i.bothCfgCopy = i.bothCfgCopy
				|| (Ext.grid.Panel && Ext.grid.Panel.prototype.bothCfgCopy)
				|| ["invalidateScrollerOnRefresh", "hideHeaders",
						"enableColumnHide", "enableColumnMove",
						"enableColumnResize", "sortableColumns"];
		if (i.orientation === "vertical") {
			a.store = h.store = i.timeAxis.tickStore;
			i.mon(i.resourceStore, {
						clear : i.refreshResourceColumns,
						datachanged : i.refreshResourceColumns,
						load : i.refreshResourceColumns,
						scope : i
					})
		}
		if (a.width) {
			i.syncLockedWidth = Ext.emptyFn;
			a.scroll = "horizontal";
			a.scrollerOwner = true
		}
		if (i.resourceStore) {
			h.resourceStore = i.resourceStore
		}
		if (i.eventStore) {
			h.eventStore = i.eventStore
		}
		if (i.dependencyStore) {
			h.dependencyStore = i.dependencyStore
		}
		i.lockedViewConfig = i.lockedViewConfig || {};
		i.normalViewConfig = i.normalViewConfig || {};
		if (f && j && Ext.getScrollbarSize().width === 0) {
			i.lockedGridConfig.scroll = false
		}
		i.lockedViewConfig.enableAnimations = i.normalViewConfig.enableAnimations = false;
		if (f) {
			i.normalViewConfig.providedStore = i.lockedViewConfig.providedStore = i
					.createNodeStore(j, i.store)
		}
		var e = i.layout;
		this.callParent(arguments);
		if (i.topPlugins) {
			i.plugins = i.topPlugins
		}
		if (a.width) {
			i.lockedGrid.setWidth(a.width);
			i.normalGrid.getView().addCls("sch-timeline-horizontal-scroll")
		} else {
			if (i.normalGrid.collapsed) {
				i.normalGrid.collapsed = false;
				i.normalGrid.view.on("boxready", function() {
							i.normalGrid.collapse()
						}, i, {
							delay : 10
						})
			}
		}
		var k = i.lockedGrid.getView();
		var b = i.normalGrid.getView();
		if (j) {
			k.on("render", this.onLockedViewRender, this);
			this.fixPagingScroller(i.normalGrid.verticalScroller);
			if (Ext.getScrollbarSize().width > 0) {
				k.on({
							scroll : {
								fn : i.onLockedViewScroll,
								element : "el",
								scope : i
							}
						})
			}
		}
		if (Ext.getScrollbarSize().width === 0) {
			k.addCls("sch-ganttpanel-force-locked-scroll")
		}
		if (f) {
			this.setupLockableTree()
		}
		if (!b.deferInitialRefresh) {
			var g = b.onRender;
			b.onRender = function() {
				this.doFirstRefresh = function() {
				};
				g.apply(this, arguments);
				delete this.doFirstRefresh
			}
		}
		if (j) {
			b.el = {
				un : function() {
				}
			};
			i.normalGrid.verticalScroller.bindView(b);
			delete b.el
		}
		i.view.clearListeners();
		k.on({
					itemadd : i.onViewItemAdd,
					refresh : i.updateSpacer,
					scope : i
				});
		i.view = Ext.create("Sch.view.Locking", {
					locked : i.lockedGrid,
					normal : i.normalGrid,
					panel : i
				});
		if (i.syncRowHeight) {
			k.on("refresh", this.onLockedViewRefresh, this);
			b.on({
						itemadd : i.onViewItemAdd,
						itemupdate : i.onNormalViewItemUpdate,
						groupexpand : i.onNormalViewGroupExpand,
						scope : i
					});
			if (Ext.isIE9 && Ext.isStrict) {
				i.onNormalViewItemUpdate = function(l, m, o) {
					if (i.lockedGridDependsOnSchedule) {
						var n = i.lockedGrid.getView();
						n.suspendEvents();
						n.onUpdate(i.lockedGrid.store, l);
						n.resumeEvents()
					}
					var p = i.normalGrid.getView().getNode(m);
					p.style.height = o.style.height;
					i.normalHeights[m] = o.style.height;
					i.syncRowHeights()
				}
			}
		}
		if (e !== "fit") {
			i.layout = e
		}
		i.normalGrid.on({
					collapse : i.onNormalGridCollapse,
					expand : i.onNormalGridExpand,
					scope : i
				});
		i.lockedGrid.on({
					collapse : i.onLockedGridCollapse,
					scope : i
				});
		if (this.lockedGrid.view.store !== this.normalGrid.view.store) {
			Ext.Error
					.raise("Sch.mixin.lockable setup failed, not sharing store between the two views")
		}
	},
	onLockedGridCollapse : function() {
		if (this.normalGrid.collapsed) {
			this.normalGrid.expand()
		}
	},
	onNormalGridCollapse : function() {
		var a = this;
		if (!a.normalGrid.reExpander) {
			a.normalGrid.reExpander = a.normalGrid.placeholder
		}
		if (!a.lockedGrid.rendered) {
			a.lockedGrid.on("render", a.onNormalGridCollapse, a, {
						delay : 1
					})
		} else {
			a.lastLockedWidth = a.lockedGrid.getWidth();
			a.lockedGrid.setWidth(a.getWidth() - 35);
			if (a.lockedGrid.collapsed) {
				a.lockedGrid.expand()
			}
			a.addCls("sch-normalgrid-collapsed")
		}
	},
	onNormalGridExpand : function() {
		this.removeCls("sch-normalgrid-collapsed");
		this.lockedGrid.setWidth(this.lastLockedWidth)
	},
	fixPagingScroller : function(a) {
		var b = a.onViewRefresh;
		a.onViewRefresh = function() {
			b.apply(this, arguments);
			var g = this, f = g.store;
			if (f.getCount() === f.getTotalCount()
					|| (f.isFiltered() && !f.remoteFilter)) {
				g.stretcher.setHeight(g.getScrollHeight())
			}
		};
		var d = a.view.lockingPartner;
		if (d) {
			var e = a.onLockRefresh;
			var c = function(f) {
				if (f.table.dom) {
					e.apply(this, arguments)
				}
			};
			d.un("refresh", e, a);
			d.on("refresh", c, a);
			a.onLockRefresh = c
		}
		a.view.un("render", a.onViewRender, a);
		a.onViewRender = function() {
			var g = this, f = g.view.el;
			f.setStyle("position", "relative");
			g.stretcher = f.createChild({
						style : {
							position : "absolute",
							width : "1px",
							height : 0,
							top : 0,
							left : 0
						}
					}, f.dom.firstChild)
		};
		a.view.on("render", a.onViewRender, a)
	},
	createNodeStore : function(a, b) {
		return new Ext.data.NodeStore({
					buffered : a,
					purgePageCount : 0,
					pageSize : 10000000000,
					treeStore : b,
					recursive : true,
					refreshFromTree : function() {
						var e = this.eventsSuspended;
						this.suspendEvents();
						this.removeAll();
						var c = b.getRootNode(), f = [];
						var d = function(i) {
							if (i != c) {
								f[f.length] = i
							}
							if (i.isExpanded()) {
								var j = i.childNodes, h = j.length;
								for (var g = 0; g < h; g++) {
									d(j[g])
								}
							}
						};
						d(c);
						this.totalCount = f.length;
						this.cachePage(f, 1);
						if (Ext.isNumber(this.eventsSuspended) || !e) {
							this.resumeEvents()
						}
					}
				})
	},
	setupLockableTree : function() {
		var j;
		var g;
		var i = this;
		var k = i.store.buffered;
		var d = i.getView();
		var o = i.lockedGrid.getView();
		var e = i.normalGrid.getView();
		var l = e.store;
		var c = i.store;
		var h = i.normalGrid.verticalScroller;
		var m = function(t, s) {
			var q = c.viewSize || 50;
			var p = l.getTotalCount();
			if (p) {
				var r = s - t + 1;
				if (r < q && p >= r) {
					s = t + q - 1
				}
				if (s >= p) {
					t = p - (s - t);
					s = p - 1;
					t = Math.max(0, t)
				}
				l.guaranteeRange(t, s)
			}
		};
		this.mon(c, "root-fill-start", function() {
					g = true;
					l.suspendEvents();
					if (k) {
						j = l.node;
						l.setNode()
					}
				});
		this.mon(c, "root-fill-end", function() {
					g = false;
					if (k) {
						l.refreshFromTree();
						l.resumeEvents();
						m(0, c.viewSize || 50)
					} else {
						l.resumeEvents();
						d.refresh()
					}
				});
		if (k) {
			var n, a;
			this.mon(l, "guaranteedrange", function(q, r, p) {
						n = r;
						a = p
					});
			var f = function() {
				if (g) {
					return
				}
				l.refreshFromTree();
				m(n || 0, a || 50);
				if (e.rendered) {
					i.onNormalViewScroll()
				}
			};
			this.mon(c, {
						append : f,
						insert : f,
						remove : f,
						move : f,
						expand : f,
						collapse : f,
						sort : f,
						buffer : 1
					})
		}
		this.mon(c, "filter", function(q, p) {
					l.filter.apply(l, p);
					d.refresh()
				});
		this.mon(c, "clearfilter", function(p) {
					l.clearFilter();
					d.refresh()
				});
		this.mon(c, "beforecascade", function(p) {
					l.suspendEvents()
				});
		this.mon(c, "cascade", function(q, p) {
					l.resumeEvents();
					if (p.nbrAffected > 0) {
						e.refreshKeepingScroll(true);
						setTimeout(function() {
									o.saveScrollState();
									o.refresh();
									o.restoreScrollState()
								}, 0)
					}
				});
		if (k && h) {
			var b = h.onGuaranteedRange;
			h.onGuaranteedRange = function() {
				b.apply(this, arguments);
				Ext.suspendLayouts();
				d.refresh();
				Ext.resumeLayouts()
			}
		}
	},
	onNormalViewItemUpdate : function(a, b, d) {
		if (this.lockedGridDependsOnSchedule) {
			var c = this.lockedGrid.getView();
			c.suspendEvents();
			c.onUpdate(this.lockedGrid.store, a);
			c.resumeEvents()
		}
		var f = this.normalGrid.getView().getNode(b);
		var e = f.style.height !== d.style.height;
		f.style.height = d.style.height;
		this.normalHeights[b] = d.style.height;
		this.syncRowHeights(e)
	},
	onViewItemAdd : function(c, d, b) {
		var a = this.normalHeights;
		var e = this.normalGrid.getView();
		Ext.each(c, function(g, f) {
					var h = e.getNode(g);
					if (h) {
						a[h.viewIndex] = h.style.height
					}
				});
		this.syncRowHeights()
	},
	processColumns : function(b) {
		var a = this.callParent(arguments);
		var c = [];
		Ext.each(b, function(d) {
					if (d.position == "right") {
						d.processed = true;
						if (!Ext.isNumber(d.width)) {
							Ext.Error
									.raise('"Right" columns must have a fixed width')
						}
						c.push(d);
						Ext.Array.remove(a.locked.items, d);
						a.lockedWidth -= d.width
					}
				});
		if (this.orientation === "horizontal") {
			a.normal.items = [{
				xtype : this.lightWeight
						? "singletimeaxiscolumn"
						: "timeaxiscolumn",
				timeAxis : this.timeAxis,
				timeCellRenderer : this.timeCellRenderer,
				timeCellRendererScope : this.timeCellRendererScope,
				trackHeaderOver : this.trackHeaderOver
			}].concat(c)
		} else {
			a.locked.items = [Ext.apply({
						xtype : "verticaltimeaxis",
						width : 100,
						timeAxis : this.timeAxis
					}, this.timeAxisColumnCfg || {})];
			a.lockedWidth = a.locked.items[0].width
		}
		return a
	},
	prepareFullRowHeightSync : function() {
		var g = this, h = g.normalGrid.getView(), j = g.lockedGrid.getView();
		if (!h.rendered || !j.rendered) {
			return
		}
		var a = h.el, d = j.el, f = a.query(h.getItemSelector()), b = d.query(j
				.getItemSelector()), e = f.length, c = 0;
		g.lockedHeights = [];
		g.normalHeights = [];
		if (b.length !== e) {
			return
		}
		for (; c < e; c++) {
			g.normalHeights[c] = f[c].style.height
		}
	},
	onLockedViewRefresh : function() {
		this.prepareFullRowHeightSync();
		this.syncRowHeights()
	},
	onNormalViewRefresh : function() {
		var a = this.lockedGrid.getView();
		if (this.lockedGridDependsOnSchedule) {
			a.un("refresh", this.onLockedViewRefresh, this);
			this.lockedGrid.getView().refresh();
			a.on("refresh", this.onLockedViewRefresh, this)
		}
		this.prepareFullRowHeightSync();
		this.syncRowHeights()
	},
	syncRowHeights : function(b) {
		if (!this.lockedGrid.getView().rendered
				|| !this.normalGrid.getView().rendered) {
			return
		}
		var j = this, c = j.lockedHeights, k = j.normalHeights, a = [], h = c.length
				|| k.length, f = 0, l, d, e, g;
		if (c.length || k.length) {
			l = j.lockedGrid.getView();
			d = j.normalGrid.getView();
			if (!l.rendered || !d.rendered) {
				return
			}
			e = l.el.query(l.getItemSelector());
			if (!e.length) {
				return
			}
			for (; f < h; f++) {
				if (e[f] && k[f]) {
					e[f].style.height = k[f]
				}
			}
			j.lockedHeights = [];
			j.normalHeights = []
		}
		if (b !== false) {
			j.updateSpacer()
		}
	},
	getMenuItems : function() {
		return function() {
			return Ext.grid.header.Container.prototype.getMenuItems.call(this)
		}
	},
	applyColumnsState : Ext.emptyFn,
	updateSpacer : function() {
		var g = this.lockedGrid.getView();
		var e = this.normalGrid.getView();
		if (g.rendered && e.rendered && g.el.child("table")
				&& !this.getSchedulingView().__lightRefresh) {
			var f = this, c = g.el, d = e.el.dom, b = c.dom.id + "-spacer", h = (d.offsetHeight - d.clientHeight)
					+ "px";
			f.spacerEl = Ext.getDom(b);
			if (f.spacerEl) {
				f.spacerEl.style.height = h
			} else {
				var a;
				if (this.store.buffered) {
					a = f.normalGrid.verticalScroller.stretcher.item(0).dom.parentNode === c.dom
							? f.normalGrid.verticalScroller.stretcher.item(0)
							: f.normalGrid.verticalScroller.stretcher.item(1)
				} else {
					a = c
				}
				Ext.core.DomHelper.append(a, {
							id : b,
							cls : this.store.buffered
									? "sch-locked-buffered-spacer"
									: "",
							style : "height: " + h
						})
			}
		}
	},
	onLockedViewRender : function() {
		var d = this.normalGrid;
		if (!this.lockedStretcher) {
			var c = this.lockedGrid.getView().el;
			var a = this.lockedStretcher = c.createChild({
						cls : "x-stretcher",
						style : {
							position : "absolute",
							width : "1px",
							height : 0,
							top : 0,
							left : 0
						}
					}, c.dom.firstChild)
		}
		if (!d.rendered) {
			d.getView().on("render", this.onLockedViewRender, this);
			return
		}
		d.getView().el.un("scroll", this.onNormalViewScroll, this);
		d.getView().el.on("scroll", this.onNormalViewScroll, this);
		var b = d.verticalScroller;
		b.stretcher.addCls("x-stretcher");
		b.stretcher = new Ext.dom.CompositeElement([this.lockedStretcher,
				b.stretcher])
	},
	onNormalViewGroupExpand : function() {
		this.prepareFullRowHeightSync();
		this.syncRowHeights()
	}
});
Ext.define("Sch.model.Customizable", {
	extend : "Ext.data.Model",
	customizableFields : null,
	onClassExtended : function(b, d, a) {
		var c = a.onBeforeCreated;
		a.onBeforeCreated = function(f, k) {
			c.call(this, f, k);
			var j = f.prototype;
			if (!j.customizableFields) {
				return
			}
			j.customizableFields = (f.superclass.customizableFields || [])
					.concat(j.customizableFields);
			var g = j.customizableFields;
			var i = {};
			Ext.Array.each(g, function(l) {
						if (typeof l == "string") {
							l = {
								name : l
							}
						}
						i[l.name] = l
					});
			var e = j.fields;
			var h = [];
			e.each(function(l) {
						if (l.isCustomizableField) {
							h.push(l)
						}
					});
			e.removeAll(h);
			Ext.Object.each(i, function(l, o) {
				o.isCustomizableField = true;
				var p = o.name;
				var t = p === "Id" ? "idProperty" : p.charAt(0).toLowerCase()
						+ p.substr(1) + "Field";
				var q = j[t];
				var s = q || p;
				if (e.containsKey(s)) {
					e.getByKey(s).isCustomizableField = true;
					g.push(new Ext.data.Field(Ext.applyIf({
								name : p,
								isCustomizableField : true
							}, e.getByKey(s))))
				} else {
					e.add(new Ext.data.Field(Ext.applyIf({
								name : s,
								isCustomizableField : true
							}, o)))
				}
				var n = Ext.String.capitalize(p);
				if (n != "Id") {
					var r = "get" + n;
					var m = "set" + n;
					if (!j[r] || j[r].__getterFor__ && j[r].__getterFor__ != s) {
						j[r] = function() {
							return this.data[s]
						};
						j[r].__getterFor__ = s
					}
					if (!j[m] || j[m].__setterFor__ && j[m].__setterFor__ != s) {
						j[m] = function(u) {
							return this.set(s, u)
						};
						j[m].__setterFor__ = s
					}
				}
			})
		}
	},
	set : function(c, b) {
		if (arguments.length === 2) {
			this.previous = this.previous || {};
			var a = this.get(c);
			if (a !== b) {
				this.previous[c] = a
			}
		}
		this.callParent(arguments)
	},
	afterEdit : function() {
		this.callParent(arguments);
		delete this.previous
	},
	reject : function() {
		var b = this, a = b.modified, c;
		b.previous = b.previous || {};
		for (c in a) {
			if (a.hasOwnProperty(c)) {
				if (typeof a[c] != "function") {
					b.previous[c] = b.get(c)
				}
			}
		}
		b.callParent(arguments);
		delete b.previous
	}
});
Ext.define("Sch.patches.Model", {
	extend : "Sch.util.Patch",
	requires : "Sch.model.Customizable",
	reportURL : "",
	description : "",
	maxVersion : "4.1.0",
	applyFn : function() {
		try {
			Ext.define("Sch.foo", {
						extend : "Ext.data.Model",
						fields : ["a"]
					});
			Ext.define("Sch.foo.Sub", {
						extend : "Sch.foo",
						fields : ["a"]
					})
		} catch (a) {
			Ext.data.Types.AUTO.convert = function(b) {
				return b
			}
		}
	}
});
Ext.define("Sch.model.Range", {
	extend : "Sch.model.Customizable",
	requires : ["Sch.util.Date", "Sch.patches.DataOperation"],
	startDateField : "StartDate",
	endDateField : "EndDate",
	nameField : "Name",
	clsField : "Cls",
	customizableFields : [{
				name : "StartDate",
				type : "date",
				dateFormat : "c"
			}, {
				name : "EndDate",
				type : "date",
				dateFormat : "c"
			}, {
				name : "Cls",
				type : "string"
			}, {
				name : "Name",
				type : "string"
			}],
	setStartEndDate : function(b, a) {
		this.beginEdit();
		this.set(this.startDateField, b);
		this.set(this.endDateField, a);
		this.endEdit()
	},
	getDates : function() {
		var c = [], b = this.getEndDate();
		for (var a = Ext.Date.clearTime(this.getStartDate(), true); a < b; a = Sch.util.Date
				.add(a, Sch.util.Date.DAY, 1)) {
			c.push(a)
		}
		return c
	},
	forEachDate : function(b, a) {
		return Ext.each(this.getDates(), b, a)
	},
	isValid : function() {
		var b = this.callParent(arguments);
		if (b) {
			var c = this.getStartDate(), a = this.getEndDate();
			b = !c || !a || (a - c >= 0)
		}
		return b
	},
	shift : function(b, a) {
		this.setStartEndDate(Sch.util.Date.add(this.getStartDate(), b, a),
				Sch.util.Date.add(this.getEndDate(), b, a))
	}
});
Ext.define("Sch.model.Event", {
			extend : "Sch.model.Range",
			idProperty : "Id",
			customizableFields : [{
						name : "Id"
					}, {
						name : "ResourceId"
					}, {
						name : "Draggable",
						type : "boolean",
						persist : false,
						defaultValue : true
					}, {
						name : "Resizable",
						persist : false
					}],
			resourceIdField : "ResourceId",
			draggableField : "Draggable",
			resizableField : "Resizable",
			getResource : function(b) {
				if (this.stores.length > 0) {
					var a = this.stores[0].resourceStore;
					b = b || this.get(this.resourceIdField);
					if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
						return a.getNodeById(b)
								|| a.getRootNode().findChildBy(function(c) {
											return c.internalId === b
										})
					} else {
						return a.getById(b) || a.data.map[b]
					}
				}
				return null
			},
			setResource : function(a) {
				this.set(this.resourceIdField,
						(a instanceof Sch.model.Resource) ? a.getId()
								|| a.internalId : a)
			},
			assign : function(a) {
				this.setResource.apply(this, arguments)
			},
			unassign : function(a) {
			},
			isDraggable : function() {
				return this.getDraggable()
			},
			isResizable : function() {
				return this.getResizable()
			},
			isPersistable : function() {
				return !this.getResource().phantom
			},
			forEachResource : function(d, c) {
				var a = this.getResources();
				for (var b = 0; b < a.length; b++) {
					if (d.call(c || this, a[b]) === false) {
						return
					}
				}
			}
		});
Ext.define("Sch.model.Resource", {
			extend : "Sch.model.Customizable",
			idProperty : "Id",
			nameField : "Name",
			customizableFields : ["Id", {
						name : "Name",
						type : "string"
					}],
			getEventStore : function() {
				return this.stores[0] && this.stores[0].eventStore
						|| this.parentNode && this.parentNode.getEventStore()
			},
			getEvents : function(d) {
				var c = [], e, f = this.getId() || this.internalId;
				d = d || this.getEventStore();
				for (var b = 0, a = d.getCount(); b < a; b++) {
					e = d.getAt(b);
					if (e.data[e.resourceIdField] === f) {
						c.push(e)
					}
				}
				return c
			}
		});
Ext.define("Sch.data.EventStore", {
	extend : "Ext.data.Store",
	model : "Sch.model.Event",
	requires : ["Sch.util.Date"],
	setResourceStore : function(a) {
		if (this.resourceStore) {
			this.resourceStore.un({
						beforesync : this.onResourceStoreBeforeSync,
						write : this.onResourceStoreWrite,
						scope : this
					})
		}
		this.resourceStore = a;
		if (a) {
			a.on({
						beforesync : this.onResourceStoreBeforeSync,
						write : this.onResourceStoreWrite,
						scope : this
					})
		}
	},
	onResourceStoreBeforeSync : function(b, c) {
		var a = b.create;
		if (a) {
			for (var e, d = a.length - 1; d >= 0; d--) {
				e = a[d];
				e._phantomId = e.internalId
			}
		}
	},
	onResourceStoreWrite : function(c, b) {
		if (b.wasSuccessful()) {
			var d = this, a = b.getRecords();
			Ext.each(a, function(e) {
						if (e._phantomId && !e.phantom) {
							d.each(function(f) {
										if (f.getResourceId() === e._phantomId) {
											f.assign(e)
										}
									})
						}
					})
		}
	},
	isDateRangeAvailable : function(f, a, b, d) {
		var c = true, e = Sch.util.Date;
		this.each(function(g) {
					if (e
							.intersectSpans(f, a, g.getStartDate(), g
											.getEndDate())
							&& d === g.getResource() && (!b || b !== g)) {
						c = false;
						return false
					}
				});
		return c
	},
	getEventsInTimeSpan : function(d, b, a) {
		if (a !== false) {
			var c = Sch.util.Date;
			return this.queryBy(function(g) {
						var f = g.getStartDate(), e = g.getEndDate();
						return f && e && c.intersectSpans(f, e, d, b)
					})
		} else {
			return this.queryBy(function(g) {
						var f = g.getStartDate(), e = g.getEndDate();
						return f && e && (f - d >= 0) && (b - e >= 0)
					})
		}
	},
	getTotalTimeSpan : function() {
		var a = new Date(9999, 0, 1), b = new Date(0), c = Sch.util.Date;
		this.each(function(d) {
					if (d.getStartDate()) {
						a = c.min(d.getStartDate(), a)
					}
					if (d.getEndDate()) {
						b = c.max(d.getEndDate(), b)
					}
				});
		a = a < new Date(9999, 0, 1) ? a : null;
		b = b > new Date(0) ? b : null;
		return {
			start : a || null,
			end : b || a || null
		}
	},
	getEventsForResource : function(e) {
		var c = [], d, f = e.getId() || e.internalId;
		for (var b = 0, a = this.getCount(); b < a; b++) {
			d = this.getAt(b);
			if (d.data[d.resourceIdField] === f) {
				c.push(d)
			}
		}
		return c
	},
	getClosestSuccessor : function(g, e) {
		var c = Infinity, a = g.getEnd(), f, h;
		e = e || this.getRange();
		for (var d = 0, b = e.length; d < b; d++) {
			h = e[d].getStart() - a;
			if (h >= 0 && h < c) {
				f = e[d];
				c = h
			}
		}
		return f
	}
});
Ext.define("Sch.data.mixin.ResourceStore", {});
Ext.define("Sch.data.ResourceStore", {
			extend : "Ext.data.Store",
			model : "Sch.model.Resource",
			mixins : ["Sch.data.mixin.ResourceStore"]
		});
Ext.define("Sch.data.ResourceTreeStore", {
			extend : "Ext.data.TreeStore",
			model : "Sch.model.Resource",
			mixins : ["Sch.data.mixin.ResourceStore"]
		});
Ext.define("Sch.data.TimeAxis", {
	extend : "Ext.util.Observable",
	requires : ["Ext.data.JsonStore", "Sch.util.Date"],
	continuous : true,
	autoAdjust : true,
	constructor : function(a) {
		Ext.apply(this, a);
		this.originalContinuous = this.continuous;
		this.addEvents("beforereconfigure", "reconfigure");
		this.tickStore = new Ext.data.JsonStore({
					fields : ["start", "end"]
				});
		this.tickStore.on("datachanged", function() {
					this.fireEvent("reconfigure", this)
				}, this);
		this.callParent(arguments)
	},
	reconfigure : function(a) {
		Ext.apply(this, a);
		var c = this.tickStore, b = this.generateTicks(this.start, this.end,
				this.unit, this.increment || 1, this.mainUnit);
		if (this.fireEvent("beforereconfigure", this, this.start, this.end) !== false) {
			c.suspendEvents(true);
			c.loadData(b);
			if (c.getCount() === 0) {
				Ext.Error
						.raise("Invalid time axis configuration or filter, please check your input data.")
			}
			c.resumeEvents()
		}
	},
	setTimeSpan : function(b, a) {
		this.reconfigure({
					start : b,
					end : a
				})
	},
	filterBy : function(b, a) {
		this.continuous = false;
		a = a || this;
		var c = this.tickStore;
		c.clearFilter(true);
		c.suspendEvents(true);
		c.filter([{
					filterFn : function(e, d) {
						return b.call(a, e.data, d)
					}
				}]);
		if (c.getCount() === 0) {
			Ext.Error
					.raise("Invalid time axis filter - no columns passed through the filter. Please check your filter method.");
			this.clearFilter()
		}
		c.resumeEvents()
	},
	isContinuous : function() {
		return this.continuous && !this.tickStore.isFiltered()
	},
	clearFilter : function() {
		this.continuous = this.originalContinuous;
		this.tickStore.clearFilter()
	},
	generateTicks : function(a, d, g, i) {
		var h = [], f, b = Sch.util.Date, e = 0;
		g = g || this.unit;
		i = i || this.increment;
		if (this.autoAdjust) {
			a = this.floorDate(a || this.getStart(), false);
			d = this.ceilDate(d || b.add(a, this.mainUnit, this.defaultSpan),
					false)
		}
		while (a < d) {
			f = this.getNext(a, g, i);
			if (g === b.HOUR && i > 1 && h.length > 0 && e === 0) {
				var c = h[h.length - 1];
				e = ((c.start.getHours() + i) % 24) - c.end.getHours();
				if (e !== 0) {
					f = b.add(f, b.HOUR, e)
				}
			}
			h.push({
						start : a,
						end : f
					});
			a = f
		}
		return h
	},
	getTickFromDate : function(c) {
		if (this.getStart() > c || this.getEnd() < c) {
			return -1
		}
		var f = this.tickStore.getRange(), e, a, d, b;
		for (d = 0, b = f.length; d < b; d++) {
			a = f[d].data.end;
			if (c <= a) {
				e = f[d].data.start;
				return d + (c > e ? (c - e) / (a - e) : 0)
			}
		}
		return -1
	},
	getDateFromTick : function(d, f) {
		var g = this.tickStore.getCount();
		if (d === g) {
			return this.getEnd()
		}
		var a = Math.floor(d), e = d - a, c = this.getAt(a);
		var b = Sch.util.Date.add(c.start, Sch.util.Date.MILLI, e
						* (c.end - c.start));
		if (f) {
			b = this[f + "Date"](b)
		}
		return b
	},
	getAt : function(a) {
		return this.tickStore.getAt(a).data
	},
	getCount : function() {
		return this.tickStore.getCount()
	},
	getTicks : function() {
		var a = [];
		this.tickStore.each(function(b) {
					a.push(b.data)
				});
		return a
	},
	getStart : function() {
		return Ext.Date.clone(this.tickStore.first().data.start)
	},
	getEnd : function() {
		return Ext.Date.clone(this.tickStore.last().data.end)
	},
	roundDate : function(r) {
		var l = Ext.Date.clone(r), b = this.getStart(), s = this.resolutionIncrement;
		switch (this.resolutionUnit) {
			case Sch.util.Date.MILLI :
				var e = Sch.util.Date.getDurationInMilliseconds(b, l), d = Math
						.round(e / s)
						* s;
				l = Sch.util.Date.add(b, Sch.util.Date.MILLI, d);
				break;
			case Sch.util.Date.SECOND :
				var i = Sch.util.Date.getDurationInSeconds(b, l), q = Math
						.round(i / s)
						* s;
				l = Sch.util.Date.add(b, Sch.util.Date.MILLI, q * 1000);
				break;
			case Sch.util.Date.MINUTE :
				var n = Sch.util.Date.getDurationInMinutes(b, l), a = Math
						.round(n / s)
						* s;
				l = Sch.util.Date.add(b, Sch.util.Date.SECOND, a * 60);
				break;
			case Sch.util.Date.HOUR :
				var m = Sch.util.Date.getDurationInHours(this.getStart(), l), j = Math
						.round(m / s)
						* s;
				l = Sch.util.Date.add(b, Sch.util.Date.MINUTE, j * 60);
				break;
			case Sch.util.Date.DAY :
				var c = Sch.util.Date.getDurationInDays(b, l), f = Math.round(c
						/ s)
						* s;
				l = Sch.util.Date.add(b, Sch.util.Date.DAY, f);
				break;
			case Sch.util.Date.WEEK :
				Ext.Date.clearTime(l);
				var o = l.getDay() - this.weekStartDay, t;
				if (o < 0) {
					o = 7 + o
				}
				if (Math.round(o / 7) === 1) {
					t = 7 - o
				} else {
					t = -o
				}
				l = Sch.util.Date.add(l, Sch.util.Date.DAY, t);
				break;
			case Sch.util.Date.MONTH :
				var p = Sch.util.Date.getDurationInMonths(b, l)
						+ (l.getDate() / Ext.Date.getDaysInMonth(l)), h = Math
						.round(p / s)
						* s;
				l = Sch.util.Date.add(b, Sch.util.Date.MONTH, h);
				break;
			case Sch.util.Date.QUARTER :
				Ext.Date.clearTime(l);
				l.setDate(1);
				l = Sch.util.Date.add(l, Sch.util.Date.MONTH, 3
								- (l.getMonth() % 3));
				break;
			case Sch.util.Date.YEAR :
				var k = Sch.util.Date.getDurationInYears(b, l), g = Math
						.round(k / s)
						* s;
				l = Sch.util.Date.add(b, Sch.util.Date.YEAR, g);
				break
		}
		return l
	},
	floorDate : function(s, d) {
		d = d !== false;
		var m = Ext.Date.clone(s), b = d ? this.getStart() : null, t = this.resolutionIncrement;
		switch (d ? this.resolutionUnit : this.mainUnit) {
			case Sch.util.Date.MILLI :
				if (d) {
					var f = Sch.util.Date.getDurationInMilliseconds(b, m), e = Math
							.floor(f / t)
							* t;
					m = Sch.util.Date.add(b, Sch.util.Date.MILLI, e)
				}
				break;
			case Sch.util.Date.SECOND :
				if (d) {
					var j = Sch.util.Date.getDurationInSeconds(b, m), r = Math
							.floor(j / t)
							* t;
					m = Sch.util.Date.add(b, Sch.util.Date.MILLI, r * 1000)
				} else {
					m.setMilliseconds(0)
				}
				break;
			case Sch.util.Date.MINUTE :
				if (d) {
					var o = Sch.util.Date.getDurationInMinutes(b, m), a = Math
							.floor(o / t)
							* t;
					m = Sch.util.Date.add(b, Sch.util.Date.SECOND, a * 60)
				} else {
					m.setSeconds(0);
					m.setMilliseconds(0)
				}
				break;
			case Sch.util.Date.HOUR :
				if (d) {
					var n = Sch.util.Date
							.getDurationInHours(this.getStart(), m), k = Math
							.floor(n / t)
							* t;
					m = Sch.util.Date.add(b, Sch.util.Date.MINUTE, k * 60)
				} else {
					m.setMinutes(0);
					m.setSeconds(0);
					m.setMilliseconds(0)
				}
				break;
			case Sch.util.Date.DAY :
				if (d) {
					var c = Sch.util.Date.getDurationInDays(b, m), g = Math
							.floor(c / t)
							* t;
					m = Sch.util.Date.add(b, Sch.util.Date.DAY, g)
				} else {
					Ext.Date.clearTime(m)
				}
				break;
			case Sch.util.Date.WEEK :
				var p = m.getDay();
				Ext.Date.clearTime(m);
				if (p !== this.weekStartDay) {
					m = Sch.util.Date.add(m, Sch.util.Date.DAY,
							-(p > this.weekStartDay
									? (p - this.weekStartDay)
									: (7 - p - this.weekStartDay)))
				}
				break;
			case Sch.util.Date.MONTH :
				if (d) {
					var q = Sch.util.Date.getDurationInMonths(b, m), i = Math
							.floor(q / t)
							* t;
					m = Sch.util.Date.add(b, Sch.util.Date.MONTH, i)
				} else {
					Ext.Date.clearTime(m);
					m.setDate(1)
				}
				break;
			case Sch.util.Date.QUARTER :
				Ext.Date.clearTime(m);
				m.setDate(1);
				m = Sch.util.Date.add(m, Sch.util.Date.MONTH,
						-(m.getMonth() % 3));
				break;
			case Sch.util.Date.YEAR :
				if (d) {
					var l = Sch.util.Date.getDurationInYears(b, m), h = Math
							.floor(l / t)
							* t;
					m = Sch.util.Date.add(b, Sch.util.Date.YEAR, h)
				} else {
					m = new Date(s.getFullYear(), 0, 1)
				}
				break
		}
		return m
	},
	ceilDate : function(c, b) {
		var e = Ext.Date.clone(c);
		b = b !== false;
		var a = b ? this.resolutionIncrement : 1, d = b
				? this.resolutionUnit
				: this.mainUnit, f = false;
		switch (d) {
			case Sch.util.Date.DAY :
				if (e.getMinutes() > 0 || e.getSeconds() > 0
						|| e.getMilliseconds() > 0) {
					f = true
				}
				break;
			case Sch.util.Date.WEEK :
				Ext.Date.clearTime(e);
				if (e.getDay() !== this.weekStartDay) {
					f = true
				}
				break;
			case Sch.util.Date.MONTH :
				Ext.Date.clearTime(e);
				if (e.getDate() !== 1) {
					f = true
				}
				break;
			case Sch.util.Date.QUARTER :
				Ext.Date.clearTime(e);
				if (e.getMonth() % 3 !== 0) {
					f = true
				}
				break;
			case Sch.util.Date.YEAR :
				Ext.Date.clearTime(e);
				if (e.getMonth() !== 0 && e.getDate() !== 1) {
					f = true
				}
				break;
			default :
				break
		}
		if (f) {
			return this.getNext(e, d, a)
		} else {
			return e
		}
	},
	getNext : function(b, c, a) {
		return Sch.util.Date.getNext(b, c, a, this.weekStartDay)
	},
	getResolution : function() {
		return {
			unit : this.resolutionUnit,
			increment : this.resolutionIncrement
		}
	},
	setResolution : function(b, a) {
		this.resolutionUnit = b;
		this.resolutionIncrement = a || 1
	},
	shiftNext : function(a) {
		a = a || this.getShiftIncrement();
		var b = this.getShiftUnit();
		this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a),
				Sch.util.Date.add(this.getEnd(), b, a))
	},
	shiftPrevious : function(a) {
		a = -(a || this.getShiftIncrement());
		var b = this.getShiftUnit();
		this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a),
				Sch.util.Date.add(this.getEnd(), b, a))
	},
	getShiftUnit : function() {
		return this.shiftUnit || this.getMainUnit()
	},
	getShiftIncrement : function() {
		return this.shiftIncrement || 1
	},
	getUnit : function() {
		return this.unit
	},
	getIncrement : function() {
		return this.increment
	},
	timeSpanInAxis : function(b, a) {
		if (this.continuous) {
			return Sch.util.Date.intersectSpans(b, a, this.getStart(), this
							.getEnd())
		} else {
			return a > b && this.getTickFromDate(b) !== this.getTickFromDate(a)
		}
	},
	forEachInterval : function(b, a, c) {
		c = c || this;
		if (b === "top" || (b === "middle" && this.headerConfig.bottom)) {
			this.forEachAuxInterval(b, a, c)
		} else {
			this.tickStore.each(function(e, d) {
						return a.call(c, e.data.start, e.data.end, d)
					})
		}
	},
	forEachMainInterval : function(a, b) {
		this.forEachInterval("middle", a, b)
	},
	forEachAuxInterval : function(b, a, f) {
		f = f || this;
		var c = this.getEnd(), g = this.getStart(), e = 0, d;
		while (g < c) {
			d = Sch.util.Date.min(this.getNext(g, this.headerConfig[b].unit,
							this.headerConfig[b].increment || 1), c);
			a.call(f, g, d, e);
			g = d;
			e++
		}
	}
});
Ext.define("Sch.view.Horizontal", {
	props : {
		translateToScheduleCoordinate : function(a) {
			return a - this.el.getX() + this.el.getScroll().left
		},
		translateToPageCoordinate : function(a) {
			return a + this.el.getX() - this.el.getScroll().left
		},
		getDateFromXY : function(g, e) {
			var b, a = this.translateToScheduleCoordinate(g[0]), d = a
					/ this.getActualTimeColumnWidth(), c = this.timeAxis
					.getCount();
			if (d < 0 || d > c) {
				b = null
			} else {
				var f = d - this.resolveColumnIndex(a);
				if (f > 2 && d >= c) {
					return null
				}
				b = this.timeAxis.getDateFromTick(d, e)
			}
			return b
		},
		getXYFromDate : function(b, d) {
			var a, c = this.timeAxis.getTickFromDate(b);
			if (c >= 0) {
				a = this.getActualTimeColumnWidth() * c
			}
			if (d === false) {
				a = this.translateToPageCoordinate(a)
			}
			return [a, 0]
		},
		getEventBox : function(e, b) {
			var a = Math.floor(this.getXYFromDate(e)[0]), c = Math.floor(this
					.getXYFromDate(b)[0]), d = Math;
			if (this.managedEventSizing) {
				return {
					top : Math.max(0, (this.barMargin
									- (Ext.isIE && !Ext.isStrict)
									? 0
									: this.eventBorderWidth
											- this.cellBorderWidth)),
					left : d.min(a, c),
					width : d.max(1, d.abs(a - c)),
					height : this.rowHeight - (2 * this.barMargin)
							- this.eventBorderWidth
				}
			}
			return {
				left : d.min(a, c),
				width : d.max(1, d.abs(a - c))
			}
		},
		layoutEvents : function(a) {
			var c = Ext.Array.clone(a);
			c.sort(this.sortEvents);
			var b = this.layoutEventsInBands(0, c);
			return b
		},
		layoutEventsInBands : function(d, a) {
			var c = a[0], b = d === 0
					? this.barMargin
					: (d * this.rowHeight - ((d - 1) * this.barMargin));
			if (b >= this.cellBorderWidth) {
				b -= this.cellBorderWidth
			}
			while (c) {
				c.top = b;
				Ext.Array.remove(a, c);
				c = this.findClosestSuccessor(c, a)
			}
			d++;
			if (a.length > 0) {
				return this.layoutEventsInBands(d, a)
			} else {
				return d
			}
		},
		getScheduleRegion : function(d, f) {
			var h = d ? Ext.fly(this.getNodeByRecord(d)).getRegion() : this.el
					.down(".x-grid-table").getRegion(), e = this.timeAxis
					.getStart(), j = this.timeAxis.getEnd(), b = this
					.getDateConstraints(d, f)
					|| {
						start : e,
						end : j
					}, c = this.translateToPageCoordinate(this
					.getXYFromDate(b.start)[0]), i = this
					.translateToPageCoordinate(this.getXYFromDate(b.end)[0]), g = h.top
					+ this.barMargin, a = h.bottom - this.barMargin
					- this.eventBorderWidth;
			return new Ext.util.Region(g, Math.max(c, i), a, Math.min(c, i))
		},
		getResourceRegion : function(h, d, g) {
			var k = Ext.fly(this.getNodeByRecord(h)).getRegion(), i = this.timeAxis
					.getStart(), n = this.timeAxis.getEnd(), c = d
					? Sch.util.Date.max(i, d)
					: i, e = g ? Sch.util.Date.min(n, g) : n, f = this
					.getXYFromDate(c)[0], m = this.getXYFromDate(e)[0], l = this.el
					.getTop(), b = this.el.getScroll(), j = k.top + 1 - l
					+ b.top, a = k.bottom - 1 - l + b.top;
			return new Ext.util.Region(j, Math.max(f, m), a, Math.min(f, m))
		},
		collectRowData : function(g, p, o) {
			var c = this.eventStore.getEventsForResource(p);
			if (c.length === 0 || this.headerCt.getColumnCount() === 0) {
				g.rowHeight = this.rowHeight;
				return g
			}
			var a = Sch.util.Date, m = this.timeAxis, n = m.getStart(), r = m
					.getEnd(), k = [], j, f;
			for (j = 0, f = c.length; j < f; j++) {
				var b = c[j], d = b.getStartDate(), h = b.getEndDate();
				if (d && h && m.timeSpanInAxis(d, h)) {
					var q = this.generateTplData(b, n, r, p, o);
					k[k.length] = q
				}
			}
			var e = 1;
			if (this.dynamicRowHeight) {
				e = this.layoutEvents(k)
			}
			g.rowHeight = (e * this.rowHeight) - ((e - 1) * this.barMargin);
			g[this.getFirstTimeColumn().id] += "&#160;"
					+ this.eventTpl.apply(k);
			return g
		},
		resolveResource : function(a) {
			var b = this.findItemByChild(a);
			if (b) {
				return this.getRecord(b)
			}
			return null
		},
		getTimeSpanRegion : function(b, h, g) {
			var d = this.getXYFromDate(b)[0], f = this.getXYFromDate(h || b)[0], a, c;
			if (this.store.buffered) {
				var e;
				if (this.panel.verticalScroller.stretcher instanceof Ext.CompositeElement) {
					e = this.panel.verticalScroller.stretcher.first()
				} else {
					e = this.el.down(".x-stretcher")
				}
				if (e.dom.clientHeight) {
					c = e
				}
			}
			if (!c) {
				c = this.el.down(".x-grid-table")
			}
			if (g) {
				a = Math.max(c ? c.dom.clientHeight : 0,
						this.el.dom.clientHeight)
			} else {
				a = c ? c.dom.clientHeight : 0
			}
			return new Ext.util.Region(0, Math.max(d, f), a, Math.min(d, f))
		},
		getStartEndDatesFromRegion : function(c, b) {
			var a = this.getDateFromXY([c.left, 0], b), d = this.getDateFromXY(
					[c.right, 0], b);
			if (d && a) {
				return {
					start : Sch.util.Date.min(a, d),
					end : Sch.util.Date.max(a, d)
				}
			} else {
				return null
			}
		},
		onEventAdd : function(c, e) {
			var f = {};
			for (var b = 0, a = e.length; b < a; b++) {
				var d = e[b].getResource();
				if (d) {
					f[d.getId()] = d
				}
			}
			Ext.Object.each(f, function(h, g) {
						this.onUpdate(this.resourceStore, g)
					}, this)
		},
		onEventRemove : function(c, a) {
			var b = this.getElementFromEventRecord(a);
			if (b) {
				var d = this.resolveResource(b);
				b.fadeOut({
							callback : function() {
								if (Ext.tree.View
										&& this instanceof Ext.tree.View
										&& this.store.indexOf(d)) {
									this.onUpdate(this.store, d)
								} else {
									if (this.resourceStore.indexOf(d) >= 0) {
										this.onUpdate(this.resourceStore, d)
									}
								}
							},
							scope : this
						})
			}
		},
		onEventUpdate : function(b, c, a) {
			var e, d = c.previous;
			if (d && d[c.resourceIdField]) {
				e = c.getResource(d[c.resourceIdField]);
				if (e) {
					this.onUpdate(this.resourceStore, e)
				}
			}
			e = c.getResource();
			if (e) {
				this.onUpdate(this.resourceStore, e)
			}
		},
		getSingleTickInPixels : function() {
			return this.getActualTimeColumnWidth()
		},
		setColumnWidth : function(b, a) {
			if (this.getTimeAxisColumn()) {
				this.getTimeAxisColumn().setTimeColumnWidth(b);
				if (!a) {
					this.refreshKeepingScroll()
				}
			}
			this.fireEvent("columnwidthchange", this, b)
		},
		getVisibleDateRange : function() {
			if (!this.rendered) {
				return null
			}
			var b = this.getEl().getScroll(), a = this.panel.getStart(), g = this.panel
					.getEnd(), e = this.getWidth();
			var c = Ext.query(".x-grid-table", this.getEl().dom)[0];
			if (c.clientWidth < e) {
				return {
					startDate : a,
					endDate : g
				}
			}
			var f = this.getSingleTickInPixels();
			var d = this.timeAxis.getUnit();
			return {
				startDate : Sch.util.Date.add(a, d, b.left / f),
				endDate : Sch.util.Date.add(a, d, b.left / f + e / f)
			}
		}
	}
});
Ext.define("Sch.view.Vertical", {
	props : {
		translateToScheduleCoordinate : function(a) {
			return a - this.el.getY() + this.el.getScroll().top
		},
		translateToPageCoordinate : function(c) {
			var b = this.el, a = b.getScroll();
			return c + b.getY() - a.top
		},
		getDateFromXY : function(e, d) {
			var b, f = this.translateToScheduleCoordinate(e[1]);
			var c = f / this.rowHeight, a = this.timeAxis.getCount();
			if (c < 0 || c > a) {
				b = null
			} else {
				b = this.timeAxis.getDateFromTick(c, d)
			}
			return b
		},
		getXYFromDate : function(a, c) {
			var d = -1, b = this.timeAxis.getTickFromDate(a);
			if (b >= 0) {
				d = this.rowHeight * b
			}
			if (c === false) {
				d = this.translateToPageCoordinate(d)
			}
			return [0, d]
		},
		getEventBox : function(e, b) {
			var a = Math.floor(this.getXYFromDate(e)[1]), c = Math.floor(this
					.getXYFromDate(b)[1]), d = Math;
			if (this.managedEventSizing) {
				return {
					left : this.barMargin,
					width : this.panel.resourceColumnWidth
							- (2 * this.barMargin) - this.eventBorderWidth,
					top : d.max(0, d.min(a, c) - this.eventBorderWidth),
					height : d.max(1, d.abs(a - c))
				}
			}
			return {
				top : d.min(a, c),
				height : d.max(1, d.abs(a - c))
			}
		},
		getScheduleRegion : function(d, f) {
			var g = d ? Ext.fly(this.getCellByPosition({
						column : this.resourceStore.indexOf(d),
						row : 0
					})).getRegion() : this.el.down(".x-grid-table").getRegion(), e = this.timeAxis
					.getStart(), j = this.timeAxis.getEnd(), a = this
					.getDateConstraints(d, f)
					|| {
						start : e,
						end : j
					}, c = this.translateToPageCoordinate(this
					.getXYFromDate(Sch.util.Date.min(e, a.start))[1]), i = this
					.translateToPageCoordinate(this.getXYFromDate(Sch.util.Date
							.max(j, a.end))[1]), b = g.left + this.barMargin, h = (d
					? (g.left + this.panel.resourceColumnWidth)
					: g.right)
					- this.barMargin;
			return new Ext.util.Region(Math.min(c, i), h, Math.max(c, i), b)
		},
		getResourceRegion : function(h, b, g) {
			var d = this.resourceStore.indexOf(h)
					* this.panel.resourceColumnWidth, i = this.timeAxis
					.getStart(), l = this.timeAxis.getEnd(), a = b
					? Sch.util.Date.max(i, b)
					: i, e = g ? Sch.util.Date.min(l, g) : l, f = this
					.getXYFromDate(a)[1], k = this.getXYFromDate(e)[1], c = d
					+ this.barMargin + this.cellBorderWidth, j = d
					+ this.panel.resourceColumnWidth - this.barMargin
					- this.cellBorderWidth;
			return new Ext.util.Region(Math.min(f, k), j, Math.max(f, k), c)
		},
		layoutEvents : function(r) {
			if (r.length === 0) {
				return
			}
			r.sort(this.sortEvents);
			var b, d, a = Sch.util.Date, q = 1, o, n, g = this.panel.resourceColumnWidth
					- (2 * this.barMargin), k, e;
			for (var f = 0, c = r.length; f < c; f++) {
				k = r[f];
				b = k.start;
				d = k.end;
				n = this.findStartSlot(r, k);
				var m = this.getCluster(r, f);
				if (m.length > 1) {
					k.left = n.start;
					k.width = n.end - n.start;
					e = 1;
					while (e < (m.length - 1) && m[e + 1].start - k.start === 0) {
						e++
					}
					var p = this.findStartSlot(r, m[e]);
					if (p && p.start < 0.8) {
						m = m.slice(0, e)
					}
				}
				var h = m.length, s = (n.end - n.start) / h;
				for (e = 0; e < h; e++) {
					m[e].width = s;
					m[e].left = n.start + (e * s)
				}
				f += h - 1
			}
			for (f = 0, c = r.length; f < c; f++) {
				r[f].width = r[f].width * g;
				r[f].left = this.barMargin + (r[f].left * g)
			}
		},
		findStartSlot : function(o, c) {
			var b = Sch.util.Date, d = c.start, g = c.end, e = 0, f, n = 0, h, m, a = Ext.Array
					.indexOf(o, c), l = this.getPriorOverlappingEvents(o, c), k;
			if (l.length === 0) {
				return {
					start : 0,
					end : 1
				}
			}
			for (k = 0; k < l.length; k++) {
				if (k === 0 && l[0].left > 0) {
					return {
						start : 0,
						end : l[0].left
					}
				} else {
					if (l[k].left + l[k].width < (k < l.length - 1
							? l[k + 1].left
							: 1)) {
						return {
							start : l[k].left + l[k].width,
							end : k < l.length - 1 ? l[k + 1].left : 1
						}
					}
				}
			}
			return false
		},
		getPriorOverlappingEvents : function(e, f) {
			var g = Sch.util.Date, h = f.start, b = f.end, c = [];
			for (var d = 0, a = Ext.Array.indexOf(e, f); d < a; d++) {
				if (g.intersectSpans(h, b, e[d].start, e[d].end)) {
					c.push(e[d])
				}
			}
			c.sort(function(j, i) {
						return j.left < i.left ? -1 : 1
					});
			return c
		},
		getCluster : function(e, g) {
			if (g >= e.length - 1) {
				return [e[g]]
			}
			var c = [e[g]], b = e.length, h = e[g].start, a = e[g].end, f = Sch.util.Date, d = g
					+ 1;
			while (d < b && f.intersectSpans(h, a, e[d].start, e[d].end)) {
				c.push(e[d]);
				h = f.max(h, e[d].start);
				a = f.min(e[d].end, a);
				d++
			}
			return c
		},
		collectRowData : function(j, b, m) {
			if (m === 0) {
				var n = Sch.util.Date, k = this.timeAxis, f = k.getStart(), e = k
						.getEnd(), q = [], o = this.headerCt.getColumnCount(), h, a, g, t, u, r;
				for (var p = 0; p < o; p++) {
					t = this.getHeaderAtIndex(p);
					a = [];
					h = this.resourceStore.getAt(p);
					g = this.eventStore.getEventsForResource(h);
					for (u = 0, r = g.length; u < r; u++) {
						var s = g[u], d = s.getStartDate(), c = s.getEndDate();
						if (d && c && k.timeSpanInAxis(d, c)) {
							a.push(this.generateTplData(s, f, e, h, p))
						}
					}
					this.layoutEvents(a);
					j[t.id] += "&#160;" + this.eventTpl.apply(a)
				}
			}
			j.rowHeight = this.rowHeight;
			return j
		},
		resolveResource : function(a) {
			var b = this.getHeaderByCell(a);
			if (b) {
				return this.resourceStore
						.getAt(this.headerCt.getHeaderIndex(b))
			}
			return null
		},
		onEventUpdate : function(b, c) {
			this.renderSingle(c);
			var d = c.previous;
			var a = c.getResource();
			if (d && d[c.resourceIdField]) {
				var e = c.getResource(d[c.resourceIdField]);
				if (e) {
					this.relayoutRenderedEvents(e)
				}
			}
			if (a) {
				this.relayoutRenderedEvents(a)
			}
		},
		onEventAdd : function(a, b) {
			if (b.length === 1) {
				this.renderSingle(b[0]);
				this.relayoutRenderedEvents(b[0].getResource())
			} else {
				this.onUpdate(this.store, this.store.first())
			}
		},
		onEventRemove : function(a, b) {
			if (b.length === 1) {
				this
						.relayoutRenderedEvents(this
								.getResourceByEventRecord(b[0]))
			} else {
				this.onUpdate(this.store, this.store.first())
			}
		},
		relayoutRenderedEvents : function(g) {
			var f = [], c, a, e, d, b = this.eventStore.getEventsForResource(g);
			if (b.length > 0) {
				for (c = 0, a = b.length; c < a; c++) {
					e = b[c];
					d = this.getEventNodeByRecord(e);
					if (d) {
						f.push({
									start : e.getStartDate(),
									end : e.getEndDate(),
									id : d.id
								})
					}
				}
				this.layoutEvents(f);
				for (c = 0; c < f.length; c++) {
					e = f[c];
					Ext.fly(e.id).setStyle({
								left : e.left + "px",
								width : e.width + "px"
							})
				}
			}
		},
		renderSingle : function(c) {
			var f = c.getResource();
			var b = this.getEventNodeByRecord(c);
			var e = this.resourceStore.indexOf(f);
			if (b) {
				Ext.fly(b).remove()
			}
			if (e < 0) {
				return
			}
			var a = this.getCell(this.store.getAt(0),
					this.headerCt.getHeaderAtIndex(e)).first();
			var d = this.generateTplData(c, this.timeAxis.getStart(),
					this.timeAxis.getEnd(), f, e);
			this.eventTpl.append(a, [d])
		},
		getTimeSpanRegion : function(b, f) {
			var a = this.getXYFromDate(b)[1], e = this.getXYFromDate(f || b)[1], c = this.el
					.down(".x-grid-table"), d = (c || this.el).dom.clientWidth;
			return new Ext.util.Region(Math.min(a, e), d, Math.max(a, e), 0)
		},
		getStartEndDatesFromRegion : function(c, b) {
			var a = this.getDateFromXY([0, c.top], b), d = this.getDateFromXY([
							0, c.bottom], b);
			if (top && d) {
				return {
					start : Sch.util.Date.min(a, d),
					end : Sch.util.Date.max(a, d)
				}
			} else {
				return null
			}
		},
		getSingleTickInPixels : function() {
			return this.rowHeight
		},
		timeColumnRenderer : function(l, d, h, n, c, b) {
			var a = "";
			if (this.timeCellRenderer) {
				var i = this.timeAxis, g = i.getAt(n), f = g.start, j = g.end, k = this.resourceStore, e = k
						.getAt(c);
				a = this.timeCellRenderer.call(this.timeCellRendererScope
								|| this, d, e, n, c, k, f, j)
			}
			if (Ext.isIE) {
				d.style += ";z-index:" + (this.store.getCount() - n)
			}
			if (c % 2 === 1) {
				d.tdCls += " " + this.altColCls
			}
			return a
		},
		setColumnWidth : function(b, a) {
			if (this.panel) {
				this.panel.resourceColumnWidth = b
			}
			var c = this.headerCt;
			c.suspendLayout = true;
			c.items.each(function(d) {
						if (d.rendered) {
							d.minWidth = undefined;
							d.setWidth(b)
						}
					});
			c.suspendLayout = false;
			c.doLayout();
			if (!a) {
				this.refresh()
			}
			this.fireEvent("columnwidthchange", this, b)
		},
		getVisibleDateRange : function() {
			if (!this.rendered) {
				return null
			}
			var b = this.getEl().getScroll(), a = this.panel.getStart(), g = this.panel
					.getEnd(), e = this.getHeight();
			var c = Ext.query(".x-grid-table", this.getEl().dom)[0];
			if (c.clientWidth < e) {
				return {
					startDate : a,
					endDate : g
				}
			}
			var f = this.getSingleTickInPixels();
			var d = this.timeAxis.getUnit();
			return {
				startDate : Sch.util.Date.add(a, d, b.top / f),
				endDate : Sch.util.Date.add(a, d, b.top / f + e / f)
			}
		}
	}
});
Ext.define("Sch.selection.EventModel", {
	extend : "Ext.selection.Model",
	alias : "selection.eventmodel",
	requires : ["Ext.util.KeyNav"],
	deselectOnContainerClick : true,
	constructor : function(a) {
		this.addEvents("beforedeselect", "beforeselect", "deselect", "select");
		this.callParent(arguments)
	},
	bindStore : function(a, b) {
		this.callParent([this.view.getEventStore(), b])
	},
	bindComponent : function(a) {
		var b = this, c = {
			refresh : b.refresh,
			scope : b
		};
		b.view = a;
		b.bindStore(a.getEventStore());
		a.on({
					eventclick : b.onEventClick,
					itemclick : b.onItemClick,
					scope : this
				});
		a.on(c)
	},
	onEventClick : function(b, a, c) {
		this.selectWithEvent(a, c)
	},
	onItemClick : function() {
		if (this.deselectOnContainerClick) {
			this.deselectAll()
		}
	},
	onSelectChange : function(d, b, j, a) {
		var f = this, g = f.view, h = f.store, e = b ? "select" : "deselect", c = 0;
		if ((j || f.fireEvent("before" + e, f, d)) !== false && a() !== false) {
			if (b) {
				g.onEventSelect(d, j)
			} else {
				g.onEventDeselect(d, j)
			}
			if (!j) {
				f.fireEvent(e, f, d)
			}
		}
	},
	selectRange : function() {
	},
	selectNode : function(c, d, a) {
		var b = this.view.resolveEventRecord(c);
		if (b) {
			this.select(b, d, a)
		}
	},
	deselectNode : function(c, d, a) {
		var b = this.view.resolveEventRecord(c);
		if (b) {
			this.deselect(b, a)
		}
	}
});
Ext.define("Sch.plugin.Printable", {
	extend : "Ext.AbstractPlugin",
	lockableScope : "top",
	docType : "<!DOCTYPE HTML>",
	printableEventTpl : null,
	beforePrint : Ext.emptyFn,
	afterPrint : Ext.emptyFn,
	autoPrintAndClose : true,
	fakeBackgroundColor : true,
	scheduler : null,
	constructor : function(a) {
		Ext.apply(this, a)
	},
	init : function(a) {
		this.scheduler = a;
		a.print = Ext.Function.bind(this.print, this)
	},
	mainTpl : '{docType}<html class="x-border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{title}</title>{styles}</head><body class="sch-print-body {bodyClasses}"><div class="sch-print-ct {componentClasses}" style="width:{totalWidth}px"><div class="sch-print-headerbg" style="border-left-width:{totalWidth}px;height:{headerHeight}px;"></div><div class="sch-print-header-wrap"><div style="left:-{lockedScroll}px;margin-right:-{lockedScroll}px;width:{[values.lockedWidth + values.lockedScroll]}px" class="sch-print-lockedheader x-grid-header-ct x-grid-header-ct-default x-docked x-docked-top x-grid-header-ct-docked-top x-grid-header-ct-default-docked-top x-box-layout-ct x-docked-noborder-top x-docked-noborder-right x-docked-noborder-left">{lockedHeader}</div><div style="left:{lockedWidth}px;width:{normalWidth}px;" class="sch-print-normalheader x-grid-header-ct x-grid-header-ct-default x-docked x-docked-top x-grid-header-ct-docked-top x-grid-header-ct-default-docked-top x-box-layout-ct x-docked-noborder-top x-docked-noborder-right x-docked-noborder-left"><div style="margin-left:-{normalScroll}px">{normalHeader}</div></div></div><div id="lockedRowsCt" style="left:-{lockedScroll}px;margin-right:-{lockedScroll}px;width:{[values.lockedWidth + values.lockedScroll]}px;top:{headerHeight}px;" class="sch-print-locked-rows-ct {innerLockedClasses} x-grid-inner-locked">{lockedRows}</div><div id="normalRowsCt" style="left:{lockedWidth}px;top:{headerHeight}px;width:{normalWidth}px" class="sch-print-normal-rows-ct {innerNormalClasses}"><div style="position:relative;overflow:visible;margin-left:-{normalScroll}px">{normalRows}</div></div></div><script type="text/javascript">{setupScript}<\/script></body></html>',
	getGridContent : function(l) {
		var k = l.normalGrid, c = l.lockedGrid, m = c.getView(), d = k
				.getView(), f, b, j, e, i;
		this.beforePrint(l);
		var a = m.store.getRange();
		b = m.tpl.apply(m.collectData(a, 0));
		j = d.tpl.apply(d.collectData(a, 0));
		e = m.el.getScroll().left;
		i = d.el.getScroll().left;
		if (l.columnLinesFeature) {
			var h = l.columnLinesFeature;
			var g = h.containerEl;
			h.containerEl = Ext.get(document.createElement("div"));
			h.renderElementsInternal();
			j = h.containerEl.dom.innerHTML + j;
			h.containerEl = g
		}
		this.afterPrint(l);
		return {
			normalHeader : k.headerCt.el.dom.innerHTML,
			lockedHeader : c.headerCt.el.dom.innerHTML,
			lockedRows : b,
			normalRows : j,
			lockedScroll : e,
			normalScroll : i,
			lockedWidth : c.getWidth(),
			normalWidth : k.getWidth(),
			headerHeight : k.headerCt.getHeight(),
			innerLockedClasses : c.view.el.dom.className,
			innerNormalClasses : k.view.el.dom.className
					+ (this.fakeBackgroundColor
							? " sch-print-fake-background"
							: ""),
			width : l.getWidth()
		}
	},
	getStylesheets : function() {
		return Ext.getDoc().select('link[rel="stylesheet"]')
	},
	print : function() {
		var g = this.scheduler;
		if (!(this.mainTpl instanceof Ext.Template)) {
			var a = 22;
			this.mainTpl = Ext.create("Ext.XTemplate", this.mainTpl, {
						compiled : true,
						disableFormats : true
					})
		}
		var h = g.getView(), i = this.getStylesheets(), e = Ext
				.get(Ext.core.DomHelper.createDom({
							tag : "div"
						})), b;
		i.each(function(j) {
					e.appendChild(j.dom.cloneNode(true))
				});
		b = e.dom.innerHTML + "";
		var f = this.getGridContent(g), c = this.mainTpl.apply(Ext.apply({
					waitText : this.waitText,
					docType : this.docType,
					htmlClasses : "",
					bodyClasses : Ext.getBody().dom.className,
					componentClasses : g.el.dom.className,
					title : (g.title || ""),
					styles : b,
					totalWidth : g.getWidth(),
					setupScript : "(" + this.setupScript.toString() + ")();"
				}, f));
		var d = window.open("", "printgrid");
		d.document.write(c);
		d.document.close();
		if (this.autoPrintAndClose) {
			d.print();
			if (!Ext.isChrome) {
				d.close()
			}
		}
	},
	setupScript : function() {
		var f = document.getElementById("lockedRowsCt"), d = document
				.getElementById("normalRowsCt"), b = f
				.getElementsByTagName("tr"), a = d.getElementsByTagName("tr"), e = a.length, c = 0;
		for (; c < e; c++) {
			b[c].style.height = a[c].style.height
		}
	}
});
Ext.define("Sch.plugin.Lines", {
	extend : "Sch.feature.AbstractTimeSpan",
	cls : "sch-timeline",
	showTip : true,
	init : function(b) {
		this.callParent(arguments);
		var a = this.schedulerView;
		if (!this.template) {
			this.template = new Ext.XTemplate(
					'<tpl for=".">',
					'<div id="'
							+ this.uniqueCls
							+ '-{id}"'
							+ (this.showTip
									? 'title="{[this.getTipText(values)]}" '
									: "")
							+ 'class="'
							+ this.cls
							+ " "
							+ this.uniqueCls
							+ ' {Cls}" style="left:{left}px;top:{top}px;height:{height}px;width:{width}px"></div>',
					"</tpl>", {
						getTipText : function(c) {
							return a.getFormattedDate(c.Date) + " "
									+ (c.Text || "")
						}
					})
		}
	},
	getElementData : function(k, n, d) {
		var p = this.store, j = this.schedulerView, f = d || p.getRange(), h = [], o = this.containerEl.lastBox
				? this.containerEl.lastBox.height
				: this.containerEl.getHeight(), a, c, m, b;
		for (var g = 0, e = p.getCount(); g < e; g++) {
			a = f[g];
			c = a.get("Date");
			if (c && Ext.Date.between(c, k, n)) {
				m = j.getTimeSpanRegion(c, null, this.expandToFitView);
				h[h.length] = Ext.apply({
							id : a.internalId,
							left : m.left,
							top : m.top,
							width : Math.max(1, m.right - m.left),
							height : m.bottom - m.top
						}, a.data)
			}
		}
		return h
	}
});
Ext.define("Sch.plugin.CurrentTimeLine", {
			extend : "Sch.plugin.Lines",
			tooltipText : "Current time",
			updateInterval : 60000,
			autoUpdate : true,
			init : function(c) {
				var b = Ext.create("Ext.data.JsonStore", {
							model : Ext.define("TimeLineEvent", {
										extend : "Ext.data.Model",
										fields : ["Date", "Cls", "Text"]
									}),
							data : [{
										Date : new Date(),
										Cls : "sch-todayLine",
										Text : this.tooltipText
									}]
						});
				var a = b.first();
				if (this.autoUpdate) {
					this.runner = Ext.create("Ext.util.TaskRunner");
					this.runner.start({
								run : function() {
									a.set("Date", new Date())
								},
								interval : this.updateInterval
							})
				}
				c.on("destroy", this.onHostDestroy, this);
				this.store = b;
				this.callParent(arguments)
			},
			onHostDestroy : function() {
				if (this.runner) {
					this.runner.stopAll()
				}
				if (this.store.autoDestroy) {
					this.store.destroy()
				}
			}
		});
Ext.define("Sch.plugin.DragSelector", {
			extend : "Sch.util.DragTracker",
			mixins : ["Ext.AbstractPlugin"],
			lockableScope : "normal",
			constructor : function(a) {
				a = a || {};
				Ext.applyIf(a, {
							onBeforeStart : this.onBeforeStart,
							onStart : this.onStart,
							onDrag : this.onDrag,
							onEnd : this.onEnd
						});
				this.callParent(arguments)
			},
			init : function(a) {
				a.on({
							afterrender : this.onSchedulerRender,
							destroy : this.onSchedulerDestroy,
							scope : this
						});
				this.scheduler = a
			},
			onBeforeStart : function(a) {
				return a.ctrlKey
			},
			onStart : function(b) {
				var c = this.schedulerView;
				if (!this.proxy) {
					this.proxy = c.el.createChild({
								cls : "sch-drag-selector x-view-selector"
							})
				} else {
					this.proxy.show()
				}
				this.bodyRegion = c.getScheduleRegion();
				var a = [];
				c.getEventNodes().each(function(d) {
							a[a.length] = {
								region : d.getRegion(),
								node : d.dom
							}
						}, this);
				this.eventData = a;
				this.sm.deselectAll()
			},
			onDrag : function(h) {
				var j = this.sm, f = this.eventData, b = this.getRegion()
						.constrainTo(this.bodyRegion), c, d, a, g;
				this.proxy.setRegion(b);
				for (c = 0, a = f.length; c < a; c++) {
					d = f[c];
					g = b.intersect(d.region);
					if (g && !d.selected) {
						d.selected = true;
						j.selectNode(d.node, true)
					} else {
						if (!g && d.selected) {
							d.selected = false;
							j.deselectNode(d.node)
						}
					}
				}
			},
			onEnd : function(a) {
				if (this.proxy) {
					this.proxy.setDisplayed(false)
				}
			},
			onSchedulerRender : function(a) {
				this.sm = a.getEventSelectionModel();
				this.schedulerView = a.getSchedulingView();
				this.initEl(a.el)
			},
			onSchedulerDestroy : function() {
				Ext.destroy(this.proxy);
				this.destroy()
			}
		});
Ext.define("Sch.plugin.EventEditor", {
	extend : "Ext.form.FormPanel",
	mixins : ["Ext.AbstractPlugin"],
	lockableScope : "normal",
	requires : ["Sch.util.Date"],
	saveText : "Save",
	deleteText : "Delete",
	cancelText : "Cancel",
	hideOnBlur : true,
	startDateField : null,
	startTimeField : null,
	durationField : null,
	timeConfig : null,
	dateConfig : null,
	durationConfig : null,
	durationUnit : null,
	durationText : null,
	triggerEvent : "eventdblclick",
	fieldsPanelConfig : null,
	dateFormat : "Y-m-d",
	timeFormat : "H:i",
	cls : "sch-eventeditor",
	border : false,
	dynamicForm : true,
	eventRecord : null,
	hidden : true,
	collapsed : true,
	currentForm : null,
	scheduler : null,
	schedulerView : null,
	preventHeader : true,
	floating : true,
	hideMode : "offsets",
	layout : {
		type : "vbox",
		align : "stretch"
	},
	constrain : false,
	constructor : function(a) {
		a = a || {};
		this.durationUnit = a.durationUnit || Sch.util.Date.HOUR;
		this.addEvents("beforeeventdelete", "beforeeventsave");
		this.callParent(arguments)
	},
	initComponent : function() {
		if (!this.fieldsPanelConfig) {
			throw "Must define a fieldsPanelConfig property"
		}
		Ext.apply(this, {
					fbar : this.buttons || this.buildButtons(),
					items : [{
								layout : "hbox",
								height : 35,
								border : false,
								cls : "sch-eventeditor-timefields",
								items : this.buildDurationFields()
							}, Ext.applyIf(this.fieldsPanelConfig, {
										flex : 1,
										activeItem : 0
									})]
				});
		this.callParent(arguments)
	},
	init : function(a) {
		this.scheduler = a;
		this.schedulerView = a.getSchedulingView();
		this.eventStore = a.getEventStore();
		this.schedulerView.on({
					afterrender : this.onSchedulerRender,
					destroy : this.onSchedulerDestroy,
					dragcreateend : this.onDragCreateEnd,
					scope : this
				});
		if (this.triggerEvent) {
			this.schedulerView.on(this.triggerEvent, this.onActivateEditor,
					this)
		}
		this.schedulerView.registerEventEditor(this)
	},
	onSchedulerRender : function() {
		this.render(Ext.getBody());
		if (this.hideOnBlur) {
			this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this)
		}
	},
	show : function(b, e) {
		//Added By James Zhang
		if(App.Scheduler.scheduler.isReadOnly()||(b.getStartDate()-Ext.Date.add(new Date(),Ext.Date.DAY,-3))<=0){
			return;
		}
		
		if (this.deleteButton) {
			this.deleteButton.setVisible(this.eventStore.indexOf(b) >= 0)
		}
		this.eventRecord = b;
		
		
		this.durationField.setValue(Sch.util.Date.getDurationInUnit(b.getStartDate(), b.getEndDate(), this.durationUnit));

		
		//Modified By James Zhang
//		alert(b.getStartDate()+"/"+b.getEndDate()+"/"+b.data["Duration"]);
				
//		if(b.data["Duration"]){
//			this.durationField.setValue(b.data["Duration"]);		
//		}else {
//			this.durationField.setValue(Sch.util.Date.getDurationInUnit(b.getStartDate(), b.getEndDate(), this.durationUnit));			
//		}	
		
		var a = b.getStartDate();
		this.startDateField.setValue(a);
		this.startTimeField.setValue(a);
		this.callParent();
		e = e || this.schedulerView.getElementFromEventRecord(b);
		this.alignTo(e, this.scheduler.orientation == "horizontal"
						? "bl"
						: "tl-tr", this.getConstrainOffsets(e));
		this.expand(!this.constrain);
		if (this.constrain) {
			this.doConstrain(Ext.util.Region.getRegion(Ext.getBody()))
		}
		var f, d = b.get("EventType");
		if (d && this.dynamicForm) {
			var g = this.items.getAt(1), c = g.query("> component[EventType="
					+ d + "]");
			if (!c.length) {
				throw "Can't find form for EventType=" + d
			}
			if (!g.getLayout().setActiveItem) {
				throw "Can't switch active component in the 'fieldsPanel'"
			}
			f = c[0];
			if (!(f instanceof Ext.form.Panel)) {
				throw "Each child component of 'fieldsPanel' should be a 'form'"
			}
			g.getLayout().setActiveItem(f)
		} else {
			f = this
		}
		this.currentForm = f;		
		f.getForm().loadRecord(b)

		//Added By James Zhang
		var color = b.data["Cls"].substr(10);
		var fixed = b.data["Fixed"];
		f.getForm().findField("Color").setValue(color);
		if(fixed=="TRUE"){
			f.getForm().findField("Fixed").setValue("on");
		}else {
			f.getForm().findField("Fixed").setValue("");
		}
	},
	getConstrainOffsets : function(a) {
		return [0, 0]
	},
	onSaveClick : function() {
		var d = this, g = d.eventRecord, a = this.currentForm.getForm();
		if (a.isValid() && this.fireEvent("beforeeventsave", this, g) !== false) {
			var c = d.startDateField.getValue(), h, b = d.startTimeField
					.getValue(), f = d.durationField.getValue();
			if (c && f >= 0) {
				if (b) {
					Sch.util.Date.copyTimeValues(c, b)
				}
				//Modified By James Zhang  (set precision to minute)
//				h = Sch.util.Date.add(c, this.durationUnit, f)
				h = Sch.util.Date.add(c, Sch.util.Date.MINUTE, Math.round(f*60))
			} else {
				return
			}
			var e = g.getResource() || this.resourceRecord;
			if (!this.schedulerView.allowOverlap
					&& !this.schedulerView.isDateRangeAvailable(c, h, g, e)) {
				return
			}
			g.beginEdit();
			var i = g.endEdit;
			g.endEdit = Ext.emptyFn;
			a.updateRecord(g);
			g.endEdit = i;
			g.setStartDate(c);
			g.setEndDate(h);
			
			//Added By James Zhang, set duration
			var cls = "sch-event-"+a.getValues().Color;
			var fixed = a.getValues().Fixed;
			g.data.Duration = f;
			g.data.Cls = cls;
			if(fixed=="on"){
				g.data.Fixed = "TRUE";
			}else {
				g.data.Fixed = "FALSE";
			}
			g.setCls(cls);

			
			g.endEdit();
			if (this.eventStore.indexOf(this.eventRecord) < 0) {
				if (this.schedulerView.fireEvent("beforeeventadd",
						this.schedulerView, g) !== false) {
					this.eventStore.add(g)
				}
			}
			d.collapse(null, true)
			
			//Added by James Zhang
			//realign event schedule
			App.Scheduler.realignEvent(g,this.eventStore);
		}
	},
	onDeleteClick : function() {
		if (this.fireEvent("beforeeventdelete", this, this.eventRecord) !== false) {
			this.eventStore.remove(this.eventRecord)
		}
		this.collapse(null, true)
	},
	onCancelClick : function() {
		this.collapse(null, true)
	},
	buildButtons : function() {
		this.saveButton = new Ext.Button({
					text : this.saveText,
					scope : this,
					handler : this.onSaveClick
				});
		this.deleteButton = new Ext.Button({
					text : this.deleteText,
					scope : this,
					handler : this.onDeleteClick
				});
		this.cancelButton = new Ext.Button({
					text : this.cancelText,
					scope : this,
					handler : this.onCancelClick
				});
		return [this.saveButton, this.deleteButton, this.cancelButton]
	},
	buildDurationFields : function() {
		this.startDateField = new Ext.form.field.Date(Ext.apply({
					width : 90,
					allowBlank : false,
					format : this.dateFormat
				}, this.dateConfig || {}));
		this.startTimeField = new Ext.form.field.Time(Ext.apply({
					width : 70,
					style : "margin-left : 5px",
					allowBlank : false,
					format : this.timeFormat
				}, this.timeConfig || {}));
		this.durationField = new Ext.form.field.Number(Ext.apply({
					width : 45,
					value : 0,
					minValue : 0,
					allowNegative : false,
					style : "margin-left : 15px"
				}, this.durationConfig || {}));
		this.durationLabel = Ext.create("Ext.form.Label", {
					text : this.getDurationText(),
					style : "margin-left : 5px"
				});
		return [this.startDateField, this.startTimeField, this.durationField,
				this.durationLabel]
	},
	onActivateEditor : function(b, a) {
		this.show(a)
	},
	onMouseDown : function(a) {
		if (this.collapsed || a.within(this.getEl()) || a.getTarget(".x-layer")
				|| a.getTarget(".sch-event-editor-ignore-click")
				|| a.getTarget(".sch-event")) {
			return
		}
		this.collapse()
	},
	onSchedulerDestroy : function() {
		this.destroy()
	},
	onDragCreateEnd : function(b, a, c) {
		if (!this.dragProxyEl && this.schedulerView.dragCreator) {
			this.dragProxyEl = this.schedulerView.dragCreator.getProxy()
		}
		this.resourceRecord = c;
		this.schedulerView.onEventCreated(a);
		this.show(a, this.dragProxyEl)
	},
	hide : function() {
		this.callParent(arguments);
		var a = this.dragProxyEl;
		if (a) {
			a.hide()
		}
	},
	afterCollapse : function() {
		this.hide();
		this.callParent(arguments)
	},
	getDurationText : function() {
		if (this.durationText) {
			return this.durationText
		}
		return Sch.util.Date.getShortNameOfUnit(Sch.util.Date
				.getNameOfUnit(this.durationUnit))
	}
});
Ext.define("Sch.plugin.EventTools", {
	extend : "Ext.Container",
	mixins : ["Ext.AbstractPlugin"],
	lockableScope : "normal",
	hideDelay : 500,
	align : "right",
	defaults : {
		xtype : "tool",
		baseCls : "sch-tool",
		overCls : "sch-tool-over",
		width : 20,
		height : 20,
		visibleFn : Ext.emptyFn
	},
	fadeOutTimer : null,
	lastTarget : null,
	lastPosition : null,
	cachedSize : null,
	offset : {
		x : 0,
		y : 1
	},
	autoRender : true,
	floating : true,
	hideMode : "offsets",
	getRecord : function() {
		return this.record
	},
	init : function(a) {
		if (!this.items) {
			throw "Must define items property for this plugin to function correctly"
		}
		this.addCls("sch-event-tools");
		this.scheduler = a;
		a.on({
					eventresizestart : this.onOperationStart,
					eventresizeend : this.onOperationEnd,
					eventdragstart : this.onOperationStart,
					eventdrop : this.onOperationEnd,
					eventmouseenter : this.onEventMouseEnter,
					eventmouseleave : this.onContainerMouseLeave,
					scope : this
				})
	},
	onRender : function() {
		this.callParent(arguments);
		this.scheduler.mon(this.el, {
					mouseenter : this.onContainerMouseEnter,
					mouseleave : this.onContainerMouseLeave,
					scope : this
				})
	},
	onEventMouseEnter : function(f, a, e) {
		if (!this.rendered) {
			this.doAutoRender();
			this.hide()
		}
		var d = e.getTarget(f.eventSelector);
		var c = Ext.fly(d).getBox();
		this.lastTarget = d;
		this.record = a;
		this.items.each(function(g) {
					g.setVisible(g.visibleFn(a) !== false)
				}, this);
		this.doLayout();
		var b = this.getSize();
		this.lastPosition = [e.getXY()[0] - (b.width / 2),
				c.y - b.height - this.offset.y];
		this.onContainerMouseEnter()
	},
	onContainerMouseEnter : function() {
		window.clearTimeout(this.fadeOutTimer);
		this.setPosition.apply(this, this.lastPosition);
		this.el.fadeIn()
	},
	onContainerMouseLeave : function() {
		window.clearTimeout(this.fadeOutTimer);
		this.fadeOutTimer = Ext.defer(this.el.fadeOut, this.hideDelay, this.el)
	},
	onOperationStart : function() {
		this.scheduler.un("eventmouseenter", this.onEventMouseEnter, this);
		window.clearTimeout(this.fadeOutTimer);
		this.hide()
	},
	hide : function() {
		this.el.hide()
	},
	onOperationEnd : function() {
		this.scheduler.on("eventmouseenter", this.onEventMouseEnter, this)
	}
});
Ext.define("Sch.plugin.Pan", {
			alias : "plugin.pan",
			extend : "Ext.AbstractPlugin",
			lockableScope : "normal",
			enableVerticalPan : true,
			panel : null,
			constructor : function(a) {
				Ext.apply(this, a)
			},
			init : function(a) {
				this.panel = a.normalGrid || a;
				this.view = a.getSchedulingView();
				this.view.on("afterrender", this.onRender, this)
			},
			onRender : function(a) {
				this.view.el.on("mousedown", this.onMouseDown, this, {
							delegate : "." + this.view.timeCellCls
						})
			},
			onMouseDown : function(b, a) {
				if (b.getTarget("." + this.view.timeCellCls)
						&& !b.getTarget(this.view.eventSelector)) {
					this.mouseX = b.getPageX();
					this.mouseY = b.getPageY();
					Ext.getBody().on("mousemove", this.onMouseMove, this);
					Ext.getDoc().on("mouseup", this.onMouseUp, this)
				}
			},
			onMouseMove : function(d) {
				d.stopEvent();
				var a = d.getPageX(), f = d.getPageY(), c = a - this.mouseX, b = f
						- this.mouseY;
				this.panel.scrollByDeltaX(-c);
				this.mouseX = a;
				this.mouseY = f;
				if (this.enableVerticalPan) {
					this.panel.scrollByDeltaY(-b)
				}
			},
			onMouseUp : function(a) {
				Ext.getBody().un("mousemove", this.onMouseMove, this);
				Ext.getDoc().un("mouseup", this.onMouseUp, this)
			}
		});
Ext.define("Sch.plugin.SimpleEditor", {
			extend : "Ext.Editor",
			mixins : ["Ext.AbstractPlugin"],
			lockableScope : "normal",
			cls : "sch-simpleeditor",
			allowBlur : false,
			newEventText : "New booking...",
			delegate : ".sch-event-inner",
			dataIndex : null,
			completeOnEnter : true,
			cancelOnEsc : true,
			ignoreNoChange : true,
			height : 19,
			autoSize : {
				width : "boundEl"
			},
			constructor : function(a) {
				a = a || {};
				a.field = a.field || Ext.create("Ext.form.TextField", {
							selectOnFocus : true
						});
				this.callParent(arguments)
			},
			init : function(a) {
				this.scheduler = a.getSchedulingView();
				a.on("afterrender", this.onSchedulerRender, this);
				this.scheduler.registerEventEditor(this);
				this.dataIndex = this.dataIndex
						|| this.scheduler.getEventStore().model.prototype.nameField
			},
			edit : function(a, b) {
				b = b || this.scheduler.getElementFromEventRecord(a);
				this.startEdit(b.child(this.delegate));
				this.record = a;
				this.setValue(this.record.get(this.dataIndex))
			},
			onSchedulerRender : function(a) {
				this.on({
							complete : function(e, f, d) {
								var b = this.record;
								var c = this.scheduler.eventStore;
								b.set(this.dataIndex, f);
								if (c.indexOf(b) < 0) {
									if (this.scheduler
											.fireEvent("beforeeventadd",
													this.scheduler, b) !== false) {
										c.add(b)
									}
								}
							},
							hide : function() {
								if (this.dragProxyEl) {
									this.dragProxyEl.hide()
								}
							},
							scope : this
						});
				a.on({
							eventdblclick : function(b, c, d) {
								this.edit(c)
							},
							dragcreateend : this.onDragCreateEnd,
							scope : this
						});
				a.el.on("mousedown", function() {
							this.cancelEdit()
						}, this)
			},
			onDragCreateEnd : function(b, a) {
				if (!this.dragProxyEl && this.scheduler.dragCreator) {
					this.dragProxyEl = this.scheduler.dragCreator.getProxy()
				}
				this.scheduler.onEventCreated(a);
				if (a.get(this.dataIndex) === "") {
					a.set(this.dataIndex, this.newEventText)
				}
				this.edit(a, this.dragProxyEl)
			}
		});
Ext.define("Sch.plugin.SummaryColumn", {
			extend : "Ext.grid.column.Column",
			mixins : ["Ext.AbstractPlugin"],
			lockableScope : "top",
			alias : "widget.summarycolumn",
			showPercent : false,
			nbrDecimals : 1,
			sortable : false,
			fixed : true,
			menuDisabled : true,
			width : 80,
			dataIndex : "_sch_not_used",
			constructor : function(a) {
				this.scope = this;
				this.callParent(arguments)
			},
			init : function(a) {
				if (!("eventStore" in a)) {
					return
				}
				this.scheduler = a;
				this.scheduler.lockedGridDependsOnSchedule = true;
				this.eventStore = a.eventStore
			},
			renderer : function(j, a, f) {
				var h = this.scheduler, k = this.eventStore, e = h.getStart(), i = h
						.getEnd(), c = 0, b = this.calculate(f.getEvents(), e,
						i);
				if (b <= 0) {
					return ""
				}
				if (this.showPercent) {
					var d = Sch.util.Date.getDurationInMinutes(e, i);
					return (Math.round((b * 100) / d)) + " %"
				} else {
					if (b > 1440) {
						return (b / 1440).toFixed(this.nbrDecimals) + " "
								+ Sch.util.Date.getShortNameOfUnit("DAY")
					}
					if (b >= 30) {
						return (b / 60).toFixed(this.nbrDecimals) + " "
								+ Sch.util.Date.getShortNameOfUnit("HOUR")
					}
					return b + " " + Sch.util.Date.getShortNameOfUnit("MINUTE")
				}
			},
			calculate : function(c, g, d) {
				var e = 0, b, a, f = Sch.util.Date;
				Ext.each(c, function(h) {
							b = h.getStartDate();
							a = h.getEndDate();
							if (f.intersectSpans(g, d, b, a)) {
								e += f.getDurationInMinutes(f.max(b, g), f.min(
												a, d))
							}
						});
				return e
			}
		});
Ext.define("Sch.plugin.Zones", {
	extend : "Sch.feature.AbstractTimeSpan",
	requires : ["Sch.model.Range"],
	cls : "sch-zone",
	init : function(a) {
		if (!this.template) {
			this.template = new Ext.XTemplate(
					'<tpl for=".">',
					'<div id="'
							+ this.uniqueCls
							+ '-{id}" class="'
							+ this.cls
							+ " "
							+ this.uniqueCls
							+ ' {Cls}" style="left:{left}px;top:{top}px;height:{height}px;width:{width}px"></div>',
					"</tpl>")
		}
		this.callParent(arguments)
	},
	getElementData : function(j, n, c) {
		var o = this.store, h = this.schedulerView, e = c || o.getRange(), g = [], a, m, b, k;
		for (var f = 0, d = o.getCount(); f < d; f++) {
			a = e[f];
			m = a.getStartDate();
			b = a.getEndDate();
			if (m && b && Sch.util.Date.intersectSpans(m, b, j, n)) {
				k = h.getTimeSpanRegion(Sch.util.Date.max(m, j), Sch.util.Date
								.min(b, n), this.expandToFitView);
				g[g.length] = Ext.apply({
							id : a.internalId,
							left : k.left,
							top : k.top,
							width : k.right - k.left,
							height : k.bottom - k.top,
							Cls : a.getCls()
						}, a.data)
			}
		}
		return g
	}
});
Ext.define("Sch.plugin.TimeGap", {
	extend : "Sch.plugin.Zones",
	getZoneCls : Ext.emptyFn,
	init : function(a) {
		this.store = new Ext.data.JsonStore({
					model : "Sch.model.Range"
				});
		this.scheduler = a;
		a.mon(a.eventStore, {
					load : this.populateStore,
					update : this.populateStore,
					remove : this.populateStore,
					add : this.populateStore,
					datachanged : this.populateStore,
					scope : this
				});
		a.on("viewchange", this.populateStore, this);
		this.schedulerView = a.getSchedulingView();
		this.callParent(arguments)
	},
	populateStore : function(c) {
		var b = this.schedulerView.getEventsInView(), f = [], e = this.scheduler
				.getStart(), i = this.scheduler.getEnd(), d = b.getCount(), j = e, h, g = 0, a;
		b.sortBy(function(l, k) {
					return l.getStartDate() - k.getStartDate()
				});
		a = b.getAt(0);
		while (j < i && g < d) {
			h = a.getStartDate();
			if (!Sch.util.Date.betweenLesser(j, h, a.getEndDate()) && j < h) {
				f.push(new this.store.model({
							StartDate : j,
							EndDate : h,
							Cls : this.getZoneCls(j, h) || ""
						}))
			}
			j = Sch.util.Date.max(a.getEndDate(), j);
			g++;
			a = b.getAt(g)
		}
		if (j < i) {
			f.push(new this.store.model({
						StartDate : j,
						EndDate : i,
						Cls : this.getZoneCls(j, i) || ""
					}))
		}
		this.store.removeAll(f.length > 0);
		this.store.add(f)
	}
});
Ext.define("Sch.plugin.TreeCellEditing", {
	extend : "Ext.grid.plugin.CellEditing",
	init : function(a) {
		this._grid = a;
		this.on("beforeedit", this.checkReadOnly, this);
		this.callParent(arguments)
	},
	checkReadOnly : function() {
		var a = this._grid;
		if (!(a instanceof Sch.panel.TimelineTreePanel)) {
			a = a.up("tablepanel")
		}
		return !a.isReadOnly()
	},
	startEditByClick : function(c, a, h, b, g, d, f) {
		if (f.getTarget(c.expanderSelector)) {
			return
		}
		this.callParent(arguments)
	},
	startEdit : function(a, f) {
		if (!a || !f) {
			return
		}
		var d = this, b = d.getEditor(a, f), e = a.get(f.dataIndex), c = d
				.getEditingContext(a, f);
		a = c.record;
		f = c.column;
		d.completeEdit();
		if (f && !f.getEditor(a)) {
			return false
		}
		if (b) {
			c.originalValue = c.value = e;
			if (d.beforeEdit(c) === false
					|| d.fireEvent("beforeedit", c) === false || c.cancel) {
				return false
			}
			d.context = c;
			d.setActiveEditor(b);
			d.setActiveRecord(a);
			d.setActiveColumn(f);
			d.grid.view.focusCell({
						column : c.colIdx,
						row : c.rowIdx
					});
			d.editTask.delay(15, b.startEdit, b, [d.getCell(a, f), c.value, c])
		} else {
			d.grid.getView().getEl(f).focus((Ext.isWebKit || Ext.isIE)
					? 10
					: false)
		}
	},
	getEditingContext : function(e, c) {
		var f = this, a = f.grid, i = a.store, b, d, g = a.getView(), h;
		if (Ext.isNumber(e)) {
			b = e;
			e = i.getAt(b)
		} else {
			if (i.indexOf) {
				b = i.indexOf(e)
			} else {
				b = g.indexOf(g.getNode(e))
			}
		}
		if (Ext.isNumber(c)) {
			d = c;
			c = a.headerCt.getHeaderAtIndex(d)
		} else {
			d = c.getIndex()
		}
		h = e.get(c.dataIndex);
		return {
			grid : a,
			record : e,
			field : c.dataIndex,
			value : h,
			row : g.getNode(b),
			column : c,
			rowIdx : b,
			colIdx : d
		}
	},
	startEditByPosition : function(a) {
		var f = this, d = f.grid, h = d.getSelectionModel(), b = f.view, e = this.view
				.getNode(a.row), g = d.headerCt.getHeaderAtIndex(a.column), c = b
				.getRecord(e);
		if (h.selectByPosition) {
			h.selectByPosition(a)
		}
		f.startEdit(c, g)
	}
});
Ext.define("Sch.plugin.ResourceZones", {
	extend : "Sch.plugin.Zones",
	store : null,
	cls : "sch-resourcezone",
	getElementData : function(e, h, a) {
		var g = this.store, f = this.schedulerView, d = [], i, b, c;
		if (f.getNodes().length > 0) {
			Ext.each(a || g.getRange(), function(j) {
				var k = j.getResource();
				i = j.getStartDate();
				b = j.getEndDate();
				if (k
						&& (f.resourceStore.indexOf ? f.resourceStore : f.store)
								.indexOf(k) >= 0
						&& Sch.util.Date.intersectSpans(i, b, e, h)) {
					c = f.getResourceRegion(k, i, b);
					d[d.length] = Ext.apply({
								id : j.internalId,
								left : c.left,
								top : c.top,
								width : c.right - c.left,
								height : c.bottom - c.top,
								Cls : j.getCls()
							}, j.data)
				}
			})
		}
		return d
	}
});
Ext.define("Sch.feature.ColumnLines", {
			extend : "Sch.plugin.Lines",
			cls : "sch-column-line",
			showTip : false,
			requires : ["Ext.data.Store"],
			init : function(b) {
				this.timeAxis = b.getTimeAxis();
				this.store = Ext.create("Ext.data.JsonStore", {
							model : Ext.define("Sch.model.TimeLine", {
										extend : "Ext.data.Model",
										fields : ["start", {
													name : "Date",
													convert : function(d, c) {
														return c.data.start
													}
												}]
									}),
							data : b.getOrientation() === "horizontal" ? this
									.getData() : []
						});
				this.callParent(arguments);
				var a = this.schedulerView;
				a.timeAxis.on("reconfigure", this.populate, this)
			},
			populate : function() {
				var a = this.schedulerView;
				var b = a.getOrientation() === "horizontal"
						&& a.store.getCount() > 0;
				this.store.removeAll(b);
				if (b) {
					this.store.add(this.getData())
				}
			},
			getElementData : function() {
				var a = this.schedulerView;
				if (a.getOrientation() === "horizontal"
						&& a.store.getCount() > 0) {
					return this.callParent(arguments)
				}
				return []
			},
			getData : function() {
				var a = [];
				this.timeAxis.forEachMainInterval(function(d, b, c) {
							if (c > 0) {
								a.push({
											start : d
										})
							}
						});
				a.push({
							start : this.timeAxis.getEnd()
						});
				return a
			}
		});
Ext.define("Sch.mixin.TimelineView", {
	requires : ["Sch.column.Time", "Sch.data.TimeAxis"],
	orientation : "horizontal",
	overScheduledEventClass : "sch-event-hover",
	selectedEventCls : "sch-event-selected",
	altColCls : "sch-col-alt",
	timeCellCls : "sch-timetd",
	timeCellSelector : ".sch-timetd",
	ScheduleEventMap : {
		click : "Click",
		dblclick : "DblClick",
		contextmenu : "ContextMenu",
		keydown : "KeyDown"
	},
	suppressFitCheck : 0,
	forceFit : false,
	inheritables : function() {
		return {
			cellBorderWidth : 1,
			initComponent : function() {
				this.setOrientation(this.panel._top.orientation
						|| this.orientation);
				this.addEvents("beforetooltipshow", "scheduleclick",
						"scheduledblclick", "schedulecontextmenu",
						"columnwidthchange");
				this.enableBubble("columnwidthchange");
				var a = {}, c = Sch.util.Date;
				a[c.DAY] = a[c.WEEK] = a[c.MONTH] = a[c.QUARTER] = a[c.YEAR] = null;
				Ext.applyIf(this, {
							eventPrefix : this.id + "-",
							largeUnits : a
						});
				this.callParent(arguments);
				if (this.orientation === "horizontal") {
					this.getTimeAxisColumn().on("timeaxiscolumnreconfigured",
							this.checkHorizontalFit, this)
				}
				var b = this.panel._top;
				Ext.apply(this, {
							eventRendererScope : b.eventRendererScope,
							eventRenderer : b.eventRenderer,
							eventBorderWidth : b.eventBorderWidth,
							timeAxis : b.timeAxis,
							dndValidatorFn : b.dndValidatorFn || Ext.emptyFn,
							resizeValidatorFn : b.resizeValidatorFn
									|| Ext.emptyFn,
							createValidatorFn : b.createValidatorFn
									|| Ext.emptyFn,
							tooltipTpl : b.tooltipTpl,
							validatorFnScope : b.validatorFnScope || this,
							snapToIncrement : b.snapToIncrement,
							timeCellRenderer : b.timeCellRenderer,
							timeCellRendererScope : b.timeCellRendererScope,
							readOnly : b.readOnly,
							eventResizeHandles : b.eventResizeHandles,
							enableEventDragDrop : b.enableEventDragDrop,
							enableDragCreation : b.enableDragCreation,
							dragConfig : b.dragConfig,
							dropConfig : b.dropConfig,
							resizeConfig : b.resizeConfig,
							createConfig : b.createConfig,
							tipCfg : b.tipCfg,
							orientation : b.orientation,
							getDateConstraints : b.getDateConstraints
									|| Ext.emptyFn
						});
				if (this.emptyText) {
					this.emptyText = '<span class="sch-empty-text">'
							+ this.emptyText + "</span>"
				}
			},
			onDestroy : function() {
				if (this.tip) {
					this.tip.destroy()
				}
				this.callParent(arguments)
			},
			afterComponentLayout : function() {
				this.callParent(arguments);
				var b = this.getWidth();
				var a = this.getHeight();
				if (b === this.__prevWidth && a === this.__prevHeight) {
					return
				}
				this.__prevWidth = b;
				this.__prevHeight = a;
				if (!this.lockable && !this.suppressFitCheck) {
					this.checkHorizontalFit()
				}
			},
			beforeRender : function() {
				this.callParent(arguments);
				this.addCls("sch-timelineview");
				if (this.readOnly) {
					this.addCls(this._cmpCls + "-readonly")
				}
			},
			afterRender : function() {
				this.callParent(arguments);
				if (this.overScheduledEventClass) {
					this.mon(this.el, {
								mouseover : this.onMouseOver,
								mouseout : this.onMouseOut,
								delegate : this.eventSelector,
								scope : this
							})
				}
				if (this.tooltipTpl) {
					this.el.on("mousemove", this.setupTooltip, this, {
								single : true
							})
				}
				this.setupTimeCellEvents()
			},
			processUIEvent : function(f) {
				var c = this, a = f.getTarget(this.eventSelector), d = c.ScheduleEventMap, b = f.type;
				if (a && b in d) {
					this.fireEvent(this.scheduledEventName + b, this, this
									.resolveEventRecord(a), f)
				} else {
					this.callParent(arguments)
				}
			},
			refresh : function() {
				this.fixedNodes = 0;
				this.callParent(arguments)
			},
			clearViewEl : function() {
				var c = this, b = c.getTargetEl();
				b.down("table").remove();
				if (this.emptyText) {
					var a = b.down(".sch-empty-text");
					if (a) {
						a.remove()
					}
				}
			},
			onMouseOver : function(b, a) {
				if (a !== this.lastItem) {
					this.lastItem = a;
					Ext.fly(a).addCls(this.overScheduledEventClass);
					this.fireEvent("eventmouseenter", this, this
									.resolveEventRecord(a), b)
				}
			},
			onMouseOut : function(b, a) {
				if (this.lastItem) {
					if (!b.within(this.lastItem, true, true)) {
						Ext.fly(this.lastItem)
								.removeCls(this.overScheduledEventClass);
						this.fireEvent("eventmouseleave", this, this
										.resolveEventRecord(this.lastItem), b);
						delete this.lastItem
					}
				}
			},
			highlightItem : function(b) {
				if (b) {
					var a = this;
					a.clearHighlight();
					a.highlightedItem = b;
					Ext.fly(b).addCls(a.overItemCls)
				}
			},
			shouldUpdateCell : function() {
				return true
			}
		}
	},
	hasRightColumns : function() {
		return this.headerCt.items.getCount() > 1
	},
	checkHorizontalFit : function() {
		if (this.orientation === "horizontal") {
			var a = this.getActualTimeColumnWidth();
			var c = this.getFittingColumnWidth();
			if (this.forceFit) {
				if (c != a) {
					this.fitColumns()
				}
			} else {
				if (this.snapToIncrement) {
					var b = this.calculateTimeColumnWidth(a);
					if (b > 0 && b !== a) {
						this.setColumnWidth(b)
					}
				} else {
					if (a < c) {
						this.fitColumns()
					}
				}
			}
		}
	},
	getTimeAxisColumn : function() {
		return this.headerCt.items.get(0)
	},
	getFirstTimeColumn : function() {
		return this.headerCt.getGridColumns()[0]
	},
	getFormattedDate : function(a) {
		return Ext.Date.format(a, this.getDisplayDateFormat())
	},
	getFormattedEndDate : function(d, a) {
		var b = this.timeAxis, c = b.getResolution().unit;
		if (c in this.largeUnits
				&& d.getHours() === 0
				&& d.getMinutes() === 0
				&& !(d.getYear() === a.getYear()
						&& d.getMonth() === a.getMonth() && d.getDate() === a
						.getDate())) {
			d = Sch.util.Date.add(d, Sch.util.Date.DAY, -1)
		}
		return Ext.Date.format(d, this.getDisplayDateFormat())
	},
	getDisplayDateFormat : function() {
		return this.displayDateFormat
	},
	setDisplayDateFormat : function(a) {
		this.displayDateFormat = a
	},
	getSingleUnitInPixels : function(a) {
		return Sch.util.Date.getUnitToBaseUnitRatio(this.timeAxis.getUnit(), a)
				* this.getSingleTickInPixels()
	},
	getSingleTickInPixels : function() {
		throw "Must be implemented by horizontal/vertical"
	},
	scrollEventIntoView : function(c, a) {
		var b = this.getOuterElementFromEventRecord(c);
		if (b) {
			b.scrollIntoView(this.el);
			if (a) {
				if (typeof a === "boolean") {
					b.highlight()
				} else {
					b.highlight(null, a)
				}
			}
		}
	},
	calculateTimeColumnWidth : function(e) {
		if (!this.panel.rendered) {
			return e
		}
		var h = this.forceFit;
		var b = 0, d = this.timeAxis.getUnit(), k = this.timeAxis.getCount(), g = Number.MAX_VALUE;
		if (this.snapToIncrement) {
			var i = this.timeAxis.getResolution(), j = i.unit, c = i.increment;
			g = Sch.util.Date.getUnitToBaseUnitRatio(d, j) * c
		}
		var f = Sch.util.Date.getMeasuringUnit(d);
		g = Math.min(g, Sch.util.Date.getUnitToBaseUnitRatio(d, f));
		var a = Math.floor(this.getAvailableWidthForSchedule() / k);
		b = (h || e < a) ? a : e;
		if (g > 0 && (!h || g < 1)) {
			b = Math.round(Math.max(1, Math[h ? "floor" : "round"](g * b)) / g)
		}
		return b
	},
	getFittingColumnWidth : function() {
		var a = Math.floor(this.getAvailableWidthForSchedule()
				/ this.timeAxis.getCount());
		return this.calculateTimeColumnWidth(a)
	},
	fitColumns : function(b) {
		var a = 0;
		if (this.orientation === "horizontal") {
			a = this.getFittingColumnWidth()
		} else {
			a = Math.floor((this.panel.getWidth()
					- Ext.getScrollbarSize().width - 1)
					/ this.headerCt.getColumnCount())
		}
		this.setColumnWidth(a, b)
	},
	getAvailableWidthForSchedule : function() {
		var c = (this.lastBox && this.lastBox.width) || this.getWidth();
		var a = this.headerCt.items.items;
		for (var b = 1; b < a.length; b++) {
			c -= a[b].getWidth()
		}
		return c - Ext.getScrollbarSize().width - 1
	},
	getRightColumnsWidth : function() {
		var c = 0;
		var a = this.headerCt.items.items;
		for (var b = 1; b < a.length; b++) {
			c += a[b].getWidth()
		}
		return c
	},
	fixRightColumnsPositions : function() {
		var a = this.headerCt.items.items;
		var c = a[0].getWidth();
		for (var b = 1; b < a.length; b++) {
			var d = a[b];
			d.el.setLeft(c);
			c += d.getWidth()
		}
	},
	getElementFromEventRecord : function(a) {
		return Ext.get(this.eventPrefix + a.internalId)
	},
	getEventNodeByRecord : function(a) {
		return document.getElementById(this.eventPrefix + a.internalId)
	},
	getOuterElementFromEventRecord : function(a) {
		return Ext.get(this.eventPrefix + a.internalId)
	},
	resolveColumnIndex : function(a) {
		return Math.floor(a / this.getActualTimeColumnWidth())
	},
	getStartEndDatesFromRegion : function(b, a) {
		throw "Must be implemented by horizontal/vertical"
	},
	setupTooltip : function() {
		var b = this, a = Ext.apply({
					renderTo : Ext.getBody(),
					delegate : b.eventSelector,
					target : b.el,
					anchor : "b"
				}, b.tipCfg);
		b.tip = Ext.create("Ext.ToolTip", a);
		b.tip.on({
			beforeshow : function(d) {
				if (!d.triggerElement || !d.triggerElement.id) {
					return false
				}
				var c = this.resolveEventRecord(d.triggerElement);
				if (!c
						|| this.fireEvent("beforetooltipshow", this, c) === false) {
					return false
				}
				d.update(this.tooltipTpl.apply(this.getDataForTooltipTpl(c)));
				return true
			},
			scope : this
		})
	},
	getDataForTooltipTpl : function(a) {
		return a.data
	},
	getTimeResolution : function() {
		return this.timeAxis.getResolution()
	},
	setTimeResolution : function(b, a) {
		this.timeAxis.setResolution(b, a);
		if (this.snapToIncrement) {
			this.refreshKeepingScroll()
		}
	},
	getEventIdFromDomNodeId : function(a) {
		return a.substring(this.eventPrefix.length)
	},
	getDateFromDomEvent : function(b, a) {
		return this.getDateFromXY(b.getXY(), a)
	},
	handleScheduleEvent : function(c) {
		var b = c.getTarget("." + this.timeCellCls, 2);
		if (b) {
			var a = this.getDateFromDomEvent(c, "floor");
			this.fireEvent("schedule" + c.type, this, a, this.indexOf(this
							.findItemByChild(b)), c)
		}
	},
	setupTimeCellEvents : function() {
		this.mon(this.el, {
					click : this.handleScheduleEvent,
					dblclick : this.handleScheduleEvent,
					contextmenu : this.handleScheduleEvent,
					scope : this
				}, this)
	},
	getSnapPixelAmount : function() {
		if (this.snapToIncrement) {
			var a = this.timeAxis.getResolution();
			return (a.increment || 1) * this.getSingleUnitInPixels(a.unit)
		} else {
			return 1
		}
	},
	getActualTimeColumnWidth : function() {
		return this.headerCt.items.get(0).getTimeColumnWidth()
	},
	setSnapEnabled : function(a) {
		this.snapToIncrement = a;
		if (a) {
			this.refreshKeepingScroll()
		}
	},
	setReadOnly : function(a) {
		this.readOnly = a;
		this[a ? "addCls" : "removeCls"](this._cmpCls + "-readonly")
	},
	isReadOnly : function() {
		return this.readOnly
	},
	setOrientation : function(a) {
		this.orientation = a;
		Ext.apply(this, Sch.view[Ext.String.capitalize(a)].prototype.props)
	},
	getOrientation : function() {
		return this.orientation
	},
	translateToScheduleCoordinate : function(a) {
		throw "Abstract method call!"
	},
	translateToPageCoordinate : function(a) {
		throw "Abstract method call!"
	},
	getDateFromXY : function(b, a) {
		throw "Abstract method call!"
	},
	getXYFromDate : function(a, b) {
		throw "Abstract method call!"
	},
	getTimeSpanRegion : function(a, b) {
		throw "Abstract method call!"
	},
	getStart : function() {
		return this.timeAxis.getStart()
	},
	getEnd : function() {
		return this.timeAxis.getEnd()
	},
	setBarMargin : function(b, a) {
		this.barMargin = b;
		if (!a) {
			this.refreshKeepingScroll()
		}
	},
	setRowHeight : function(a, b) {
		this.rowHeight = a || 24;
		if (this.rendered && !b) {
			this.refreshKeepingScroll()
		}
	},
	refreshKeepingScroll : function(a) {
		this.saveScrollState();
		if (this.lightRefresh) {
			this.lightRefresh()
		} else {
			this.refresh()
		}
		this.restoreScrollState()
	},
	refreshKeepingResourceScroll : function(c) {
		var d = this.el.dom, b = d.scrollTop, a = d.scrollLeft;
		if (this.lightRefresh) {
			this.lightRefresh()
		} else {
			this.refresh()
		}
		if (this.getOrientation() === "horizontal") {
			d.scrollTop = b
		} else {
			d.scrollLeft = a
		}
	},
	lightRefresh : function() {
		var a = this.refreshSize;
		Ext.suspendLayouts();
		this.refreshSize = Ext.emptyFn;
		this.__lightRefresh = true;
		this.refresh();
		delete this.__lightRefresh;
		this.refreshSize = a;
		Ext.resumeLayouts()
	}
});
Ext.apply(Sch, {
			VERSION : "2.1.4"
		});
Ext.define("Sch.view.TimelineGridView", {
			extend : "Ext.grid.View",
			mixins : ["Sch.mixin.TimelineView"]
		}, function() {
			this
					.override(Sch.mixin.TimelineView.prototype.inheritables()
							|| {})
		});
Ext.define("Sch.mixin.SchedulerView", {
	uses : ["Sch.tooltip.Tooltip"],
	requires : ["Sch.feature.DragCreator", "Sch.feature.DragDrop",
			"Sch.feature.ResizeZone", "Sch.feature.Scheduling",
			"Sch.column.Resource", "Sch.view.Horizontal", "Sch.view.Vertical"],
	_cmpCls : "sch-schedulerview",
	scheduledEventName : "event",
	barMargin : 1,
	eventResizeHandles : "end",
	allowOverlap : true,
	constrainDragToResource : false,
	readOnly : false,
	dynamicRowHeight : true,
	managedEventSizing : true,
	eventAnimations : true,
	eventSelector : ".sch-event",
	eventTpl : [
			'<tpl for=".">',
			'<div unselectable="on" id="{{evt-prefix}}{id}" style="left:{left}px;top:{top}px;height:{height}px;width:{width}px;{style}" class="sch-event x-unselectable {internalcls} {cls}">',
			'<div unselectable="on" class="sch-event-inner {iconCls}">',
			"{body}", "</div>", "</div>", "</tpl>"],
	dndValidatorFn : function(b, a, c, f, d) {
		return true
	},
	resizeValidatorFn : function(c, b, a, f, d) {
		return true
	},
	createValidatorFn : function(b, a, d, c) {
		return true
	},
	inheritables : function() {
		return {
			loadingText : "Loading events...",
			trackOver : false,
			overItemCls : "",
			initComponent : function() {
				this.addEvents("eventclick", "eventdblclick",
						"eventcontextmenu", "eventmouseenter", "eventmouseout",
						"beforeeventresize", "eventresizestart",
						"eventpartialresize", "eventresizeend",
						"beforeeventdrag", "eventdragstart", "eventdrop",
						"aftereventdrop", "beforedragcreate",
						"dragcreatestart", "dragcreateend", "afterdragcreate",
						"beforeeventadd");
				this.callParent(arguments);
				var a = this.panel._top;
				Ext.apply(this, {
							eventStore : a.eventStore,
							resourceStore : a.resourceStore,
							eventBodyTemplate : a.eventBodyTemplate,
							eventTpl : a.eventTpl || this.eventTpl,
							eventBarTextField : a.eventBarTextField
									|| a.eventStore.model.prototype.nameField,
							allowOverlap : a.allowOverlap,
							eventBarIconClsField : a.eventBarIconClsField,
							onEventCreated : a.onEventCreated || Ext.emptyFn,
							constrainDragToResource : a.constrainDragToResource
						});
				var c = this;
				if (Ext.isArray(c.eventTpl)) {
					var e = Ext.Array.clone(c.eventTpl), b = '<div class="sch-resizable-handle sch-resizable-handle-{0}"></div>';
					if (this.eventResizeHandles === "start"
							|| this.eventResizeHandles === "both") {
						e.splice(2, 0, Ext.String.format(b, "start"))
					}
					if (this.eventResizeHandles === "end"
							|| this.eventResizeHandles === "both") {
						e.splice(2, 0, Ext.String.format(b, "end"))
					}
					var d = e.join("").replace("{{evt-prefix}}",
							this.eventPrefix);
					c.eventTpl = Ext.create("Ext.XTemplate", d)
				}
			},
			setReadOnly : function(a) {
				if (this.dragCreator) {
					this.dragCreator.setDisabled(a)
				}
				this.callParent(arguments)
			},
			prepareData : function(c, a, b) {
				var d = this.callParent(arguments);
				d = this.collectRowData(d, b, a);
				return d
			},
			initFeatures : function() {
				this.features = this.features || [];
				this.features.push({
							ftype : "scheduling"
						});
				this.callParent(arguments)
			},
			beforeRender : function() {
				this.callParent(arguments);
				this.addCls(this._cmpCls);
				if (this.eventAnimations) {
					this.addCls("sch-animations-enabled")
				}
			},
			afterRender : function() {
				this.callParent(arguments);
				this.bindEventStore(this.eventStore, true);
				this.setupEventListeners();
				this.configureFunctionality();
				var a = this.headerCt.resizer;
				if (a) {
					a.doResize = Ext.Function.createSequence(a.doResize,
							this.afterHeaderResized, this)
				}
			},
			onDestroy : function() {
				this.bindEventStore(null);
				this.callParent(arguments)
			}
		}
	},
	getRowHeight : function() {
		return this.rowHeight
	},
	translateToScheduleCoordinate : function(a) {
		throw "Must be defined by horizontal/vertical class"
	},
	getEventBox : function(b, a) {
		throw "Must be defined by horizontal/vertical class"
	},
	generateTplData : function(a, d, j, f, e) {
		var b = a.getStartDate(), c = a.getEndDate(), g = this.getEventBox(
				Sch.util.Date.max(b, d), Sch.util.Date.min(c, j)), h = Ext
				.apply(g, {
							id : a.internalId,
							internalcls : a.getCls()
									+ (a.dirty ? " sch-dirty " : "")
									+ (c > j ? " sch-event-endsoutside " : "")
									+ (b < d ? " sch-event-startsoutside " : "")
									+ (this.eventBarIconClsField
											? " sch-event-withicon "
											: ""),
							start : b,
							end : c,
							iconCls : a.data[this.eventBarIconClsField] || ""
						});
		if (this.eventRenderer) {
			var i = this.eventRenderer.call(this.eventRendererScope || this, a,
					f, h, e);
			if (Ext.isObject(i) && this.eventBodyTemplate) {
				h.body = this.eventBodyTemplate.apply(i)
			} else {
				h.body = i
			}
		} else {
			if (this.eventBodyTemplate) {
				h.body = this.eventBodyTemplate.apply(a.data)
			} else {
				if (this.eventBarTextField) {
					h.body = a.data[this.eventBarTextField]
				}
			}
		}
		return h
	},
	sortEvents : function(e, d) {
		var c = (e.start - d.start === 0);
		if (c) {
			return e.end > d.end ? -1 : 1
		} else {
			return (e.start < d.start) ? -1 : 1
		}
	},
	layoutEvents : function(a) {
		throw "Must be defined by horizontal/vertical class"
	},
	findClosestSuccessor : function(g, e) {
		var c = Infinity, f, a = g.end, h;
		for (var d = 0, b = e.length; d < b; d++) {
			h = e[d].start - a;
			if (h >= 0 && h < c) {
				f = e[d];
				c = h
			}
		}
		return f
	},
	resolveResource : function(a) {
		throw "Must be defined by horizontal/vertical class"
	},
	getScheduleRegion : function(b, a) {
		throw "Must be defined by horizontal/vertical class"
	},
	resolveEventRecord : function(b) {
		var a = Ext.get(b);
		if (!a.is(this.eventSelector)) {
			a = a.up(this.eventSelector)
		}
		return this.getEventRecordFromDomId(a.id)
	},
	getResourceByEventRecord : function(a) {
		return a.getResource()
	},
	getEventRecordFromDomId : function(b) {
		var a = this.getEventIdFromDomNodeId(b);
		return this.eventStore.data.getByKey(a)
	},
	configureFunctionality : function() {
		var a = this.validatorFnScope || this;
		if (this.eventResizeHandles !== "none" && Sch.feature.ResizeZone) {
			this.resizePlug = Ext.create("Sch.feature.ResizeZone", Ext.applyIf(
							{
								schedulerView : this,
								validatorFn : function(d, c, b, e) {
									return (this.allowOverlap || this
											.isDateRangeAvailable(b, e, c, d))
											&& this.resizeValidatorFn.apply(a,
													arguments) !== false
								},
								validatorFnScope : this
							}, this.resizeConfig || {}))
		}
		if (this.enableEventDragDrop !== false && Sch.feature.DragDrop) {
			this.dragdropPlug = Ext.create("Sch.feature.DragDrop", this, {
				validatorFn : function(c, b, d, g, f) {
					return (this.allowOverlap || this.isDateRangeAvailable(d,
							Sch.util.Date.add(d, Sch.util.Date.MILLI, g), c[0],
							b))
							&& this.dndValidatorFn.apply(a, arguments) !== false
				},
				validatorFnScope : this,
				dragConfig : this.dragConfig || {},
				dropConfig : this.dropConfig || {}
			})
		}
		if (this.enableDragCreation !== false && Sch.feature.DragCreator) {
			this.dragCreator = Ext.create("Sch.feature.DragCreator", Ext
					.applyIf({
								schedulerView : this,
								disabled : this.readOnly,
								validatorFn : function(c, b, d) {
									return (this.allowOverlap || this
											.isDateRangeAvailable(b, d, null, c))
											&& this.createValidatorFn.apply(a,
													arguments) !== false
								},
								validatorFnScope : this
							}, this.createConfig || {}))
		}
	},
	isDateRangeAvailable : function(d, a, b, c) {
		return this.eventStore.isDateRangeAvailable(d, a, b, c)
	},
	getEventsInView : function() {
		var b = this.timeAxis.getStart(), a = this.timeAxis.getEnd();
		return this.eventStore.getEventsInTimeSpan(b, a)
	},
	getEventNodes : function() {
		return this.el.select(this.eventSelector)
	},
	onBeforeDragDrop : function(a, c, b) {
		return !this.readOnly
				&& !b.getTarget().className.match("sch-resizable-handle")
	},
	onDragDropStart : function() {
		if (this.dragCreator) {
			this.dragCreator.setDisabled(true)
		}
		if (this.tip) {
			this.tip.hide();
			this.tip.disable()
		}
	},
	onDragDropEnd : function() {
		if (this.dragCreator) {
			this.dragCreator.setDisabled(false)
		}
		if (this.tip) {
			this.tip.enable()
		}
	},
	onBeforeDragCreate : function(b, c, a, d) {
		return !this.readOnly && !d.ctrlKey
	},
	onDragCreateStart : function() {
		if (this.overClass) {
			var a = this.getView().mainBody;
			this.mun(a, "mouseover", this.onMouseOver, this);
			this.mun(a, "mouseout", this.onMouseOut, this)
		}
		if (this.tip) {
			this.tip.hide();
			this.tip.disable()
		}
	},
	onDragCreateEnd : function(b, a, c) {
		if (!this.eventEditor) {
			if (this.fireEvent("beforeeventadd", this, a) !== false) {
				this.onEventCreated(a);
				this.eventStore.add(a)
			}
			this.dragCreator.getProxy().hide()
		}
	},
	onEventCreated : function(a) {
	},
	onAfterDragCreate : function() {
		if (this.overClass) {
			this.mon(this.getView().mainBody, {
						mouseover : this.onMouseOver,
						mouseout : this.onMouseOut,
						scope : this
					})
		}
		if (this.tip) {
			this.tip.enable()
		}
	},
	onBeforeResize : function(a, c, b) {
		return !this.readOnly
	},
	onResizeStart : function() {
		if (this.tip) {
			this.tip.hide();
			this.tip.disable()
		}
		if (this.dragCreator) {
			this.dragCreator.setDisabled(true)
		}
	},
	onResizeEnd : function() {
		if (this.tip) {
			this.tip.enable()
		}
		if (this.dragCreator) {
			this.dragCreator.setDisabled(false)
		}
	},
	getEventStore : function() {
		return this.eventStore
	},
	registerEventEditor : function(a) {
		this.eventEditor = a
	},
	getEventEditor : function() {
		return this.eventEditor
	},
	setupEventListeners : function() {
		this.on({
					beforeeventdrag : this.onBeforeDragDrop,
					eventdragstart : this.onDragDropStart,
					aftereventdrop : this.onDragDropEnd,
					beforedragcreate : this.onBeforeDragCreate,
					dragcreatestart : this.onDragCreateStart,
					dragcreateend : this.onDragCreateEnd,
					afterdragcreate : this.onAfterDragCreate,
					beforeeventresize : this.onBeforeResize,
					eventresizestart : this.onResizeStart,
					eventresizeend : this.onResizeEnd,
					scope : this
				})
	},
	_onEventUpdate : function(b, c, a) {
		this.onEventUpdate.apply(this, arguments)
	},
	_onEventAdd : function(a, b) {
		this.onEventAdd.apply(this, arguments)
	},
	_onEventRemove : function(a, b) {
		this.onEventRemove.apply(this, arguments)
	},
	bindEventStore : function(b, a) {
		var c = this;
		if (!a && c.eventStore) {
			if (b !== c.eventStore && c.eventStore.autoDestroy) {
				c.eventStore.destroy()
			} else {
				c.mun(c.eventStore, {
							scope : c,
							refresh : c.onEventDataRefresh,
							add : c._onEventAdd,
							remove : c._onEventRemove,
							update : c._onEventUpdate,
							clear : c.refresh
						})
			}
			if (!b) {
				if (c.loadMask && c.loadMask.bindStore) {
					c.loadMask.bindStore(null)
				}
				c.eventStore = null
			}
		}
		if (b) {
			b = Ext.data.StoreManager.lookup(b);
			c.mon(b, {
						scope : c,
						refresh : c.onEventDataRefresh,
						add : c._onEventAdd,
						remove : c._onEventRemove,
						update : c._onEventUpdate,
						clear : c.refresh
					});
			if (c.loadMask && c.loadMask.bindStore) {
				c.loadMask.bindStore(b)
			}
		}
		c.eventStore = b;
		if (b && !a) {
			c.refresh()
		}
	},
	onEventDataRefresh : function() {
		this.refreshKeepingScroll()
	},
	afterHeaderResized : function() {
		var b = this.headerCt.resizer;
		if (b && b.dragHd instanceof Sch.column.Resource) {
			var a = b.dragHd.getWidth();
			this.setColumnWidth(a)
		}
	},
	onEventSelect : function(a) {
		var b = this.getEventNodeByRecord(a);
		if (b) {
			Ext.fly(b).addCls(this.selectedEventCls)
		}
	},
	onEventDeselect : function(a) {
		var b = this.getEventNodeByRecord(a);
		if (b) {
			Ext.fly(b).removeCls(this.selectedEventCls)
		}
	}
});
Ext.define("Sch.view.SchedulerGridView", {
			extend : "Sch.view.TimelineGridView",
			mixins : ["Sch.mixin.SchedulerView"],
			alias : "widget.schedulergridview",
			alternateClassName : "Sch.HorizontalSchedulerView"
		}, function() {
			this.override(Sch.mixin.SchedulerView.prototype.inheritables()
					|| {})
		});
Ext.define("Sch.mixin.TimelinePanel", {
	requires : ["Sch.util.Patch", "Sch.patches.LoadMask", "Sch.patches.Model",
			"Sch.data.TimeAxis", "Sch.feature.ColumnLines", "Sch.view.Locking",
			"Sch.mixin.Lockable", "Sch.preset.Manager"],
	orientation : "horizontal",
	weekStartDay : 1,
	snapToIncrement : false,
	readOnly : false,
	eventResizeHandles : "both",
	viewPreset : "weekAndDay",
	trackHeaderOver : true,
	startDate : null,
	endDate : null,
	eventBorderWidth : 1,
	syncCellHeight : Ext.emptyFn,
	tooltipTpl : null,
	tipCfg : {
		cls : "sch-tip",
		showDelay : 1000,
		dismissDelay: 0, //Added by James Zhang
		hideDelay : 0,
		autoHide : true,
		anchor : "b"
	},
	lightWeight : true,
	timeCellRenderer : null,
	timeCellRendererScope : null,
	inheritables : function() {
		return {
			columnLines : true,
			enableColumnMove : false,
			enableLocking : true,
			lockable : true,
			lockedXType : null,
			normalXType : null,
			initComponent : function() {
				this.lightWeight = this.lightWeight && !this.timeCellRenderer;
				this.addEvents("timeheaderdblclick", "beforeviewchange",
						"viewchange");
				if (!this.timeAxis) {
					this.timeAxis = Ext.create("Sch.data.TimeAxis")
				}
				if (!this.columns && !this.colModel) {
					this.columns = []
				}
				if (this.enableLocking) {
					this.self.mixin("lockable", Sch.mixin.Lockable);
					var b = 0, a = this.columns.length, c;
					for (; b < a; ++b) {
						c = this.columns[b];
						if (c.locked !== false) {
							c.locked = true
						}
					}
					this.timeAxis.on("reconfigure", this.onTimeAxisReconfigure,
							this);
					this.switchViewPreset(this.viewPreset, this.startDate,
							this.endDate, true)
				}
				this.callParent(arguments);
				if (this.lockable) {
					this.applyViewSettings(this.timeAxis.preset);
					if (!this.viewPreset) {
						throw "You must define a valid view preset object. See Sch.preset.Manager class for reference"
					}
					if (this.lightWeight && this.columnLines) {
						this.columnLinesFeature = new Sch.feature.ColumnLines();
						this.columnLinesFeature.init(this)
					}
				}
				this.relayEvents(this.getView(), ["beforetooltipshow",
								"scheduleclick", "scheduledblclick",
								"schedulecontextmenu"])
			},
			getState : function() {
				var a = this, b = a.callParent(arguments);
				Ext.apply(b, {
							viewPreset : a.viewPreset,
							startDate : a.getStart(),
							endDate : a.getEnd()
						});
				return b
			},
			getOrientation : function() {
				return this.orientation
			},
			applyState : function(b) {
				var a = this;
				a.callParent(arguments);
				if (b && b.viewPreset) {
					a.switchViewPreset(b.viewPreset, b.startDate, b.endDate)
				}
			},
			beforeRender : function() {
				this.callParent(arguments);
				if (this.lockable) {
					this.addCls("sch-" + this.orientation)
				}
			},
			afterRender : function() {
				this.callParent(arguments);
				if (this.lockable) {
					this.lockedGrid.on("itemdblclick", function(d, c, e, g, f) {
								if (this.orientation == "vertical" && c) {
									this.fireEvent("timeheaderdblclick", this,
											c.get("start"), c.get("end"), g, f)
								}
							}, this)
				} else {
					var b = this.headerCt;
					if (b && b.reorderer && b.reorderer.dropZone) {
						var a = b.reorderer.dropZone;
						a.positionIndicator = Ext.Function.createSequence(
								a.positionIndicator, function() {
									this.valid = false
								})
					}
				}
			},
			delayScroll : function() {
				var a = this.getScrollTarget().el;
				if (a) {
					this.scrollTask.delay(10, function() {
								if (a.dom) {
									this.syncHorizontalScroll(a.dom.scrollLeft)
								}
							}, this)
				}
			}
		}
	},
	setReadOnly : function(a) {
		this.getSchedulingView().setReadOnly(a)
	},
	isReadOnly : function() {
		return this.getSchedulingView().isReadOnly()
	},
	switchViewPreset : function(d, a, f, b) {
		if (this.fireEvent("beforeviewchange", this, d, a, f) !== false) {
			if (Ext.isString(d)) {
				this.viewPreset = d;
				d = Sch.preset.Manager.getPreset(d)
			}
			if (!d) {
				throw "View preset not found"
			}
			var e = d.headerConfig;
			var c = {
				unit : e.bottom ? e.bottom.unit : e.middle.unit,
				increment : (e.bottom ? e.bottom.increment : e.middle.increment)
						|| 1,
				resolutionUnit : d.timeResolution.unit,
				resolutionIncrement : d.timeResolution.increment,
				weekStartDay : this.weekStartDay,
				mainUnit : e.middle.unit,
				shiftUnit : d.shiftUnit,
				headerConfig : d.headerConfig,
				shiftIncrement : d.shiftIncrement || 1,
				preset : d,
				defaultSpan : d.defaultSpan || 1
			};
			if (b) {
				c.start = a || new Date();
				c.end = f
			} else {
				c.start = a || this.timeAxis.getStart();
				c.end = f
			}
			if (!b) {
				this.applyViewSettings(d)
			}
			this.timeAxis.reconfigure(c)
		}
	},
	applyViewSettings : function(b) {
		var a = this.getSchedulingView();
		a.setDisplayDateFormat(b.displayDateFormat);
		if (this.orientation === "horizontal") {
			a.setRowHeight(this.rowHeight || b.rowHeight, true)
		}
	},
	getStart : function() {
		return this.timeAxis.getStart()
	},
	getEnd : function() {
		return this.timeAxis.getEnd()
	},
	setTimeColumnWidth : function(b, a) {
		this.getSchedulingView().setColumnWidth(b, a)
	},
	onTimeAxisReconfigure : function() {
		this.fireEvent("viewchange", this);
		if (this.stateful && this.lockedGrid) {
			this.saveState()
		}
	},
	getColumnsState : function() {
		var b = this, a = b.lockedGrid.headerCt.getColumnsState();
		return a
	},
	shiftNext : function(a) {
		this.timeAxis.shiftNext(a)
	},
	shiftPrevious : function(a) {
		this.timeAxis.shiftPrevious(a)
	},
	goToNow : function() {
		this.setTimeSpan(new Date())
	},
	setTimeSpan : function(b, a) {
		if (this.timeAxis) {
			this.timeAxis.setTimeSpan(b, a)
		}
	},
	setStart : function(a) {
		this.setTimeSpan(a)
	},
	setEnd : function(a) {
		this.setTimeSpan(null, a)
	},
	getTimeAxis : function() {
		return this.timeAxis
	},
	getResourceByEventRecord : function(a) {
		return a.getResource()
	},
	scrollToDate : function(c, b) {
		var a = this.getSchedulingView();
		var d = a.getXYFromDate(c, true);
		if (this.orientation == "horizontal") {
			a.getEl().scrollTo("left", Math.max(0, d[0]), b)
		} else {
			a.getEl().scrollTo("top", Math.max(0, d[1]), b)
		}
	},
	getSchedulingView : function() {
		return this.lockable ? this.normalGrid.getView() : this.getView()
	},
	setOrientation : function(a) {
		this.removeCls("sch-" + this.orientation);
		this.addCls("sch-" + a);
		this.orientation = a
	}
});
Ext.define("Sch.mixin.SchedulerPanel", {
	requires : ["Sch.view.SchedulerGridView", "Sch.model.Event",
			"Sch.model.Resource", "Sch.data.EventStore",
			"Sch.data.ResourceStore", "Sch.selection.EventModel",
			"Sch.plugin.ResourceZones", "Sch.util.Date",
			"Sch.column.timeAxis.Vertical"],
	resourceColumnWidth : null,
	eventBarIconClsField : "",
	eventSelModelType : "eventmodel",
	eventSelModel : null,
	enableEventDragDrop : true,
	enableDragCreation : true,
	dragConfig : null,
	dropConfig : null,
	eventBarTextField : null,
	allowOverlap : true,
	startParamName : "startDate",
	endParamName : "endDate",
	passStartEndParameters : false,
	eventRenderer : null,
	eventRendererScope : null,
	eventStore : null,
	resourceStore : null,
	eventTpl : null,
	eventBodyTemplate : null,
	resourceZones : null,
	componentCls : "sch-schedulerpanel",
	lockedGridDependsOnSchedule : false,
	initStores : function() {
		var b = this.resourceStore;
		if (!b) {
			Ext.Error.raise("You must specify a resourceStore config")
		}
		if (!this.eventStore) {
			Ext.Error.raise("You must specify an eventStore config")
		}
		this.eventStore = Ext.StoreManager.lookup(this.eventStore);
		this.resourceStore = Ext.StoreManager.lookup(b);
		if (!(this.eventStore instanceof Sch.data.EventStore)) {
			Ext.Error
					.raise("Your eventStore should be a Sch.data.EventStore (or inherit from it)")
		}
		Ext.applyIf(this, {
					store : b,
					resourceStore : b
				});
		this.resourceStore.eventStore = this.eventStore;
		this.eventStore.setResourceStore(this.resourceStore);
		if (this.lockable) {
			if (this.resourceZones) {
				this.plugins = this.plugins || [];
				var a = Ext.StoreManager.lookup(this.resourceZones);
				a.setResourceStore(this.resourceStore);
				this.resourceZonesPlug = Ext.create("Sch.plugin.ResourceZones",
						{
							store : a
						});
				this.plugins.push(this.resourceZonesPlug)
			}
			if (this.passStartEndParameters) {
				this.eventStore.on("beforeload", this.applyStartEndParameters,
						this)
			}
		}
	},
	inheritables : function() {
		return {
			initComponent : function() {
				this.initStores();
				if (this.eventBodyTemplate
						&& Ext.isString(this.eventBodyTemplate)) {
					this.eventBodyTemplate = Ext.create("Ext.XTemplate",
							this.eventBodyTemplate)
				}
				this.callParent(arguments);
				this.relayEvents(this.getView(), ["eventclick",
								"eventdblclick", "eventcontextmenu",
								"eventmouseenter", "eventmouseleave",
								"beforeeventresize", "eventresizestart",
								"eventpartialresize", "eventresizeend",
								"beforeeventdrag", "eventdragstart",
								"eventdrop", "aftereventdrop",
								"beforedragcreate", "dragcreatestart",
								"dragcreateend", "afterdragcreate",
								"beforeeventadd"]);
				this.addEvents("orientationchange")
			},
			setOrientation : function(a, d) {
				if (a === this.orientation && !d) {
					return
				}
				this.callParent(arguments);
				var c = this, f = c.normalGrid, h = c.lockedGrid, g = c
						.getSchedulingView(), b = f.headerCt;
				g.setOrientation(a);
				b.suspendLayouts();
				b.items.each(function(i) {
							b.remove(i)
						});
				b.resumeLayouts();
				if (a === "horizontal") {
					c.mun(c.resourceStore, {
								clear : c.refreshResourceColumns,
								datachanged : c.refreshResourceColumns,
								load : c.refreshResourceColumns,
								scope : c
							});
					g.suspendEvents();
					g.setRowHeight(c.rowHeight || c.timeAxis.preset.rowHeight,
							true);
					g.suppressFitCheck++;
					c.reconfigureLockable(c.resourceStore, c.columns);
					g.suppressFitCheck--;
					g.resumeEvents();
					g.setColumnWidth(c.timeAxis.preset.timeColumnWidth || 60,
							true);
					g.checkHorizontalFit();
					g.getTimeAxisColumn().on({
								timeaxiscolumnreconfigured : g.checkHorizontalFit,
								scope : g
							})
				} else {
					g.setRowHeight(c.timeAxis.preset.timeColumnWidth || 60,
							true);
					g.setColumnWidth(c.timeAxis.preset.resourceColumnWidth
									|| 100, true);
					c.mon(c.resourceStore, {
								clear : c.refreshResourceColumns,
								datachanged : c.refreshResourceColumns,
								load : c.refreshResourceColumns,
								scope : c
							});
					var e = c.processColumns(c.columns);
					c.reconfigureLockable(c.timeAxis.tickStore, e.locked.items);
					f.reconfigure(c.timeAxis.tickStore, c
									.createResourceColumns())
				}
				f.view.refresh();
				h.view.refresh();
				this.fireEvent("orientationchange", this, a)
			},
			applyViewSettings : function(c) {
				this.callParent(arguments);
				var b = this.getSchedulingView(), a;
				if (this.orientation === "horizontal") {
					a = this.rowHeight = this.rowHeight || c.rowHeight
				} else {
					a = this.timeColumnWidth = this.timeColumnWidth
							|| c.timeColumnWidth || 60;
					b.setColumnWidth(c.resourceColumnWidth || 100, true)
				}
				b.setRowHeight(a, true)
			},
			afterRender : function() {
				this.callParent(arguments);
				if (this.lockable && this.lockedGridDependsOnSchedule) {
					if (!this.syncRowHeight) {
						this.normalGrid.getView().on("refresh",
								this.onNormalViewRefresh, this)
					}
					this.normalGrid.getView().on("itemupdate",
							this.onNormalViewItemUpdate, this)
				}
			}
		}
	},
	getResourceStore : function() {
		return this.resourceStore
	},
	getEventStore : function() {
		return this.eventStore
	},
	getEventSelectionModel : function() {
		if (this.eventSelModel && this.eventSelModel.events) {
			return this.eventSelModel
		}
		if (!this.eventSelModel) {
			this.eventSelModel = {}
		}
		var a = this.eventSelModel;
		var b = "SINGLE";
		if (this.simpleSelect) {
			b = "SIMPLE"
		} else {
			if (this.multiSelect) {
				b = "MULTI"
			}
		}
		Ext.applyIf(a, {
					allowDeselect : this.allowDeselect,
					mode : b
				});
		if (!a.events) {
			a = this.eventSelModel = Ext.create("selection."
							+ this.eventSelModelType, a)
		}
		if (!a.hasRelaySetup) {
			this.relayEvents(a, ["selectionchange", "deselect", "select"]);
			a.hasRelaySetup = true
		}
		if (this.disableSelection) {
			a.locked = true
		}
		return a
	},
	applyStartEndParameters : function(b, a) {
		a.params = a.params || {};
		a.params[this.startParamName] = this.getStart();
		a.params[this.endParamName] = this.getEnd()
	},
	refreshResourceColumns : function() {
		var a = this.normalGrid.headerCt;
		if (a.getColumnCount() > 0) {
			a.removeAll()
		}
		a.add(this.createResourceColumns());
		this.getView().refresh()
	},
	createResourceColumns : function() {
		var b = [], a = this.getSchedulingView();
		var c = this;
		this.resourceStore.each(function(d) {
			b.push(Ext.create("Sch.column.Resource", {
						tdCls : a.timeCellCls,
						renderer : a.timeColumnRenderer,
						scope : a,
						width : c.resourceColumnWidth
								|| c.timeAxis.preset.resourceColumnWidth || 100,
						text : d.getName()
					}))
		});
		return b
	}
});
Ext.define("Sch.view.TimelineTreeView", {
			extend : "Ext.tree.View",
			mixins : ["Sch.mixin.TimelineView"],
			requires : ["Sch.patches.TreeView"],
			cellBorderWidth : 0,
			beforeRender : function() {
				this.addCls("sch-timelinetreeview");
				this.callParent(arguments)
			}
		}, function() {
			this
					.override(Sch.mixin.TimelineView.prototype.inheritables()
							|| {})
		});
Ext.define("Sch.view.SchedulerTreeView", {
			extend : "Sch.view.TimelineTreeView",
			alias : "widget.schedulertreeview",
			mixins : ["Sch.mixin.SchedulerView"]
		}, function() {
			this.override(Sch.mixin.SchedulerView.prototype.inheritables()
					|| {})
		});
Ext.define("Sch.panel.TimelineGridPanel", {
			extend : "Ext.grid.Panel",
			mixins : ["Sch.mixin.TimelinePanel"]
		}, function() {
			this.override(Sch.mixin.TimelinePanel.prototype.inheritables()
					|| {})
		});
Ext.define("Sch.panel.TimelineTreePanel", {
	extend : "Ext.tree.Panel",
	requires : ["Ext.data.TreeStore"],
	mixins : ["Sch.mixin.TimelinePanel"],
	useArrows : true,
	rootVisible : false,
	constructor : function(a) {
		a = a || {};
		a.animate = false;
		this.callParent(arguments)
	},
	initComponent : function() {
		this.callParent(arguments);
		if (this.lockable
				&& this.lockedGrid.headerCt.query("treecolumn").length === 0) {
			Ext.Error
					.raise("You must define an Ext.tree.Column (or use xtype : 'treecolumn').")
		}
	},
	onRootChange : function(a) {
		if (!this.lockable) {
			this.callParent(arguments)
		}
	}
}, function() {
	this.override(Sch.mixin.TimelinePanel.prototype.inheritables() || {})
});
Ext.define("Sch.panel.SchedulerGrid", {
			extend : "Sch.panel.TimelineGridPanel",
			mixins : ["Sch.mixin.SchedulerPanel"],
			alias : ["widget.schedulergrid", "widget.schedulerpanel"],
			alternateClassName : "Sch.SchedulerPanel",
			viewType : "schedulergridview",
			lockedXType : "gridpanel",
			normalXType : "schedulergrid",
			onRender : function() {
				this.callParent(arguments);
				if (this.lockable && this.orientation === "vertical") {
					this.refreshResourceColumns(true)
				}
			}
		}, function() {
			this.override(Sch.mixin.SchedulerPanel.prototype.inheritables()
					|| {})
		});
Ext.define("Sch.panel.SchedulerTree", {
	extend : "Sch.panel.TimelineTreePanel",
	mixins : ["Sch.mixin.SchedulerPanel"],
	alias : ["widget.schedulertree"],
	requires : ["Sch.view.SchedulerTreeView"],
	lockedXType : "treepanel",
	normalXType : "schedulertree",
	viewType : "schedulertreeview",
	setOrientation : function(a) {
		if (a == "vertical") {
			Ext.Error
					.raise("Sch.panel.SchedulerTree does not support vertical orientation")
		}
	},
	initComponent : function() {
		this.callParent(arguments);
		if (!this.lockable
				&& (this.resourceStore instanceof Ext.data.TreeStore)) {
			this.getView().store.eventStore = this.eventStore
		}
	}
}, function() {
	this.override(Sch.mixin.SchedulerPanel.prototype.inheritables() || {})
});
Ext.data.Connection.override({
			parseStatus : function(b) {
				var a = this.callOverridden(arguments);
				if (b === 0) {
					a.success = true
				}
				return a
			}
		});
