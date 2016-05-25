Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.Date.*'
]); 
    
Ext.Loader.setConfig({enabled:true});       
        
Ext.onReady(function(){

    // HtmlEditor需要这个
    Ext.QuickTips.init();
   
       var conSelection = {
        id: 'conSelection',
        xtype: 'container',
        layout: 'column',
        //margin:'0 0 10',
        items:[{
          xtype: 'fieldset',
          columnWidth:.25,
          height: 150,
          title: '导入数据选项',
          layout: 'anchor',
          defaults: {anchor:'100%'},
          style: {marginLeft:'10px'},
          items: [{
            xtype: 'checkboxgroup',
            hideLabels: true,
            columns: 2,
            vertical: true,
            //style:{marginBottom:'29px'},
            items: [
              {id:'cbox_oh',boxLabel:'库存',name:'parm_oh',uncheckedValue:" ",inputValue:'Y',checked:false},
              {id:'cbox_so',boxLabel:'生产工单',name:'parm_so',uncheckedValue:" ",inputValue:'Y',checked:false},
              {id:'cbox_po',boxLabel:'采购订单',name:'parm_po',uncheckedValue:" ",inputValue:'Y',checked:false},
              {id:'cbox_pl',boxLabel:'计划订单',name:'parm_pl',uncheckedValue:" ",inputValue:'Y',checked:false,disabled:true},
              {id:'cbox_itm',boxLabel:'货号主数据',name:'parm_itm',uncheckedValue:" ",inputValue:'Y',checked:false},
              {id:'cbox_rtn',boxLabel:'工艺路线主数据',name:'parm_rtn',uncheckedValue:" ",inputValue:'Y',checked:false,disabled:true},
              {id:'cbox_bom',boxLabel:'BOM主数据',name:'parm_bom',uncheckedValue:" ",inputValue:'Y',checked:false,disabled:true}
            ]             
          }]
        }]
    };

    //selection panel
    var fpSelection = Ext.create('Ext.FormPanel',{
        labelAlign: 'right',
        labelWidth: 80,
        buttonAlign: 'right',
        height: 250,
        title: '数据导入',
        frame: true,
        items: [conSelection],
        buttons: [{
            text: '导入',
            listeners: {
              "click": function(){                
                
            	var now = new Date();
            	  
                if(fpSelection.getForm().isValid()){
                  
                  var formData = fpSelection.getForm().getValues();
                  var parm = new Object();
                  
                  //import inventory
                  if(formData.parm_oh=='Y') {
                  
                      parm.parm_oh = formData.parm_oh;
                      now = new Date();
                      importLog = Ext.getCmp('txtLog').value;
                      if (importLog !='') {
                        importLog = importLog + '库存数据更新中... @' + now.toLocaleString() + '\n';
                      } else {
                        importLog = '库存数据更新中... @' + now.toLocaleString() + '\n';
                      }                                            
                      Ext.getCmp('txtLog').setValue(importLog);
                      
                      Ext.getCmp('cbox_oh').setDisabled(true);
                      
                      //alert message
                      var myMask = new Ext.LoadMask(Ext.getBody(), {
                    	  msg : "数据正在下载中，请稍候..."
                      });
                      myMask.show();
                      
                      //call java import inventory
                      ImportDataService.importInv(parm,function(flag){
                    	  if (flag == true) {
                    		  now = new Date();
                    		  importLog = Ext.getCmp('txtLog').value;
                              if (importLog !='') {
                                importLog = importLog + '库存数据更新结束. @' + now.toLocaleString() + '\n';
                              } else {
                                importLog = '库存数据更新结束. @' + now.toLocaleString() + '\n';
                              }
                              Ext.getCmp('txtLog').setValue(importLog); 
                    	  }
                      });
                      
                      myMask.hide();
                                                    
                  }
                  
                  //import shop order
                  if(formData.parm_so=='Y') {
                  
                	  parm.parm_so = formData.parm_so;
                      
                	  now = new Date();
                      importLog = Ext.getCmp('txtLog').value;
                      if (importLog !='') {
                        importLog = importLog + '生产工单数据更新中... @' + now.toLocaleString() + '\n';
                      } else {
                        importLog = '生产工单数据更新中... @' + now.toLocaleString() + '\n';
                      }                                            
                      Ext.getCmp('txtLog').setValue(importLog);
                      
                      Ext.getCmp('cbox_so').setDisabled(true);
                      
                      //alert message
                      var myMask = new Ext.LoadMask(Ext.getBody(), {
                    	  msg : "数据正在下载中，请稍候..."
                      });
                      myMask.show();
                      
                      //call java import s/o header
                      ImportDataService.importSord(parm, function(ordflag){
                    	  
                    	  if(ordflag == true){
                    		  
                    		  now = new Date();
                    		  importLog = Ext.getCmp('txtLog').value;
                              if (importLog !='') {
                                importLog = importLog + '生产工单主数据更新结束. @' + now.toLocaleString() + '\n';
                              } else {
                                importLog = '生产工单主数据更新结束. @' + now.toLocaleString() + '\n';
                              }
                              Ext.getCmp('txtLog').setValue(importLog);
                              
                              //call java import s/o detail
                              ImportDataService.importSordDtl(parm, function(dtlflag){
                            	  if(dtlflag == true){
                            		  now = new Date();
                            		  importLog = Ext.getCmp('txtLog').value;
                                      if (importLog !='') {
                                        importLog = importLog + '生产工明细主数据更新结束. @' + now.toLocaleString() + '\n';
                                      } else {
                                        importLog = '生产工单明细数据更新结束. @' + now.toLocaleString() + '\n';
                                      }
                                      Ext.getCmp('txtLog').setValue(importLog);
                            	  }
                              });
                    	  }
                        
                      });
                      
                      
                      
                      myMask.hide();
                                                               
                  }
                  
                  //import purchase order
                  if(formData.parm_po=='Y') {
                  
                      parm.parm_po = formData.parm_po;
                      
                      now = new Date();
                      importLog = Ext.getCmp('txtLog').value;
                      if (importLog !='') {
                        importLog = importLog + '采购订单数据更新中... @' + now.toLocaleString() + '\n';
                      } else {
                        importLog = '采购订单数据更新中... @' + now.toLocaleString() + '\n';
                      }                                            
                      Ext.getCmp('txtLog').setValue(importLog);
                      
                      Ext.getCmp('cbox_po').setDisabled(true);
                      
                      //alert message
                      var myMask = new Ext.LoadMask(Ext.getBody(), {
                    	  msg : "数据正在下载中，请稍候..."
                      });
                      myMask.show();
                      
                    //call java import po
                      ImportDataService.importHpo(parm, function(flag){
                    	  if (flag == true) {
                    		  now = new Date();	
                    		  importLog = Ext.getCmp('txtLog').value;
                              if (importLog !='') {
                                importLog = importLog + '采购订单数据更新结束. @' + now.toLocaleString() + '\n';
                              } else {
                                importLog = '采购订单数据更新结束. @' + now.toLocaleString() + '\n';
                              }
                              Ext.getCmp('txtLog').setValue(importLog);
                    		  
                    	  }
                      });
                      
                      myMask.hide();
                      
                  }
                  
                  //import item master
                  if(formData.parm_itm=='Y') {
                  
                      parm.parm_itm = formData.parm_itm;
                      
                      now = new Date();
                      importLog = Ext.getCmp('txtLog').value;
                      if (importLog !='') {
                        importLog = importLog + '货号主数据更新中... @' + now.toLocaleString() + '\n';
                      } else {
                        importLog = '货号主数据更新中... @' + now.toLocaleString() + '\n';
                      }                                            
                      Ext.getCmp('txtLog').setValue(importLog);
                      
                      Ext.getCmp('cbox_itm').setDisabled(true);
                      
                      //alert message
                      var myMask = new Ext.LoadMask(Ext.getBody(), {
                    	  msg : "数据正在下载中，请稍候..."
                      });
                      myMask.show();
                      
                      //call java import item
                      ImportDataService.importItemMaster(parm, function(flag){
                    	  
                    	  if(flag == true){
                    		  now = new Date();
                    		  importLog = Ext.getCmp('txtLog').value;
                              if (importLog !='') {
                                importLog = importLog + '货号主数据更新结束. @' + now.toLocaleString() + '\n';
                              } else {
                                importLog = '货号主数据更新结束. @' + now.toLocaleString() + '\n';
                              }
                              Ext.getCmp('txtLog').setValue(importLog); 
                    		  
                    	  }
                      });
                      
                      myMask.hide();
                        
                  }                  	  								            
                }              
              }
            }
        }]
    });
    
    //log panel
    var fpLog = Ext.create('Ext.FormPanel',{
        labelAlign: 'right',
        labelWidth: 80,
        layout:{
          type:'vbox',
          align: 'stretch'
        },
        height: 330,
        title: '导入日志',
        frame: true,
        items: [{
          id: 'txtLog',
          xtype: 'textarea',
          fieldLabel: 'Message text',
          hideLabel: true,
          disabled: true,
          value: '',
          name: 'msg',
          style: 'margin:0', // Remove default margin
          flex: 1  // Take up all *remaining* vertical space
        }]
    });    
   
    //Layout
    var viewport = new Ext.Viewport({
        el: 'viewport',
        renderTo: Ext.getBody(),
        maxWidth: 1300,
        height: 600,
        layout:'anchor',
        defaults: {anchor:'100%'},
        items:[fpSelection,fpLog]
    });
    
//    viewport.render();
//    viewport.render("form");

});