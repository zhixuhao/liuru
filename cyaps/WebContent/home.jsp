<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html class="no-js">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>创易高级计划系统</title>
<meta name="description" content="这是一个 index 页面">
<meta name="keywords" content="index">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" />
<link rel="icon" type="image/png"
	href="<%=request.getContextPath()%>/manufacturing/eHeijunka2/images/logo17.png">
<link rel="apple-touch-icon-precomposed"
	href="<%=request.getContextPath()%>/amazeui/i/app-icon72x72@2x.png">
<meta name="apple-mobile-web-app-title" content="Amaze UI" />
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/amazeui/css/amazeui.css" />
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/amazeui/css/admin.css">
<script src="<%=request.getContextPath()%>/amazeui/js/jquery.min.js"></script>
<script type="text/javascript" language="javascript">
function iFrameHeight() {
    var ifm= document.getElementById("iframepage");
    var subWeb = document.frames ? document.frames["iframepage"].document:ifm.contentDocument;
        if(ifm != null && subWeb != null) {
       		ifm.height = subWeb.body.scrollHeight;
        }
        
 }
function iFrameTarget(target){
	$('iframe').attr('src',target);
}
</script>
</head>
<body>

<!--[if lte IE 9]>
<p class="browsehappy">你正在使用<strong>过时</strong>的浏览器， 本系统暂不支持。 请 <a href="http://browsehappy.com/" target="_blank">升级浏览器</a>
  以获得更好的体验！</p>
<![endif]-->
<!--[if lt IE 9]>
    <script>document.createElement('section')</script>
    <style type="text/css">
        .holder {
            position: relative;
            z-index: 10000;
        }
        .datepicker {
            display: block;
        }
    </style>
<![endif]-->
	<header class="am-topbar admin-header">
		<div class="am-topbar-brand">
			<img src="./manufacturing/eHeijunka2/images/logo17.png" /> <strong>创易</strong> <small>高级计划系统</small>
		</div>

		<button
			class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only"
			data-am-collapse="{target: '#topbar-collapse'}">
			<span class="am-sr-only">导航切换</span> <span class="am-icon-bars"></span>
		</button>

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

			<ul	class="am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list">
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
	
	<div class="am-cf admin-main" id="main_content" >

		<!-- content start -->
		<div class="admin-content" >
		<div id="pageloading"></div>
		<div id="leamain" >
		
		       <iframe src="" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="100%" height="600" id="iframepage" name="iframepage"></iframe>
		
		     </div>

	</div>
  <!-- content end -->

</div>

<a class="am-icon-btn am-icon-th-list am-show-sm-only admin-menu" data-am-offcanvas="{target: '#admin-offcanvas'}"></a>

<footer>
  <hr>
  <p class="am-padding-left"><small>Copyright © 2015-2016 Liuru Tech. All Rights Reserved  六如科技 版权所有</small></p>
</footer>

<!--[if lt IE 9]>
<script src="http://libs.baidu.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://cdn.staticfile.org/modernizr/2.8.3/modernizr.js"></script>
<script src="<%=request.getContextPath()%>/amazeui/js/polyfill/rem.min.js"></script>
<script src="<%=request.getContextPath()%>/amazeui/js/polyfill/respond.min.js"></script>
<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.legacy.js"></script>
<![endif]-->

<!--[if (gte IE 9)|!(IE)]><!-->
<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.min.js"></script>
<!--<![endif]-->
<script src="<%=request.getContextPath()%>/amazeui/js/app.js"></script>

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
	  <%String app_url =  request.getQueryString();String url = app_url;%>
	  <%char menuid = url.charAt(url.length()-1);%>
	  var app_url = jsgetQueryString("app_url");
	  var menuid = jsgetQueryString("menuid");
	  iFrameTarget(app_url);
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
				  "<li ><a href = \"#\" onclick=\"location='"+url+menuid+"'\">"+name+"</a></li>"
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
</script>

</body>
</html>