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
	<div class="am-u-lg-9 am-u-sm-centered" style="margin-top:50px" >
		<div class="row" >
		  <div class="col-md-8 am-u-xx-centered" style="">
		  <div class="am-g">
			  <div class="am-u-sm-2"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_click()">添加工作中心</button></div>
			  <div class="am-u-sm-6"><input type="text" id = "search" class="am-form-field am-input-sm col-md-4" placeholder="Search by name" onkeydown="onSearch()"></div>
		  </div>
		  <div id = "table_wapper" style="overflow-y:auto;">
		  
		  
		  
		  <hr>
		  	<table class="am-table am-table-striped am-table-hover" id = "user_table" >
    			<thead >
		        <tr>
		            <th>工作中心代码</th>
		            <th>工作中心描述</th>
		            <th>隶属工厂</th>
		            <th>是否使用中</th>
		            <th>使用者</th>
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
    			rs = st.executeQuery("select * from dta_wrkc");
    			%>
    			
    			<% while (rs.next()) { %>  
    			<%String menurole = ""; %>
		            <tr>  
		                <td><%=rs.getString(2) %></td>  
		                <td><%=rs.getString(3) %></td>  
		                <td><%=rs.getString(4) %></td>  
		                <td><%=rs.getString(5) %></td>
		                <td><%=rs.getString(6) %></td>
		               
		                <td>
  							<a href="#" onclick = "edit_click('edit','<%=rs.getString(2)%>','<%=rs.getString(3)%>','<%=rs.getString(4)%>','<%=rs.getString(5)%>','<%=rs.getString(6)%>')">编辑</a>
  							<a href="#" onclick = "delete_click('delete','<%=rs.getString(2)%>')">删除</a>
  							<a href="#" onclick = "mach_click('mach','<%=rs.getString(2)%>')">设备</a>
  							<a href="#" onclick = "user_click('user','<%=rs.getString(2)%>')">用户</a>
  							<a href="#" onclick = "reset_click('reset','<%=rs.getString(2)%>')">重置</a>
			            </td>
			            
		            </tr>  
			        <%  }  %>  
    			</tbody>
			</table>
			</div>
		  </div>
		</div>
	</div>
	<div class="am-modal am-modal-alert" tabindex="-1" id="wrkc_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">工作中心编辑</div>
    		<div class="am-modal-bd">
      		<form method="post" class="am-form">
				
				<label >工作中心代码</label> 
				<input type="text" name="wrkc" id="wrkcid"  minlength="1"  required> 
				<br> 
				<label>描述</label>
				<input type="text" name="wrkc_name" id="wrkc_nameid" value="" required>
				<br>
				<label>隶属工厂</label>
				<input type="text" name="plant" id="plantid" value="" required>
				<br>
				<label>使用中</label>
				<label class="am-radio-inline">
		        	<input type="radio"  value="Y" name="used" id="radioy">是
		      	</label>
		      	<label class="am-radio-inline">
		        	<input type="radio"  value="N" name="used" id="radion">否
		      	</label>
		      	<br>
		      	<label>使用者</label>
				<input type="text" name="used_by" id="used_byid" value="" required>
				<br>
				<div class="am-cf">
					<input type="button" name="" value="提 交" id="subbmit"
						class="am-btn am-btn-primary am-btn-sm am-fl" onclick = "edit_wrkc()">
					<input type="button" name="" value="取 消" id="registerid"
						class="am-modal-btn" style="color:#000000;
						background-color: #f0f0f0;border-color: #000000;margin-left: 30px;"
					>
				</div>
			</form>
    		</div>
		</div>
	</div>
	
	<div class="am-modal am-modal-alert" tabindex="-1" id="mach_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd" id = "mach_edit_title">编辑设备</div>
    		<div class="am-modal-bd">
      			<div class="am-u-lg-12 am-u-sm-centered" style="margin-top:50px" >
      			<div class="am-g">
				  <div class="am-u-sm-6"><input type="text" class="am-form-field am-radius" name="add_mach"	id="add_machid" value="" minlength="1" placeholder="输入设备代码"></div>
				  <div class="am-u-sm-6"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_mach('add_mach')">添加设备</button></div>				  
		  		  <hr>
		  		</div>
					<div class="row" >
				  	<div class="col-md-8 am-u-xx-centered" >
				  	<div style="height:200px;overflow-y:auto">
				  		<table class="am-table am-table-striped am-table-hover" id = "mach_table" style="text-align:left;">
			    			<thead >
					        <tr>
					            <th>设备代码</th>
					            <th>操作</th>
					        </tr>
			    			</thead>
			    			<tbody id = "mach_body">
			    			
			    			</tbody>
			    			</table>
			    			</div>
			    			<div class="am-cf">
							<input type="button" name="" value="确定" onclick = "$('#mach_edit').modal('toggle');"
								class="am-btn am-btn-primary am-btn-sm am-fl" >
							</div>
				  	</div>
				  	</div>
				</div>
    		</div>
    		
		</div>
	</div>
	
	<div class="am-modal am-modal-alert" tabindex="-1" id="user_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd" id = "user_edit_title">编辑用户</div>
    		<div class="am-modal-bd">
      			<div class="am-u-lg-12 am-u-sm-centered" style="margin-top:50px" >
      			<div class="am-g">
				  <div class="am-u-sm-4"><input type="text" class="am-form-field am-radius" id="add_userid" value="" minlength="1" placeholder="输入用户id"></div>
				  <div class="am-u-sm-4">
				    <label class="am-radio-inline">
		        	<input type="radio"  value="Y" name="user_auth" id="userradioy">编辑
		      		</label>
		      		<label class="am-radio-inline">
		        	<input type="radio"  value="N" name="user_auth" id="userradion" checked>只读
		      		</label>
		      	  </div>
				  <div class="am-u-sm-4"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_user('add_user')">添加用户</button></div>				  
		  		  <hr>
		  		</div>
					<div class="row" >
				  	<div class="col-md-8 am-u-xx-centered" >
				  	<div style="height:200px;overflow-y:auto">
				  		<table class="am-table am-table-striped am-table-hover" id = "user_table" style="text-align:left;">
			    			<thead >
					        <tr>
					            <th>用户id</th>
					            <th>权限</th>
					            <th>操作</th>
					        </tr>
			    			</thead>
			    			<tbody id = "user_body">
			    			
			    			</tbody>
			    			</table>
			    			</div>
			    			<div class="am-cf">
							<input type="button" name="" value="确定" onclick = "$('#user_edit').modal('toggle');"
								class="am-btn am-btn-primary am-btn-sm am-fl" >
							</div>
				  	</div>
				  	</div>
				</div>
    		</div>
    		
		</div>
	</div>
	
				
