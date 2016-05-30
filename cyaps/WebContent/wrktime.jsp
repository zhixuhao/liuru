<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ page import="java.sql.*" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;">
<meta charset="UTF-8">
<title>创易高级计划系统</title>
	<link rel="icon" type="image/png"
	href="<%=request.getContextPath()%>/manufacturing/eHeijunka2/images/logo17.png">
	<link href="muban/css/style.css" rel="stylesheet">
	<link href="muban/css/style.css" rel="stylesheet">
    <link href="muban/css/font-awesome.css" rel="stylesheet">
    <link href="muban/css/animate.css" rel="stylesheet">
    <link href="muban/css/lightbox.css" rel="stylesheet">
	<link rel="stylesheet" href="amazeui/css/amazeui.css">
    <script type="text/javascript" src="muban/js/jquery-1.12.1.js"></script>
    <script  src="muban/js/bootstrap.min.js"></script>
    <script src="<%=request.getContextPath()%>/amazeui/js/amazeui.ie8polyfill.min.js"></script>
	<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.ie8polyfill.js"></script>
	<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.js"></script>
</head>

<header class="am-topbar admin-header">
		<div class="am-topbar-brand">
			<img src="./manufacturing/eHeijunka2/images/logo17.png" /> <strong>创易</strong> <small>高级计划系统</small>
		</div>


		<div class="am-collapse am-topbar-collapse" id="topbar-collapse">
			
			<ul class="am-nav am-nav-pills am-topbar-nav">
			
				
        		<li class="am-dropdown" data-am-dropdown id="menudir">
       		 		<a class="am-dropdown-toggle" data-am-dropdown-toggle href="javascript:;"><span class="am-icon-caret-down"></span></a>
					<ul class="am-dropdown-content" id = "menudirul" onclick = "menuclick('menudir')">
		            	
		          	</ul>
        		</li>
			
				
        		<li class="am-dropdown" data-am-dropdown id = "myfavorite">
       		 		<a class="am-dropdown-toggle" data-am-dropdown-toggle href="javascript:;">收藏  <span class="am-icon-caret-down"></span></a>
					<ul class="am-dropdown-content" id = "myfavoriteul" onclick = "menuclick('myfavorite')">
		            	
		          	</ul>
        		</li>
        		
        		
        		
      		</ul>

			<ul	class="am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list" style="margin-top:0px">
				<li class="am-dropdown" data-am-dropdown id = "l5">
				<a
					class="am-dropdown-toggle" data-am-dropdown-toggle
					href="javascript:;"> <span class="am-icon-users"></span> <%out.print((String)(session.getAttribute("user_name"))); %>
						<span class="am-icon-caret-down"></span>
				</a>
					<ul class="am-dropdown-content" id="lc5" onclick="menuclick('user')">
						<li><a href = "#" onclick="location='<%=request.getContextPath()%>/logout'"><span
								class="am-icon-power-off"></span> 退出</a></li>
					</ul>
				</li>
				<li class="am-dropdown" data-am-dropdown onclick="javascript:window.close();">
				<a
					class="am-dropdown-toggle" data-am-dropdown-toggle
					href="javascript:;">返回 <span class="am-icon-reply"></span> 
						
				</a>
					
				</li>
			</ul>
		</div>
	</header>
  
