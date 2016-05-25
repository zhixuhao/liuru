var colorStore = new Ext.data.ArrayStore({
	        idIndex: 0,
	        fields: [
	            'value','displayText'
	        ],
//	        data: [['orange', 'Orange'],['red', 'Red'],['blue', 'Blue'], ['yellow', 'Yellow'],['chocolate','Chocolate'],['yellowgreen','Yellowgreen'],['green', 'green']]
			data: [['orange', 'Orange'],['red', 'Red'],['blue', 'Blue'], ['yellow', 'Yellow'],['chocolate','Chocolate'],['yellowgreen','Yellowgreen']]
	     }),

ColorPicker = Ext.extend(Ext.form.ComboBox, {
    // default configs:
    fieldLabel: 'Color',
    valueField: 'value',
    displayField: 'displayText',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    width: 200,
    store : colorStore,
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '{displayText}',
        '</tpl>'
    ),    
    
	constructor: function(config) {
        ColorPicker.superclass.constructor.apply(this, arguments);
        
        //init
        this.init();
    },
    
    init: function(){
        this.tpl = this.tpl ||
              '<tpl for="."><div class="x-boundlist-item"><span style="background-color:{' + this.valueField + '};width: 60px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{' + this.displayField + '}</div></tpl>';
    }
});