<script>
$(function() {
	  init();
	  
});

function init(){
	  document.getElementById("table_wapper").style.height = ""+0.6*window.screen.height+"px";
	  <%String app_url =  request.getQueryString();%>
	  <%char menuid = app_url.charAt(app_url.length()-1);%>
	  var menuid = '<%=menuid%>';
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
				  "<li ><a href = \"#\" onclick=\"location='"+url+menuid+"'\">"+name+"  "+"</a></li>"
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
				  "<li ><a href = \"#\" onclick=\"location='"+tmpappurl+tmpm+"'\">"+tmpappname+"</a></li>"
		  );
		}
	  }
function menuclick(id){
	  var $l1 = $('#'+id);
	  $l1.dropdown("toggle");
	    
}
function mach_click(action,wrkc){
	wmethod = "mach_click";
	mach_wrkc = wrkc;
	jsondata = {};
	jsondata.method = wmethod;
	jsondata.wrkc = wrkc;
	document.getElementById("mach_edit_title").innerHTML = "编辑设备——"+"工作中心代码: "+wrkc;
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#mach_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#mach_body').append(
               	'<tr>'+'<td>'+result[i].MACH+'</td>'
               	+'<td><a href="#" onclick = "delete_mach(\'delete_mach\','+"'"+result[i].MACH+"'"+')"> 删除</a></td></tr>'
               )}  
               
           }       
        ,  
            error : function(data) {  
                $('#mach_body').append("获取数据失败！");  
            } 
			
} );
	$('#mach_edit').modal('toggle');
}
function delete_mach(action,mach){
	var jsondata = {};
	jsondata.method = action;
	jsondata.wrkc = mach_wrkc;
	jsondata.mach = mach;
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#mach_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#mach_body').append(
               	'<tr>'+'<td>'+result[i].MACH+'</td>'
               	+'<td><a href="#" onclick = "delete_mach(\'delete_mach\','+"'"+result[i].MACH+"'"+')"> 删除</a></td></tr>'
               )}  
               
           }       
        ,  
            error : function(data) {  
                $('#mach_body').append("获取数据失败！");  
            } 
			
} );
}
function add_mach(action){
	var jsondata = {};
	jsondata.method = action;
	jsondata.wrkc = mach_wrkc;
	jsondata.mach = document.getElementById("add_machid").value;
	if(jsondata.mach == "" || jsondata.mach == " " || jsondata.mach == null){ 
		alert("请正确输入设备代码");
		return;
	}
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#mach_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#mach_body').append(
               	'<tr>'+'<td>'+result[i].MACH+'</td>'
               	+'<td><a href="#" onclick = "delete_mach(\'delete_mach\','+"'"+result[i].MACH+"'"+')"> 删除</a></td></tr>'
               )}  
               
           }       
        ,  
            error : function(data) {  
                $('#mach_body').append("获取数据失败！");  
            } 
			
} );
}
function user_click(action,wrkc){
	user_wrkc = wrkc;
	wmethod = "user_click";
	jsondata = {};
	jsondata.method = wmethod;
	jsondata.wrkc = wrkc;
	document.getElementById("user_edit_title").innerHTML = "编辑用户——"+"工作中心代码: "+wrkc;
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#user_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
        	   var ycheck = "";
        	   var ncheck = "";
        	   if(result[i].AUTH == 'Y') ycheck = "checked";
        	   if(result[i].AUTH == 'N') ncheck = "checked";
               $('#user_body').append(
               	'<tr>'+'<td>'+result[i].UID+'</td>'+'<td><label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidy" '+ycheck+'>编辑</label>'
	      		+'<label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidn" '+ncheck+'>只读</label></td>'
               	+'<td><a href="#" onclick = "edit_user(\'edit_user\','+"'"+result[i].UID+"'"+')"> 更改</a>'
	      		+'<a href="#" onclick = "delete_user(\'delete_user\','+"'"+result[i].UID+"'"+')"> 删除</a></td></tr>'
               )}  
               
           }       
        ,  
            error : function(data) {  
                $('#user_body').append("获取数据失败！");  
            } 
			
} );
	$('#user_edit').modal('toggle');
}
function add_user(action){
	var jsondata = {};
	jsondata.method = action;
	jsondata.wrkc = user_wrkc;
	if(document.getElementById("userradioy").checked){
		jsondata.auth = 'Y';
	}
	else{
		jsondata.auth = 'N';
	}
	jsondata.uid = document.getElementById("add_userid").value;
	if(jsondata.uid == "" || jsondata.uid == " " || jsondata.uid == null){ 
		alert("请正确输入 用户id");
		return;
	}
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#user_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
        	   var ycheck = "";
        	   var ncheck = "";
        	   if(result[i].AUTH == 'Y') ycheck = "checked";
        	   if(result[i].AUTH == 'N') ncheck = "checked";
               $('#user_body').append(
               	'<tr>'+'<td>'+result[i].UID+'</td>'+'<td><label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidy" '+ycheck+'>编辑</label>'
	      		+'<label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidn" '+ncheck+'>只读</label></td>'
               	+'<td><a href="#" onclick = "edit_user(\'edit_user\','+"'"+result[i].UID+"'"+')"> 更改</a>'
	      		+'<a href="#" onclick = "delete_user(\'delete_user\','+"'"+result[i].UID+"'"+')"> 删除</a></td></tr>'
               )}  
               
           }       
        ,  
            error : function(data) {  
                $('#user_body').append("获取数据失败！");  
            } 
			
} );
}
function edit_user(action,uid){
	var jsondata = {};
	jsondata.method = action;
	jsondata.uid = uid;
	jsondata.wrkc = user_wrkc;
	if(document.getElementById(uid+"userradioidy").checked){
		jsondata.auth = 'Y';
	}
	else{
		jsondata.auth = 'N';
	}
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#user_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
        	   var ycheck = "";
        	   var ncheck = "";
        	   if(result[i].AUTH == 'Y') ycheck = "checked";
        	   if(result[i].AUTH == 'N') ncheck = "checked";
               $('#user_body').append(
               	'<tr>'+'<td>'+result[i].UID+'</td>'+'<td><label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidy" '+ycheck+'>编辑</label>'
	      		+'<label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidn" '+ncheck+'>只读</label></td>'
               	+'<td><a href="#" onclick = "edit_user(\'edit_user\','+"'"+result[i].UID+"'"+')"> 更改</a>'
	      		+'<a href="#" onclick = "delete_user(\'delete_user\','+"'"+result[i].UID+"'"+')"> 删除</a></td></tr>'
               )}  
               alert("更新成功！");
           }       
        ,  
            error : function(data) {  
                $('#user_body').append("获取数据失败！");  
            } 
			
} );
}
function delete_user(action,uid){
	var jsondata = {};
	jsondata.method = action;
	jsondata.uid = uid;
	jsondata.wrkc = user_wrkc;
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#user_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
        	   var ycheck = "";
        	   var ncheck = "";
        	   if(result[i].AUTH == 'Y') ycheck = "checked";
        	   if(result[i].AUTH == 'N') ncheck = "checked";
               $('#user_body').append(
               	'<tr>'+'<td>'+result[i].UID+'</td>'+'<td><label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidy" '+ycheck+'>编辑</label>'
	      		+'<label class="am-radio-inline"><input type="radio" name="'+result[i].UID+'userradio" id="'+result[i].UID+'userradioidn" '+ncheck+'>只读</label></td>'
               	+'<td><a href="#" onclick = "edit_user(\'edit_user\','+"'"+result[i].UID+"'"+')"> 更改</a>'
	      		+'<a href="#" onclick = "delete_user(\'delete_user\','+"'"+result[i].UID+"'"+')"> 删除</a></td></tr>'
               )}  
               
           }       
        ,  
            error : function(data) {  
                $('#user_body').append("获取数据失败！");  
            } 
			
} );
}
  function delete_click(action,wrkc) {  
  	  var jsondata = {};
  	  jsondata.method = action;
  	  jsondata.wrkc = wrkc;
	  if(action=="delete"){
		  $.ajax({  
	            type : 'POST',  
	            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
	            url : 'wrkc',  
	            data : jsondata,  
	            dataType : 'html',  
	            success : function(data) { 
	        	   var result = JSON.parse(data);  
	                 
	               $('#user_table tbody tr').remove();//移除先前数据  
	               for ( var i = 0; i < result.length; i++) {  
	                   $('#user_table tbody').append(
	                   	'<tr>'+'<td>'+result[i].WRKC+'</td>'+'<td>'+result[i].WRKC_NAME
	                   	+'</td>'+'<td>'+result[i].PLANT+'</td>'
	                   	+'<td>'+result[i].USED+'</td>'+'<td>'+result[i].USED_BY+'</td>'
	                   	+'<td><a href="#" onclick = "edit_click(\'edit\',\''+result[i].WRKC+'\',\''+result[i].WRKC_NAME+'\',\''+result[i].PLANT+'\',\''+result[i].USED+'\',\''+result[i].USED_BY+'\')">编辑 </a>'
	                   	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].WRKC+"'"+')"> 删除</a>'
	                   	+'<a href="#" onclick = "mach_click(\'mach\','+"'"+result[i].WRKC+"'"+')"> 设备</a>'
	                   	+'<a href="#" onclick = "user_click(\'user\','+"'"+result[i].WRKC+"'"+')"> 用户</a>'
	                   	+'<a href="#" onclick = "reset_click(\'reset\','+"'"+result[i].WRKC+'\')"> 重置</a></td></tr>'
	                   )}  
	                   
	               }       
	            ,  
	                error : function(data) {  
	                    $('#user_table tbody').append("获取数据失败！");  
	                } 
	  			
	  } );
	  }
	  
	  }
  function edit_click(action,wrkc,wrkc_name,plant,used,used_by){
	  wmethod = "edit";
	  former_wrkc = wrkc;
	  document.getElementById("wrkcid").value = wrkc;
	  document.getElementById("wrkc_nameid").value = wrkc_name;
	  document.getElementById("plantid").value = plant;
	  document.getElementById("used_byid").value = used_by;
	  if(used == "Y"){
		  document.getElementById("radioy").checked = true;
	  }
	  else if(used == "N"){
		  document.getElementById("radion").checked = true;
	  }
	  $('#wrkc_edit').modal('toggle');
  }
  function reset_click(action,wrkc){
	  var jsondata = {};
	  jsondata.method = "reset";
	  jsondata.wrkc = wrkc;
	  $.ajax({  
	        type : 'POST',  
	        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
	        url : 'wrkc',  
	        data : jsondata,  
	        dataType : 'html',  
	        success : function(data) { 
	    	   var result = JSON.parse(data);  
	             
	           $('#user_table tbody tr').remove();//移除先前数据  
	           for ( var i = 0; i < result.length; i++) {  
	               $('#user_table tbody').append(
	               	'<tr>'+'<td>'+result[i].WRKC+'</td>'+'<td>'+result[i].WRKC_NAME
	               	+'</td>'+'<td>'+result[i].PLANT+'</td>'
	               	+'<td>'+result[i].USED+'</td>'+'<td>'+result[i].USED_BY+'</td>'
	               	+'<td><a href="#" onclick = "edit_click(\'edit\',\''+result[i].WRKC+'\',\''+result[i].WRKC_NAME+'\',\''+result[i].PLANT+'\',\''+result[i].USED+'\',\''+result[i].USED_BY+'\')">编辑 </a>'
	               	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].WRKC+"'"+')"> 删除</a>'
	               	+'<a href="#" onclick = "mach_click(\'mach\','+"'"+result[i].WRKC+"'"+')"> 设备</a>'
	               	+'<a href="#" onclick = "user_click(\'user\','+"'"+result[i].WRKC+"'"+')"> 用户</a>'
	               	+'<a href="#" onclick = "reset_click(\'reset\','+"'"+result[i].WRKC+'\')"> 重置</a></td></tr>'
	               )}  
	               
	           }       
	        ,  
	            error : function(data) {  
	                $('#user_table tbody').append("获取数据失败！");  
	            } 
				
	} );
  }
  function add_click(){
	  wmethod = "add";
	  former_wrkc = "";
	  document.getElementById("wrkcid").value = "";
	  document.getElementById("wrkc_nameid").value = "";
	  document.getElementById("plantid").value = "";
	  document.getElementById("used_byid").value = "";
	  document.getElementById("radioy").checked = true;
	  $('#wrkc_edit').modal('toggle');
	}