<body>
	<div class="am-u-lg-9 am-u-sm-centered" style="margin-top:50px">
		<div class="row">
		  <div class="col-md-8 am-u-xx-centered" style="">
		  <div class="am-g">
			  <div class="am-u-sm-2"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_click()">添加工作时间</button></div>
			  <div class="am-u-sm-6"><input type="text" id = "search" class="am-form-field am-input-sm col-md-4" placeholder="Search by name" onkeydown="onSearch()"></div>
		  </div>
		  <div>
		  
		  
		  </div>
		  <hr>
		  	<table class="am-table am-table-striped am-table-hover" id = "time_table">
    			<thead >
		        <tr>
		            <th>时间代码</th>
		            <th>描述</th>
		            <th>开始时间</th>
		            <th>结束时间</th>
		            <th>操作</th>
		        </tr>
    			</thead>
    			<tbody id = "table_body">
    			<%  
    			Connection conn = null;
    			Statement st = null;
    			String str_driver = application.getInitParameter("dbdriver");	
    			Class.forName(str_driver);
    			String url = application.getInitParameter("dbadress");	
    			String username = application.getInitParameter("dbusername");	
    			String password = application.getInitParameter("dbpassword");	
    			conn = DriverManager.getConnection(url,username,password);
    			ResultSet rs = null;	
    			st = conn.createStatement();
    			rs = st.executeQuery("select * from dta_cal_wrktime");
    			%>
    			
    			<% while (rs.next()) { %>  
    			<%String start_time = rs.getString(4); 
    			String end_time = rs.getString(5); 
    			String start_time1 = "";
    			String end_time1 = "";
    			
    			
    				String tmpa = start_time.substring(0,2);
    				String tmpb = start_time.substring(2,4);
    				start_time = tmpa+tmpb;
    				start_time1 = tmpa+":"+tmpb;
    			
    			
    			
    				tmpa = end_time.substring(0,2);
    				tmpb = end_time.substring(2,4);
    				end_time = tmpa+tmpb;
    				end_time1 = tmpa+":"+tmpb;
    			
    			%>
		            <tr>  
		                <td><%=rs.getString(2) %></td>  
		                <td><%=rs.getString(3) %></td>  	
		                <td><%=start_time1 %></td>  
		                <td><%=end_time1 %></td> 	            
		                <td>
  							<a href="#" onclick = "edit_click('edit','<%=rs.getString(2)%>','<%=rs.getString(3)%>','<%=start_time %>','<%=end_time%>')">编辑</a>
  							<a href="#" onclick = "delete_click('delete','<%=rs.getString(2)%>')">删除</a>
			            </td>
			            
		            </tr>  
			        <%  }  %>  
    			</tbody>
			</table>
		  </div>
		</div>
	</div>
	<div class="am-modal am-modal-alert" tabindex="-1" id="time_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">时间编辑</div>
    		<div class="am-modal-bd">
      		<form method="post" class="am-form">
				
				<label >时间代码</label> 
				<input type="text" name="time" id="timeid"  minlength="1"  required> 
				<br> 
				<label>描述</label>
				<input type="text" name="time_name" id="time_nameid" value="" required>
				<br>
				<h4>Start time:</h4>
				<div class="am-g am-g-fixed">
				  <div class="am-u-sm-5"><input type="text" 
					id="starttimehid" value="" minlength="1"  required>
				  </div>
				  <div class="am-u-sm-2">
				  :
				  </div>
				  <div class="am-u-sm-5">
					<input type="text" 
					id="starttimemid" value="" minlength="1"  required>
				  </div>
				</div>
				 <h4>End time:</h4>
				<div class="am-g am-g-fixed">
				  <div class="am-u-sm-5"><input type="text" 
					id="endtimehid" value="" minlength="1"  required>
				  </div>
				  <div class="am-u-sm-2">
				  :
				  </div>
				  <div class="am-u-sm-5">
					<input type="text" 
					id="endtimemid" value="" minlength="1"  required>
				  </div>
				</div>
				<hr>
				<div class="am-cf">
					<input type="button" name="" value="提 交" id="subbmit"
						class="am-btn am-btn-primary am-btn-sm am-fl" onclick = "edit_time()">
					<input type="button" name="" value="取 消" id="registerid"
						class="am-modal-btn" style="color:#000000;
						background-color: #f0f0f0;border-color: #000000;margin-left: 30px;"
					>
				</div>
			</form>
    		</div>
		</div>
	</div>
	
				
