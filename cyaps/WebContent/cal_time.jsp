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
			  <div class="am-u-sm-2"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_click()">添加日历时间</button></div>
			  <div class="am-u-sm-6"><input type="text" id = "search" class="am-form-field am-input-sm col-md-4" placeholder="Search by name" onkeydown="onSearch()"></div>
		  </div>
		  <div>
		  
		  
		  </div>
		  <hr>
		  	<table class="am-table am-table-striped am-table-hover" id = "calws_table">
    			<thead >
		        <tr>
		            <th>ID</th>
		            <th>类型</th>
		            <th>PLANT</th>
		            <th>工作中心</th>
		            <th>设备</th>
		            <th>日历</th>
		            <th>工作时间</th>
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
    			rs = st.executeQuery("select * from dta_cal_ws");
    			%>
    			
    			<% while (rs.next()) { %>  
    			<%String menurole = ""; %>
		            <tr>  
		            	<td><%=rs.getString(1) %></td>  
		                <td><%=rs.getString(2) %></td>  
		                <td><%=rs.getString(3) %></td>  
		                <td><%=rs.getString(4) %></td>  
		                <td><%=rs.getString(5) %></td>  	
		                <td><%=rs.getString(6) %></td>  
		                <td><%=rs.getString(7) %></td>  			            
		                <td>
  							<a href="#" onclick = "edit_click('edit','<%=rs.getString(1)%>','<%=rs.getString(2)%>','<%=rs.getString(3)%>','<%=rs.getString(4)%>','<%=rs.getString(5)%>','<%=rs.getString(6)%>','<%=rs.getString(7)%>')">编辑</a>
  							<a href="#" onclick = "cstm_click('cstm','<%=rs.getString(1)%>','<%=rs.getString(2)%>','<%=rs.getString(3)%>','<%=rs.getString(4)%>','<%=rs.getString(5)%>')">日历</a>
			            	<a href="#" onclick = "delete_click('delete','<%=rs.getString(1)%>')">删除</a>
			            </td>
			            
		            </tr>  
			        <%  }  %>  
    			</tbody>
			</table>
		  </div>
		</div>
	</div>
	<div class="am-modal am-modal-alert" tabindex="-1" id="calws_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">日历时间编辑</div>
    		<div class="am-modal-bd">
      		<form method="post" class="am-form">
      		<div class="am-g am-g-fixed">
      			<div class="am-u-sm-6">
				<label>类型</label>
				<select data-am-selected id="select_typeid" onchange="select_type()">
				  <option value="P" id="plantselid">Plant</option>
				  <option value="W" id="wrkcselid">Wrkc</option>
				  <option value="M" id="machselid" selected>Mach</option>
				</select>
				</div>
				<div class="am-u-sm-6">
				<label>PLANT</label>
				<input type="text" id="plantid" value="" required>
				</div>
			</div>
			<div class="am-g am-g-fixed">
				<div class="am-u-sm-6">
				<label>WRKC</label>
				<input type="text" id="wrkcid" value="" >
				</div>
				<div class="am-u-sm-6">
				<label>MACH</label>
				<input type="text" id="machid" value="" >
				</div>
			</div>
			<div class="am-g am-g-fixed" id = "cal_time_div_id">
				<div class="am-u-sm-6">
				<label>日历</label>
				<input type="text" id="calid" value="" required>
				</div>
				<div class="am-u-sm-6">
				<label>工作时间</label>
				<input type="text" id="timeid" value="" required>
				</div>
			</div>
			
			<hr>
				<div class="am-cf">
					<input type="button" name="" value="提 交" id="subbmit"
						class="am-btn am-btn-primary am-btn-sm am-fl" onclick = "edit_calws()">
					<input type="button" name="" value="取 消" id="registerid"
						class="am-modal-btn" style="color:#000000;
						background-color: #f0f0f0;border-color: #000000;margin-left: 30px;"
					>
				</div>
			</form>
    		</div>
		</div>
	</div>
	
	<div class="am-modal am-modal-alert" tabindex="-1" id="cstm_edit">
		<div class="am-modal-dialog">
			<div class="am-modal-hd" id = "cstm_edit_title">编辑日历</div>
    		<div class="am-modal-bd">
      			<div class="am-u-lg-12 am-u-sm-centered" style="margin-top:50px" >
      			<div class="am-g">
				  <div class="am-u-sm-6"><input type="text" class="am-form-field am-radius" name="add_cstm"	id="cstm_dayid" value="" minlength="1" placeholder="输入日期"></div>
				  <div class="am-u-sm-6"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_cstm('add_cstm')">添加日历</button></div>				  
		  		  <hr>
		  		  <h4>Start time:</h4>
				<div class="am-g am-g-fixed">
				  <div class="am-u-sm-5"><input type="text" class="am-form-field"
					id="starttimehid" value="" minlength="1"  required>
				  </div>
				  <div class="am-u-sm-2">
				  :
				  </div>
				  <div class="am-u-sm-5">
					<input type="text" class="am-form-field"
					id="starttimemid" value="" minlength="1"  required>
				  </div>
				</div>
				 <h4>End time:</h4>
				<div class="am-g am-g-fixed">
				  <div class="am-u-sm-5"><input type="text" class="am-form-field"
					id="endtimehid" value="" minlength="1"  required>
				  </div>
				  <div class="am-u-sm-2">
				  :
				  </div>
				  <div class="am-u-sm-5">
					<input type="text" class="am-form-field"
					id="endtimemid" value="" minlength="1"  required>
				  </div>
				</div>
		  		</div>
					<div class="row" >
				  	<div class="col-md-8 am-u-xx-centered" >
				  	<div style="height:200px;overflow-y:auto">
				  		<table class="am-table am-table-striped am-table-hover" id = "cstm_table" style="text-align:left;">
			    			<thead >
					        <tr>
					            <th>日期</th>
					            <th>开始时间</th>
					            <th>结束时间</th>
					        </tr>
			    			</thead>
			    			<tbody id = "cstm_body">
			    			
			    			</tbody>
			    			</table>
			    			</div>
			    			<div class="am-cf">
							<input type="button" name="" value="确定" onclick = "$('#cstm_edit').modal('toggle');"
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
function select_type(){
	if(document.getElementById("select_typeid").value == 'P'){
		document.getElementById("plantid").disabled = false;
		document.getElementById("wrkcid").disabled = true;
		document.getElementById("machid").disabled = true;
		document.getElementById("wrkcid").value = "";
		document.getElementById("machid").value = "";
	}
	if(document.getElementById("select_typeid").value == 'W'){
		document.getElementById("plantid").disabled = false;
		document.getElementById("wrkcid").disabled = false;
		document.getElementById("machid").disabled = true;
		document.getElementById("machid").value = "";
	}
	if(document.getElementById("select_typeid").value == 'M'){
		document.getElementById("plantid").disabled = false;
		document.getElementById("wrkcid").disabled = false;
		document.getElementById("machid").disabled = false;
	}
	
}
function cstm_click(action,id,type,plant,wrkc,mach){
	wmethod = "cstm_click";
	jsondata = {};
	jsondata.method = wmethod;
	jsondata.wrkc = wrkc;
	jsondata.type = type;
	jsondata.plant = plant;
	jsondata.mach = mach;
	cstm_wrkc = wrkc;
	cstm_type = type;
	cstm_plant = plant;
	cstm_mach = mach;
	var str_title = "";
	if(type == 'P') str_title = plant;
	if(type == 'W') str_title = wrkc;
	if(type == 'M') str_title = mach;
	document.getElementById("cstm_edit_title").innerHTML = "编辑日历——"+""+str_title;
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'cal_time',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#cstm_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#cstm_body').append(
               	'<tr>'+'<td>'+result[i].CSTM_DATE+'</td>'+'<td>'+result[i].starttime1+'</td>'+'<td>'+result[i].endtime1+'</td>'
               	+'<td><a href="#" onclick = "delete_cstm(\'delete_cstm\','+"'"+result[i].CSTM_TYPE+"',"+"'"+result[i].PLANT+"',"+"'"+result[i].WRKC+"',"+"'"+result[i].MACH
               			+"',"+"'"+result[i].CSTM_DATE+"',"+"'"+result[i].starttime+"',"+"'"+result[i].endtime+"'"+')"> 删除</a></td></tr>'
               )} 
               
           }       
        ,  
            error : function(data) {  
                $('#cstm_body').append("获取数据失败！");  
            } 
			
	} );
	$('#cstm_edit').modal('toggle');
	
}
function add_cstm(action){
	jsondata = {};
	jsondata.method = action;
	var cstm_date = document.getElementById("cstm_dayid").value;
	jsondata.cstm_date = cstm_date;
	var sh = document.getElementById("starttimehid").value;
	var sm = document.getElementById("starttimemid").value;
	var eh = document.getElementById("endtimehid").value;
	var em = document.getElementById("endtimemid").value;
	jsondata.starttime = sh+""+sm+"00";
	jsondata.endtime = eh+""+em+"00";
	jsondata.type = cstm_type;
	jsondata.plant = cstm_plant;
	jsondata.wrkc = cstm_wrkc;
	jsondata.mach = cstm_mach;
	var reg1 = new RegExp("^1[0-9]$");
	var reg2 = new RegExp("^2[0-4]$");
	var reg3 = new RegExp("^[0][0-9]$");
	var reg4 = new RegExp("^[0-5][0-9]$");
	
	var reg5 = new RegExp("^20[0-9][0-9]-0[1-9]-0[1-9]$");
	var reg6 = new RegExp("^20[0-9][0-9]-0[1-9]-[1-3][0-9]$");
	var reg7 = new RegExp("^20[0-9][0-9]-1[0-2]-0[1-9]$");
	var reg8 = new RegExp("^20[0-9][0-9]-1[0-2]-[1-3][0-9]$");
	if(!reg5.test(cstm_date) && !reg6.test(cstm_date) && !reg7.test(cstm_date)&& !reg8.test(cstm_date)){
		alert("请正确输入日期！");
		return;
	}
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
	if(!reg4.test(em)){
		alert("请正确输入结束时间！");
		return;
	}
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'cal_time',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#cstm_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#cstm_body').append(
               	'<tr>'+'<td>'+result[i].CSTM_DATE+'</td>'+'<td>'+result[i].starttime1+'</td>'+'<td>'+result[i].endtime1+'</td>'
               	+'<td><a href="#" onclick = "delete_cstm(\'delete_cstm\','+"'"+result[i].CSTM_TYPE+"',"+"'"+result[i].PLANT+"',"+"'"+result[i].WRKC+"',"+"'"+result[i].MACH
               			+"',"+"'"+result[i].CSTM_DATE+"',"+"'"+result[i].starttime+"',"+"'"+result[i].endtime+"'"+')"> 删除</a></td></tr>'
               )} 
               
           }       
        ,  
            error : function(data) {  
                $('#cstm_body').append("获取数据失败！");  
            } 
			
	} );
	
}

