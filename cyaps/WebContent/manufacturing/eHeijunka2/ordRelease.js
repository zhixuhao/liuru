Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.Date.*'
]); 
    
Ext.Loader.setConfig({enabled:true}); 
       
Ext.define('Ord',{
    extend: 'Ext.data.Model',
    fields: [
        {name: 'plant'},
        {name: 'ord_type'},
        {name: 'ord_num'},
        {name: 'ord_op'},
        {name: 'ord_row'},
        {name: 'item'},
        {name: 'item_desc'},
        {name: 'req_qty'},
        {name: 'orlsdt'},
        {name: 'sup_duedt'},
        {name: 'sup_ordtype'},
        {name: 'sup_ordnum'},
        {name: 'sup_ordop'},
        {name: 'sup_ordrow'},
        {name: 'wrkc'}
    ]
});  

Ext.define('OrdDtl',{
    extend: 'Ext.data.Model',
    fields: [
        {name: 'plant'},
        {name: 'ord_type'},
        {name: 'ord_num'},
        {name: 'item'},
        {name: 'item_desc'},
        {name: 'prnt'},
        {name: 'req_qty'},
        {name: 'dem_rlsdt'},
        {name: 'sup_plant'},
        {name: 'sup_ordtype'},
        {name: 'sup_ordnum'},
        {name: 'sup_duedt'},
        {name: 'gap_hrs'}
    ]
});      
        
