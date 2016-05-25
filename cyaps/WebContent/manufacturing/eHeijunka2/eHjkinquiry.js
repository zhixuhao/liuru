Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');
Ext.Loader.setPath('Ext.ux', 'ux');
Ext.require([
'Sch.panel.SchedulerGrid', 'EventEditor'
]);
Ext.require([
    'Ext.ux.grid.FiltersFeature'
]);

Ext.define("MyApp.TaskGrid", {
			extend : "Ext.grid.Panel",
			cls : 'taskgrid',
			collapsible : true,
			viewConfig : {
				columnLines : true
			},
			initComponent : function() {
				Ext.apply(this, {
							store : new Ext.data.JsonStore({
								model : Ext.define("UnplannedTask", {
									extend : "Ext.data.Model",
									fields : ['Name','ReleaseDate','OriginalStartDateTime','OriginalEndDateTime','OriginalDueDateTime','DueDate','DueTime','Family','SubFamily','Duration','RemainQuantity','Item','ItemDescription','WorkCenter','ParentViewStr','ChildViewStr','Priority','op','plant']
								}),
	    						autoLoad:false
					    	}),
							columns : [{
										//header : '#SO',
										header : '\u751f\u4ea7\u5de5\u5355',
										sortable : true,
										width : 150,
										dataIndex : 'Name'
									}, 
									{
										//header : '#OP',
										header : '\u5de5\u5e8f',
										sortable : true,
										width : 60,
										dataIndex : 'op'
									},{
										//header : 'Item',
										header : '\u8d27\u53f7',
										sortable : true,
										width : 100,
										dataIndex : 'Item'
									}, {
										//header : 'Description',
										header : '\u63cf\u8ff0',
										sortable : true,
										width : 200,
										dataIndex : 'ItemDescription'
									}, {
										//header : 'Sub Family',
										header : '\u4ea7\u54c1\u65cf\u5b50\u9879',
										sortable : true,
										width : 100,
										dataIndex : 'SubFamily'
									},{
										//header : 'Release Date',
										header : '\u5f00\u5355\u65e5\u671f',
										sortable : true,
										width : 100,
										dataIndex : 'ReleaseDate',
										hidden : true,
										renderer : function(value, cellmeta, record, rowIndex, colIndex, store){
											var ReleaseDate = record.get("ReleaseDate");
											if(ReleaseDate!=0){
												var date = Ext.Date.parse(ReleaseDate,'Ymd');
												return Ext.Date.format(date,'Y-m-d');
											}else {
												return value;
											}
						                }
									},{
										//header : 'Prod Start Date/Time',
										header : '\u5f00\u59cb\u751f\u4ea7\uff08\u65e5\u671f/\u65f6\u95f4\uff09',
										sortable : true,
										width : 150,
										dataIndex : 'OriginalStartDateTime',
										renderer : function(value, cellmeta, record, rowIndex, colIndex, store){
											var date = Ext.Date.parse(value,'YmdHis');
											return Ext.Date.format(date,'Y-m-d H:i:s');											
						                }
									},{
										//header : 'Child View',
										header : '\u5b50\u9879\u89c6\u56fe',
										sortable : true,
										width : 150,
										dataIndex : 'ChildViewStr'
									},{
										//header : 'Prod End Date/Time',
										header : '\u751f\u4ea7\u7ed3\u675f\uff08\u65e5\u671f/\u65f6\u95f4\uff09',
										sortable : true,
										width : 150,
										dataIndex : 'OriginalEndDateTime',
										renderer : function(value, cellmeta, record, rowIndex, colIndex, store){
											var date = Ext.Date.parse(value,'YmdHis');
											return Ext.Date.format(date,'Y-m-d H:i:s');											
						                }
									},{
										//header : 'Parent View',
										header : '\u7236\u9879\u89c6\u56fe',
										sortable : true,
										width : 150,
										dataIndex : 'ParentViewStr'
									}, {
										//header : 'Remain HRS',
										header : '\u5269\u4f59\u5c0f\u65f6\u6570',
										sortable : true,
										width : 100,
										dataIndex : 'Duration'
									}, {
										//header : 'Remain QTY',
										header : '\u5269\u4f59\u6570\u91cf',
										sortable : true,
										width : 110,
										dataIndex : 'RemainQuantity'
									},{
										//header : 'Due Datetime',
										header : '\u4ea4\u8d27\u65e5\u671f',
										sortable : true,
										width : 100,
										hidden : true,
										dataIndex : 'OriginalDueDateTime',
										renderer : function(value, cellmeta, record, rowIndex, colIndex, store){
											if(value!=0){
												var dueDateTime = Ext.Date.parse(value,'YmdHis');
												return Ext.Date.format(dueDateTime,'Y-m-d H:i:s');
											}else {
												return value;
											}
						                }
									}, {
										//header : 'Family',
										header : '\u4ea7\u54c1\u65cf',
										sortable : true,
										width : 100,
										dataIndex : 'Family'
									}, {
										//header : 'Priority',
										header : '\u4f18\u5148\u7ea7',
										sortable : true,
										width : 60,
										dataIndex : 'Priority',
										renderer : function(value, cellmeta, record, rowIndex, colIndex, store){
											return value;
						                }
									},{
										//header : 'WC#',
										header : '\u5de5\u4f5c\u4e2d\u5fc3',
										sortable : true,
										width : 60,
										dataIndex : 'WorkCenter'								
									},{
										//header : 'Plant#',
										header : '\u5de5\u5382\u4ee3\u7801',
										sortable : true,
										width : 60,
										dataIndex : 'plant'								
									}]
						});
				this.callParent(arguments);
			}
		}); 
		
		
Ext.define("MyApp.TaskDragZone", {
	extend : "Ext.dd.DragZone",
	ddGroup : 'unplannedtasks',
	getRepairXY : function() {
		return this.dragData.repairXY;
	},
	getDragData : function(e) {
		var sourceEl = e.getTarget(), view = this.taskGrid.getView(), rowEl = view
				.findItemByChild(sourceEl), rec = rowEl
				&& view.getRecord(rowEl);
		if (sourceEl && rec) {
			var d = sourceEl.cloneNode(true);
			d.id = Ext.id();
			var wrap = Ext.get(Ext.core.DomHelper.createDom({
						tag : 'div',
						cls : 'sch-dd-wrap',
						style : {
							width : '100px'
						},
						children : [{
									tag : 'span',
									cls : 'sch-dd-proxy-hd',
									html : '&nbsp;'
								}]
					}));
//			wrap.appendChild(d);
			Ext.fly(d).addCls('sch-event');
			Ext.fly(d).update(rec.get('Name'));
			
			return {
				sourceEl : sourceEl,
				repairXY : Ext.fly(sourceEl).up('tr').getXY(),
				duration : rec.get('Duration') * 3600000,
				ddel : wrap.dom,
				sourceEventRecord : rec,
				records : [rec]
			};
		}
	}
}); 

Ext.define('Event', {
    extend: 'Sch.model.Event',
    fields: [
    	{name: 'ID', type : 'string', mapping: 'ID'},
        {name: 'ResourceId', type: 'string', mapping: 'ResourceId'},
        {name: 'PercentAllocated', type: 'int', mapping: 'PercentAllocated'},
		{name: 'StartDate', type : 'date', dateFormat: 'Y-m-dTH:i:s', mapping: 'StartDate'},
        {name: 'EndDate', type : 'date', dateFormat: 'Y-m-dTH:i:s', mapping: 'EndDate'},
        {name: 'Duration', type : 'string', mapping: 'Duration'}, 
        {name: 'HRSGap', type : 'string', mapping: 'HRSGap'},
        {name: 'Cls', type : 'string', mapping: 'Cls'},
        {name: 'EventId',type: 'string', mapping: 'EventId'},
        {name: 'EventType', type: 'string', mapping: 'EventType'},
        {name: 'Title', type: 'string', mapping: 'Title'},
        {name: 'Quantity', type: 'string', mapping: 'Quantity'},
        {name: 'ShopOrder', type: 'string', mapping: 'ShopOrder'},
        {name: 'Item', type: 'string', mapping: 'Item'},
        {name: 'ItemDescription', type: 'string', mapping: 'ItemDescription'},
        {name: 'DueDate', type : 'date', dateFormat: 'Y-m-dTH:i:s', mapping: 'DueDate'},
        {name: 'WorkCenter', type : 'string', mapping: 'WorkCenter'},
        {name: 'Fixed', type : 'string', mapping: 'Fixed'},
        {name: 'Status', type : 'string', mapping: 'Status'},
        {name: 'ParentViewStr', type : 'string', mapping: 'ParentViewStr'},
        {name: 'ChildViewStr', type : 'string', mapping: 'ChildViewStr'},
        {name: 'OriginalID', type : 'string', mapping: 'OriginalID'},
        {name: 'Priority', type : 'int', mapping: 'Priority'},
        {name: 'OrginalEndDateInfo', type:'string', mapping: 'OrginalEndDateInfo'},
        {name: 'op', type:'int', mapping: 'op'},
        {name: 'plant', type: 'string', mapping: 'plant'}
    ]
});	

var myMask;

Ext.onReady(function() {	
	Ext.QuickTips.init();
//	Ext.apply(Ext.QuickTips.getQuickTip(), {
//	    showDelay: 0,
//	    dismissDelay: 0, 
//	    trackMouse: true
//	});	
	App.Scheduler.init();
});