function edit_wrkc() {  
	$('#wrkc_edit').modal('toggle');
	var jsondata = {};
	jsondata.wrkc = document.getElementById("wrkcid").value;
	jsondata.wrkc_name = document.getElementById("wrkc_nameid").value;
	jsondata.plant = document.getElementById("plantid").value;
	jsondata.used_by = document.getElementById("used_byid").value;
	jsondata.method = wmethod;
	jsondata.former_wrkc = former_wrkc;
	if(document.getElementById("radioy").checked == true){
		jsondata.used = "Y";
	}
	else{
		jsondata.used = "N";
	}
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'wrkc',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
             
           $('#user_table tbody tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#user_table tbody').append(
               	'<tr>'+'<td>'+result[i].WRKC+'</td>'+'<td>'+result[i].WRKC_NAME
               	+'</td>'+'<td>'+result[i].PLANT+'</td>'
               	+'<td>'+result[i].USED+'</td>'+'<td>'+result[i].USED_BY+'</td>'
               	+'<td><a href="#" onclick = "edit_click(\'edit\',\''+result[i].WRKC+'\',\''+result[i].WRKC_NAME+'\',\''+result[i].PLANT+'\',\''+result[i].USED+'\',\''+result[i].USED_BY+'\')">编辑 </a>'
               	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].WRKC+"'"+')"> 删除</a>'
               	+'<a href="#" onclick = "mach_click(\'mach\','+"'"+result[i].WRKC+"'"+')"> 设备</a>'
               	+'<a href="#" onclick = "user_click(\'user\','+"'"+result[i].WRKC+"'"+')"> 用户</a>'
               	+'<a href="#" onclick = "reset_click(\'reset\','+"'"+result[i].WRKC+'\')"> 重置</a></td></tr>'
               )}  
               
           }       
        ,  
            error : function(data) {  
                $('#user_table tbody').append("获取数据失败！");  
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