function delete_cstm(action,type,plant,wrkc,mach,cstm_date,starttime,endtime){
	jsondata = {};
	jsondata.method = action;
	jsondata.type = type;
	jsondata.plant = plant;
	jsondata.wrkc = wrkc;
	jsondata.mach = mach;
	jsondata.cstm_date = cstm_date;
	jsondata.starttime = starttime;
	jsondata.endtime = endtime;
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'cal_time',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
           $('#cstm_body tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#cstm_body').append(
               	'<tr>'+'<td>'+result[i].CSTM_DATE+'</td>'+'<td>'+result[i].starttime1+'</td>'+'<td>'+result[i].endtime1+'</td>'
               	+'<td><a href="#" onclick = "delete_cstm(\'delete_cstm\','+"'"+result[i].CSTM_TYPE+"',"+"'"+result[i].PLANT+"',"+"'"+result[i].WRKC+"',"+"'"+result[i].MACH
               			+"',"+"'"+result[i].CSTM_DATE+"',"+"'"+result[i].starttime+"',"+"'"+result[i].endtime+"'"+')"> 删除</a></td></tr>'
               )} 
               
           }       
        ,  
            error : function(data) {  
                $('#cstm_body').append("获取数据失败！");  
            } 
			
	} );
	
}

  function delete_click(action,id) {  
  	  var jsondata = {};
  	  jsondata.method = action;
  	  jsondata.id = id;
	  if(action=="delete"){
		  $.ajax({  
	            type : 'POST',  
	            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
	            url : 'cal_time',  
	            data : jsondata,  
	            dataType : 'html',  
	            success : function(data) { 
	        	   var result = JSON.parse(data);  
	                 
	               $('#calws_table tbody tr').remove();//移除先前数据  
	               for ( var i = 0; i < result.length; i++) {  
	                   $('#calws_table tbody').append(
	                   	'<tr>'+'<td>'+result[i].ID+'</td>'+'<td>'+result[i].WCAL_TYPE+'</td>'+'<td>'+result[i].PLANT+'</td>'+'<td>'+result[i].WRKC+'</td>'+'<td>'+result[i].MACH+'</td>'+'<td>'+result[i].CAL_CODE+'</td>'+'<td>'+result[i].WT_CODE+'</td>'
	                   	+'<td><a href="#" onclick = "edit_click(\'edit\','+"'"+result[i].ID+"',"+"'"+result[i].WCAL_TYPE+"',"+"'"+result[i].PLANT+"',"+"'"+result[i].WRKC+"',"+"'"+result[i].MACH+"',"+"'"+result[i].CAL_CODE+"'"+',\''+result[i].WT_CODE+'\')">编辑 </a>'
	                   	+'<a href="#" onclick = "cstm_click(\'cstm\','+"'"+result[i].ID+"',"+"'"+result[i].WCAL_TYPE+"',"+"'"+result[i].PLANT+"',"+"'"+result[i].WRKC+"',"+"'"+result[i].MACH+'\')">日历</a>'
	                   	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].ID+"'"+')"> 删除</a></td></tr>'
	                   	
	                   )}  
	                   
	               }       
	            ,  
	                error : function(data) {  
	                    $('#calws_table tbody').append("获取数据失败！");  
	                } 
	  			
	  } );
	  }
	  
	  }
 
  function add_click(){
	  wmethod = "add";
	  wid="";
	  document.getElementById("plantid").value = "";
	  document.getElementById("wrkcid").value = "";
	  document.getElementById("machid").value = "";
	  document.getElementById("calid").value = "";
	  document.getElementById("timeid").value = "";
	  $('#calws_edit').modal('toggle');
	}
  function edit_click(action,id,type,plant,wrkc,mach,cal_code,wt_code){
	  wmethod = "edit";
	  wid = id;
	  document.getElementById("select_typeid").value = type;
	  document.getElementById("plantid").value = plant;
	  document.getElementById("wrkcid").value = wrkc;
	  document.getElementById("machid").value = mach;
	  document.getElementById("calid").value = cal_code;
	  document.getElementById("timeid").value = wt_code;
	  if(type == 'P'){
		  document.getElementById("plantselid").setAttribute("selected","true");
		  document.getElementById("wrkcselid").removeAttribute("selected");
		  document.getElementById("machselid").removeAttribute("selected");
	  }
	  if(type == 'W'){
		  document.getElementById("plantselid").removeAttribute("selected");
		  document.getElementById("wrkcselid").setAttribute("selected","true");
		  document.getElementById("machselid").removeAttribute("selected");
	  }
	  if(type == 'M'){
		  document.getElementById("plantselid").removeAttribute("selected");
		  document.getElementById("wrkcselid").removeAttribute("selected");
		  document.getElementById("machselid").setAttribute("selected","true");
	  }
	  document.getElementById("plantid").disabled = true;
	  document.getElementById("wrkcid").disabled = true;
	  document.getElementById("machid").disabled = true;
	  document.getElementById("select_typeid").disabled = true;
	  $('#calws_edit').modal('toggle');
  }
