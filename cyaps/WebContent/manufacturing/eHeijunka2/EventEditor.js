Ext.define('EventEditor',  {
    extend : "Sch.plugin.EventEditor",
    height          : 190,
    width           : 350,
            
    initComponent : function() {
        Ext.apply(this, {
        	durationConfig  : {
        		width : 65,
        		decimalPrecision : 3
        	},
        	
            timeConfig      : {
                minValue    : '00:00',
                maxValue    : '24:00'
            },
            
            durationUnit    : Sch.util.Date.HOUR,
            durationText    : 'H',
            
            buttonAlign     : 'center',
            fieldsPanelConfig : {
                xtype       : 'container',
                layout      : 'card',
                items       : [
                    {   
                    	EventType   : 'SD', //Shut Down
                        xtype       : 'form',
                        style       : 'background:#fff',
                        cls         : 'editorpanel',
                        border      : false,
                        padding     : 10,
                        layout      : {
                            type    : 'vbox',
                            align   : 'stretch'
                        },
                        items       : [
                            this.titleField = new Ext.form.TextField({
                                name        : 'Title',
                                //fieldLabel  : 'Title',
                                fieldLabel  : '备注',
                                labelAlign  : 'left',
								labelWidth : 60,
                                anchor: '100%'
                            }),
                            
                            this.colorPickerField = new ColorPicker({
                            	id : "colorPicker",
								name : "Color",
								fieldLabel: '颜色',
								labelAlign : 'left',
								labelWidth : 60,
								anchor: '100%'
							}),
							
							this.fixCheckBoxField = new Ext.form.Checkbox({
								name : 'Fixed',
					            //fieldLabel: 'Fixed?',
					            fieldLabel: '钉',
					            labelAlign: 'left',
					            labelWidth : 60,
					            checked   : false
							})
                        ]                    
                    },
                    {   
                    	EventType   : 'PD', //Production
                        xtype       : 'form',
                        style       : 'background:#fff',
                        cls         : 'editorpanel',
                        border      : false,
                        padding     : 10,
                        layout      : {
                            type    : 'vbox',
                            align   : 'stretch'
                        },
                        items       : [
                            this.titleField = new Ext.form.TextField({
                                name        : 'Title',
                                //fieldLabel  : 'Title',
                                fieldLabel  : '产品',
                                labelAlign  : 'left',
                                labelWidth : 60,
                                anchor: '100%'
                            }),
                    
                            this.quantityField = new Ext.form.NumberField({
                                labelAlign  : 'left',
                                labelWidth : 60,
                                name        : 'Quantity',
                                //fieldLabel  : 'Quantity',
                                fieldLabel  : '数量',
								allowBlank : false,
								regex : /^0|[1-9]\d*$/                                
                            }),
                            
                            this.colorPickerField = new ColorPicker({
								name : "Color",
								fieldLabel: '颜色',
								labelAlign : 'left',
								labelWidth : 60,
								anchor: '100%'
							}),
							
							this.fixCheckBoxField = new Ext.form.Checkbox({
								name : 'Fixed',
					            //fieldLabel: 'Fixed?',
					            fieldLabel: '钉？',
								labelAlign : 'left',
								labelWidth : 60,
					            checked   : false
							})							
                        ]                    
                    }                    
                ]
            }
        });

        this.on('expand', this.titleField.focus, this.titleField,this.colorPickerField,this.fixCheckBoxField);
        
        this.callParent(arguments);
    }
    
//    show : function(eventRecord) {
//       var resourceId = eventRecord.getResourceId();
//       //Load the image of the resource
//       this.img.setSrc(this.schedulerView.resourceStore.getById(resourceId).get('ImgUrl'));
//    	
//        this.callParent(arguments);
//    }
});