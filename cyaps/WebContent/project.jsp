<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html;">
<meta charset="UTF-8">
<title>创易高级计划系统</title>
	<link rel="icon" type="image/png"
	href="<%=request.getContextPath()%>/manufacturing/eHeijunka2/images/logo17.png">
	<link href="muban/css/style.css" rel="stylesheet">
    <link href="muban/css/font-awesome.css" rel="stylesheet">
    <link href="muban/css/animate.css" rel="stylesheet">
    <link href="muban/css/lightbox.css" rel="stylesheet">
	<link rel="stylesheet" href="amazeui/css/amazeui.css">
	<link rel="stylesheet"
	href="<%=request.getContextPath()%>/amazeui/css/admin.css">
    <script type="text/javascript" src="muban/js/jquery-1.12.1.js"></script>
    <script  src="muban/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="amazeui/js/amazeui.min.js"></script>
    <script type="text/javascript" src="muban/js/jquery.hovertreescroll.js"></script>
    <style type="text/css">
		.btn-my{ 
		width: 80px; height: 80px; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%; 
		border-color:#2babcf;
		}
		.btn:focus,
		.btn:active:focus,
		.btn.active:focus,
		.btn.focus,
		.btn:active.focus,
		.btn.active.focus {
		    outline: none;          
		}
		.icon-my{
		color:#2babcf;
		font-size:40px;
		}
		.jishu{
		background-color:#e2efee;
		margin-top:30px
		}
		.oushu{
		margin-top:30px
		}
		.wrapper{
		background-color:#fff
		}
		.am-nav-tabs > li.am-active > a:hover,.am-nav-tabs > li.am-active > a{
		background-color:#f3f3f3
		}
	</style>
