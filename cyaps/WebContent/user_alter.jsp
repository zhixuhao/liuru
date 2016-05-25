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
			
				<!-- 计划管理菜单 -->
        		<li class="am-dropdown" data-am-dropdown id="menudir">
       		 		<a class="am-dropdown-toggle" data-am-dropdown-toggle href="javascript:;"><span class="am-icon-caret-down"></span></a>
					<ul class="am-dropdown-content" id = "menudirul" onclick = "menuclick('menudir')">
		            	
		          	</ul>
        		</li>
			
				<!-- 生产管理菜单 -->
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
			  <div class="am-u-sm-2"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_click()">添加用户</button></div>
			  <div class="am-u-sm-6"><input type="text" id = "search" class="am-form-field am-input-sm col-md-4" placeholder="Search by name" onkeydown="onSearch()"></div>
		  </div>
		  <div>
		  
		  
		  </div>
		  <hr>
		  	<table class="am-table am-table-striped am-table-hover" id = "user_table">
    			<thead >
		        <tr>
		            <th>id</th>
		            <th>工号</th>
		            
		            <th>名</th>
		            <th>姓</th>
		            <th>email</th>
		            <th>操作</th>
		        </tr>
    			</thead>
    			<tbody id = "table_body">
    			<%  
    			Connection conn = null;
    			Statement st = null;
    			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    			String url = "jdbc:sqlserver://localhost:1433; DatabaseName=liuru";	
    			String username = "sa";	
    			String password = "zhixuhao";	
    			conn = DriverManager.getConnection(url,username,password);
    			ResultSet rs = null;	
    			st = conn.createStatement();
    			rs = st.executeQuery("select * from sys_user");
    			%>
    			
    			<% while (rs.next()) { %>  
    			<%String menurole = ""; %>
		            <tr>  
		                <td><%=rs.getString(1) %></td>  
		                <td><%=rs.getString(2) %></td>  
		                
		                <td><%=rs.getString(4) %></td>
		                <td><%=rs.getString(5) %></td>
		                <td><%=rs.getString(6) %></td>
		                <td>
  							<a href="#" onclick = "edit_click('edit',<%=rs.getString(1)%>,'<%=rs.getString(2)%>','<%=rs.getString(3)%>','<%=rs.getString(4)%>','<%=rs.getString(5)%>','<%=rs.getString(6)%>')">编辑</a>
  							<a href="#" onclick = "delete_user('delete','<%=rs.getString(2)%>')">删除</a>
  							<%
			    			String sql = "select * from sys_user_menu where uid = '"+rs.getString(2)+"'";
  							Statement stmt1 = conn.createStatement();
  							ResultSet rs1 = stmt1.executeQuery(sql);//返回结果集（游标）
			    			while(rs1.next()){
			    				menurole = menurole + rs1.getString("roleid") +" ";
			    			}
			    			%>
  							<a href="#" onclick = "auth_click('auth','<%=rs.getString(2)%>','<%=menurole%>')">权限管理</a>
			            </td>
			            
		            </tr>  
			        <%  }  %>  
    			</tbody>
			</table>
		  </div>
		</div>
	</div>
	<div class="am-modal am-modal-alert" tabindex="-1" id="user_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">用户信息编辑</div>
    		<div class="am-modal-bd">
      		<form method="post" class="am-form">
				
				<label for="username">工号:</label> 
				<input type="text" name="gonghao"
					id="gonghaoid"  minlength="1"  required> 
					<br> 
				<label for="password">密码:</label>
				<input type="password" name="password" id="passwordid" value="" required><br>
				<div class="am-g am-g-fixed">
				  <div class="am-u-sm-6"><h4>姓:</h4><input type="text" name="lastname"
					id="lastnameid" value="" minlength="1"  required> </div>
				  <div class="am-u-sm-6"><h4>名:</h4><input type="text" name="firstname"
					id="firstnameid" value="" minlength="1"  required></div>
				</div>
			  
			  
			  <br> 
			  <br> 
			  <label for="email">email:</label> 
				<input type="text" name="email" id="emailid"
					 value="" minlength="1"  required> 
					<br> 
				<br />
				<div class="am-cf">
					<input type="button" name="" value="提 交" id="subbmit"
						class="am-btn am-btn-primary am-btn-sm am-fl" onclick = "edit_user()">
					<input type="button" name="" value="取 消" id="registerid"
						class="am-modal-btn" style="color:#000000;
						background-color: #f0f0f0;border-color: #000000;margin-left: 30px;"
					>
				</div>
			</form>
    		</div>
		</div>
	</div>
	<% 
	String menu = (String)session.getAttribute("menuarr");
	menu = menu.trim();
	String []menuarr = menu.split(" ");
	%>
	<div class="am-modal am-modal-alert" tabindex="-1" id="auth_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">用户权限管理</div>
    		<div class="am-modal-bd" >
      		<form method="post" class="am-form">
				<div class="am-g am-g-fixed">
				<div class="am-u-sm-6">
				   <%=menuarr[0] %>
						<select id="menu1" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[1] %>
						<select id="menu2" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				
				
				  <div class="am-u-sm-6">
				   <%=menuarr[2] %>
						<select id="menu3" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[3] %>
						<select id="menu4" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[4] %>
						<select id="menu5" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[5] %>
						<select id="menu6" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				
				
				  <div class="am-u-sm-6">
				   <%=menuarr[6] %>
						<select id="menu7" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[7] %>
						<select id="menu8" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[8] %>
						<select id="menu9" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[9] %>
						<select id="menu10" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				
				
				  <div class="am-u-sm-6">
				   <%=menuarr[10] %>
						<select id="menu11" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[11] %>
						<select id="menu12" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				  <div class="am-u-sm-6">
				   <%=menuarr[12] %>
						<select id="menu13" data-am-selected>
						  <option value="deny">denied</option>
						  <option value="user" selected>user</option>
						  <option value="power">power</option>
						  <option value="admin">admin</option>
						</select>
				  </div>
				
				</div>
				<br>
				<br>
				<br>
				<br>
				
				<div class="am-cf">
					<input type="button" name="" value="提 交" id="subbmit"
						class="am-btn am-btn-primary am-btn-sm am-fl" onclick = "auth_edit()">
					<input type="button" name="" value="取 消" 
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

