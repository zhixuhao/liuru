Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');
Ext.Loader.setPath('Ext.ux', 'ux');

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
        {name: 'OrginalEndDateInfo', type:'string', mapping: 'OrginalEndDateInfo'}
    ]
});	

var myMask;

Ext.onReady(function() {	
	Ext.QuickTips.init();
	App.Scheduler.init();
	
	function refreshX(){
		var leftStart = Ext.getCmp("ProductionSchedulerGrid").view.normalView.el.dom.scrollLeft;
		var leftEnd = Ext.getCmp("ProductionSchedulerGrid").view.normalView.el.dom.scrollLeftMax;				
		Ext.getCmp("ProductionSchedulerGrid").view.normalView.scrollBy(100,0);  //Horizon scroll		
	};
	
	function refreshY(){
		var topStart = Ext.getCmp("ProductionSchedulerGrid").view.normalView.el.dom.scrollTop;
		var topEnd = Ext.getCmp("ProductionSchedulerGrid").view.normalView.el.dom.scrollTopMax;
		Ext.getCmp("ProductionSchedulerGrid").view.normalView.scrollBy(0,100);  // Vertical scroll
	};	
	
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
	            		fieldLabel : 'Work Center',
	            		height : 25,
	            		style : 'font-size:18px;',
	            		labelWidth : 120,
	            		labelAlign : 'right',
	            		labelStyle : 'font-size:18px;',
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
	            		text : 'View',
	            		height : 25,
	            		width : 60,
	            		style : 'text-align:center',
	            		handler : function(button,event){
	            			if(formPanel.getForm().isValid()){
	                			App.Scheduler.scheduler.setReadOnly(true); //Set schdeuler to be readonly

	            				var formData = formPanel.getForm().getValues();
	                			var workCenter = formData.workCenter;
	                			App.Scheduler.WorkCenter = workCenter; //global work center
	                			
								var data = new Object();
								data.workCenter = App.Scheduler.WorkCenter;

	                			//Load resource availability time spans
	                			App.Scheduler.scheduler.loadResourceAvailabilityList();
								
	                			//Load resource store
								App.Scheduler.scheduler.loadResourceStore();								
								
								//Load event store
								App.Scheduler.scheduler.loadEventStore();	
								
								
								
								Ext.TaskManager.start({
									run:function(){
										if(Ext.getCmp("ProductionSchedulerGrid")){
											var formPanel = Ext.getCmp("ProductionScheduleFormPanel");	
											if(formPanel.getForm().isValid()){
								    			App.Scheduler.scheduler.setReadOnly(true); //Set schdeuler to be readonly
								
												var formData = formPanel.getForm().getValues();
								    			var workCenter = formData.workCenter;
								    			App.Scheduler.WorkCenter = workCenter; //global work center
								    			
												var data = new Object();
												data.workCenter = App.Scheduler.WorkCenter;
								
								    			//Load resource availability time spans
								    			App.Scheduler.scheduler.loadResourceAvailabilityList();
												
								    			//Load resource store
												App.Scheduler.scheduler.loadResourceStore();								
												
												//Load event store
												App.Scheduler.scheduler.loadEventStore();	
											}				
										}
									},
									interval :  1800000
								});		
								
								Ext.TaskManager.start({
									run : function(){
										if(Ext.getCmp("ProductionSchedulerGrid")){
											var rowHeightStr = $( "tr.x-grid-row")[0][Name='style'].height;
											var index = rowHeightStr.indexOf("px");
											var rowHeight = rowHeightStr.substring(0,index);
											
											var viewHeight = Ext.getCmp("ProductionSchedulerGrid").view.normalGrid.getHeight();
											
											var viewRows = parseInt(viewHeight/rowHeight); // count of rows which can be displayed in one screen
											var offset = viewRows*rowHeight;										
										
										
											var scrollHeight = Ext.getCmp("ProductionSchedulerGrid").view.normalView.el.dom.scrollHeight;
											var clientHeight = Ext.getCmp("ProductionSchedulerGrid").view.normalView.el.dom.clientHeight;
											var scrollTop = Ext.getCmp("ProductionSchedulerGrid").view.normalView.el.dom.scrollTop;
											
											if(scrollTop<(scrollHeight-clientHeight)){
												Ext.getCmp("ProductionSchedulerGrid").view.normalView.scrollBy(0,offset);  // Vertical scroll															
											}else {
												Ext.getCmp("ProductionSchedulerGrid").view.normalView.scrollBy(0,(clientHeight-scrollHeight));  // Vertical scroll	
											}
										}
									},
									
									interval : 30000
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
		
		var contentPanel = Ext.create('Ext.panel.Panel', {
		    title: 'Content Panel',
		    header : false,
		    region : 'center',
		    layout : 'border',
		    items: [scheduler]
		});		
        
		new Ext.Viewport({
		    layout: 'border',
		    items: [
            	formPanel,
            	contentPanel		    
		    ]
		});        
        
    },

	onEventContextMenu: function (s, rec, e) {
        e.stopEvent();
		return false;
    },

	
    beforeTooltipShow: function (s, r) {
		//TODO
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
        	title 		: 'Production Scheduling',
        	header 		: true,
            height      : 400,
            width       : 900,
            border      : true,
            region 		: 'center',
            viewPreset  : 'hourAndDay',
			rowHeight 	: 120,
			border		: true,
			allowOverlap: true,
			split 		: true,
            columnLines : true,
            rowLines 	: true,			

			resourceStore   : resourceStore,
			resourceZones 	: availabilityStore,
			eventStore      : eventStore,
			
            columns     : [
               { header : 'Machine', sortable : true, width : 130, dataIndex : 'Name' }
            ],			
			
			eventBodyTemplate: new Ext.XTemplate('<tpl if="EventType == \'PD\'">', 
													'<div class = "sch-event-header">',
														'<tpl if="Fixed == \'TRUE\'">',
														'<img src="images/red-pin.png" width="20" height="20"/>',
														'</tpl>',
													'</div>',
													'<div class = "sch-event-header">SO#: {ShopOrder}</div>',
													'<div class = "sch-event-header">SKU: {Item}</div>',
													'<div class = "sch-event-header">Description: {ItemDescription}</div>',
													'<div class = "sch-event-header">Qty: {Quantity}</div>',
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
					'	<p><b></b>{OrginalEndDateInfo}&nbsp;&nbsp;{Title}</p><p><b>SO#: </b>{ShopOrder}</p><p><b>Item: </b>{Item}</p><p><b>Description: </b>{ItemDescription}</p><p><b>Priority: </b>{Priority}</p><p><b>Qty: </b>{Quantity}</p><p><b>From: </b>{[Ext.Date.format(values.StartDate, "Y-m-d H:i:s")]}</p><p><b>To: </b>{[Ext.Date.format(values.EndDate, "Y-m-d H:i:s")]}</p><p><b>Due Time: </b>{[Ext.Date.format(values.DueDate, "Y-m-d H:i:s")]}</p>',
					'	<p><b>Parent View: </b>{ParentViewStr}</p>',
					'	<p><b>Child View: </b>{ChildViewStr}</p>',
					'</div>',
            	'</tpl>',
            	'<tpl if="EventType == \'SD\'">',
					'<div><p><b>Title: </b>{Title}</p><p><b>From: </b>{[Ext.Date.format(values.StartDate, "Y-m-d H:i:s")]}</p><p><b>To: </b>{[Ext.Date.format(values.EndDate, "Y-m-d H:i:s")]}</p></div>',
            	'</tpl>'
            ).compile(),	
            
			plugins: [
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
		            width : 160,
		            layout: 'hbox',
		            items: [
		                {
		                    boxLabel  : 'Time',
		                    name      : 'sizeType',
		                    inputValue: 't',
		                    style : 'font-size:18px;',
		                    checked   : true
		                }, {
		                    boxLabel  : 'Machine',
		                    name      : 'sizeType',
		                    style : 'font-size:18px;',
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
                    			Ext.getCmp("col-slider").setMinValue(120);
                    			Ext.getCmp("col-slider").setMaxValue(200);
                    			var rowHeight = App.Scheduler.RowHeight;
                    			if(Ext.isEmpty(rowHeight)){
                    				Ext.getCmp("col-slider").setValue(120);
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
                     		}                     		
                      	}     
                 	}	            	
	            },
                {
                    text : 'Hours',
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
                    text : 'Days',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    iconCls : 'icon-calendar',
                    handler : function() {
                    	var now = new Date();
                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
                    	var end = Ext.Date.add(start,Ext.Date.DAY,7);                    	
                        sched.switchViewPreset('dayAndWeek', start, end);                      
                    }
                },
                {
                    text : 'Weeks',
                    toggleGroup : 'presets',
                    enableToggle : true,
                    iconCls : 'icon-calendar',
                    handler : function() {
                    	var now = new Date();
                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
                    	var end = Ext.Date.add(start,Ext.Date.DAY,21);                         	
                        sched.switchViewPreset('weekAndMonth',start,end);                        
                    }
                }
//                ,
//                '->',
//                {
//                    text : 'Day and night shift',
//                    enableToggle : true,
//                    toggleGroup : 'presets',
//                    iconCls : 'icon-calendar',
//                    handler : function() {
//                    	var start = sched.getStart();
//                    	var end = sched.getEnd();               	
//                        sched.switchViewPreset('dayNightShift', start, end);
//                    }
//                },
//                {
//                    enableToggle: true,
//                    text: 'Select Date...',
//                    toggleGroup: 'presets',
//                    iconCls : 'icon-calendar',
//                    scope : this,
//                    menu : Ext.create('Ext.menu.DatePicker', {
//                        handler: function(dp, date){
//                            var viewPreset = Ext.getCmp("ProductionSchedulerGrid").viewPreset;
//	                    	var now = date;
//                            if(viewPreset=="hourAndDay"){
//		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
//		                    	var end = Ext.Date.add(start,Ext.Date.DAY,2);     
//		                    	sched.switchViewPreset('hourAndDay',start, end);
//                            }else if(viewPreset=="dayAndWeek"){
//		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
//		                    	var end = Ext.Date.add(start,Ext.Date.DAY,7);                    	
//		                        sched.switchViewPreset('dayAndWeek', start, end); 
//                            }else if(viewPreset=="weekAndMonth"){
//		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
//		                    	var end = Ext.Date.add(start,Ext.Date.DAY,21);                         	
//		                        sched.switchViewPreset('weekAndMonth',start,end);                            
//                            }else {
//		                    	var start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0);
//		                    	var end = Ext.Date.add(start,Ext.Date.DAY,1);     
//		                    	sched.switchViewPreset('hourAndDay',start, end);                           	
//                            }
//                        },
//                        scope : this
//                    })
//                }              
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
			}    
        });
        
        App.Scheduler.scheduler = sched;
        sched.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, 1);
		return sched;
    }	
};
