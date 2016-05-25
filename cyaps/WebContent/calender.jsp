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
    <script type="text/javascript" src="muban/js/jquery.hovertreescroll.js"></script>
    <script  src="muban/js/bootstrap.min.js"></script>
    <script src="<%=request.getContextPath()%>/amazeui/js/amazeui.ie8polyfill.min.js"></script>
	<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.ie8polyfill.js"></script>
	<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.js"></script>
	<style>
	.td1{
	color:#ff0000;
	font-weight:bold;
	}
	</style>
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
			  <div class="am-u-sm-2"><button type="button" class="am-btn am-btn-secondary am-round" onclick = "add_click()">创建日历</button></div>
			  <div class="am-u-sm-6"><input type="text" id = "search" class="am-form-field am-input-sm col-md-4" placeholder="Search by name" onkeydown="onSearch()"></div>
		  </div>
		  <div>
		  
		  
		  </div>
		  <hr>
		  	<table class="am-table am-table-striped am-table-hover" id = "cal_table">
    			<thead >
		        <tr>
		            <th>日历代码</th>
		            <th>描述</th>
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
    			rs = st.executeQuery("select * from dta_cal");
    			%>
    			
    			<% while (rs.next()) { %>  
    			<%String menurole = ""; %>
		            <tr>  
		                <td><%=rs.getString(2) %></td>  
		                <td><%=rs.getString(3) %></td>  		            
		                <td>
  							<a href="#" onclick = "edit_click('edit','<%=rs.getString(2)%>','<%=rs.getString(3)%>','<%=rs.getString(4)%>')">编辑</a>
  							<a href="#" onclick = "delete_click('delete','<%=rs.getString(2)%>')">删除</a>
			            </td>
			            
		            </tr>  
			        <%  }  %>  
    			</tbody>
			</table>
		  </div>
		</div>
	</div>
	<br>
	<br>
	<br>
	<br>
	<br>
	<br>
	<br>
	<br>
	<div class="am-u-lg-10 am-u-sm-centered" id = "calender_editid" style="display:none;padding-top:50px">
		<div class="am-g am-g-fixed am-u-sm-10">
      			<div class="am-u-sm-2">
				<label>日历代码:</label>
				</div>
				<div class="am-u-sm-2">
				<input type="text" id="calid" class="am-form-field" value="" required>
				</div>
				<div class="am-u-sm-1">
				<label>描述:</label>
				</div>
				<div class="am-u-sm-3">
				<input type="text" id="cal_nameid" class="am-form-field" value="" required>
				</div>
				<div class="am-u-sm-1">
				<label>年份:</label>
				</div>
				<div class="am-u-sm-2">
				<input type="text" id="cal_yearid" class="am-form-field" value="" required>
				</div>
				
			</div>
			<div class="am-u-sm-2">
				<button type="button" class="am-btn am-btn-primary" onclick = "edit_cal()">提交</button>
			</div>
			<br>
			<br>
			<br>
			<br>
			<hr>
		<div class="row" >
            <div class="col-sm-3" id = "month1"></div>
            <div class="col-sm-3" id = "month2"></div>
            <div class="col-sm-3" id = "month3"></div>
            <div class="col-sm-3" id = "month4"></div>
        </div>
        <div class="row">
            <div class="col-sm-3" id = "month5"></div>
            <div class="col-sm-3" id = "month6"></div>
            <div class="col-sm-3" id = "month7"></div>
            <div class="col-sm-3" id = "month8"></div>
        </div>
        <div class="row">    
            <div class="col-sm-3" id = "month9"></div>
            <div class="col-sm-3" id = "month10"></div>
            <div class="col-sm-3" id = "month11"></div>
            <div class="col-sm-3" id = "month12"></div>
        </div>
	</div>
<script>
function tdclick(obj){
	
	if(obj.className == "td1") obj.className = "";
	else obj.className = "td1";
}
function init_cal(code){
	$('#calender_editid')[0].style.display = 'block';
	var arrcode = code.split("");
	var monthl = [31,29,31,30,31,30,31,31,30,31,30,31];
	var startday = [5,1,2,5,7,3,5,1,4,6,2,4];
	for(var m = 1; m <= monthl.length;m++){
		
		
	var appendtext = '';
	for(var r = 1; r <= 6;r++){
		appendtext = appendtext+'<tr>';
		for(var c = 1; c <= 7;c++){
			
			appendtext = appendtext+'<td '+'id="'+'m'+m+'r'+r+'c'+c+'" onclick="tdclick(this)"></td>';
			
		}
		
			appendtext = appendtext+'</tr>'	;
	}
	
			$('#month'+m+' tbody tr').remove();
			$('#month'+m+' tbody').append(appendtext);
	}
	var nocode = 0;
	for(var m = 1; m <= monthl.length;m++){
		var tdays = monthl[m-1];
		var sday = startday[m-1];
		for(var d = 1;d <= tdays;d++){
			var row = Math.floor((d+sday-1)/7 + 1);
			var col = (d+sday-1)%7;
			if(col == 0){
				row = row -1;
				col = 7;
			}
			var tdid = "m"+m+"r"+row+"c"+col;
			$("#"+tdid)[0].innerText = d;
			if(arrcode[nocode] == 'W'){
				$("#"+tdid)[0].className = "td1";
			}
			nocode++;
		}
	}
}
function get_rest(){
	var redclass =  document.getElementsByClassName("td1");
	var monthl = [31,29,31,30,31,30,31,31,30,31,30,31];
	var startday = [5,1,2,5,7,3,5,1,4,6,2,4];
	var code = [];
	for(var i = 0;i<366;i++){
		code[i] = 'A';
	}
	for(var i = 0; i < redclass.length;i++){
		//alert(redclass[i].id);
		var redid = redclass[i].id;
		var row = parseInt(redid[redid.length-3]);
		var col = parseInt(redid[redid.length-1]);
		var month = '';
		if(redid.length == 7){
			month = redid.substring(1,3);
		}
		if(redid.length == 6){
			month = redid[1];
		}
		month = parseInt(month);
		var index = 0;
		for(var m = 0;m<month-1;m++){
			index = index+monthl[m];
		}
		index = index + (row-1)*7+col-startday[month-1];
		code[index] = 'W';
		
	}
	var str_code = "";
	for(var i = 0; i < code.length;i++){
		str_code = ''+str_code + code[i];
	}
	return str_code;
}
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
	  for(var m = 1; m <= 12;m++){
			var appendtext = '<h4>'+m+'月</h4>'+'<table class="am-table am-table-striped am-table-hover"><thead ><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th>'
				+'<th>六</th><th>七</th></tr></thead><tbody>';
				appendtext = appendtext+'</tbody></table>'
				$('#month'+m).append(appendtext);
		}
	  }
