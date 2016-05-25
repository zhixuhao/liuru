/**  
 * http://extjs.com/forum/showthread.php?t=19529  
 */  
/*  
 * 作者：彭仁夔 blog:http://jxnuprk.cnblogs.com/或jljlpch.javaeye.com  
 */  
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
    noSort : true,// this implementation doesn't support remote sorting. don't set noSort to false!   
    sort : '',   
    dir : "",   
    start : 0,   
    limit : 10,   
    load : function(params, reader, loadCallback, scope, arg) {   
        var l = this.dwrlen, dwrFnArgs = [], flag;   
        // 隔离短的请求时可能会引起的冲突   
        var dataProxy = this;//for (var p in this)
        //    t[p] = this[p];
        if (dataProxy.fireEvent("beforeload", dataProxy, params) !== false) {   
            var loadArgs = params['dwrFnArgs'] || params;
            if (loadArgs instanceof Array) {/* 通过数组传入参数 */
                for (var i = 0;i < loadArgs.length; i++) {
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
        for (var i = l2 - 1;i < l; i++) {   
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
            var s = dataProxy.sort + " " + dataProxy.dir   
            dwrFnArgs[dataProxy.noPage ? l - 1 : dataProxy.sortPos] = s;   
        }   

        var cb = function(response) {   
            dataProxy.lastOptions = dwrFnArgs;   
            var records = reader.read(response);   
            dataProxy.fireEvent("load", dataProxy, response, loadCallback);   
            loadCallback.call(scope, records, arg, true);   
        }   
  
        var eh = function(message, exception) {   
        	alert(exception.message);
            dataProxy.fireEvent("loadexception", dataProxy, message, loadCallback, exception);   
            loadCallback.call(scope, null, arg, false);   
        };
        dwrFnArgs[l] = {// dwr配置参数   
            callback : cb,   
            exceptionHandler : eh   
        };
        //alert(dwrFnArgs)
        dataProxy.dwrFn.apply(Object, dwrFnArgs);   
    } else {   
        loadCallback.call(scope || dataProxy, null, arg, false);   
    }   
}   
});




Ext.ux.data.ListRangeReader = function(meta, recordType){
    Ext.ux.data.ListRangeReader.superclass.constructor.call(this, meta, recordType);
    this.recordType = recordType;
};
Ext.extend(Ext.ux.data.ListRangeReader, Ext.data.DataReader, {
  getJsonAccessor: function(){
      var re = /[\[\.]/;
      return function(expr) {
          try {
              return(re.test(expr))
                  ? new Function("obj", "return obj." + expr)
                  : function(obj){
                      return obj[expr];
                  };
          } catch(e){}
          return Ext.emptyFn;
      };
  }(),
	
	read : function(o){
		var recordType = this.recordType, fields = recordType.prototype.fields;

		//Generate extraction functions for the totalProperty, the root, the id, and for each field
		if (!this.ef) {
			if(this.meta.totalProperty) {
				this.getTotal = this.getJsonAccessor(this.meta.totalProperty);
			}
		
			if(this.meta.successProperty) {
				this.getSuccess = this.getJsonAccessor(this.meta.successProperty);
			}

			if (this.meta.id) {
				var g = this.getJsonAccessor(this.meta.id);
				this.getId = function(rec) {
					var r = g(rec);
					return (r === undefined || r === "") ? null : r;
				};
			} else {
				this.getId = function(){return null;};
			}
			this.ef = [];
			for(var i = 0; i < fields.length; i++){
				f = fields.items[i];
				var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
				this.ef[i] = this.getJsonAccessor(map);
			}
		}

   	var records = [];
   	var root = o.data, c = root.length, totalRecords = c, success = true;

   	if(this.meta.totalProperty){
	    var v = parseInt(this.getTotal(o), 10);
			if(!isNaN(v)){
				totalRecords = v;
			}
		}

		if(this.meta.successProperty){
			var v = this.getSuccess(o);
			if(v === false || v === 'false'){
				success = false;
			}
		}

		for(var i = 0; i < c; i++){
	    var n = root[i];
      var values = {};
      var id = this.getId(n);
      for(var j = 0; j < fields.length; j++){
				f = fields.items[j];
        var v = this.ef[j](n);						
        values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue);
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