//
// Ext.ux.Multiselect/ItemSelector
// 
// ---------------------------------------------------------------------------------------
// Version History
// ---------------------------------------------------------------------------------------
//
// 2.1     Fixes                                     27 Sept 2007          Figtree Systems 
//          - General
//            - draggable now spelt correctly in all places :)
//            - Queries to the store in setValue now match whole value correctly 
//              (rather than partial match)
//          - ItemSelector
//            - value now initialised onRender
//
// 2.0     Fixes/Enhancements                        19 Sept 2007          Figtree Systems
//          - General
//            - Now uses Animal's DDView
//          - ItemSelector
//            - Move to top/bottom navigation buttons
//            - When using navigation buttons items remain selected in destination list
//          - Multiselect
//            - Border dropped when marked invalid for better visuals (less jumping/popping)
//            - Validation for blank, min length and max length
//            - Ext.form.Field.getName() now returns correct name
//
// 1.3     Fixes/Enhancements                        24 Aug  2007          Figtree Systems
//          - Multiselect now clears when underlying datastore is cleared
//          - New silver (more Ext'ish) arrow buttons (thanks Galdaka)
//
// 1.2     Enhancements                              23 Aug  2007          Figtree Systems
//          - Added ItemSelector (beta)
// 
// 1.1     Fixes/Enhancements                        16 Aug  2007          Figtree Systems
//          - Can now bind to external data store
//          - List items are now unselectable (prevents text highlight/selection)
//          - Enabled/disabled now works correctly
//          - Reset now properly clears selections
//          - Click and Change events added 
// 
// 1.0     Release                                   14 Aug  2007          Figtree Systems
//
//

Ext.namespace("Ext.ux");


/**
 * @class Ext.ux.Multiselect
 * Ext implementation of the traditional HTML select/multiple widget
 * @param {Object} config The configuration properties. These include all the config options of
 * {@link Ext.form.Field} plus some specific to this class.<br>
 * 
 */

Ext.ux.Multiselect = function(config){
	Ext.ux.Multiselect.superclass.constructor.call(this, config);

	this.addEvents({
		'dblclick' : true,
		'click' : true,
		'change' : true
	});
	
	this.on('valid', this.onValid);
	this.on('invalid', this.onInvalid);

};