Ext.onReady(function(){

    // HtmlEditor需要这个
    Ext.QuickTips.init();
   
       var cSearch = {
        id: 'cSearch',
        xtype: 'container',
        layout: 'column',
        //margin:'0 0 10',
        items:[{
          xtype: 'fieldset',
          columnWidth:.3,
          height: 120,
          title: '查询条件',
          defaultType: 'textfield',
          layout: 'anchor',
          defaults: {anchor:'100%'},
          items:[
            {xtype:'textfield',fieldLabel: '<font color=\'red\'>*</font>工厂代码',name: 'plant'},
            {xtype:'textfield',fieldLabel: '<font color=\'red\'>*</font>工作中心',name: 'wrkc'},
            {xtype: 'textfield',fieldLabel: '货号',name: 'item'},
          ]
        },{
          xtype: 'fieldset',
          columnWidth:.25,
          height: 120,
          title: '供应选项',
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
              {boxLabel:'库存',name:'parm_oh',uncheckedValue:" ",inputValue:'Y',checked:true,disabled:true},
              {boxLabel:'采购订单',name:'parm_po',uncheckedValue:" ",inputValue:'Y',checked:true},
              {boxLabel:'生产工单',name:'parm_so',uncheckedValue:" ",inputValue:'Y',checked:true},
              {boxLabel:'计划订单',name:'parm_pl',uncheckedValue:" ",inputValue:'Y',checked:true}]             
          }]
        },{
          xtype: 'fieldset',
          columnWidth:.2,
          height: 120,
          title: '数据更新',
          defaultType: 'checkbox',
          layout: 'anchor',
          defaults: {anchor:'100%'},
          style: {marginLeft:'10px'},
          items: [{
            xtype: 'checkboxgroup',
            hideLabels: true,
            columns: 1,
            vertical: true,
            //style:{marginBottom:'54px'},
            items: [
              {boxLabel:'更新数据',name:'parm_upd',uncheckedValue:" ",inputValue:"Y",checked:false}] 
          }]
        }]
    };

    var fpSearch = Ext.create('Ext.FormPanel',{
        labelAlign: 'right',
        labelWidth: 80,
        buttonAlign: 'right',
        height: 190,
        title: '工单齐套查询',
        frame: true,
        items: [cSearch],
        buttons: [{
            text: '查询',
            listeners: {
              "click": function(){                
                              
                if(fpSearch.getForm().isValid()){
                  
                  var formData = fpSearch.getForm().getValues();
                  var parm = new Object();
                  parm.plant = formData.plant;
                  parm.wrkc = formData.wrkc;
                  parm.item = '%' + formData.item + '%';
                  parm.parm_po = formData.parm_po;
                  parm.parm_so = formData.parm_so;
                  parm.parm_pl = formData.parm_pl;
                  parm.parm_upd = formData.parm_upd;
                  
                  //alert message
                  if (parm.parm_upd=="Y") {
                      strMsg = "数据正在更新中，请稍候...";
                    } else {
                      strMsg = "正在查询中，请稍候...";
                  }
                  /*var msgMask = new Ext.LoadMask(Ext.getBody(),{
                    msg: strMsg  
                  });
                  msgMask.show();*/
                  var myMask = new Ext.LoadMask(Ext.getBody(), {
                	  msg : strMsg
                  });	
                  myMask.show();
                  //update or query data
                  EHeijunkaService.getPegChkCompltList(parm, function(jsonString){
                    var dataStore = Ext.getCmp("gridOrd").getStore();
                    var data = Ext.decode(jsonString);
                    dataStore.loadData(data.data);
                  });             
                }
                myMask.hide(); 
              }
            }
        }]
    });
       
    var iniData = [];
    
    var dsOrd = Ext.create('Ext.data.ArrayStore',{
        model: 'Ord',
        data: iniData
    });
    
    var dsOrdDtl = Ext.create('Ext.data.ArrayStore',{
        model: 'OrdDtl',
        data: iniData
    });  
   
    var gridOrd = Ext.create('Ext.grid.Panel',{
        id: 'gridOrd',
        store: dsOrd,
        stateful: true,
        columns: [
          {header:'生产工单',dataIndex:'ord_num',width:120},
          {header:'工序号',dataIndex:'ord_op',width:80},
          {header:'看板编号',dataIndex:'ord_row',width:80},
          {header:'货号',dataIndex:'item',width:150},
          {header:'货号描述',dataIndex:'item_desc',width:150},
          {header:'数量',dataIndex:'req_qty',width:80},
          {header:'计划开始时间',dataIndex:'orlsdt',width:150,
              renderer: function(value){              
                  if(value=='9999-12-31 00:00:00'){
                      return '<font color=blue></font><span style="color:red;">' + value + '</span>';
                  } else {
                      return value;
                  } 
              }
          },
          {header:'开始时间',dataIndex:'sup_duedt',width:150,
              renderer: function(value){              
                  if(value=='9999-12-31 00:00:00'){
                      return '<font color=blue></font><span style="color:red;">' + value + '</span>';
                  } else {
                	  return value;
                  } 
              }          
          },
          {header:'子项订单类型',dataIndex:'sup_ordtype',width:60,align:'center'},
          {header:'子项单号',dataIndex:'sup_ordnum',width:60,align:'center'},
          {header:'子项工序号',dataIndex:'sup_ordop',width:60,align:'center'},
          {header:'子项看板编号',dataIndex:'sup_ordrow',width:60,align:'center'},
          {header:'工作中心',dataIndex:'wrkc',width:60}  
        ],
        title: '生产工单列表',
        height: 250,
        
        /**
        //paging bar
        bbar: new Ext.PagingToolbar({
            id: 'tbGridOrd',
            pageSize: 10,
            store: dsOrd,
            displayInfo: true,
            displayMsg: '显示 {0} - {1} of {2}',
            emptyMsg: "查无记录"
        }),*/
        
        //listeners get order detail
        listeners: {
          "cellclick": function(gridOrd,record,rowIndex,cellIndex,e){
                var rec = cellIndex.data;
                var parm = new Object();
                parm.plant = rec.plant;
                parm.ord_type = rec.ord_type;
                parm.ord_num = rec.ord_num;
                parm.ord_op = rec.ord_op;
                parm.ord_row = rec.ord_row;
                EHeijunkaService.getPegChkCompltDtlList(parm, function(jsonString){
                    var dataStore = Ext.getCmp("gridOrdDtl").getStore();
                    var data = Ext.decode(jsonString);
                    dataStore.loadData(data.data);
                });             
              console.log(parm);
            }
        }
        
    });
    
    //Order component information
    var gridOrdDtl = new Ext.grid.Panel({
        id: 'gridOrdDtl',
        store: dsOrdDtl,
        columns:[
          {header:'子项货号',dataIndex:'item'},
          {header:'子项货号描述',dataIndex:'item_desc'},
          {header:'需求数量',dataIndex:'req_qty'},
          {header:'父项开始时间',dataIndex:'dem_rlsdt',width:150,
              renderer: function(value){              
                  if(value=="9999-12-31 00:00:00") {
                	  return '<font color=blue></font><span style="color:red;">' + value + '</span>';
                  } else {
                      return value;
                  } 
              }
          },
          {header:'订单类型',dataIndex:'sup_ordtype'},
          {header:'子项订单',dataIndex:'sup_ordnum',width:150,},
          {header:'子项交货期',dataIndex:'sup_duedt',width:150,
              renderer: function(value){              
                  if(value=="9999-12-31 00:00:00"){
                	  return '<font color=blue></font><span style="color:red;">' + value + '</span>';
                  } else {
                	  return value;
                  } 
              }
          },
          {header:'时差(hrs)',dataIndex:'gap_hrs',
        	  renderer: function(value){
        		  if (value<=0) {
        			  return '<font color=blue></font><span style="color:red;">' + -value + '</span>';
        		  } else {
        			  return '<font color=blue></font><span style="color:green;">' + value + '</span>';
        		  }
        	  }
          }  
        ],
        title: '子项工单列表',
        height: 150
    });
   
    //Layout
    var viewport = new Ext.Viewport({
        el: 'viewport',
        renderTo: Ext.getBody(),
        maxWidth: 1300,
        layout:'anchor',
        defaults: {anchor:'100%'},
        items:[fpSearch,gridOrd,gridOrdDtl]
    });
    
    //viewport.render();
    //viewport.render("form")

});