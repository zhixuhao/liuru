Ext.define("MyApp.AvailabilityStore", {
    extend : 'Sch.data.EventStore',
    autoLoad : false,
//    proxy : {
//        type : 'ajax',
//        url : 'availabilitydata.js',
//        reader : { type : 'json' }
//    },

    getAvailabilityForResource : function(resource) {
        var id = resource.getId();
        var availability = [];
        var length = this.getCount();

        for (var i = 0; i < length; i++) {  
            if (this.getAt(i).getResourceId() === id) {
                availability.push(this.getAt(i));
            }
        }

        return availability;
    },

    isResourceAvailable : function(resource, start, end) {
//        var availability = this.getAvailabilityForResource(resource);
//        
//        if (!availability || availability.length === 0) return true;
//
//        for (var i = 0, l = availability.length; i < l; i++) {
//            // Check if there is an availability block completely encapsulating the passed start/end timespan
//            if (Sch.util.Date.timeSpanContains(availability[i].getStartDate(), availability[i].getEndDate(), start, end)) {
//                return true;
//            }
//        }
//
//        return false; 
    	
    	return true;
    }
});