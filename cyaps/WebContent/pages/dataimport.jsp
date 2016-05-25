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
				<h3>数据导入</h3>
				<label class="am-radio"> <input type="radio" name="radio1"
					value="" data-am-ucheck> 生产订单头部导入
				</label> <label class="am-radio"> <input type="radio" name="radio1"
					value="" data-am-ucheck> 生产订单明细导入
				</label> <label class="am-radio"> <input type="radio" name="radio1"
					value="" data-am-ucheck> 采购订单导入
				</label> <label class="am-radio"> <input type="radio" name="radio1"
					value="" data-am-ucheck> 客户订单导入
				</label> <label class="am-radio"> <input type="radio" name="radio1"
					value="" data-am-ucheck> 库存导入
				</label> <label class="am-radio"> <input type="radio" name="radio1"
					value="" data-am-ucheck> 工艺路线导入
				</label> <label class="am-radio"> <input type="radio" name="radio1"
					value="" data-am-ucheck> BOM导入
				</label>
			</div>

			<div class="am-u-sm-6">
				<p>
					<button type="button" class="am-btn am-btn-primary"
						onclick="ajax_post()">上传文件</button>
					<button type="button" class="am-btn am-btn-default"
						onclick="ajax_post()">提交</button>
				</p>
			</div>

		</fieldset>
	</form>

	<div id="pageloading"></div>
	<script type="text/javascript">
			function ajax_post(){
				
				 $("#pageloading").show();
				  $.post("<%=request.getContextPath()%>/test", {
				plant : $('#input_plant').val()
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