</head>
<body>
  <!--导航代码 -->
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
			
				
			
				
        		<li class="am-dropdown" data-am-dropdown id = "myfavorite">
       		 		<a class="am-dropdown-toggle" data-am-dropdown-toggle href="javascript:;">收藏  <span class="am-icon-caret-down"></span></a>
					<ul class="am-dropdown-content" id = "myfavoriteul" onclick="menuclick('myfavoriteul')">
		            	
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
					<ul class="am-dropdown-content" id="lc5" ">
						<li><a href = "#" onclick="location='<%=request.getContextPath()%>/logout'"><span
								class="am-icon-power-off"></span> 退出</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</header>
  <!-- Wrapper -->
    <div class="wrapper" style = "padding-top:0px;padding-bottom:50px">

      
      <!-- Main Services -->
      <div >
      <div class="am-u-lg-9 am-u-sm-centered" >
          <div class="row" id = "mainrow1">
            <div class="col-sm-3" id = "main1" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu1',500)"><i class="fa fa-cogs"></i></span>
                  <div class="service-desc">
                    <h4>系统配置</h4>
                  </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main2" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu2',450)"><i class="fa fa-money"></i></span>
                  <div class="service-desc">
                    <h4>财务管理</h4>
                  </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main3" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu3',400)"><i class="fa fa-building-o"></i></span>
                  <div class="service-desc">
                    <h4>需求管理</h4>
                  </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main4" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu4',350)"><i class="fa fa-truck"></i></span>
                  <div class="service-desc">
                    <h4>供应计划管理</h4>
                  </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main5" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu5',300)"><i class="fa fa-cart-arrow-down"></i></span>
                  <div class="service-desc">
                    <h4>采购管理</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main6" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu6',250)"><i class="fa fa-dashboard"></i></span>
                  <div class="service-desc">
                    <h4>生产管理</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main7" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu7',200)"><i class="fa fa-database"></i></span>
                  <div class="service-desc">
                    <h4>仓储运输管理</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main8" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu8',150)"><i class="fa fa-search-plus"></i></span>
                  <div class="service-desc">
                    <h4>质量控制管理</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main9" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu9',150)"><i class="fa fa-briefcase"></i></span>
                  <div class="service-desc">
                    <h4>分销需求计划</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main10" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu10',150)"><i class="fa fa-calendar"></i></span>
                  <div class="service-desc">
                    <h4>主生产计划</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main11" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu11',150)"><i class="fa fa-cubes"></i></span>
                  <div class="service-desc">
                    <h4>物料需求计划</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main12" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu12',150)"><i class="fa fa-line-chart"></i></span>
                  <div class="service-desc">
                    <h4>产能计划</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
            <div class="col-sm-3" id = "main13" style="display:none">
              <div class="services">
                <div class="service-item" >
                  <span class="icon icon-1 icon-1c" onclick = "Scroll('menu13',150)"><i class="fa fa-group"></i></span>
                  <div class="service-desc">
                    <h4>客户服务管理</h4>
                    </div>
                </div>
              </div> <!-- / .services -->
            </div>
           </div>
           <!-- / .row -->
          </div>
      </div> <!-- / .main-features -->
      <div class="am-g">
      <div class="jishu" id = "menu1" style ="display:none">
      	
	  </div>
		  
		 <div class="oushu" id = "menu2" style ="display:none">
		 
		  </div>
		  
		  <div class="jishu" id = "menu3" style ="display:none">
		  
		  </div>
		  
		  <div class = "oushu" id = "menu4" style ="display:none">
		  
		  </div>
		  
		  <div class="jishu" id = "menu5" style ="display:none">
		  
		  </div>
		  
		  <div class="oushu" id = "menu6" style ="display:none">
		  		  </div>
		  
		  <div class="jishu" id = "menu7" style ="display:none">
		  
		  </div>
		  
		  <div class="oushu" id = menu8 style ="display:none">
		  
	  	  </div>
	  	  <div class="jishu" id = "menu9" style ="display:none">
		  
		  </div>
		  
		  <div class="oushu" id = "menu10" style ="display:none">
		  		  </div>
		  
		  <div class="jishu" id = "menu11" style ="display:none">
		  
		  </div>
		  
		  <div class="oushu" id = menu12 style ="display:none">
		  
	  	  </div>
	  	  <div class="jishu" id = "menu13" style ="display:none">
		  
		  </div>
	  </div>
      
			
	  
    </div> <!-- / .wrapper -->
    <div class="am-modal am-modal-alert" tabindex="-1" id="addapp">
		<div class="am-modal-dialog">
			<div class="am-u-lg-9 am-u-sm-centered" >
			<div class="am-modal-hd">应用收藏</div>
          		<div class="row" id = "addapprow">
          			
          			
          		</div>
          		<div class="am-modal-footer">
					<span class="am-modal-btn" onclick="addapp()">确定</span>
					<span class="am-modal-btn">取消</span>
				</div>
          	</div>
		</div>
	</div>
  <script>
  $(function() {
	  init();
	  app_user();
    var $dropdown = $('#dropdown_project');
    $('#dropdown_content').on('click', function(e) {
      $dropdown.dropdown('toggle');
      return false;
    });
    $('#doc-my-tabs1').tabs();
    $('#doc-my-tabs2').tabs();
    $('#doc-my-tabs3').tabs();
    $('#doc-my-tabs4').tabs();
    $('#doc-my-tabs5').tabs();
    $('#doc-my-tabs6').tabs();
    $('#doc-my-tabs7').tabs();
    $('#doc-my-tabs8').tabs();
    $('#doc-my-tabs9').tabs();
    $('#doc-my-tabs10').tabs();
    $('#doc-my-tabs11').tabs();
    $('#doc-my-tabs12').tabs();
    $('#doc-my-tabs13').tabs();
  });
  function Scroll(id,speed) {  
	  if(!speed) speed = 500;
	  $("#" + id).HoverTreeScroll(speed);
	  }  
  function init(){
	  var s = "<%=(String)session.getAttribute("menuroleid")%>";
	  var s_name = "<%=(String)session.getAttribute("menuarr")%>";
	  s = s.trim();
	  s_name = s_name.trim();
	  var sa = s.split(" ");
	  var s_name_a = s_name.split(" ");
	  for(var i = 1;i <= sa.length;i++){
		  if(sa[i-1] > 0){
			  var s = "main"+i;
			  var ms = "menu"+i;
			  var tmp = document.getElementById(s);
			  tmp.removeAttribute("style");
			  var h = tmp.getElementsByTagName("h4");
			  h[0].innerHTML = s_name_a[i-1];
			  var tmp1 = document.getElementById(ms);
			  tmp1.removeAttribute("style");
			  var apps_menu = "";
			  $('#'+ms).append(
					  "<div class=\"am-u-lg-10 am-u-sm-centered\"><h1 style=\"padding-top:50px\">"+s_name_a[i-1]+"</h1><hr><div class=\"am-tabs\" id=\""+("doc-my-tabs"+i)+"\" style = \"padding-bottom:150px\">"
						  +"<ul class=\"am-tabs-nav am-nav am-nav-tabs am-nav-justify\"><li class=\"am-active\"><a href=\"\">应用</a></li>"
						  +"</ul><div class= \"am-tabs-bd\"><div class=\"am-tab-panel am-fade am-in am-active\"><div class=\"row\" id = \""+("menurow"+i)+"\"></div>"
			  );
			  
		  }
	  }
	  var menuapp = '<%=(String)session.getAttribute("menuapp")%>';
	  menuapp = menuapp.trim();
	  var menuapparr = menuapp.split(" ");
	  var appid = '<%=(String)session.getAttribute("appid")%>';
	  appid = appid.trim();
	  var appidarr = appid.split(" ");
	  var myapp = '<%=(String)session.getAttribute("myapp")%>';
	  myapp = myapp.trim();
	  var myapparr = myapp.split(" ");
	  var appurl = '<%=(String)session.getAttribute("appurl")%>';
	  appurl = appurl.trim();
	  var appurlarr = appurl.split(" ");
	  var appname = '<%=(String)session.getAttribute("apparr")%>';
	  appname = appname.trim();
	  var appnamearr = appname.split(" ");
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
		  var meth = "javascript:window.open('";
		  var postfix = ")";
		  if(!tmpappid){
			  tmpappurl = '#';
			  tmpm = '';
			  tmpappname = 'none';
			  meth="location='";
			  postfix="";
		  }
		  $('#myfavoriteul').append(
				  "<li ><a href = \"#\" onclick=\""+meth+tmpappurl+tmpm+"'"+postfix+"\">"+tmpappname+"</a></li>"
		  );
	  }
	  $('#myfavoriteul').append(
			  "<li class=\"am-divider\" id='myappdiv'></li><li id='add_app'><a href = \"#\" onclick=\"addappclick()\">新增"+"</a></li>"
	  );

	  for(var i = 0;i < appidarr.length;i++){
		  var t = "";
		  if(myapp.indexOf(appidarr[i]) > -1){
			  t="checked";
		  }
		  $('#addapprow').append(
				  "<div class=\"col-sm-6\"><label class=\"am-checkbox\">"+
				  "<input type=\"checkbox\" name=\"cbx\" value=\""+appidarr[i]+"\" data-am-ucheck "+t+">"+appnamearr[i]+"</label></div>"
				  );
	  }
  }
  function app_user(){
	  var appnames = "<%=(String)session.getAttribute("apparr")%>";
	  appnames = appnames.trim();
	  var appnamearr = appnames.split(" ");
	  var appids = "<%=(String)session.getAttribute("appid")%>";
	  appids = appids.trim();
	  var appidarr = appids.split(" ");
	  var menuapp = "<%=(String)session.getAttribute("menuapp")%>";
	  menuapp = menuapp.trim();
	  var menuapparr = menuapp.split(" ");
	  var appurl = "<%=(String)session.getAttribute("appurl")%>";
	  appurl = appurl.trim();
	  var appurlarr = appurl.split(" ");
	  for(var i = 0;i < appidarr.length;i++){
		  app = appidarr[i];
		  var m = 0;
		  for(var j = 1;j < menuapparr.length;j++){
			  if(app == menuapparr[j]){
				  m = menuapparr[j-1];
			  }
		  }
		  //alert("app:"+appidarr[i]+"menu:"+m);
		  var url = appurlarr[i];
		  $('#menurow'+m).append(
				  "<div class=\"col-sm-2\" ><div class=\"services\"><div class=\"service-item\"><button type = \"button\" class=\"btn btn-default btn-my\" onclick = \";javascript:window.open('"+url+m+"');\"><i class=\"fa fa-rocket icon-my\" ></i>"
	              + "</button> <div class=\"service-desc\"><h4>"+appnamearr[i]+"</h4></div></div></div> </div>"
		  );
	  }
  }
  function menuclick(id){
	  var $l1 = $('#'+id);
	  $l1.dropdown("toggle");
	    
  }
  function addappclick(){
	  $('#addapp').modal('toggle');
  }
  function addapp(){
	  var addapps = document.getElementsByName("cbx");
	  var myapps = "";
	  for(var i = 0; i < addapps.length;i++){
		  if(addapps[i].checked == true){
		  	myapps = myapps + addapps[i].value + " ";
		  }
	  }
	  var jsondata = {};
	  jsondata.method = "myapp";
	  jsondata.myapps = myapps;
	  jsondata.uid = "<%=(String)session.getAttribute("uid")%>";
	  jsondata.id = "1";
	  $.ajax({  
          type : 'GET',  
          contentType : 'application/json',  
          url : 'alter_user',  
          data : jsondata,  
          dataType : 'html',  
          success : function(data) { 
	      	  var result = JSON.parse(data);  
	      	  var myapp = result.myapp;
	          $('#addapprow div').remove();
	          $('#myfavoriteul li').remove();
	          var menuapp = '<%=(String)session.getAttribute("menuapp")%>';
	    	  menuapp = menuapp.trim();
	    	  var menuapparr = menuapp.split(" ");
	          myapp = myapp.trim();
	          var myapparr = myapp.split(" ");
	          var appid = '<%=(String)session.getAttribute("appid")%>';
	      	  appid = appid.trim();
	      	  var appidarr = appid.split(" ");
	      	  var appurl = '<%=(String)session.getAttribute("appurl")%>';
	      	  appurl = appurl.trim();
	      	  var appurlarr = appurl.split(" ");
	      	  var appname = '<%=(String)session.getAttribute("apparr")%>';
	      	  appname = appname.trim();
	      	  var appnamearr = appname.split(" ");
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
	  		  var meth = "javascript:window.open('";
	  		  var postfix = ")";
	  		  if(!tmpappid){
	  			  tmpappurl = '#';
	  			  tmpm = '';
	  			  tmpappname = 'none';
	  			  meth="location='";
	  			  postfix="";
	  		  }
	  		  $('#myfavoriteul').append(
	  				  "<li ><a href = \"#\" onclick=\""+meth+tmpappurl+tmpm+"'"+postfix+"\">"+tmpappname+"</a></li>"
	  		  );
	  	  }
	  	  $('#myfavoriteul').append(
	  			  "<li class=\"am-divider\" id='myappdiv'></li><li id='add_app'><a href = \"#\" onclick=\"addappclick()\">新增"+"</a></li>"
	  	  );

	  	  for(var i = 0;i < appidarr.length;i++){
	  		  var t = "";
	  		  if(myapp.indexOf(appidarr[i]) > -1){
	  			  t="checked";
	  		  }
	  		  $('#addapprow').append(
	  				  "<div class=\"col-sm-6\"><label class=\"am-checkbox\">"+
	  				  "<input type=\"checkbox\" name=\"cbx\" value=\""+appidarr[i]+"\" data-am-ucheck "+t+">"+appnamearr[i]+"</label></div>"
	  				  );
	  	  }
           }       
          ,  
              error : function(data) {  
                  $('#user_table tbody').append("获取数据失败！");  
              } 
			
} );
  }
</script>
	
    <script  src="muban/js/scrolltopcontrol.js"></script>
	<script  src="muban/js/SmoothScroll.js"></script>
    <script  src="muban/js/lightbox-2.6.min.js"></script>
    <script  src="muban/js/custom.js"></script>
    <script  src="muban/js/index.js"></script>
</body>
</html>