App.Scheduler = {
    // Initialize application
    init : function() {
        Sch.preset.Manager.registerPreset("dayNightShift", {
            timeColumnWidth : 35,
            rowHeight : 60,
            displayDateFormat : 'G:i',
            shiftIncrement : 1,
            shiftUnit :"DAY",
            timeResolution : {
                unit :"MINUTE",
                increment : 5
            },
            defaultSpan : 24,
            headerConfig : {
                bottom : {
                    unit :"HOUR",
                    increment : 1,
                    dateFormat : 'G'
                },
                middle : {
                    unit :"HOUR",
                    increment : 12,
                    renderer : function(startDate, endDate, headerConfig, cellIdx) {
                        // Setting align on the header config object
                        headerConfig.align = 'center';

                        if (startDate.getHours() === 0) {
                            // Setting a custom CSS on the header cell element
                            headerConfig.headerCls = 'nightShift';
                            return Ext.Date.format(startDate, 'M d') + ' Night Shift';
                       }
                        else {
                            // Setting a custom CSS on the header cell element
                            headerConfig.headerCls = 'dayShift';
                            return Ext.Date.format(startDate, 'M d') + ' Day Shift';
                        }
                    }
                },
                top : {
                    unit :"DAY",
                    increment : 1,
                    dateFormat : 'd M Y'
                }
            }
        });
        
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'ProductionScheduleFormPanel',
		    title: 'Production Scheduling',
		    header : false,
		    region: 'north',
		    border : false,
		    frame : true,
		    collapsible : true,
		    layout:"column",
		    height : 46,
		    bodyPadding: 0,
            items : [
                {
                	columnWidth:.3,
					layout : 'form',
					border : false,
					frame : false,
                	items : [{
						xtype: "textfield",
						name : 'workCenter',
	            		//fieldLabel : 'Work Center',
						fieldLabel : '\u5de5\u4f5c\u4e2d\u5fc3',
	            		height : 25,
	            		allowBlank : false
					}]
                },
                {
                	columnWidth:.1,
					layout : 'form',
					border : false,
					frame : false,
                	items : [{                    	
						xtype:"button",
	            		//text : 'View',
						text : '\u67e5\u770b', //查看
	            		id : 'view_Button',
	            		height : 25,
	            		width : 60,
	            		style : 'text-align:center',
	            		handler : function(button,event){
	            			if(formPanel.getForm().isValid()){
								var myMask = new Ext.LoadMask(Ext.getBody(), {
									//msg : "Loading, please wait..."		
									msg : "\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u5019..."
										});	
								myMask.show();
							
	            				Ext.getCmp("eHeijunka_saveButton").setDisabled(true);
	                			App.Scheduler.scheduler.setReadOnly(true); //Set schdeuler to be readonly

	            				var formData = formPanel.getForm().getValues();
	                			var workCenter = formData.workCenter;
	                			App.Scheduler.WorkCenter = workCenter; //global work center
	                			
								var data = new Object();
								data.workCenter = App.Scheduler.WorkCenter;
								
								// add vied and edit pruview
								EHeijunkaService.getPruview(data,function(resultFlag){
									myMask.hide();
									if(resultFlag==0 || resultFlag==1 || resultFlag ==3){
				                		EHeijunkaService.unlockWorkCenter(data,function(resultFlag){
											if(resultFlag==0){
					                			//Load resource availability time spans
					                			App.Scheduler.scheduler.loadResourceAvailabilityList();
												
					                			//Load resource store
												App.Scheduler.scheduler.loadResourceStore();								
												
												//Load event store
												App.Scheduler.scheduler.loadEventStore();
				
												//Load unplanned shop order list
												App.Scheduler.scheduler.loadUnpannedShopOrderStore();
											}else {
												//Ext.Msg.alert('Tip', "Fail to unlock work center("+workCenter+")!");	
												Ext.Msg.alert('\u63d0\u793a', "\u5de5\u4f5c\u4e2d\u5fc3\u89e3\u9501\u5931\u8d25("+workCenter+")!");
											}
										});
										
									}else if(resultFlag == 4){
										//Ext.Msg.alert('Tip', "You are not authorized to view this work center("+workCenter+")!");
										Ext.Msg.alert('\u63d0\u793a', "\u65e0\u6743\u9650\u67e5\u770b\u5de5\u4f5c\u4e2d\u5fc3("+workCenter+")!");
									}
								});
								
								
	            			}
	            		}
            		}]	            	
            	},
                {
                	columnWidth:.1,
					layout : 'form',
					border : false,
					frame : false,
                	items : [{
						xtype:"button",
	            		//text : 'Edit',
						text : '\u7f16\u8f91',
	            		id : 'edit_Button',
	            		height : 25,
	            		width : 60,
	            		disabled:true,
	            		style : 'text-align:center',
	            		handler : function(button,event){
	            			if(formPanel.getForm().isValid()){
								var myMask = new Ext.LoadMask(Ext.getBody(), {
										//msg : "Loading, please wait..."
										msg : "\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u5019..."
										});	
								myMask.show();	
							
	            				Ext.getCmp("eHeijunka_saveButton").setDisabled(false);
	            				
	                			var formData = formPanel.getForm().getValues();
	                			var workCenter = formData.workCenter;
	                			
	                			App.Scheduler.WorkCenter = workCenter; //global work center
	                			
								var data = new Object();
								data.workCenter = App.Scheduler.WorkCenter;
								data.editFlag = true; //Flag to lock the work center when editing
								EHeijunkaService.checkUserAccess(data,function(resultResult){
										myMask.hide();
										
										var strArray = resultResult.split(",");
										var resultFlag = strArray[0];
										if(resultFlag=='0'){
											App.Scheduler.scheduler.setReadOnly(false); //Set scheduler to be editable
											
				                			//Load resource availability time spans
				                			App.Scheduler.scheduler.loadResourceAvailabilityList();
											
				                			//Load resource store
											App.Scheduler.scheduler.loadResourceStore();								
											
											//Load event store
											App.Scheduler.scheduler.loadEventStore();
			
											//Load unplanned shop order list
											App.Scheduler.scheduler.loadUnpannedShopOrderStore();											
										}else if(resultFlag == '1'){ // In use
											//Ext.Msg.alert('Tip', strArray[1]+" is editing work center("+strArray[2]+")!");
											Ext.Msg.alert('\u63d0\u793a',  strArray[1]+"\u6b63\u5728\u4f7f\u7528\u5de5\u4f5c\u4e2d\u5fc3("+strArray[2]+")!");
										}else if(resultFlag == '2'){ // Don't have the privilege to edit
											//Ext.Msg.alert('Tip', "You are not authorized to edit this work center("+workCenter+")!");
											Ext.Msg.alert('\u63d0\u793a', "\u5de5\u4f5c\u4e2d\u5fc3\u89e3\u9501\u5931\u8d25("+workCenter+")!");
										}else if(resultFlag == '3'){ // This work center is not 
											//Ext.Msg.alert('Tip', "Work center("+workCenter+") is not set in system!");
											Ext.Msg.alert('\u63d0\u793a', "\u7cfb\u7edf\u4e2d\u5c1a\u672a\u914d\u7f6e\u5de5\u4f5c\u4e2d\u5fc3("+workCenter+")!");
										}
										
//										myMask.hide();
									}
								);	                			
	                			
	            			}
	            			
	            			
	            		}
            		}]
            	},
                {
                	columnWidth:.1,
					layout : 'form',
					border : false,
					frame : false,
                	items : [{
						xtype:"button",
	            		//text : 'Parent/Child View',
						text : '\u7236\u9879/\u5b50\u9879\u89c6\u56fe',
	            		id : 'parentView_Button',
	            		height : 25,
	            		width : 60,
	            		hidden:true,
	            		style : 'text-align:center',
	            		handler : function(button,event){
	            			if(formPanel.getForm().isValid()){
								var myMask = new Ext.LoadMask(Ext.getBody(), {
											//msg : "Loading, please wait..."
											msg : "\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u5019..."
										});	
								myMask.show();	
								
	            				Ext.getCmp("eHeijunka_saveButton").setDisabled(true);
	                			App.Scheduler.scheduler.setReadOnly(true); //Set schdeuler to be readonly								
							
	                			var formData = formPanel.getForm().getValues();
	                			var workCenter = formData.workCenter;
	                			
	                			App.Scheduler.WorkCenter = workCenter; //global work center
	                			
								var data = new Object();
								data.wrkc = workCenter;
								
								// add vied and edit pruview
								EHeijunkaService.getPruview(data,function(resultFlag){
									myMask.hide();
									if(resultFlag==0 || resultFlag==1 || resultFlag ==3){
				                		EHeijunkaService.parentChildView(data,function(resultResult){
											if(resultResult==0){
					                			//Load resource availability time spans
					                			App.Scheduler.scheduler.loadResourceAvailabilityList();
												
					                			//Load resource store
												App.Scheduler.scheduler.loadResourceStore();								
												
												//Load event store
												App.Scheduler.scheduler.loadEventStore();
				
												//Load unplanned shop order list
												App.Scheduler.scheduler.loadUnpannedShopOrderStore();											
											}else { 
												//Ext.Msg.alert('Tip', 'Fail to load lastest parent/child view');	
												Ext.Msg.alert('\u63d0\u793a', '\u52a0\u8f7d\u7236\u9879/\u5b50\u9879\u89c6\u56fe\u5931\u8d25');
											}
										});	
										
									}else if(resultFlag==4){
										//Ext.Msg.alert('Tip', "You are not authorized to Parent/Child View this work center("+workCenter+")!");
										Ext.Msg.alert('\u63d0\u793a', "\u65e0\u6743\u9650\u67e5\u770b\u5de5\u4f5c\u4e2d\u5fc3("+workCenter+")\u7684\u7236\u9879/\u5b50\u9879\u89c6\u56fe!");
									}
								});
								
	                			
	            			}
	            		}
            		}]
            	}                    
            ]	    
		    
		});	
		
        var scheduler = App.Scheduler.createScheduler();
        
		var filters = {
		    ftype: 'filters',
		    encode: false, // json encode the filter query
		    local: true,   // defaults to false (remote filtering)
		
		    // Filters are most naturally placed in the column definition, but can also be
		    // added here.
		    filters: [{
		        type: 'string',
		        dataIndex: 'Name'
		    },{
		        type: 'string',
		        dataIndex: 'Item'
		    },{
		    	type: 'string',
		    	dataIndex: 'SubFamily'
		    }]
		};        
		
		var unplannedTaskGrid = Ext.create("MyApp.TaskGrid", {
					id : 'unplannedTaskGrid',
					//title : 'Unplanned Shop Order',
					title : '\u672a\u6392\u4ea7\u5de5\u5355',
					header : true,
					height : 160,
		            split : true,
		            features: [filters],
		            region : 'south',
		            dock : 'bottom',
		            bbar: new Ext.Toolbar({
				        items:['->','-',{
				                    //text:"Download", //Download unplanned shop orders
				        			text:"\u4e0b\u8f7d",
				        			handler: function(){
				                    	if(Ext.isEmpty(App.Scheduler.WorkCenter)){
				                    		//Ext.Msg.alert('Tip', 'Please input work center first.');
				                    		Ext.Msg.alert('\u63d0\u793a', '\u8bf7\u8f93\u5165\u5de5\u4f5c\u4e2d\u5fc3!');
				                    		return false;
				                    	}
				                    	
										var myMask = new Ext.LoadMask(Ext.getBody(), {
											//msg : "Please wait..."
											msg : "\u8bf7\u7a0d\u5019..."
												});	
										myMask.show();			
										
									    var obj = new Object();
								    	obj.workCenter = App.Scheduler.WorkCenter;	
								    	obj.type = "unplannedshoporder";
										EHeijunkaService.downloadReport(obj, function(data) {
													myMask.hide();
													dwr.engine.openInDownload(data);
												});
									}			                    
				                }]
				        })
		        });			
		
		var contentPanel = Ext.create('Ext.panel.Panel', {
		    title: 'Content Panel',
		    header : false,
		    region : 'center',
		    layout : 'border',
		    items: [scheduler,unplannedTaskGrid]
//		    dockedItems : unplannedTaskGrid
		});		
		
		var container = new Ext.Panel({
          	renderTo : Ext.getBody(),
            width : 1300,
            height:600,
            layout : 'border',
            items : [
            	formPanel,
            	contentPanel
            ]
        });	
        
		var view = scheduler.getSchedulingView(),
            taskDragZone = Ext.create("MyApp.TaskDragZone", unplannedTaskGrid.el,{
                taskGrid : unplannedTaskGrid,
                schedulerView : view 
            });
            
        var taskDropZone = Ext.create("Sch.feature.DropZone", scheduler.el, {
            ddGroup : 'unplannedtasks',
            schedulerView : view,
            onNodeDrop : function(target, dragSource, e, data){
                var targetRecord = view.resolveResource(target),
                    date = view.getDateFromDomEvent(e, 'round'),
                    record = data.records[0];
                 
                //Not allow to create Kanban if the remain quantity of the shop order is less than zero
				if(record&&record.get("RemainQuantity")<0){
					return false
				}                    
                
                if (!scheduler.dndValidatorFn.call(this, data.records, targetRecord, date, data.duration)) {
                    return false;
                }

                if (scheduler.eventStore.indexOf(record) < 0) {
                    unplannedTaskGrid.store.remove(record);
                    
                    var title = record.get('SubFamily');
                    var itemDescription = record.get('ItemDescription');
                    if(!Ext.isEmpty(itemDescription)){
                    	if(itemDescription.length>8){
                    		title = title+"/"+itemDescription.substr(0,8);
                    	}else {
                    		title = title+"/"+itemDescription;
                    	}
                    }
                    
                    var eventRecord = new Event({
                    	EventType : 'PD', //Production
                        Title : title,
                        StartDate : date,
                        EndDate : Sch.util.Date.add(date, Sch.util.Date.MILLI, record.get('Duration') * 3600000),
                        Duration : record.get('Duration'),
                        ResourceId : targetRecord.get('Id'),
                        Item : record.get('Item'),
                        ItemDescription : record.get('ItemDescription'),
                        ShopOrder : record.get('Name'),
                        op : record.get('op'),
                        plant : record.get('plant'),
                        Quantity : record.get('RemainQuantity'),
                        WorkCenter : record.get('WorkCenter')
                    });
                    
                    view.eventStore.add(eventRecord);
                    
                    var eventEditor = scheduler.view.normalView.getEventEditor();
                    eventEditor.show(eventRecord);
                }
                return true;
            },

            // "Borrow" validatorFn from scheduler
            validatorFn : scheduler.dndValidatorFn
        });              
    },

	onEventContextMenu: function (s, rec, e) {
        e.stopEvent();
        
		if(App.Scheduler.scheduler.isReadOnly()||(rec.get("StartDate")-Ext.Date.add(new Date(),Ext.Date.DAY,-3))<=0||rec.get("Fixed")=="TRUE"){
			return false;
		}         
        
		if (!s.ctx) {
			s.ctx = new Ext.menu.Menu({
				items: [{
                    //text: 'Delete Kanban',
					text: '\u5220\u9664',
//                    iconCls: 'icon-delete',
                    handler : function() {
                        s.eventStore.remove(s.ctx.rec);
                        
						//Record removed event
						App.Scheduler.recordRemovedEvent(s.ctx.rec);	
						
						//Do auto move backward
						var record = s.ctx.rec;
//	                	var diff = record.get("StartDate")- record.get("EndDate");
						var diff = App.Scheduler.getBackwardDiff(record);
						App.Scheduler.autoMoveBackward(record,diff);						
                    }
                },'-',{
					//text : 'Split Kanban to',
                	text : '\u62c6\u5206\u4e3a',
               		menu : {
               			items : [
	               			{
			                    text: '2',
			                    handler : function() {
			                    	App.Scheduler.simpleSplitKanban(s,2);
			                    } 
	               			},
	               			{
			                    text: '3',
			                    handler : function() {
			                    	App.Scheduler.simpleSplitKanban(s,3);
			                    } 
	               			},
	               			{
			                    text: '4',
			                    handler : function() {
			                    	App.Scheduler.simpleSplitKanban(s,4);
			                    } 
	               			},
	               			{
			                    text: '5',
			                    handler : function() {
			                        App.Scheduler.simpleSplitKanban(s,5);
			                    } 
	               			},
	               			{
			                    text: '6',
			                    handler : function() {
			                        App.Scheduler.simpleSplitKanban(s,6);
			                    }
	               			},
		                    {
			                    text: '10',
			                    handler : function() {
			                        App.Scheduler.simpleSplitKanban(s,10);
			                    }
		                    }
               			]
               		}
                }]
            });

        }

        s.ctx.rec = rec;
        s.ctx.showAt(e.getXY());
    },

	
    beforeTooltipShow: function (s, r) {
        return s.getEventEditor().getCollapsed();
    },

	showEvent : function(g, r, e) {
        if (!this.win) {
            this.win = new Ext.Window({
                bodyStyle:'padding:10px',
                height:300,
                width: 300,
                closeAction : 'hide',
                autoScroll:true
            });
        }
        
        this.win.setTitle(r.get('ResourceId'));
        this.win.show(e.getTarget());

        this.win.body.update(r.get('StartDate'));
    },

    createScheduler : function(eventStore) {
        var resourceStore = Ext.create('Sch.data.ResourceStore', {
                sorters:{
                    property: 'ResourceId', 
                    direction: "ASC"
                },
                model : 'Sch.model.Resource'
            });
            
	    var eventStore = Ext.create('Sch.data.EventStore', {
	        	model : 'Event'
	   		});	     
	   		
        // Store containing the availability data for the resources
        var availabilityStore = Ext.create("MyApp.AvailabilityStore");	  
      	availabilityStore.on('load', function() { sched.lockedGrid.getView().refresh(); });        

        var sched = Ext.create("Sch.panel.SchedulerGrid", {
        	id 			: 'ProductionSchedulerGrid',
        	//title 		: 'Production Scheduling',
        	title 		: '\u751f\u4ea7\u6392\u4ea7',
        	header 		: true,
            height      : 400,
            width       : 900,
            border      : true,
            region 		: 'center',
            viewPreset  : 'hourAndDay',
			rowHeight 	: 65,
			border		: true,
			allowOverlap: true,
			split 		: true,
            columnLines : true,
            rowLines 	: true,			

			resourceStore   : resourceStore,
			resourceZones 	: availabilityStore,
			eventStore      : eventStore,
			
            columns     : [
               //{ header : 'Machine', sortable : true, width : 100, dataIndex : 'Name' }
               { header : '\u8bbe\u5907', sortable : true, width : 100, dataIndex : 'Name' }
            ],			
			
			eventBodyTemplate: new Ext.XTemplate('<tpl if="EventType == \'PD\'">', 
													'<div class = "sch-event-header">{OrginalEndDateInfo}&nbsp;&nbsp;',
														'<tpl if="Fixed == \'TRUE\'">',
														'<img src="images/red-pin.png" width="20" height="20"/>',
														'</tpl>',
														'{Title}',
													'</div>',
													//'<div class = "sch-event-header">Qty: {Quantity}</div>',
													'<div class = "sch-event-header">\u6570\u91cf: {Quantity}</div>',
													//'<div class = "sch-event-header">HRS Gap: {HRSGap}</div>',
													'<div class = "sch-event-header">\u65f6\u5dee: {HRSGap}</div>',
													//'<div class = "sch-event-header"><b>Child View: </b>{ChildViewStr}<b>  Parent View: </b>{ParentViewStr}</p></div>',
													'<div class = "sch-event-header"><b>\u5b50\u9879\u89c6\u56fe: </b>{ChildViewStr}<b>  \u7236\u9879\u89c6\u56fe: </b>{ParentViewStr}</p></div>',
													//'<div class = "sch-event-header">Due Time: {[Ext.Date.format(values.DueDate, "Y-m-d H:i")]}</div>', 
												'</tpl>',
												 '<tpl if="EventType == \'SD\'">Title:', 
													'<div class = "sch-event-header">',
														'<tpl if="Fixed == \'TRUE\'">',
														'<img src="images/red-pin.png" width="20" height="20"/>',
														'</tpl>',
														'{Title}',
													'</div>',
													'<div class = "sch-event-header">Time: {[Ext.Date.format(values.StartDate, "H:i")]} -> {[Ext.Date.format(values.EndDate, "H:i")]}</div>',
												 '</tpl>'
												 ),
			
			
			listeners   : {
                eventcontextmenu    : this.onEventContextMenu,
				//dragcreateend		: this.onDragCreateEnd,
                
                eventresizestart      : function(scheduler, record, eOpts){
                	App.Scheduler.resizeBeforeEndDate = record.get("EndDate");
                },                
                eventresizeend      : function(scheduler, record, eOpts){
                	//realign event schedule
//                	App.Scheduler.realignEventSchedule(record,scheduler.eventStore);
                	
                	//Do auto move backward
                	App.Scheduler.resizeAfterEndDate = record.get("EndDate");
                	var diff = App.Scheduler.resizeAfterEndDate - App.Scheduler.resizeBeforeEndDate;
                	if(diff<0){
						App.Scheduler.autoMoveBackward(record,diff);
                	}

                	
                	App.Scheduler.realignEvent(record,scheduler.eventStore);
                },
                eventdrop			: function(scheduler, records, isCopy, eOpts){
                	//realign event schedule
//                	App.Scheduler.realignEventSchedule(records[0],scheduler.eventStore);
                	
					var eventRecord = App.Scheduler.dragBeforeEvent;
					if(eventRecord.get("EventId")==records[0].id&&eventRecord.get("ResourceId")!=records[0].get("ResourceId")){
//						var diff = eventRecord.get("StartDate")-eventRecord.get("EndDate");
						var diff = App.Scheduler.getBackwardDiff(eventRecord);
						App.Scheduler.autoMoveBackward(eventRecord,diff);
					}

                	
                	App.Scheduler.realignEvent(records[0],scheduler.eventStore);
                },
                
                beforedragcreate : function(scheduler,resource,e,eOpts){
                	if(e-Ext.Date.add(new Date(),Ext.Date.DAY,-3)<=0){ //Not allow to create event if the start time is before or equal to the day 3 days before
                		return false;
                	}
                },
                beforeeventdrag : function(scheduler,record,e,eOpts){
                	if(record.get("StartDate")-Ext.Date.add(new Date(),Ext.Date.DAY,-3)<=0){
                		return false;
                	}
                	
	                var eventRecord = new Event({
	                	EventId : record.id,
	                    StartDate : record.get('StartDate'),
	                    EndDate : record.get("EndDate"),
	                    ResourceId : record.get('ResourceId')
	                }); 
                	App.Scheduler.dragBeforeEvent = eventRecord;
                },
                scope               : this
            },

            tooltipTpl: new Ext.XTemplate(
            	'<tpl if="EventType == \'PD\'">', 
					'<div>',
					'	<p><b></b>{OrginalEndDateInfo}&nbsp;&nbsp;{Title}</p><p><b>\u751f\u4ea7\u5de5\u5355: </b>{ShopOrder}</p><p><b>\u5de5\u5e8f: </b>{op}</p><p><b>\u8d27\u53f7: </b>{Item}</p><p><b>\u63cf\u8ff0: </b>{ItemDescription}</p><p><b>\u4f18\u5148\u7ea7: </b>{Priority}</p><p><b>\u6570\u91cf: </b>{Quantity}</p><p><b>\u5f00\u59cb\u751f\u4ea7\uff08\u65e5\u671f/\u65f6\u95f4\uff09: </b>{[Ext.Date.format(values.StartDate, "Y-m-d H:i:s")]}</p><p><b>\u751f\u4ea7\u7ed3\u675f\uff08\u65e5\u671f/\u65f6\u95f4\uff09: </b>{[Ext.Date.format(values.EndDate, "Y-m-d H:i:s")]}</p><p><b>\u4ea4\u8d27\u65e5\u671f: </b>{[Ext.Date.format(values.DueDate, "Y-m-d H:i:s")]}</p>',
					'	<p><b>\u7236\u9879\u89c6\u56fe: </b>{ParentViewStr}</p>',
					'	<p><b>\u5b50\u9879\u89c6\u56fe: </b>{ChildViewStr}</p>',
					'</div>',
            	'</tpl>',
            	'<tpl if="EventType == \'SD\'">',
					'<div><p><b>Title: </b>{Title}</p><p><b>From: </b>{[Ext.Date.format(values.StartDate, "Y-m-d H:i:s")]}</p><p><b>To: </b>{[Ext.Date.format(values.EndDate, "Y-m-d H:i:s")]}</p></div>',
            	'</tpl>'
            ).compile(),	
            
			plugins: [
                this.editor = Ext.create("EventEditor", {
					listeners : {
						'beforeeventsave' : function(eventEditor,eventRecord){
							//TODO
						},
						'aftereventsave' : function(eventEditor,eventRecord){
							//TODO
						},						
						'beforeeventdelete' : function(editor,eventRecord,eOpts){
							//Record removed event
							App.Scheduler.recordRemovedEvent(eventRecord);			
							
							//Do auto move backward
//		                	var diff = eventRecord.get("StartDate")- eventRecord.get("EndDate");
							var diff = App.Scheduler.getBackwardDiff(eventRecord);							
							App.Scheduler.autoMoveBackward(eventRecord,diff);
						}
					}
                }),

				new Sch.plugin.CurrentTimeLine({updateInterval : 10000})
            ],

			viewConfig: { rowLines : true, barMargin: 5 },

			resizeValidatorFn : function(resourceRecord, eventRecord, startDate, endDate, e) {
				if(App.Scheduler.scheduler.isReadOnly()||(startDate-Ext.Date.add(new Date(),Ext.Date.DAY,-3))<=0||eventRecord.get("Fixed")=="TRUE"){
					return false;
				}  				
				
                return availabilityStore.isResourceAvailable(resourceRecord, startDate, endDate);
            },
			
			dndValidatorFn : function(dragRecords, targetResourceRecord, date, duration, e) {
				if(App.Scheduler.scheduler.isReadOnly()||(date-Ext.Date.add(new Date(),Ext.Date.DAY,-3))<=0||dragRecords[0].get("Fixed")=="TRUE"){
					return false;
				}  				
				
                return availabilityStore.isResourceAvailable(targetResourceRecord, date, Sch.util.Date.add(date, Sch.util.Date.MILLI, duration));
            },
            
            tbar : [
		        {
		            xtype      : 'radiogroup',
		            id : 'sizeTypeRadiogroup',
		            width : 130,
		            layout: 'hbox',
		            items: [
		                {
		                    //boxLabel  : 'Time',
		                	boxLabel  : '\u65f6\u95f4',
		                    name      : 'sizeType',
		                    inputValue: 't',
		                    checked   : true
		                }, {
		                    //boxLabel  : 'Machine',
		                	boxLabel : '\u8bbe\u5907',
		                    name      : 'sizeType',
		                    inputValue: 'm'	                    
		                }
		            ],
                    listeners : {
                    	change :  function(radioField,newValue,oldValue,eOpts){
                    		var sizeType = radioField.getValue().sizeType;
                    		if(sizeType=="t"){
                    			Ext.getCmp("col-slider").setMinValue(50);
                    			Ext.getCmp("col-slider").setMaxValue(4000);
                    			var columnWidth = App.Scheduler.ColumnWidth;
                    			if(Ext.isEmpty(columnWidth)){
                    				Ext.getCmp("col-slider").setValue(100);
                    			}else {
                    				Ext.getCmp("col-slider").setValue(columnWidth);
                    			}
                    		}else if(sizeType=="m"){
                    			Ext.getCmp("col-slider").setMinValue(20);
                    			Ext.getCmp("col-slider").setMaxValue(100);
                    			var rowHeight = App.Scheduler.RowHeight;
                    			if(Ext.isEmpty(rowHeight)){
                    				Ext.getCmp("col-slider").setValue(65);
                    			}else {
                    				Ext.getCmp("col-slider").setValue(rowHeight);
                    			}
                    		}
                    	}
                    }		            
		        },            
	            {
                 	id          : 'col-slider',
                 	xtype       : 'slider',
                 	width       : 200,
                 	value       : 50,
                	increment   : 5,
                 	minValue    : 50,
                 	maxValue    : 4000,
                 	listeners : {
                     	change : function(slider, value) {
                     		var sizeType = Ext.getCmp("sizeTypeRadiogroup").getValue().sizeType;
                     		if(sizeType=="t"){
                     			sched.setTimeColumnWidth(value);
                     			App.Scheduler.ColumnWidth = value;
                     		}else if(sizeType=="m"){
                        		sched.view.normalView.setRowHeight(value);
                        		App.Scheduler.RowHeight = value;
                        		sched.rowHeight = value;
                     		}                     		
                      	}     
                 	}	            	
	            },
                {
                    //text : 'Hours',
	            	text : '\u65f6',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    pressed : true,
                    iconCls : 'icon-calendar',
                    handler : function() {
                    	var now = new Date();
                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
                    	var end = Ext.Date.add(start,Ext.Date.DAY,2);
                        sched.switchViewPreset('hourAndDay',start, end);
                    }
                },
                {
                    //text : 'Days',
                	text : '\u65e5',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    iconCls : 'icon-calendar',
                    handler : function() {
                    	var now = new Date();
                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
                    	var end = Ext.Date.add(start,Ext.Date.DAY,14);    
                        sched.switchViewPreset('dayAndWeek', start, end);
                    }
                },
                {
                    //text : 'Weeks',
                    text : '\u5468',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    iconCls : 'icon-calendar',
                    handler : function() {
                    	var now = new Date();
                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
                    	var end = Ext.Date.add(start,Ext.Date.DAY,21);     
                        sched.switchViewPreset('weekAndMonth',start,end);
                    }
                },
				'->',
				{
                       //text            : 'Horizontal view',
                		text            : '\u6c34\u5e73\u89c6\u56fe',
                        pressed         : true,
                        enableToggle    : true,
                        toggleGroup     : 'orientation',
                        iconCls         : 'icon-horizontal',
                        scope           : this,
                        handler         : function() {
                            sched.setOrientation('horizontal');
                        }
                },
                {
                        //text            :  'Vertical view',
                		text            :  '\u5782\u76f4\u89c6\u56fe',
                        enableToggle    : true,
                        toggleGroup     : 'orientation',
                        iconCls         : 'icon-vertical',
                        scope           : this,
                        handler         : function() {
                            sched.setOrientation('vertical');
                        }
                },
                '->',
                {
                    //text : 'Day and night shift',
                    text : '\u767d\u73ed/\u591c\u73ed',
                    enableToggle : true,
                    toggleGroup : 'presets',
                    iconCls : 'icon-calendar',
                    handler : function() {
                    	var start = sched.getStart();
                    	var end = sched.getEnd();               	
                        sched.switchViewPreset('dayNightShift', start, end);
                    }
                },
                {
                    enableToggle: true,
                    //text: 'Select Date...',
                    text: '\u9009\u62e9\u65e5\u671f...',
                    toggleGroup: 'presets',
                    iconCls : 'icon-calendar',
                    scope : this,
                    menu : Ext.create('Ext.menu.DatePicker', {
                        handler: function(dp, date){
                            var viewPreset = Ext.getCmp("ProductionSchedulerGrid").viewPreset;
	                    	var now = date;
                            if(viewPreset=="hourAndDay"){
		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
		                    	var end = Ext.Date.add(start,Ext.Date.DAY,2);     
		                    	sched.switchViewPreset('hourAndDay',start, end);
                            }else if(viewPreset=="dayAndWeek"){
		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
		                    	var end = Ext.Date.add(start,Ext.Date.DAY,7);                    	
		                        sched.switchViewPreset('dayAndWeek', start, end); 
                            }else if(viewPreset=="weekAndMonth"){
		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
		                    	var end = Ext.Date.add(start,Ext.Date.DAY,21);                         	
		                        sched.switchViewPreset('weekAndMonth',start,end);                            
                            }else {
		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
		                    	var end = Ext.Date.add(start,Ext.Date.DAY,1);     
		                    	sched.switchViewPreset('hourAndDay',start, end);                           	
                            }
                        },
                        scope : this
                    })
                },                
                '->',
				{
					//text : 'Save',
                	text : '\u4fdd\u5b58',
					id : 'eHeijunka_saveButton',
					disabled : true,
                    iconCls : 'icon-calendar',
                    handler : function() {
						var myMask = new Ext.LoadMask(Ext.getBody(), {
									msg : "Please wait..."
								});	
						myMask.show();										
						
						var dataArray = new Array(); 
						var records = sched.getEventStore().getModifiedRecords();
						for(var i=0;i<records.length;i++){
							var rec = records[i];
							
							var data = new Object();
							data.eventId = rec.data["EventId"];
							if(Ext.isEmpty(rec.data["ShopOrder"])&&Ext.isEmpty(rec.data["WorkCenter"])){//If it's a new and not a shop order event
								data.workCenter = App.Scheduler.WorkCenter;
							}else {
								data.workCenter = rec.data["WorkCenter"];
							}
							data.machine = rec.data["ResourceId"];
							data.shopOrder = rec.data["ShopOrder"];
							data.op = rec.data["op"];
							data.plant = rec.data["plant"];
							data.title = rec.data["Title"];
							data.startTime = rec.data["StartDate"];
							data.endTime = rec.data["EndDate"];
							var quantity = rec.data["Quantity"];
							if(Ext.isEmpty(quantity)){
								data.allocatedQuantity = 0;
							}else {
								data.allocatedQuantity = quantity;
							}	
							data.eventType = rec.data["EventType"];
							data.cls = rec.data["Cls"]; //CSS class
							if(data.cls=="sch-event-green"){ // Don't save green class
								data.cls = "";
							}	
							
							data.fixed = rec.data["Fixed"];
							
							dataArray.push(data);
						}
						
						//Add removed records to "dataArray"
						var removedRecords = sched.removedRecords;
						if(removedRecords){
							for(var i=0;i<removedRecords.length;i++){
								var rec = removedRecords[i];
								
								var data = new Object();
								data.eventId = rec.data["EventId"];
								data.workCenter = 	rec.data["WorkCenter"];
								data.removed = 	rec.data["Removed"];
								dataArray.push(data);
							}										
						}
						
						if(dataArray.length==0){
							myMask.hide();
							//Ext.Msg.alert('Tip', 'No data can be saved.');	
							Ext.Msg.alert('\u63d0\u793a', '\u65e0\u6570\u636e\u9700\u8981\u4fdd\u5b58!');
							return;
						}									
						
						//Save event list
						EHeijunkaService.saveEventList(dataArray,function(flag){
								myMask.hide();
								if(flag==0){
									sched.loadEventStore();  //Refresh event store
									sched.loadUnpannedShopOrderStore(); //Refresh unplanned shop order list
									//Ext.Msg.alert('Tip', 'Save the event successfully');																								
									Ext.Msg.alert('\u63d0\u793a', '\u4fdd\u5b58\u6210\u529f');
								}else if(flag==-1){
									//Ext.Msg.alert('Tip', 'Fail to save the event');
									Ext.Msg.alert('\u63d0\u793a', '\u4fdd\u5b58\u5931\u8d25');
								}														
							}
						);                       
                    }
                }                
            ],
            
            onEventCreated : function(newEventRecord) {
                // Overridden to provide some default values
                newEventRecord.set('Title', '');
                newEventRecord.set('EventType', 'SD'); //Shut down
            },
            
			//Load available time spans of every resource
		    loadResourceAvailabilityList : function(){
				var data = new Object();
				data.workCenter = App.Scheduler.WorkCenter;
				EHeijunkaService.getResourceAvailabilityList(data,function(jsonString){
						var availabilityStore =  sched.resourceZones;
					
						//decode resource availability list from json string
						var resourceAvailabilityList = Ext.decode(jsonString);
						availabilityStore.loadData(resourceAvailabilityList.data);							
					}
				);     		
		    },            
            
			//Load resource store
		    loadResourceStore : function(){
					var data = new Object();
					data.workCenter = App.Scheduler.WorkCenter;
					EHeijunkaService.getMachineList(data,function(jsonString){
							var resourceStore = sched.getResourceStore();
						
							//decode event list from json string
							var myMachineList = Ext.decode(jsonString);
							resourceStore.loadData(myMachineList.data);							
						}
					);     		
		    },            
            
			//Load event store
			loadEventStore : function(){
				var eventMask = new Ext.LoadMask(Ext.getCmp("ProductionSchedulerGrid").getEl(), {
							msg : "Please wait..."
						});	
				eventMask.show();	
				
		        var data = new Object();
		        data.workCenter = App.Scheduler.WorkCenter;
				EHeijunkaService.getEventList(data,function(jsonString){
					var eventStore = sched.getEventStore();
				
					//decode event list from json string
					var myeventList = Ext.decode(jsonString);
					eventStore.loadData(myeventList.data);
					
					eventStore.commitChanges();
					
					//Clear "removedRecords"
					sched.removedRecords = "";
					
					eventMask.hide();
				});								
			},
			
			//Load unplanned shop order list
		    loadUnpannedShopOrderStore : function(){
				var shopOrderMask = new Ext.LoadMask(Ext.getCmp("unplannedTaskGrid").getEl(), {
							msg : "Please wait..."
						});	
				shopOrderMask.show();			    	
		    	
					var data = new Object();
					data.workCenter = App.Scheduler.WorkCenter;
					data.workCenter = App.Scheduler.WorkCenter;
					EHeijunkaService.getUnpannedShopOrderList(data,function(jsonString){
							var store = Ext.getCmp("unplannedTaskGrid").getStore();
							
							//decode event list from json string
							var unplannedShopOrderList = Ext.decode(jsonString);
							store.loadData(unplannedShopOrderList.data);	
							
							shopOrderMask.hide();
						}
					);     		
		    },
		    
			bbar : [
					'->','-',{
				                    //text:"Download", //Download Kanbans
									text:"\u4e0b\u8f7d", //Download Kanbans            
									handler: function(){
				                    	if(Ext.isEmpty(App.Scheduler.WorkCenter)){
				                    		//Ext.Msg.alert('Tip', 'Please input work center first.');	
				                    		Ext.Msg.alert('\u63d0\u793a', '\u8bf7\u8f93\u5165\u5de5\u4f5c\u4e2d\u5fc3');
				                    		return false;
				                    	}
				                    	
										var myMask = new Ext.LoadMask(Ext.getBody(), {
													msg : "\u8bf7\u7a0d\u5019..."
												});	
										myMask.show();			
										
									    var obj = new Object();
								    	obj.workCenter = App.Scheduler.WorkCenter;		
								    	obj.type = "kanban";
										EHeijunkaService.downloadReport(obj, function(data) {
													myMask.hide();
													dwr.engine.openInDownload(data);
												});
									}			                    
				                }			
			]    
        });
        
        App.Scheduler.scheduler = sched;
        sched.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, 1);
		return sched;
    },
    
	//Split Kanban (Simple)
    simpleSplitKanban : function(scheduleView,count){
        scheduleView.eventStore.remove(scheduleView.ctx.rec);
    	
    	var record = scheduleView.ctx.rec;

		//Record removed event
		App.Scheduler.recordRemovedEvent(record);    	
    	
    	var StartDate = record.data["StartDate"];
    	var EndDate = record.data["EndDate"];
    	
    	var duration = record.getEndDate()-record.getStartDate();
    	var quantity = record.get('Quantity');
    	
    	var diff = Math.round((duration/count)/60000);  // minutes
    	var quantityDiff = Ext.Number.toFixed(quantity/count,3);

    	for(var i=0;i<count;i++){
    		if(i==count-1){
                var newEventRecord = new Event({
                	EventType : record.get("EventType"), //Production
                    Title : record.get('Title'),
                    StartDate : Sch.util.Date.add(StartDate, Sch.util.Date.MINUTE, diff*i),
                    EndDate : EndDate,
                    Duration : record.get('Duration'),
                    ResourceId : record.get('ResourceId'),
                    Item : record.get('Item'),
                    ItemDescription : record.get('ItemDescription'),
                    ShopOrder : record.get('ShopOrder'),
                    op : record.get('op'),
                    plant : record.get('plant'),
                    Quantity : Ext.Number.toFixed(quantity-quantityDiff*i,3),
                    WorkCenter : record.get('WorkCenter'),
                    Cls : record.get('Cls'),
                    Fixed : record.get('Fixed')
                }); 
    		}else {
                var newEventRecord = new Event({
                	EventType : record.get("EventType"), //Production
                    Title : record.get('Title'),
                    StartDate : Sch.util.Date.add(StartDate, Sch.util.Date.MINUTE, diff*i),
                    EndDate : Sch.util.Date.add(StartDate, Sch.util.Date.MINUTE, diff*(i+1)),
                    Duration : record.get('Duration'),
                    ResourceId : record.get('ResourceId'),
                    Item : record.get('Item'),
                    ItemDescription : record.get('ItemDescription'),
                    ShopOrder : record.get('ShopOrder'),
                    op : record.get('op'),
                    plant : record.get('plant'),
                    Quantity : quantityDiff,
                    WorkCenter : record.get('WorkCenter'),
                    Cls : record.get('Cls'),
                    Fixed : record.get('Fixed')                    
                });  
    		}
    		scheduleView.eventStore.add(newEventRecord);
    		newEventRecord.dirty = true;
    	}    	
    },
    
	//Record removed event for saving
	recordRemovedEvent: function(eventRecord){
	    var eventId = eventRecord.data["EventId"];
	    var sched = App.Scheduler.scheduler;
	    if(!Ext.isEmpty(eventId)){//If is not a new event
	        var removedRecords = sched.removedRecords;
	        if(!removedRecords){
	        	removedRecords = new Array();
	        }
	        
	        eventRecord.data["Removed"] = 'TRUE';  // Set to be removed flag for the record
	        removedRecords.push(eventRecord);	
	        sched.removedRecords = removedRecords;
	    }		    	
	},    
    
	//Realign events when event schedule is changed
	realignEventSchedule: function(newEventRecord,eventStore){
		var newId = newEventRecord.id;
		var newResourceId = newEventRecord.data["ResourceId"]; //Machine NO.
        var newStart = newEventRecord.data["StartDate"]; 
        var newEnd = newEventRecord.data["EndDate"]; 
        
        //Sort event store by "StartDate" fisrt
		eventStore.sort("StartDate","ASC");		
		
		var currentEventArray = new Array();
        for(var i=0;i<eventStore.getCount();i++){
        	var record = eventStore.getAt(i);
        	var resourceId = record.data["ResourceId"] //Machine NO.
			if(newResourceId==resourceId){
				currentEventArray.push(record);
			}
        }
        
        var deviateFlag = false;
        var diff = 0;        
        var count = currentEventArray.length;
        
        for(var i=0;i<count;i++){
        	var record = currentEventArray[i]
        	var id = record.id;
        	var resourceId = record.data["ResourceId"] //Machine NO.
        	var start = record.data["StartDate"];
        	var end = record.data["EndDate"];
        	
        	if(id==newId){
        		continue;
        	}
        	
        	if(!deviateFlag){
//        		alert((newStart>=start&&newStart<end)+"/"+(newStart<start&&newEnd>start));
	        	if(newStart>=start&&newStart<end){ 
	        		deviateFlag = true;
	        		var diff1 = end-newStart;

	        		this.addTimeDiff2Schedule(newEventRecord,diff1);
	        		
	        		if(i+2<count){
	        			var diff2 = newEventRecord.data["EndDate"] - currentEventArray[i+2].data["StartDate"];
	        			if(diff2>0){
		        			diff = diff2;
	        			}else {
//	        				alert(diff2+"/break");
	        				break;	        			
	        			}
	        		}
//	        		alert("diff2:"+diff2);
	        	}else if(newStart<start&&newEnd>start){
	        		deviateFlag = true
	        		diff = newEnd - start;
	        		this.addTimeDiff2Schedule(record,diff);
	        	}
        	}else {
        		this.addTimeDiff2Schedule(record,diff);
        	}
        }
	},
	
	//Add time diff to start date & end date
	addTimeDiff2Schedule: function (record,diff){
		var diff = Math.round(diff/60000);  // Miliseconds to Minutes
		record.data["StartDate"] = Sch.util.Date.add(record.data["StartDate"],Sch.util.Date.MINUTE,diff);
		record.data["EndDate"] = Sch.util.Date.add(record.data["EndDate"],Sch.util.Date.MINUTE,diff);
		record.commit();
		record.dirty = true;
	}
	
	///////////////////////////////////////////////////////
	,
	/**
	 * Advanced scheduler realignment (Consider fixed Kanban, Working Time, Non-working Time)
	 * @param {} newEventRecord  New changed Kanban
	 * @param {} eventStore 
	 */
	realignEvent: function(newEventRecord,eventStore){
//		alert("start realignEvent...");
		
		var newEventId = newEventRecord.id;
		var newResourceId = newEventRecord.data["ResourceId"]; //Machine NO.
		var newStart = newEventRecord.data["StartDate"];
		var newEnd = newEventRecord.data["EndDate"]; 
		
		//Step 1:Get fixed Kanbans (taking non-working time span as fixed Kanban)
        var fixedKanbans = this.getFixedTimeSpans(newEventRecord);
        
        //Step 2: If there is any unfixed Kanbans overlap with the new Kanban, do pre-treatment 
        //Step 2.1 check 
        var unfixedKanbanFlag = false;
		var currentEventArray = this.getCurrentRecordArray(newResourceId); //Get current event array 
        for(var i=0;i<currentEventArray.length;i++){
        	var record = currentEventArray[i];
        	var id = record.id;
			var start = record.data["StartDate"];
			var end = record.data["EndDate"]; 
			
	        if(id == newEventId||end<=newStart){
	        	continue;
	        }			
			
			if((start>newStart&&start<newEnd)||(end>newStart&&end<newEnd)||(start<=newStart&&end>=newEnd)){
				unfixedKanbanFlag = true;
			}
        }		
        
//      alert("unfixedKanbanFlag is:"+unfixedKanbanFlag);
        
        //2.2 pre-treatment (This is to ensure the Kanbans will be splitted&inserted in proper order)
        if(unfixedKanbanFlag){
	        this.realignEventSchedule3(fixedKanbans,newEventRecord);
        }
        
		//Step 2.3: Combine Kanbans which are splitted from a same Kanban.
		this.combineSplittedKanbans(newEventRecord);        
        
        //Step 3: Get the splitted Kanbans
//    	alert("before do getAutoSplitKanban 1111...");
		var splitRecordArray = this.getAutoSplitKanban(fixedKanbans,newEventRecord);  		
//		alert("splitRecordArray.length is:"+splitRecordArray.length);
		
		if(splitRecordArray.length==0){
			splitRecordArray = new Array();
			splitRecordArray.push(newEventRecord);
		}
		
		//Step 4: If there is any overlap Kanban, then do advanced realignment
		if(splitRecordArray.length>0){
			this.realignEventSchedule2(fixedKanbans,splitRecordArray,eventStore);
		}
	},
	
	
	/**
	 * Do advanced realignment when inserting a new event
	 * @param {} fixedKanbans
	 * @param {} newEventRecordArray  New inserted event array
	 * @param {} eventStore
	 */
	realignEventSchedule2: function(fixedKanbans,newEventRecordArray,eventStore){
		for(var m=newEventRecordArray.length-1;m>=0;m--){
			var newEventRecord = newEventRecordArray[m];
			
			var newId = newEventRecord.id;
			var newResourceId = newEventRecord.data["ResourceId"]; //Machine NO.
	        var newStart = newEventRecord.data["StartDate"]; 
	        var newEnd = newEventRecord.data["EndDate"]; 
	        
			var currentEventArray = this.getCurrentRecordArray(newResourceId);//Get current event array
			
			var recordType = newEventRecord.get("EventType");//PD,SD,SPACE 
//			alert("recordType is:"+recordType);
			
			if(recordType=="SPACE"){//When inserting space
				var spaceDiff = newEnd - newStart; //Miliseconds
		        var count = currentEventArray.length;
		        for(var i=0;i<count;i++){
		        	var record = currentEventArray[i]
		        	var id = record.id;
		        	var resourceId = record.data["ResourceId"] //Machine NO.
		        	var start = record.data["StartDate"];
		        	var end = record.data["EndDate"];
		        	
		        	if(start>=newStart){
		        		this.addTimeDiff2Schedule2(record,spaceDiff);
		        	}
		        }
			}else {//When inserting Kanban	 
				//alert("before do addKanban...  the new added Kanban id is:"+newEventRecord.id);
				this.addKanban(newEventRecord);				
				
				//Core logic to realign Kanban
		        var deviateFlag = false;
		        var diff = 0;        
		        var count = currentEventArray.length;
		        for(var i=0;i<count;i++){
		        	var record = currentEventArray[i]
		        	var id = record.id;
		        	var resourceId = record.data["ResourceId"] //Machine NO.
		        	var start = record.data["StartDate"];
		        	var end = record.data["EndDate"];
		        	
		        	if(id==newId){
		        		continue;
		        	}
		        	
		        	if(!deviateFlag){
		//	        		alert((newStart>=start&&newStart<end)+"/"+(newStart<start&&newEnd>start));
				        	if(newStart>start&&newStart<end){ 
				        		deviateFlag = true;
				        		var diff1 = end-newStart;
			
				        		this.addTimeDiff2Schedule2(newEventRecord,diff1);
				        		
				        		if(i+2<count){
				        			var diff2 = newEventRecord.data["EndDate"] - currentEventArray[i+2].data["StartDate"];
				        			if(diff2>0){
					        			diff = diff2;
				        			}else {
//				        				alert(diff2+"/break");
				        				break;	        			
				        			}
				        		}
		//		        		alert("diff2:"+diff2);
				        	}else if(newStart<=start&&newEnd>start){
				        		deviateFlag = true
				        		diff = newEnd - start;
				        		this.addTimeDiff2Schedule2(record,diff);
				        	}
			        	}else {
			        		this.addTimeDiff2Schedule2(record,diff);
			        	}
			        }
			}
			
	        //Check if there still has any Kanban is overlapped with any Fix Kanban
			//alert("before do getAutoSplitKanban...");			
			var splitRecordArray = this.getAutoSplitKanban(fixedKanbans,newEventRecord);
			
			//If still has overlap Kanban, then continue to do advanced realignment
			if(splitRecordArray.length>0){
				this.realignEventSchedule2(fixedKanbans,splitRecordArray,eventStore);
			}
		}
	},
	
	//Realign events when event schedule is changed (Special realignment)
	realignEventSchedule3: function(fixedKanbans,newEventRecord){
		var newResourceId = newEventRecord.data["ResourceId"]; //Machine NO.
		var newId = newEventRecord.id;
    	var newStart = newEventRecord.data["StartDate"];
    	var newEnd = newEventRecord.data["EndDate"];		
		
        //Get current event array
		var currentEventArray = this.getCurrentRecordArray(newResourceId);		
		
//		alert("before do addKanban...  the new added Kanban id is:"+newEventRecord.id);
		this.addKanban(newEventRecord);				
		
		//Core logic to realign the Kanban
        var deviateFlag = false;
        var diff = 0;        
        var count = currentEventArray.length;
        for(var i=0;i<count;i++){
        	var record = currentEventArray[i]
        	var id = record.id;
        	var resourceId = record.data["ResourceId"] //Machine NO.
        	var start = record.data["StartDate"];
        	var end = record.data["EndDate"];
        	
        	if(id==newId){
        		continue;
        	}
        	
        	if(!deviateFlag){
//	        		alert((newStart>=start&&newStart<end)+"/"+(newStart<start&&newEnd>start));
		        	if(newStart>start&&newStart<end){ 
		        		deviateFlag = true;
		        		var diff1 = end-newStart;
	
		        		this.addTimeDiff2Schedule2(newEventRecord,diff1);
		        		
		        		if(i+2<count){
		        			var diff2 = newEventRecord.data["EndDate"] - currentEventArray[i+2].data["StartDate"];
		        			if(diff2>0){
			        			diff = diff2;
		        			}else {
//				        				alert(diff2+"/break");
		        				break;	        			
		        			}
		        		}
//		        		alert("diff2:"+diff2);
		        	}else if(newStart<=start&&newEnd>start){
		        		deviateFlag = true
		        		diff = newEnd - start;
		        		this.addTimeDiff2Schedule2(record,diff);
		        	}
	        	}else {
	        		this.addTimeDiff2Schedule2(record,diff);
	        	}
	        }
	        
	        //Move unfixed Kanban to be after the nearest fixed Kanban
	        var currentEventArray = this.getCurrentRecordArray(newResourceId); 
	        var deviateFlag = false;
			var diff = 0;
			for(var i=0; i<fixedKanbans.length;i++){
				var fixedRecord = fixedKanbans[i];
				var fixedRecordId = fixedRecord.id;
	        	var fixedStart = fixedRecord.data["StartDate"];
	        	var fixedEnd = fixedRecord.data["EndDate"];		
	        	
		        if(fixedStart>=newStart&&fixedStart<=newEnd){
// 					alert("Found Fixed Kanban title is:"+fixedRecord.data["Title"]);		        	
		        	
			        for(var k=0; k<currentEventArray.length; k++){
			        	var record = currentEventArray[k]
			        	var id = record.id;
			        	var recordType = record.get("EventType");//PD,SD
			        	var start = record.data["StartDate"];
			        	var end = record.data["EndDate"];
				        
				        if(id == fixedRecordId){
				        	continue;
				        }
				        
				        if(!deviateFlag){
				        	if(start>fixedStart&&start<fixedEnd){
//				        		var title = record.data["Title"];	
// 								alert("Found Record title is:"+title+ "  "+start+" "+fixedStart+" "+end+" "+fixedEnd);				        		
				        		
				        		deviateFlag = true
				        		diff = fixedEnd - start;
				        		this.addTimeDiff2Schedule2(record,diff);
				        	}
				        }else {
			        		this.addTimeDiff2Schedule2(record,diff);
			        	}
			        }
		        	break;
		        }        	
			}	        
	},	

	
	//Add time diff to start date & end date
	addTimeDiff2Schedule2: function (record,diff){
		var fixed = record.data["Fixed"];
		if(fixed=="TRUE"){
			return;
		}
		var diff = Math.round(diff/60000);  // Miliseconds to Minutes
		record.data["StartDate"] = Sch.util.Date.add(record.data["StartDate"],Sch.util.Date.MINUTE,diff);
		record.data["EndDate"] = Sch.util.Date.add(record.data["EndDate"],Sch.util.Date.MINUTE,diff);
		record.commit();
		record.dirty = true;
	},
	
	removeKanban : function(record){
//		alert("before removeKanban :"+record.data["Title"]);
		
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;
		scheduleView.eventStore.remove(record);		
		
		//Add this record to "removedEvents"
		this.recordRemovedEvent(record);		
		
//		alert("after removeKanban :"+record.data["Title"]);
	},
	
	addKanban : function(newEventRecord){
//		alert("before addKanban :"+newEventRecord.data["Title"]);
		
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;
    	newEventRecord.dirty = true;
    	scheduleView.eventStore.add(newEventRecord);
    	
//    	alert("after addKanban :"+newEventRecord.data["Title"]);
	},
	
	/**
	 * Get all unfixed event records
	 * @param {} newResourceId
	 * @return {}
	 */
	getCurrentRecordArray : function(newResourceId){
		var currentEventArray = new Array();
		
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;
		var eventStore = scheduleView.eventStore;
		
        //Sort event store by "StartDate" fisrt
		eventStore.sort("StartDate","ASC");		
		
		var currentEventArray = new Array();
        for(var i=0;i<eventStore.getCount();i++){
        	var record = eventStore.getAt(i);
        	var resourceId = record.data["ResourceId"] //Machine NO.
        	var fixed = record.data["Fixed"] //Fixed
			if(newResourceId==resourceId&&fixed!="TRUE"){
				currentEventArray.push(record);
			}
        }	
        
        return currentEventArray;
	},
	
	getFixedKanban : function(newEventRecord){
		var newResourceId = newEventRecord.get("ResourceId");
		var newStartDate = newEventRecord.get("StartDate");
		
		var fixedKanban = new Array();
		
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;
		var eventStore = scheduleView.eventStore;//Event store
		
        //Sort event store by "StartDate" fisrt
		eventStore.sort("StartDate","ASC");		
		
        for(var i=0;i<eventStore.getCount();i++){
        	var record = eventStore.getAt(i);
        	var resourceId = record.data["ResourceId"]; //Machine NO.
        	var fixed = record.data["Fixed"]; 
        	
			if(resourceId==newResourceId&&fixed=="TRUE"){
				fixedKanban.push(record);
			}
        }
        
        return fixedKanban;
	},
	
	/**
	 * Get fixed time spans (take fixed Kanban as fixed time span)
	 * @param {} newEventRecord
	 * @return {}
	 */
	getFixedTimeSpans : function(newEventRecord){
		var unavailableTimeSpanStore = Ext.create('Sch.data.EventStore', {
	        	model : 'Event'
	   		});	 
		
		var newResourceId = newEventRecord.get("ResourceId");
		var newStartDate = newEventRecord.get("StartDate");
		
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;
		var eventStore = scheduleView.eventStore;//Event store
		
		//Step 1: Get unavailable time spans
		var availabilityStotre = Ext.getCmp("ProductionSchedulerGrid").resourceZones; //Avaialable time span store
		availabilityStotre.sort("StartDate","ASC");
		var lastStartDate;
		var lastEndDate;
		var unavailabelTimSpanStart;
		var unavailabelTimSpanEnd;
		var count = 0;

		for(var i=0;i<availabilityStotre.getCount();i++){
			var record = availabilityStotre.getAt(i);
			
			var resourceId = record.data["ResourceId"]; //Machine NO.
			var start = record.get("StartDate");
			var end = record.get("EndDate");
			
			if(resourceId!=newResourceId){
				continue;
			}
			
			unavailabelTimSpanStart = "";
			unavailabelTimSpanEnd = "";
			if(count==0){
				var startYear = start.getFullYear();
				var startMonth = start.getMonth();
				var startDate = start.getDate();
				if(start>new Date(startYear,startMonth,startDate,0,0,0)){
					unavailabelTimSpanStart = new Date(startYear,startMonth,startDate,0,0,0);
					unavailabelTimSpanEnd = start;
				}
			}else {
				unavailabelTimSpanStart = lastEndDate;
				unavailabelTimSpanEnd = start;				
			}
			
			if(unavailabelTimSpanStart!=""){
				var unavailableTimeSpanRecord = new Event({
	            	EventType : "UNAVAILABLETIMESPAN", 
	                StartDate : unavailabelTimSpanStart,
	                EndDate : unavailabelTimSpanEnd,
	                ResourceId : newResourceId
	            });			
				unavailableTimeSpanStore.add(unavailableTimeSpanRecord);
			}
			
			lastStartDate = start;
			lastEndDate = end;
			
			count++;
		}
		//Add last unvailable time span to "unavailableTimeSpanStore"
		if(lastEndDate){
			var startYear = lastEndDate.getFullYear();
			var startMonth = lastEndDate.getMonth();
			var startDate = lastEndDate.getDate();
			if(lastEndDate<new Date(startYear,startMonth,startDate,24,0,0)){
				unavailabelTimSpanStart = lastEndDate;
				unavailabelTimSpanEnd = new Date(startYear,startMonth,startDate,24,0,0);
				
				var unavailableTimeSpanRecord = new Event({
		        	EventType : "UNAVAILABLETIMESPAN", 
		            StartDate : unavailabelTimSpanStart,
		            EndDate : unavailabelTimSpanEnd,
		            ResourceId : newResourceId
		        });			
				unavailableTimeSpanStore.add(unavailableTimeSpanRecord);					
			}
		}
		
		
		//Step 2: Get fixed Kanban
        //Sort event store by "StartDate" fisrt
		eventStore.sort("StartDate","ASC");		
        for(var i=0;i<eventStore.getCount();i++){
        	var record = eventStore.getAt(i);
        	var resourceId = record.data["ResourceId"]; //Machine NO.
        	var fixed = record.data["Fixed"]; 
        	
			if(resourceId==newResourceId&&fixed=="TRUE"){
				unavailableTimeSpanStore.add(record);
			}
        }
        
        //Combine fixed timespans
        this.combineOverlapUnavailableTimespan(unavailableTimeSpanStore);
        
//        for(var i=0;i<unavailableTimeSpanStore.getCount();i++){
//        	alert("final====="+unavailableTimeSpanRecord.id+" "+unavailableTimeSpanStore.getAt(i).data["StartDate"]+" "+unavailableTimeSpanStore.getAt(i).data["EndDate"]);	
//        }
        
        return unavailableTimeSpanStore.data.items;
	},	
	
	combineOverlapUnavailableTimespan : function(unavailableTimeSpanStore){
		var uResourceId;
        var uStart;
        var uEnd;
        var fStart;
        var fEnd;
        var newStart;
        var newEnd;
        var overlapFlag;
        
//        alert("start combineOverlapUnavailableTimespan..... unavailableTimeSpanStore count is:"+unavailableTimeSpanStore.getCount());
        
        //Sort event store by "StartDate" fisrt
		unavailableTimeSpanStore.sort("StartDate","ASC");	        
        for(var i=0;i<unavailableTimeSpanStore.getCount();i++){
        	var unavailableTimeSpanRecord = unavailableTimeSpanStore.getAt(i);
        	uResourceId = unavailableTimeSpanRecord.get("ResourceId");
        	uStart = unavailableTimeSpanRecord.data["StartDate"];
        	uEnd = unavailableTimeSpanRecord.data["EndDate"];
        	
        	overlapFlag = false;
        	for(var k=i+1;k<unavailableTimeSpanStore.getCount();k++){
        		var record = unavailableTimeSpanStore.getAt(k);
	        	fStart = record.data["StartDate"];
	        	fEnd = record.data["EndDate"];
	        	
//	        	alert(uStart+"/"+uEnd+"   --   "+fStart+"/"+fEnd);
        		
	        	if(fStart<uStart&&fEnd>=uStart&&fEnd<=uEnd){
//	        		alert("1");
	        		overlapFlag = true;
	        		newStart = fStart;
	        		newEnd = uEnd;
	        	}else if(fStart>=uStart&&fStart<=uEnd&&fEnd>uEnd){
//	        		alert("2");
	        		overlapFlag = true;
	        		newStart = uStart;
	        		newEnd = fEnd;	        		
	        	}else if(fStart<uStart&&fEnd>uEnd){
//	        		alert("3");
	        		overlapFlag = true;
	        		newStart = fStart;
	        		newEnd = fEnd;	 	        		
	        	}else if(fStart>=uStart&&fEnd<=uEnd){
//	        		alert("4");
	        		overlapFlag = true;
	        		newStart = uStart;
	        		newEnd = uEnd;		        		
	        	}
	        	
	        	if(overlapFlag){
//	        		alert("new unavailable time span:"+newStart+" "+newEnd);
	        		unavailableTimeSpanStore.remove(record);
					unavailableTimeSpanStore.remove(unavailableTimeSpanRecord);
		        	
					var unavailableTimeSpanRecord = new Event({
			        	EventType : "UNAVAILABLETIMESPAN", 
			            StartDate : newStart,
			            EndDate : newEnd,
			            ResourceId : uResourceId
			        });			
					unavailableTimeSpanStore.add(unavailableTimeSpanRecord);			        	
		        	
		        	this.combineOverlapUnavailableTimespan(unavailableTimeSpanStore);
	        	}
        	}
        }		
	},
	
	/**
	 * Get auto split event array (Split from the events which are overlap with the first overlap fixed Kanban)
	 * @param {} fixedKanbans
	 * @param {} newEventRecord
	 * @return {}
	 */
	getAutoSplitKanban : function(fixedKanbans,newEventRecord){
		var newResourceId = newEventRecord.data["ResourceId"];
		var startFrom = newEventRecord.data["StartDate"];
		
		//alert("new Event start from is:"+startFrom);
		
		var currentEventArray = this.getCurrentRecordArray(newResourceId);//Get current event array
		
        //Check if there is any Kanban is overlapped with any Fix Kanban
		var splitRecordArray = new Array();
		var splitFlag = false;
		for(var i=0; i<fixedKanbans.length;i++){
			var fixedRecord = fixedKanbans[i];
			var fixedRecordId = fixedRecord.id;
        	var fixedStart = fixedRecord.data["StartDate"];
        	var fixedEnd = fixedRecord.data["EndDate"];		
        	
	        if(fixedEnd<=startFrom){
	        	continue;
	        }        	
        	
//        	var title = fixedRecord.data["Title"];	
//	        alert("Fixed Kanban title is:"+title);
	        
	        for(var k=0; k<currentEventArray.length; k++){
	        	var record = currentEventArray[k]
	        	var id = record.id;
	        	var recordType = record.get("EventType");//PD,SD
	        	var start = record.data["StartDate"];
	        	var end = record.data["EndDate"];
	        	
//	        	var title = record.data["Title"];	
//		        alert("Record title is:"+title+ "  "+start+" "+fixedStart+" "+end+" "+fixedEnd);
		        
		        if(id == fixedRecordId){
		        	continue;
		        }
		        
	        	if(start<fixedStart&&end>fixedStart&&end<=fixedEnd){
	        		splitFlag = true;
	        		
//	        		alert("split type:1");
	        		//Add splitted Kanban
					this.splitKanban(splitRecordArray,1,fixedRecord,record);
	        	}else if(start>=fixedStart&&start<fixedEnd&&end>fixedEnd){
	        		splitFlag = true;
	        		
//	        		alert("split type:2");
	        		//Add space before to the splitRecordArray
					this.addSpaceEvent(1,splitRecordArray,fixedRecord,currentEventArray,k,record)
	        		
					//Add splitted Kanban
	        		this.splitKanban(splitRecordArray,2,fixedRecord,record);
	        	}else if(start<fixedStart&&end>fixedEnd){
	        		splitFlag = true;
	        		
//	        		alert("split type:3");
	        		//Add splitted Kanban
	        		this.splitKanban(splitRecordArray,3,fixedRecord,record);
	        		
	        		//Add space after to the splitRecordArray
					this.addSpaceEvent(2,splitRecordArray,fixedRecord,currentEventArray,k,record)		        		
	        	}else if(start>=fixedStart&&end<=fixedEnd){
	        		splitFlag = true;
	        		
//	        		alert("split type:4");
	        		//Add space before to the splitRecordArray
					this.addSpaceEvent(1,splitRecordArray,fixedRecord,currentEventArray,k,record)
					
					//Add splitted Kanban
	        		this.splitKanban(splitRecordArray,4,fixedRecord,record);
	        		
	        		//Add space after to the splitRecordArray
					this.addSpaceEvent(2,splitRecordArray,fixedRecord,currentEventArray,k,record)	        		
	        	}
	        }
	        
        	if(splitFlag){
        		return splitRecordArray;
        	}	        
		}
		
		return splitRecordArray;
	},
	
	/**
	 * 
	 * @param {} overlapType 
	 * 							1: start<=fixedStart&&end>fixedStart&&end<=fixedEnd  
	 * 							2: start>=fixedStart&&start<fixedEnd&&end>=fixedEnd
	 * 							3: start<fixedStart&&end>fixedEnd
	 * 							4: start>=fixedStart&&end<=fixedEnd
	 * @param {} fixedRecord
	 * @param {} newEventRecord
	 */
	splitKanban : function(splitRecordArray,overlapType,fixedRecord,overlapRecord){
//		alert("splitKanban:"+overlapRecord.data["Title"]);
		
		var splitRecord1;
		var splitRecord2;
		var splitRecord3;
		
    	var id = overlapRecord.id;
    	var recordType = overlapRecord.get("EventType");//PD,SD
    	var start = overlapRecord.data["StartDate"];
    	var end = overlapRecord.data["EndDate"];		
    	var duration = overlapRecord.get('Duration');
    	var originalID = overlapRecord.data["OriginalID"];
    	
//    	alert("Overlap record title is:"+overlapRecord.data["Title"]);
//    	alert("before orginal event id:"+originalID);
    	
    	if(Ext.isEmpty(originalID)){
    		originalID = id;
    	}
    	
//    	alert("after orginal event id:"+originalID);
    	
		var fixedRecordId = fixedRecord.id;
    	var fixedStart = fixedRecord.data["StartDate"];
    	var fixedEnd = fixedRecord.data["EndDate"];		    	
    	
		if(overlapType==1){//start<fixedStart&&end>fixedStart&&end<=fixedEnd
			var diff = end - start;
			var duration = Ext.Number.toFixed(diff/3600000,3); // Hours
			
			var diff1 = fixedStart-start; //Miliseconds
			var duration1 = Ext.Number.toFixed(diff1/3600000,3); //Hours			

			var diff2 = end-fixedStart; //Miliseconds
			var duration2 = Ext.Number.toFixed(diff2/3600000,3); //Hours			
			if(recordType=="PD"){
				var quantity = overlapRecord.get('Quantity');
				var quantity1 = Ext.Number.toFixed((duration1/duration)*quantity,3); 
				var quantity2 = Ext.Number.toFixed((quantity - quantity1),3);
				
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : start,
	                EndDate : fixedStart,
	                Duration : duration1,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                Quantity : quantity1,
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
	            
	            splitRecord2 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff2),
	                Duration : duration2,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                Quantity : quantity2,
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });	        
			}else {
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : start,
	                EndDate : fixedStart,
	                Duration : duration1,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
	            
	            splitRecord2 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff2),
	                Duration : duration2,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });	        			
			}
			
			splitRecordArray.push(splitRecord1);
			splitRecordArray.push(splitRecord2);
		}else if(overlapType==2){//start>=fixedStart&&start<fixedEnd&&end>fixedEnd
			var diff = end - start;
			var duration = Ext.Number.toFixed(diff/3600000,3); // Hours
			
			if(recordType=="PD"){
				var quantity = overlapRecord.get('Quantity');
				
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff),
	                Duration : duration,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                Quantity : quantity,
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
			}else {
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff),
	                Duration : duration,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });	        			
			}
			
			splitRecordArray.push(splitRecord1);
		}else if(overlapType==3){//start<fixedStart&&end>fixedEnd
			var diff = end - start;
			var duration = Ext.Number.toFixed(diff/3600000,3); // Hours
			
			var diff1 = fixedStart-start; //Miliseconds
			var duration1 = Ext.Number.toFixed(diff1/3600000,3); //Hours			

			var diff2 = end - fixedStart; //Miliseconds
			var duration2 = Ext.Number.toFixed(diff2/3600000,3); //Hours
			
			if(recordType=="PD"){
				var quantity = overlapRecord.get('Quantity');
				var quantity1 = Ext.Number.toFixed((duration1/duration)*quantity,3); 
				var quantity2 = Ext.Number.toFixed((quantity - quantity1),3);
				
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : start,
	                EndDate : fixedStart,
	                Duration : duration1,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                Quantity : quantity1,
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
	            
	            splitRecord2 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff2),
	                Duration : duration2,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                Quantity : quantity2,
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
			}else {
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : start,
	                EndDate : fixedStart,
	                Duration : duration1,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
	            
	            splitRecord2 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff2),
	                Duration : duration2,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
			}
			
			splitRecordArray.push(splitRecord1);
			splitRecordArray.push(splitRecord2);
		}else if(overlapType==4){//start>=fixedStart&&end<=fixedEnd
			var diff = end - start;
			var duration = Ext.Number.toFixed(diff/3600000,3); // Hours
			
			if(recordType=="PD"){
				var quantity = overlapRecord.get('Quantity');
				
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff),
	                Duration : duration,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                Quantity : quantity,
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });            
			}else {
	            splitRecord1 = new Event({
	            	EventType : overlapRecord.get("EventType"), 
	                Title : overlapRecord.get('Title'),
	                StartDate : fixedEnd,
	                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,diff),
	                Duration : duration,
	                ResourceId : overlapRecord.get('ResourceId'),
	                Item : overlapRecord.get('Item'),
	                ItemDescription : overlapRecord.get('ItemDescription'),
	                ShopOrder : overlapRecord.get('ShopOrder'),
	                op : overlapRecord.get('op'),
	                plant : overlapRecord.get('plant'),
	                WorkCenter : overlapRecord.get('WorkCenter'),
	                Cls : overlapRecord.get('Cls'),
	                Fixed : overlapRecord.get('Fixed'),
	                OriginalID : originalID
	            });
			}
			
			splitRecordArray.push(splitRecord1);
		}
		
		//Remove overlapped Kanban first
		this.removeKanban(overlapRecord);
	},
	
	/**
	 * 
	 * @param {} spaceType  1: Before, 2:After
	 * @param {} splitRecordArray
	 * @param {} fixedRecord
	 * @param {} currentEventArray
	 * @param {} k
	 * @param {} record
	 */
	addSpaceEvent : function(spaceType,splitRecordArray,fixedRecord,currentEventArray,k,record){
		var newSpaceEventStart=0;
		var newSpaceEventEnd=0;
	    var newSpaceEventDiff=0;
	    
    	var fixedStart = fixedRecord.data["StartDate"];
    	var fixedEnd = fixedRecord.data["EndDate"];		
    	
    	var originalID = record.data["OriginalID"];
    	var start = record.data["StartDate"];
    	var end = record.data["EndDate"];		   	
    	
//    	alert("spaceType is:"+spaceType+"  k is:"+k);
        
    	if(spaceType==1){
			if(k>0){
				var lastEventRecord = currentEventArray[k-1];
				var lastOriginalID = lastEventRecord.data["OriginalID"];
				var lastEventStart = lastEventRecord.data["StartDate"];
				var lastEventEnd = lastEventRecord.data["EndDate"];
				
//				alert("originalID & lastOriginalID:"+originalID+" "+lastOriginalID);
				
				if(Ext.isEmpty(originalID)||Ext.isEmpty(lastOriginalID)||originalID!=lastOriginalID){
					if(lastEventEnd>fixedStart){
						newSpaceEventStart = lastEventEnd;
						newSpaceEventEnd = start; 
					}else {
						newSpaceEventStart = fixedStart;
						newSpaceEventEnd = start; 
					}
				}
			}
    	}else if(spaceType==2){
    		if((k+1)<currentEventArray.length){
				var nextEventRecord = currentEventArray[k+1];
				var nextOriginalID = nextEventRecord.data["OriginalID"];
				var nextEventStart = nextEventRecord.data["StartDate"];
				var nextEventEnd = nextEventRecord.data["EndDate"];    	
				
//				alert("nextEventStart:"+nextEventStart+"  fixedEnd:"+fixedEnd);
				
//				alert("originalID & nextOriginalID:"+originalID+" "+nextOriginalID);
				
				if(Ext.isEmpty(originalID)||Ext.isEmpty(nextOriginalID)||originalID!=nextOriginalID){
					if(end>fixedEnd){
						newSpaceEventStart = fixedStart;
						newSpaceEventEnd = fixedEnd; 					
					}else{
						newSpaceEventStart = end;
						newSpaceEventEnd = fixedEnd;      				
					}
				}
    		}
    	}
    	
		newSpaceEventDiff = newSpaceEventEnd - newSpaceEventStart//Miliseconds
		
//		alert("newSpaceEventDiff is:"+newSpaceEventDiff);
		if(newSpaceEventDiff>0){
            newSpaceRecord = new Event({
            	EventType : "SPACE", 
                StartDate : fixedEnd,
                EndDate : Sch.util.Date.add(fixedEnd,Sch.util.Date.MILLI,newSpaceEventDiff),
                ResourceId : record.get('ResourceId')
            });
            
            splitRecordArray.push(newSpaceRecord);
		}    	
	},
	
	/**
	 * Combine Kanbans to a new Kanban which are splitted from the same Kanban 
	 * @param {} newEventRecord
	 */
	combineSplittedKanbans : function(newEventRecord){
		//TODO
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;
		var eventStore = scheduleView.eventStore;
		
		this.combineSplittedKanbansCore(eventStore,newEventRecord);
	},
	
	/**
	 * Core function to combine splitted Kanbans
	 * @param {} eventStore
	 * @param {} newEventRecord
	 */
	combineSplittedKanbansCore : function(eventStore,newEventRecord){
		var newEventId = newEventRecord.id;
		var newResourceId = newEventRecord.data["ResourceId"]; //Machine NO.
		var newStart = newEventRecord.data["StartDate"];
		var newEnd = newEventRecord.data["EndDate"];		
		
		var currentEventArray = this.getCurrentRecordArray(newResourceId);//Get current event array
		
		var lastOriginalId;
		var lastEndDate;
		var lastTitle;
		var combineFlag = false;
		var diff = 0;
		var splitRecord1;
		var splitRecord2;
        for(var i=0;i<currentEventArray.length;i++){
        	var record = currentEventArray[i];
        	var recordId = record.id;
        	var resourceId = record.data["ResourceId"]; //Machine NO.
        	var fixed = record.data["Fixed"]; 
        	var originalID = record.data["OriginalID"]; 
	    	var start = record.data["StartDate"];
	    	var end = record.data["EndDate"];	  
	    	
	    	var title = record.data["Title"];
        	
			if(end<=newStart){
				continue;
			}
			
			
			
			if(!combineFlag){
				if(!Ext.isEmpty(lastOriginalId)&&originalID ==lastOriginalId){
					combineFlag = true;
					diff = lastEndDate-start; //Miliseconds
					
//					alert("222:"+lastEndDate+"  "+start+" "+diff+" "+lastTitle+" "+title);
					
					this.addTimeDiff2Schedule2(record,diff);
					
					var splitRecord1 = currentEventArray[i-1];
					var splitRecord2 = record;
				}
			}else {
//				alert("44:"+diff);
				
				this.addTimeDiff2Schedule2(record,diff);
			}
			
			lastEndDate = end;
			lastOriginalId = originalID;
			lastTitle = title;
        }		
        
        //Combine splitted Kanban
        if(combineFlag){
        	var recordType = splitRecord1.get("EventType");//PD,SD
	    	var start = splitRecord1.data["StartDate"];
	    	var end = splitRecord2.data["EndDate"];	    
	    	var duration = Ext.Number.toFixed((end-start)/3600000,3); // Hours
	    	
//	    	alert("55:"+duration+" "+start+" "+end);
	        
			if(recordType=="PD"){
				var quantity1 = splitRecord1.get('Quantity');
				var quantity2 = splitRecord2.get('Quantity');
				var quantity = Ext.Number.toFixed((quantity1+quantity2),3);
				
		        var newCombineRecord = new Event({
		        	EventType : splitRecord1.get("EventType"), 
		            Title : splitRecord1.get('Title'),
		            StartDate : start,
		            EndDate : end,
		            Duration : duration,
		            ResourceId : splitRecord1.get('ResourceId'),
		            Item : splitRecord1.get('Item'),
		            ItemDescription : splitRecord1.get('ItemDescription'),
		            ShopOrder : splitRecord1.get('ShopOrder'),
		            op : splitRecord1.get('op'),
		            plant : splitRecord1.get('plant'),
		            Quantity : quantity,
		            WorkCenter : splitRecord1.get('WorkCenter'),
		            Cls : splitRecord1.get('Cls'),
		            Fixed : splitRecord1.get('Fixed'),
		            OriginalID : splitRecord1.get('OriginalID')
		        });
			}else {
		        var newCombineRecord = new Event({
		        	EventType : splitRecord1.get("EventType"), 
		            Title : splitRecord1.get('Title'),
		            StartDate : start,
		            EndDate : end,
		            Duration : duration,
		            ResourceId : splitRecord1.get('ResourceId'),
		            Item : splitRecord1.get('Item'),
		            ItemDescription : splitRecord1.get('ItemDescription'),
		            ShopOrder : splitRecord1.get('ShopOrder'),
		            op : splitRecord1.get('op'),
		            plant : splitRecord1.get('plant'),
		            WorkCenter : splitRecord1.get('WorkCenter'),
		            Cls : splitRecord1.get('Cls'),
		            Fixed : splitRecord1.get('Fixed'),
		            OriginalID : splitRecord1.get('OriginalID')
		        });				
			}
	        
//	        alert("before remove...");
	        
	        eventStore.remove(splitRecord1);
	        eventStore.remove(splitRecord2);
	        
//	        alert("after remove...");
	        
	        eventStore.add(newCombineRecord);
	        
//	        alert("after add...");	        
	        
	        this.combineSplittedKanbansCore(eventStore,newEventRecord);
        }
	},
	
	//////////////////////////////////////////////////////////
	/**
	 * Auto move events backward when an event is deleted, event end date is change to backward
	 * @param {} eventRecord
	 * @param {} diff
	 */
	autoMoveBackward : function(eventRecord,diff){
        //Sort event store by "StartDate" fisrt
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;
		var eventStore = scheduleView.eventStore;		
		eventStore.sort("StartDate","ASC");		
		
    	var eventRecordId = eventRecord.id;
    	var eventResourceId = eventRecord.data["ResourceId"]; //Machine NO.	
    	var eventStart = eventRecord.data["StartDate"];
    	var eventEnd = eventRecord.data["EndDate"];	    	
		
		var currentEventArray = new Array();
        for(var i=0;i<eventStore.getCount();i++){
        	var record = eventStore.getAt(i);
        	var resourceId = record.data["ResourceId"] //Machine NO.
	    	var start = record.data["StartDate"];
	    	var end = record.data["EndDate"];	        
//	    	alert(eventResourceId+"/"+start+"/"+eventEnd);
			if(eventResourceId==resourceId&&start>=eventEnd){
				this.addTimeDiff2Schedule2(record,diff);
			}
        }	
	},
	
	/**
	 * Find out the start date of the next nearest Kanban
	 * @param {} eventRecord
	 */
	getBackwardDiff : function(eventRecord){
		var diff = 0;
    	var eventRecordId = eventRecord.id;
    	var eventResourceId = eventRecord.data["ResourceId"]; //Machine NO.	
    	var eventStart = eventRecord.data["StartDate"];
    	var eventEnd = eventRecord.data["EndDate"];	 
    	
        //Sort event store by "StartDate" fisrt
		var scheduleView = Ext.getCmp("ProductionSchedulerGrid").view.normalView;    	
		var eventStore = scheduleView.eventStore;		
		eventStore.sort("StartDate","ASC");		
        for(var i=0;i<eventStore.getCount();i++){
        	var record = eventStore.getAt(i);
        	var resourceId = record.data["ResourceId"] //Machine NO.
	    	var start = record.data["StartDate"];
	    	var end = record.data["EndDate"];	        
			if(eventResourceId==resourceId&&start>=eventEnd){	
				diff = eventStart - start;
				break;
			}
        }	
        
        return diff;
	}
		
	
};