<script>
$(function() {
	  init();
	  
});
function jsgetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
function init(){
	  <%String app_url =  request.getQueryString();%>
	  <%char menuid = app_url.charAt(app_url.length()-1);%>
	  var app_url = jsgetQueryString("app_url");
	  var menuid = jsgetQueryString("menuid");
	  var menuname = '<%=(String)session.getAttribute("menuarr")%>';
	  menuname = menuname.trim();
	  var menunamearr = menuname.split(" ");
	  var menudir = document.getElementById("menudir");
	  var ma = menudir.getElementsByTagName("a");
	  ma[0].innerHTML = menunamearr[menuid-1]+"<span class=\"am-icon-caret-down\"></span>";
	  var menuapp = '<%=(String)session.getAttribute("menuapp")%>';
	  menuapp = menuapp.trim();
	  var menuapparr = menuapp.split(" ");
	  var appid = '<%=(String)session.getAttribute("appid")%>';
	  appid = appid.trim();
	  var appidarr = appid.split(" ");
	  var appurl = '<%=(String)session.getAttribute("appurl")%>';
	  appurl = appurl.trim();
	  var appurlarr = appurl.split(" ");
	  var appname = '<%=(String)session.getAttribute("apparr")%>';
	  appname = appname.trim();
	  var appnamearr = appname.split(" ");
	  var appinmenu = [];
	  for(var i = 0;i < menuapp.length-1;i++){
		  if(menuapparr[i] == menuid){
			  var flag = -1;
			  for(var j = 0;j < appid.length;j++){
				  if(menuapparr[i+1] == appidarr[j]){
					  flag = j;
				  }
			  }
			  if(flag > -1){
			  	appinmenu.push(menuapparr[i+1]);
			  }
		  }
	  }
	  for(var j = 0;j < appinmenu.length;j++){
		  var id = appinmenu[j];
		  var pos = 0;
		  for(var k = 0;k < appidarr.length;k++){
			  if(id == appidarr[k]){
				  pos = k;
			  }
		  }
		  var name = appnamearr[pos];
		  var url = appurlarr[pos];
		  $('#menudirul').append(
				  "<li ><a href = \"#\" onclick=\"location='"+url+"&menuid="+menuid+"'\">"+name+"  "+"</a></li>"
		  );
	  }
	  var myapp = '<%=(String)session.getAttribute("myapp")%>';
	  myapp = myapp.trim();
	  var myapparr = myapp.split(" ");
	  for(var i = 0;i < myapparr.length;i++){
		  var tmpappid = myapparr[i];
		  var tmpm = 0;
		  var pos = -1;
		  for(var j = 1;j < menuapparr.length;j++){
			  if(menuapparr[j] == tmpappid){
				  tmpm = menuapparr[j-1];
			  }
		  }
		  for(var k = 0;k < appidarr.length;k++){
			  if(tmpappid == appidarr[k]){
				  pos = k;
			  }
		  }
		  var tmpappname = appnamearr[pos];
		  var tmpappurl = appurlarr[pos];
		  if(!tmpappid){
			  tmpappurl = '#';
			  tmpm = '';
			  tmpappname = 'none';
		  }
		  $('#myfavoriteul').append(
				  "<li ><a href = \"#\" onclick=\"location='"+tmpappurl+"&menuid="+tmpm+"'\">"+tmpappname+"</a></li>"
		  );
		}
		
	  }
function menuclick(id){
	  var $l1 = $('#'+id);
	  $l1.dropdown("toggle");
	    
}

  function delete_click(action,time) {  
  	  var jsondata = {};
  	  jsondata.method = action;
  	  jsondata.time = time;
	  if(action=="delete"){
		  $.ajax({  
	            type : 'POST',  
	            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',  
	            url : 'wrktime',  
	            data : jsondata,  
	            dataType : 'html',  
	            success : function(data) { 
	        	   var result = JSON.parse(data);  
	               $('#time_table tbody tr').remove();//移除先前数据  
	               for ( var i = 0; i < result.length; i++) {  
	                   $('#time_table tbody').append(
	                   	'<tr>'+'<td>'+result[i].WT_CODE+'</td>'+'<td>'+result[i].WT_NAME+'</td>'+'<td>'+result[i].starttime1+'</td>'+'<td>'+result[i].endtime1+'</td>'
	                   	+'<td><a href="#" onclick = "edit_click(\'edit\','+"'"+result[i].WT_CODE+"','"+result[i].WT_NAME+"','"+result[i].starttime+"','"+result[i].endtime+'\' )">编辑 </a>'
	                   	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].WT_CODE+"'"+')"> 删除</a></td></tr>'
	                   	
	                   )}  
	                   
	               }       
	            ,  
	                error : function(data) {  
	                    $('#time_table tbody').append("获取数据失败！");  
	                } 
	  			
	  } );
	  }
	  
	  }
 
  function add_click(){
	  wmethod = "add";
	  former_time = "";
	  document.getElementById("timeid").value = "";
	  document.getElementById("time_nameid").value = "";
	  document.getElementById("starttimemid").value = "";
	  document.getElementById("endtimemid").value = "";
	  document.getElementById("starttimehid").value = "";
	  document.getElementById("endtimehid").value = "";
	  $('#time_edit').modal('toggle');
	}
  function edit_click(action,time,time_name,starttime,endtime){
	  wmethod = "edit";
	  former_time = time;
	  document.getElementById("timeid").value = time;
	  document.getElementById("time_nameid").value = time_name;
	  document.getElementById("starttimemid").value = starttime.substring(starttime.length-2,starttime.length);
	  document.getElementById("endtimemid").value = endtime.substring(endtime.length-2,endtime.length);
	  document.getElementById("starttimehid").value = starttime.substring(0,starttime.length-2);
	  document.getElementById("endtimehid").value = endtime.substring(0,endtime.length-2);
	  $('#time_edit').modal('toggle');
  }