function menuclick(id){
	  var $l1 = $('#'+id);
	  $l1.dropdown("toggle");
	    
}
  function delete_click(action,cal) {  
	  $('#calender_editid')[0].style.display = 'none';
  	  var jsondata = {};
  	  jsondata.method = action;
  	  jsondata.cal = cal;
	  if(action=="delete"){
		  $.ajax({  
	            type : 'POST',  
	            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
	            url : 'calender',  
	            data : jsondata,  
	            dataType : 'html',  
	            success : function(data) { 
	        	   var result = JSON.parse(data);  
	                 
	               $('#cal_table tbody tr').remove();//移除先前数据  
	               for ( var i = 0; i < result.length; i++) {  
	                   $('#cal_table tbody').append(
	                   	'<tr>'+'<td>'+result[i].CAL_CODE+'</td>'+'<td>'+result[i].CAL_NAME+'</td>'
	                   	+'<td><a href="#" onclick = "edit_click(\'edit\','+"'"+result[i].CAL_CODE+"'"+',\''+result[i].CAL_NAME+"'"+',\''+result[i].CAL_YEAR+'\')">编辑 </a>'
	                   	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].CAL_CODE+"'"+')"> 删除</a></td></tr>'
	                   	
	                   )}  
	                   
	               }       
	            ,  
	                error : function(data) {  
	                    $('#cal_table tbody').append("获取数据失败！");  
	                } 
	  			
	  } );
	  }
	  
	  }
 
  function add_click(){
	  wmethod = "add";
	  former_cal = "";
	  document.getElementById("calid").value = "";
	  document.getElementById("cal_nameid").value = "";
	  document.getElementById("cal_yearid").value = "";
	  var code = "AWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAA"
	  +"AAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWW"
	  +"AAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAW"
	  +"WAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWA"
	  +"AAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAAAAAWWAA"
	  +"AAAWWAAAAAWWAAAAAW";
	  init_cal(code);
	  Scroll('calender_editid',250);
	        
	}
  function edit_click(action,cal,cal_name,cal_year){
	  wmethod = "edit_click";
	  former_cal = cal;
	  document.getElementById("calid").value = cal;
	  document.getElementById("cal_nameid").value = cal_name;
	  document.getElementById("cal_yearid").value = cal_year;
	  var jsondata = {};
	  jsondata.method = wmethod;
	  jsondata.cal = cal;
	  $.ajax({  
	        type : 'POST',  
	        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
	        url : 'calender',  
	        data : jsondata,  
	        dataType : 'html',  
	        success : function(data) { 
	        	var result = JSON.parse(data);
	        	init_cal(result[0].cal_date);
	        	Scroll('calender_editid',250);
	        }				
	} );
	}
function edit_cal() {  
	var wwme = "";
	if(wmethod == "edit_click") wwme = "edit";
	if(wmethod == "add") wwme = "add";
	var jsondata = {};
	jsondata.method = wwme;
	jsondata.cal = document.getElementById("calid").value;
	jsondata.cal_name = document.getElementById("cal_nameid").value;
	jsondata.cal_year = document.getElementById("cal_yearid").value;
	jsondata.former_cal = former_cal;
	jsondata.cal_date = get_rest();
	$.ajax({  
        type : 'POST',  
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',   
        url : 'calender',  
        data : jsondata,  
        dataType : 'html',  
        success : function(data) { 
    	   var result = JSON.parse(data);  
             
           $('#cal_table tbody tr').remove();//移除先前数据  
           for ( var i = 0; i < result.length; i++) {  
               $('#cal_table tbody').append(
               	'<tr>'+'<td>'+result[i].CAL_CODE+'</td>'+'<td>'+result[i].CAL_NAME+'</td>'
               	+'<td><a href="#" onclick = "edit_click(\'edit\','+"'"+result[i].CAL_CODE+"'"+',\''+result[i].CAL_NAME+"'"+',\''+result[i].CAL_YEAR+'\')">编辑 </a>'
               	+'<a href="#" onclick = "delete_click(\'delete\','+"'"+result[i].CAL_CODE+"'"+')"> 删除</a></td></tr>'
               	
               )}  
               
           
           Scroll('topbar-collapse',250);
           $('#calender_editid')[0].style.display = 'none';
           }       
        ,  
            error : function(data) {  
                $('#cal_table tbody').append("获取数据失败！");  
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

function Scroll(id,speed) {  
	  if(!speed) speed = 500;
	  $("#" + id).HoverTreeScroll(speed);
	  }  
</script>
</body>
</html>