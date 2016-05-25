<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html class="no-js">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>易排产-管理后台</title>
<meta name="description" content="这是一个 index 页面">
<meta name="keywords" content="index">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" />
<link rel="icon" type="image/png"
	href="<%=request.getContextPath()%>/amazeui/i/favicon.png">
<link rel="apple-touch-icon-precomposed"
	href="<%=request.getContextPath()%>/amazeui/i/app-icon72x72@2x.png">
<meta name="apple-mobile-web-app-title" content="Amaze UI" />
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/amazeui/css/amazeui.css" />
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/amazeui/css/admin.css">
<script src="<%=request.getContextPath()%>/amazeui/js/jquery.min.js"></script>
<script type="text/javascript" language="javascript">

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
	<form class="am-form">
		<fieldset>
			<legend>&nbsp;</legend>

			<div class="am-form-group">
				<label for="input_plant">工厂代码</label> <input type="text" class=""
					id="input_plant" placeholder="输入工厂代码" required>
				<p></p>
				<label for="input_wrkc">工作中心</label> <input type="text" class=""
					id="input_wrkc" placeholder="输入工作中心" required>
				<p></p>
				<label for="input_frzDays">保护期（单位：天）</label> <input type="text"
					class="" id="input_frzDays" placeholder="输入看板保护天数" required>
				<h3>选项</h3>
				<div class="am-g">
					<div class="am-u-sm-3">
					<h3>齐套选项</h3>
					    <label class="am-checkbox" >
					      <input type="checkbox" name="cbx" id="cbxid" value="Y" data-am-ucheck>
					    	  齐套
					    </label>
					    
				    </div>
				    <div class="am-u-sm-3">
				    	<h3>排程顺序</h3>
					    <label class="am-radio">
					      <input type="radio" name="radio1" id="radio1idb" value="B" data-am-ucheck checked>
					    	  按客户订单
					    </label>
					    
					    <label class="am-radio">
					      <input type="radio" name="radio1" id="radio1id" value="R" data-am-ucheck >
					    	 按开工日期
					    </label>
					    <label class="am-radio">
					      <input type="radio" name="radio1" id="radio1idno" value="N" data-am-ucheck disabled>
					    	 无
					    </label>
				    </div>
				    <div class="am-u-sm-3">
				    	<h3>连续排程</h3>
					    <label class="am-radio">
					      <input type="radio" name="radio2" id="radio2idy" value="Y" data-am-ucheck >
					    	  连续
					    </label>
					    
					    <label class="am-radio">
					      <input type="radio" name="radio2" id="radio2idn" value="N" data-am-ucheck checked>
					    	 不连续
					    </label>
					    
				    </div>
				    <div class="am-u-sm-3">
				    	<h3>排版方式</h3>
					    <label class="am-radio">
					      <input type="radio" name="radio3" id="radio3id" value="I" data-am-ucheck checked>
					    	  完整排程
					    </label>
					    
					    <label class="am-radio">
					      <input type="radio" name="radio3" id="radio3id" value="S" data-am-ucheck >
					    	 可切分排程
					    </label>
					    
				    </div>
			    </div>
			</div>
			<p>
				<button type="submit" class="am-btn am-btn-default"
					onclick="ajax_post()">提交</button>
			</p>
		</fieldset>
	</form>

	<div id="pageloading"></div>
	<script type="text/javascript">
	$("document").ready(function(){   
	    $("#cbxid").click(function(){   
	       var cbx = document.getElementById("cbxid");
	       var radio1no = document.getElementById("radio1idno");
	       var radio1b = document.getElementById("radio1idb");
	       var radio2idy = document.getElementById("radio2idy");
	       var radio2idn = document.getElementById("radio2idn");
	       if(cbx.checked){
	    	   radio1no.disabled = false;
	    	   radio2idy.checked = false;
	    	   radio2idy.disabled = true; 
	    	   radio2idn.checked = true;
	    	   
	       }
	       else{
	    	   radio1no.disabled = true;
	    	   radio1b.checked = true;
	    	   radio2idy.disabled = false; 
	       }
	    })   
	})  
			function ajax_post(){
				if(($('#input_plant').val()=="")||($('#input_wrkc').val()=="")||($('#input_frzDays').val()=="")){
					alert("请完善信息");return;
				}
				var cbx = document.getElementById("cbxid");
				var cbxval;
				if(cbx.checked){
					cbxval = 'Y';
				}
				else{
					cbxval = 'N';
				}
				var radio1 = document.getElementsByName("radio1");
				var radio1val;
				for(var i = 0; i < radio1.length;i++){
					if(radio1[i].checked == true){
						radio1val = radio1[i].value;
					}
				}
				var radio2 = document.getElementsByName("radio2");
				var radio2val;
				for(var i = 0; i < radio2.length;i++){
					if(radio2[i].checked == true){
						radio2val = radio2[i].value;
					}
				}
				var radio3 = document.getElementsByName("radio3");
				var radio3val;
				for(var i = 0; i < radio3.length;i++){
					if(radio3[i].checked == true){
						radio3val = radio3[i].value;
					}
				}
				var plantval = document.getElementById("input_plant").value;
				var wrkcval = document.getElementById("input_wrkc").value;
				var daysval = document.getElementById("input_frzDays").value;
				
				 $("#pageloading").show();
				  $.post("<%=request.getContextPath()%>/autodsp", {
				plant : plantval,
				wrkc :wrkcval,
				days :daysval,
				chld:cbxval,
				bcp:radio1val,
				cw:radio2val,
				istype:radio3val
			}, function(data) {
								 
					alert('已提交');
					return false;
				
				
			}, "text");//这里返回的类型有：json,html,xml,text
		}
			

	</script>
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

</body>
</html>