function init(){
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
  function delete_user(action,uid) {  
	  
  	  var jsondata = {};
  	  jsondata.method = action;
  	  jsondata.id = uid;
	  if(action=="delete"){
		  $.ajax({  
	            type : 'POST',  
	            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
	            url : 'alter_user',  
	            data : jsondata,  
	            dataType : 'html',  
	           success : function(data) { 
	        	   var result = JSON.parse(data);  
	                 
	               $('#user_table tbody tr').remove();//移除先前数据  
	               for ( var i = 0; i < result.length; i++) {  
	                   $('#user_table tbody').append(
	                   	'<tr>'+'<td>'+result[i].ID+'</td>'+'<td>'+result[i].UID
	                   	+'</td>'
	                   	+'<td>'+result[i].FIRSTNAME+'</td>'+'</td>'+'<td>'+result[i].LASTNAME+'</td>'+'<td>'+result[i].EMAIL+'</td>'
	                   	+'<td><a href="#" onclick = "edit_click(\'edit\','+result[i].ID+',\''+result[i].UID+'\',\''+result[i].PSW+'\',\''+result[i].FIRSTNAME+'\',\''+result[i].LASTNAME+'\',\''+result[i].EMAIL+'\',\''+result[i].MENUROLE+'\')">编辑 </a>'
	                   	+'<a href="#" onclick = "delete_user(\'delete\','+"'"+result[i].UID+"'"+')"> 删除</a>'
	                   	+'<a href="#" onclick = "auth_click(\'auth\','+"'"+result[i].UID+"'"+',\''+result[i].MENUROLE+'\')"> 权限管理</a></td></tr>'
	                   )}  
	                   
	               }       
	            ,  
	                error : function(data) {  
	                    $('#user_table tbody').append("获取数据失败！");  
	                } 
	  			
	  } );
	  }
	  
	  }
  function edit_click(action,id,uid,password,firstname,lastname,email){
	  edit_user_id = id;
	  modal_type = "edit";
	  document.getElementById("passwordid").value = password;
	  document.getElementById("emailid").value = email;
	  document.getElementById("firstnameid").value = firstname;
	  document.getElementById("lastnameid").value = lastname;
	  document.getElementById("gonghaoid").value = uid;
	  $('#user_edit').modal('toggle');
  }
  function auth_click(action,uid,menurole){
	  user_authid = uid;
	  var menuroleid = menurole;
	  menuroleid = menuroleid.trim();
	  var menurolearr = menuroleid.split(" ");
	  for(var i = 0;i < menurolearr.length;i++){
		  var tmp = document.getElementById("menu"+(i+1));
		  for(j = 0;j < tmp.length;j++){
			  
			  if(tmp[j].value == menurolearr[i]){
				  tmp[j].setAttribute("selected","true");
			  }
			  else{
				  tmp[j].removeAttribute("selected");
			  }
		  }
	  }
	  $('#auth_edit').modal('toggle');
  }
  function auth_edit(){
	  $('#auth_edit').modal('toggle');
	  var menuauth = "";
	  var jsondata = {};
	  for(var i = 1; i <= 13; i ++){
		  var tmp = document.getElementById("menu"+i);
		  menuauth = menuauth + tmp.value + " ";
	  }
	  jsondata.method = "auth";
	  jsondata.menuauth = menuauth;
	  jsondata.uid = user_authid;
	  $.ajax({  
	        type : 'POST',  
	        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
	        url : 'alter_user',  
	        data : jsondata,  
	        dataType : 'html',  
	        success : function(data) { 
	    	   var result = JSON.parse(data);  
	             
	           $('#user_table tbody tr').remove();//移除先前数据  
	           for ( var i = 0; i < result.length; i++) {  
	               $('#user_table tbody').append(
	               	'<tr>'+'<td>'+result[i].ID+'</td>'+'<td>'+result[i].UID
	               	+'</td>'
	               	+'<td>'+result[i].FIRSTNAME+'</td>'+'<td>'+result[i].LASTNAME+'</td>'+'<td>'+result[i].EMAIL+'</td>'
	               	+'<td><a href="#" onclick = "edit_click(\'edit\','+result[i].ID+',\''+result[i].UID+'\',\''+result[i].PSW+'\',\''+result[i].FIRSTNAME+'\',\''+result[i].LASTNAME+'\',\''+result[i].EMAIL+'\',\''+result[i].MENUROLE+'\')">编辑 </a>'
	               	+'<a href="#" onclick = "delete_user(\'delete\','+"'"+result[i].UID+"'"+')"> 删除</a>'
	               	+'<a href="#" onclick = "auth_click(\'auth\','+"'"+result[i].UID+"'"+',\''+result[i].MENUROLE+'\')"> 权限管理</a></td></tr>'
	               )}  
	               
	           }   
	        ,  
	            error : function(data) {  
	                $('#user_table tbody').append("获取数据失败！");  
	            } 
				
	} );
  }
  function add_click(){
		modal_type = "add";
		  document.getElementById("passwordid").value = "";
		  document.getElementById("emailid").value = "";
		  document.getElementById("firstnameid").value = "";
		  document.getElementById("lastnameid").value = "";
		  document.getElementById("gonghaoid").value = "";
		$('#user_edit').modal('toggle');
	}
function edit_user() {  
	$('#user_edit').modal('toggle');
	var jsondata = {};
	jsondata.password = document.getElementById("passwordid").value;
	jsondata.email = document.getElementById("emailid").value;
	jsondata.firstname = document.getElementById("firstnameid").value;
	jsondata.lastname = document.getElementById("lastnameid").value;
	jsondata.uid = document.getElementById("gonghaoid").value;
	if(modal_type == "edit"){
		jsondata.id = edit_user_id;  
		jsondata.method = "edit";
	}
	if(modal_type == "add"){
		jsondata.id = 0;  
		jsondata.method = "add";
	}
	
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',  
        url : 'alter_user',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#user_table tbody tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#user_table tbody').append(
               	'<tr>'+'<td>'+result[i].ID+'</td>'+'<td>'+result[i].UID
               	+'</td>'
               	+'<td>'+result[i].FIRSTNAME+'</td>'+'<td>'+result[i].LASTNAME+'</td>'+'<td>'+result[i].EMAIL+'</td>'
               	+'<td><a href="#" onclick = "edit_click(\'edit\','+result[i].ID+',\''+result[i].UID+'\',\''+result[i].PSW+'\',\''+result[i].FIRSTNAME+'\',\''+result[i].LASTNAME+'\',\''+result[i].EMAIL+'\',\''+result[i].MENUROLE+'\')">编辑 </a>'
               	+'<a href="#" onclick = "delete_user(\'delete\','+"'"+result[i].UID+"'"+')"> 删除</a>'
               	+'<a href="#" onclick = "auth_click(\'auth\','+"'"+result[i].UID+"'"+',\''+result[i].MENUROLE+'\')"> 权限管理</a></td></tr>'
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