function edit_calws() {  
	
	var jsondata = {};
	jsondata.method = wmethod;
	jsondata.id = wid;
	jsondata.wcal_type = document.getElementById("select_typeid").value;
	jsondata.plant = document.getElementById("plantid").value;
	jsondata.wrkc = document.getElementById("wrkcid").value;
	jsondata.mach = document.getElementById("machid").value;
	jsondata.cal_code = document.getElementById("calid").value;
	jsondata.wt_code = document.getElementById("timeid").value;
	if(jsondata.cal_code == "" ||jsondata.cal_code == null){
		alert("请正确输入日历代码");
		return;
	}
	if(jsondata.wt_code == "" ||jsondata.wt_code == null){
		alert("请正确输入时间代码");
		return;
	}
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'cal_time',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
             
           $('#calws_table tbody tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#calws_table tbody').append(
               	'<tr>'+'<td>'+result[i].ID+'</td>'+'<td>'+result[i].WCAL_TYPE+'</td>'+'<td>'+result[i].PLANT+'</td>'+'<td>'+result[i].WRKC+'</td>'+'<td>'+result[i].MACH+'</td>'+'<td>'+result[i].CAL_CODE+'</td>'+'<td>'+result[i].WT_CODE+'</td>'
               	+'<td><a href="#" onclick = "edit_click(\'edit\','+"'"+result[i].ID+"',"+"'"+result[i].WCAL_TYPE+"',"+"'"+result[i].PLANT+"',"+"'"+result[i].WRKC+"',"+"'"+result[i].MACH+"',"+"'"+result[i].CAL_CODE+"'"+',\''+result[i].WT_CODE+'\')">编辑 </a>'
               	+'<a href="#" onclick = "cstm_click(\'cstm\','+"'"+result[i].ID+"',"+"'"+result[i].WCAL_TYPE+"',"+"'"+result[i].PLANT+"',"+"'"+result[i].WRKC+"',"+"'"+result[i].MACH+'\')">日历</a>'
               	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].ID+"'"+')"> 删除</a></td></tr>'
               	
               )}  
           $('#calws_edit').modal('toggle');
           }       
        ,  
            error : function(data) {  
                $('#calws_table tbody').append("获取数据失败！");  
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