function edit_time() {  
	
	var jsondata = {};
	jsondata.method = wmethod;
	jsondata.time = document.getElementById("timeid").value;
	jsondata.time_name = document.getElementById("time_nameid").value;
	jsondata.former_time = former_time;
	var sh = document.getElementById("starttimehid").value;
	var sm = document.getElementById("starttimemid").value;
	var eh = document.getElementById("endtimehid").value;
	var em = document.getElementById("endtimemid").value;
	jsondata.starttime = sh+""+sm+"00";
	jsondata.endtime = eh+""+em+"00";
	
	var reg1 = new RegExp("^1[0-9]$");
	var reg2 = new RegExp("^2[0-4]$");
	var reg3 = new RegExp("^[0][0-9]$");
	var reg4 = new RegExp("^[0-5][0-9]$");
	
	if(!reg1.test(sh) && !reg2.test(sh) && !reg3.test(sh)){
		alert("请正确输入起始时间！");
		return;
	}
	if(!reg4.test(sm) ){
		alert("请正确输入起始时间！");
		return;
	}
	if(!reg1.test(eh) && !reg2.test(eh) && !reg3.test(eh)){
		alert("请正确输入结束时间！");
		return;
	}
	if(!reg4.test(em) ){
		alert("请正确输入结束时间！");
		return;
	}
	
	 $.ajax({  
         type : 'POST',  
         contentType : 'application/x-www-form-urlencoded; charset=UTF-8',  
         url : 'wrktime',  
         data : jsondata,  
         dataType : 'html',  
         success : function(data) { 
     	   var result = JSON.parse(data);  
            $('#time_table tbody tr').remove();//移除先前数据  
            for ( var i = 0; i < result.length; i++) {  
                $('#time_table tbody').append(
                	'<tr>'+'<td>'+result[i].WT_CODE+'</td>'+'<td>'+result[i].WT_NAME+'</td>'+'<td>'+result[i].starttime1+'</td>'+'<td>'+result[i].endtime1+'</td>'
                	+'<td><a href="#" onclick = "edit_click(\'edit\','+"'"+result[i].WT_CODE+"','"+result[i].WT_NAME+"','"+result[i].starttime+"','"+result[i].endtime+'\' )">编辑 </a>'
                	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].WT_CODE+"'"+')"> 删除</a></td></tr>'
                	
                )}  
            $('#time_edit').modal('toggle');
            }       
         ,  
             error : function(data) {  
                 $('#time_table tbody').append("获取数据失败！");  
             } 
			
} );
}

function onSearch(){
    setTimeout(function(){
	var search_value = document.getElementById('search').value;
	var list =  document.getElementById('table_body').getElementsByTagName("tr");
    var found = 0;
    for(var i=0; i<list.length; i++){
        var data = list[i].getElementsByTagName("td")[1].innerHTML;
        if(data.match(search_value)){
        	list[i].removeAttribute("style");
        } else{
            list[i].setAttribute("style", "display:none;");
        }
        if(search_value==""){
        	list[i].removeAttribute("style");
        }
    }
    
	},200);
}

	  
</script>
</body>
</html>