Ext.extend(Ext.ux.Multiselect, Ext.form.Field,  {
	
	/** @cfg {Ext.data.Store} store Pre-initialised Ext data store. */
	
	/**	@cfg {Array} dataFields Inline data definition when not using a pre-initialised store. */
	/**	@cfg {Array} data Inline data when not using a pre-initialised store. */
	
	/**	@cfg {Integer} width Desired width (in pixels) of the widget. */
	/**	@cfg {Integer} height Desired height (in pixels) of the widget. */
	
	/**	@cfg {String/Integer} displayField Name/Index of the desired display field in the dataset. */
	/**	@cfg {String/Integer} valueField Name/Index of the desired value field in the dataset. */
	
	/**	@cfg {Boolean} allowBlank Allow blank for validation. */
	/**	@cfg {Integer} minLength Minimum number of selections allowed. */
	/**	@cfg {Integer} maxLength Maximum number of selections allowed. */
	/**	@cfg {String} blankText Text displayed when widget contains no items. */
	/**	@cfg {String} minLengthText Validation message displayed when minLength is not met. */
	/**	@cfg {String} maxLengthText Validation message displayed when maxLength is not met. */
	
	/**	@cfg {Boolean} isFormField Denotes whether the widget is a form field (ie. is submitted). */
	
	
	store             :  null,
	
	dataFields        :  [],
	data              :  [],
	
	width             :  100,
	height            :  100,
	
	displayField      :  0,
	valueField        :  1,
	
	allowBlank        :  true,
	minLength         :  0,
	maxLength         :  Number.MAX_VALUE,
	blankText         :  Ext.form.TextField.prototype.blankText,
	minLengthText     : 'Minimum {0} item(s) required',
	maxLengthText     : 'Maximum {0} item(s) allowed',
	
	isFormField       :  true,
	
	view              :  null,
	draggable         :  false,
	defaultAutoCreate :  {tag: "input", type: "hidden", value: ""},
    
    
    
	onRender : function(ct, position){

		this.el = ct.createChild(); 
		this.el.dom.style.zoom = 1;
		this.el.addClass(this.fieldCls);
		this.el.setWidth(this.width);
		this.el.setHeight(this.height);

		var div = this.el.createChild({tag: div});

		if (!this.store) {
			this.store = new Ext.data.SimpleStore({
				fields: this.dataFields,
				data : this.data
			});
		}
		
		this.store.on('clear', this.reset, this);
			
		var cls = 'x-combo-list';
		
		this.list = new Ext.Layer({
			shadow: false, cls: [cls, 'ux-mselect-valid'].join(' '), constrain:false
		}, div);
		
		var lw = this.width - this.el.getFrameWidth('lr');
		var lh = this.height - this.el.getFrameWidth('tb');
		
		this.list.setWidth(lw);
		this.list.setHeight(lh);
		this.list.swallowEvent('mousewheel');
		
		this.innerList = this.list.createChild({tag: 'div', cls: cls + '-inner'});
		this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
		this.innerList.setHeight(lh - this.list.getFrameWidth('tb'));
		
		if (Ext.isIE || Ext.isIE7)
		{
			var tpl = '<div unselectable=on class="' + cls + '-item ux-mselect-pointer">{' + this.displayField + '}</div>';
		}
		else
		{
			var tpl = '<div class="' + cls + '-item ux-mselect-pointer x-unselectable">{' + this.displayField + '}</div>';
		}

		if (this.draggable) {
			this.view = new Ext.ux.DDView(this.innerList, tpl, {
				multiSelect: true, store: this.store, selectedClass: 'x-combo-selected'
				, copy: false, allowCopy: false, dragGroup: this.dragGroup, dropGroup: this.dragGroup, jsonRoot: 'collection'
			});
		} else {
			this.view = new Ext.ux.DDView(this.innerList, tpl, {
				multiSelect: true, store: this.store, selectedClass: 'x-combo-selected'
			});			
		}
		
		this.view.on('click', this.onViewClick, this);
		this.view.on('beforeClick', this.onViewBeforeClick, this);
		this.view.on('dblclick', this.onViewDblClick, this);
		
		this.list.setStyle('position', '');
		this.list.show();
		
		this.hiddenName = this.name;
		this.defaultAutoCreate.name = this.name;
		if (this.isFormField) { 
			this.hiddenField = this.el.createChild(this.defaultAutoCreate);
		} else {
			this.hiddenField = Ext.get(document.body).createChild(this.defaultAutoCreate);
		}
	},

	onViewClick: function(vw, index, node, e) {
		var arrayIndex = this.preClickSelections.indexOf(index);
		if (arrayIndex  != -1)
		{
			this.preClickSelections.splice(arrayIndex, 1);
			this.view.clearSelections(true);
			this.view.select(this.preClickSelections);
		}
		this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
		this.hiddenField.dom.value = this.getValue();
		this.fireEvent('click', this, e);
		this.validate();
		
	},

	onViewBeforeClick: function(vw, index, node, e) {
		this.preClickSelections = this.view.getSelectedIndexes();
		if (this.disabled) {return false;}
	},

	onViewDblClick : function(vw, index, node, e) {
		this.fireEvent('dblclick', vw, index);
	},

	getValue: function(valueField){
		var returnArray = [];
		var selectionsArray = this.view.getSelectedIndexes();
		if (selectionsArray.length == 0) {return '';}
		for (var i=0; i<selectionsArray.length; i++)
		{
			returnArray.push(this.store.getAt(selectionsArray[i]).get(((valueField != null)? valueField : this.valueField)));
		}
		return returnArray.join(',');
	},

	setValue: function(values)
	{
		var index;
		var selections = [];
		this.view.clearSelections();
		this.hiddenField.dom.value = '';
		
		if (!values || (values == ''))
		{
			return;
		}
		
		if (!(values instanceof Array))
		{
			values = values.split(',');
		}
		for (var i=0; i<values.length; i++)
		{
			index = this.view.store.indexOf(this.view.store.query(this.valueField, new RegExp('^' + values[i] + '$', "i")).itemAt(0));
			selections.push(index);
		}
		this.view.select(selections);
		this.hiddenField.dom.value = this.getValue();
		this.validate();
	},
	
	reset : function() {
		this.setValue('');
	},
	
	getRawValue: function(valueField){
        var tmp = this.getValue(valueField);
        if (tmp.length){
            tmp = tmp.split(',');
        }
        else{
            tmp = [];
        }
        return tmp;
    },

    setRawValue: function(values){
        setValue(values);
    },

    validateValue : function(value){
        if(value.length < 1){ // if it has no value
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        return true;
    },
	
	onValid : function() {
		this.list.addClass('ux-mselect-valid');
		this.list.removeClass('ux-mselect-invalid');
	},
	
	onInvalid : function() {
		this.list.addClass('ux-mselect-invalid');
		this.list.removeClass('ux-mselect-valid');
	}
});



/**
 * @class Ext.ux.ItemSelector
 * Ext implementation of widget that allows moving items from an "available" list to a "selected" list 
 * and vice-versa. Uses Ext.ux.Multiselect for the available and selected lists.
 * @param {Object} config The configuration properties. These include all the config options of
 * {@link Ext.form.Field} plus some specific to this class.<br>
 * 
 */

Ext.ux.ItemSelector = function(config) {
	Ext.ux.ItemSelector.superclass.constructor.call(this, config);
}

Ext.extend(Ext.ux.ItemSelector, Ext.form.Field, {

	/**	@cfg {Integer} msWidth Desired width (in pixels) of the lists. */
	/**	@cfg {Integer} msHeight Desired height (in pixels) of the lists. */
	
	/**	@cfg {String} iconUp Path to image representing 'Up' navigation. */
	/**	@cfg {String} iconDown Path to image representing 'Down' navigation. */
	/**	@cfg {String} iconLeft Path to image representing 'Left' navigation. */
	/**	@cfg {String} iconRight Path to image representing 'Right' navigation. */
	/**	@cfg {String} iconTop Path to image representing 'To Top' navigation. */
	/**	@cfg {String} iconBottom Path to image representing 'To Bottom' navigation. */
	
	/** @cfg {Ext.data.Store} fromStore Pre-initialised Ext data store. */
	/** @cfg {Ext.data.Store} toStore Pre-initialised Ext data store. */
	
	/**	@cfg {Array} dataFields Inline data definition when not using a pre-initialised store. */
	/**	@cfg {Array} fromData Inline data when not using a pre-initialised store. */
	/**	@cfg {Array} toData Inline data when not using a pre-initialised store. */
	
	msWidth      : 100,
	msHeight     : 100,
	
	iconUp       : "up2.gif",
	iconDown     : "down2.gif",
	iconLeft     : "left2.gif",
	iconRight    : "right2.gif",
	iconTop      : "top2.gif",
	iconBottom   : "bottom2.gif",
	
	fromStore    : null,
	toStore      : null,
	fromData     : null,
	toData       : null,
	
	displayField :  0,
	valueField   :  1,
	
	
	defaultAutoCreate : {tag: "input", type: "hidden", value: ""},
	
	onRender : function(ct, position){

		this.iconUp = (this.iconUp) ? this.iconUp : "up2.gif";
		this.iconDown = (this.iconDown) ? this.iconDown : "down2.gif";
		this.iconLeft = (this.iconLeft) ? this.iconLeft : "left2.gif";
		this.iconRight = (this.iconRight) ? this.iconRight : "right2.gif";
		this.iconTop = this.iconTop || 'up2.gif';
		this.iconBottom = this.iconBottom || 'down2.gif';
		
		var table = ct.createChild({tag: 'table', cellpadding: 0, cellspacing: 0});
		this.el = table;
		var tr = table.createChild({tag: 'tr'});
		if (tr.dom.tagName.toUpperCase() == 'TBODY') { tr = tr.child('tr'); }

		var td = Ext.get(tr.dom.appendChild(document.createElement('td')));
		var divFrom = td.createChild({tag: 'div'});

		this.fromMultiselect = new Ext.ux.Multiselect({draggable: true, dragGroup: this.el.dom.id, width: this.msWidth, height: this.msHeight, dataFields: this.dataFields, data: this.fromData, displayField: this.displayField, valueField: this.valueField, store: this.fromStore, isFormField:false});
		
		td = Ext.get(tr.dom.appendChild(document.createElement('td')));

		this.toTopIcon = td.createChild({tag:'img', src:this.iconTop, style:{cursor:'pointer', margin:'2px'}});
		this.toTopIcon.on('click', this.toTop, this);
		td.createChild({tag: 'br'});
		this.upIcon = td.createChild({tag:'img', src:this.iconUp, style:{cursor:'pointer', margin:'2px'}});
		this.upIcon.on('click', this.up, this);
		td.createChild({tag: 'br'});
		this.addIcon = td.createChild({tag:'img', src:this.iconRight, style:{cursor:'pointer', margin:'2px'}});
		this.addIcon.on('click', this.fromTo, this);
		td.createChild({tag: 'br'});
		this.removeIcon = td.createChild({tag:'img', src:this.iconLeft, style:{cursor:'pointer', margin:'2px'}});
		this.removeIcon.on('click', this.toFrom, this);
		td.createChild({tag: 'br'});
		this.downIcon = td.createChild({tag:'img', src:this.iconDown, style:{cursor:'pointer', margin:'2px'}});
		this.downIcon.on('click', this.down, this);
		td.createChild({tag: 'br'});
		this.toBottomIcon = td.createChild({tag:'img', src:this.iconBottom, style:{cursor:'pointer', margin:'2px'}});
		this.toBottomIcon.on('click', this.toBottom, this);

		var td = Ext.get(tr.dom.appendChild(document.createElement('td')));
		var divTo = td.createChild({tag: 'div'});

		if (!this.toStore) {
			this.toStore = new Ext.data.SimpleStore({
				fields: this.dataFields,
				data : this.toData
			});
		}
			
		this.toStore.on('add', this.valueChanged, this);
		this.toStore.on('remove', this.valueChanged, this);
		this.toStore.on('load', this.valueChanged, this);
		this.toMultiselect = new Ext.ux.Multiselect({draggable: true, dragGroup: this.el.dom.id, width: this.msWidth, height: this.msHeight, displayField: this.displayField, valueField: this.valueField, store: this.toStore, isFormField:false});
		
		this.fromMultiselect.render(divFrom);
		this.toMultiselect.render(divTo);
		
		this.defaultAutoCreate.name = this.name;
		this.hiddenName = this.name;
		this.hiddenField = ct.createChild(this.defaultAutoCreate);
		this.valueChanged(this.toStore);
	},
	
	toTop : function() {
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			selectionsArray.sort();
			for (var i=0; i<selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for (var i=records.length-1; i>-1; i--) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				this.toMultiselect.view.store.insert(0, record);
				selectionsArray.push(((records.length - 1) - i));
			}
		}
		this.toMultiselect.view.refresh();
		this.toMultiselect.view.select(selectionsArray);
	},

	toBottom : function() {
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			selectionsArray.sort();
			for (var i=0; i<selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for (var i=0; i<records.length; i++) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				this.toMultiselect.view.store.add(record);
				selectionsArray.push((this.toMultiselect.view.store.getCount()) - (records.length - i));
			}
		}
		this.toMultiselect.view.refresh();
		this.toMultiselect.view.select(selectionsArray);
	},
	
	up : function() {
		var record = null;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		selectionsArray.sort();
		var newSelectionsArray = [];
		if (selectionsArray.length > 0) {
			for (var i=0; i<selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				if ((selectionsArray[i] - 1) >= 0) {
					this.toMultiselect.view.store.remove(record);
					this.toMultiselect.view.store.insert(selectionsArray[i] - 1, record);
					newSelectionsArray.push(selectionsArray[i] - 1);
				}
			}
			this.toMultiselect.view.refresh();
			this.toMultiselect.view.select(newSelectionsArray);
		}
	},

	down : function() {
		var record = null;
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		selectionsArray.sort();
		selectionsArray.reverse();
		var newSelectionsArray = [];
		if (selectionsArray.length > 0) {
			for (var i=0; i<selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				if ((selectionsArray[i] + 1) < this.toMultiselect.view.store.getCount()) {
					this.toMultiselect.view.store.remove(record);
					this.toMultiselect.view.store.insert(selectionsArray[i] + 1, record);
					newSelectionsArray.push(selectionsArray[i] + 1);
				}
			}
			this.toMultiselect.view.refresh();
			this.toMultiselect.view.select(newSelectionsArray);
		}
	},
	
	fromTo : function() {
		var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			for (var i=0; i<selectionsArray.length; i++) {
				record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for (var i=0; i<records.length; i++) {
				record = records[i];
				this.fromMultiselect.view.store.remove(record);
				this.toMultiselect.view.store.add(record);
				selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
			}
		}
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.refresh();
		this.toMultiselect.view.select(selectionsArray);
	},
	
	toFrom : function() {
		var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
		var records = [];
		if (selectionsArray.length > 0) {
			for (var i=0; i<selectionsArray.length; i++) {
				record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
				records.push(record);
			}
			selectionsArray = [];
			for (var i=0; i<records.length; i++) {
				record = records[i];
				this.toMultiselect.view.store.remove(record);
				this.fromMultiselect.view.store.add(record);
				selectionsArray.push((this.fromMultiselect.view.store.getCount() - 1));
			}
		}
		this.fromMultiselect.view.refresh();
		this.toMultiselect.view.refresh();
		this.fromMultiselect.view.select(selectionsArray);
	},
	
	valueChanged: function(store) {
		var record = null;
		var values = [];
		for (var i=0; i<store.getCount(); i++) {
			record = store.getAt(i);
			values.push(record.get(this.valueField));
		}
		this.hiddenField.dom.value = values.join(',');
	},
	
	getValue : function() {
		return this.hiddenField.dom.value;
	}	
	
});