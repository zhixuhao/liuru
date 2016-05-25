<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="net.sf.json.JSONArray,net.sf.json.JSONObject"%>
<!DOCTYPE html>
<html>
<head lang="en">
<meta charset="UTF-8">
<title>创易高级计划系统</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" />
<link rel="icon" type="image/png"
	href="<%=request.getContextPath()%>/manufacturing/eHeijunka2/images/logo17.png">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/amazeui/css/amazeui.css" />
<style>
.header {
	text-align: center;
}

.header h1 {
	font-size: 200%;
	color: #333;
	margin-top: 30px;
}

.header p {
	font-size: 14px;
}
</style>
</head>
<body>

	<div class="header">
		<div class="am-g">
			<h1>
			<img src="./manufacturing/eHeijunka2/images/logo19.png" />
			<!--  <strong>创易</strong> <small>高级计划系统</small></h1> -->
		</div>
		<hr />
	</div>
	<div class="am-g">
		<div class="am-u-lg-6 am-u-md-8 am-u-sm-centered">
			<h3>用户登录</h3>
			<hr>

			<form method="post" class="am-form" action="login">
				<label for="username">工号:</label> 
				<input type="text" name="uid"
					id="userid" value="" minlength="1"  required> 
					<br> 
				<label for="password">密码:</label>
				<input type="password" name="password" id="passwordid" value="" required>
				<br />
				<div class="am-cf">
					<input type="submit" name="" value="登 录" id="subbmit"
						class="am-btn am-btn-primary am-btn-sm am-fl">
					<!--  <input type="button" name="" value="注册" id="registerid"
						class="am-btn am-btn-primary am-btn-sm am-fl" style="color:#000000;
						background-color: #f0f0f0;border-color: #000000;margin-left: 30px;"
						onclick="location='<%=request.getContextPath()%>/register.jsp'"> -->
				</div>
			</form>
			<hr>
			<div class="footer">
				<small>Copyright © 2015-2016 Liuru Tech. All Rights Reserved  六如科技 版权所有</small>
			</div>
		</div>
	</div>
	<div class="am-modal am-modal-alert" tabindex="-1" id="err">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">用户登录</div>
			<div class="am-modal-bd">错误的用户名或密码</div>
			<div class="am-modal-footer">
				<span class="am-modal-btn">确定</span>
			</div>
		</div>
	</div>
	<!--[if lt IE 9]>
<script src="http://libs.baidu.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://cdn.staticfile.org/modernizr/2.8.3/modernizr.js"></script>
<script src="<%=request.getContextPath()%>/amazeui/js/polyfill/rem.min.js"></script>
<script src="<%=request.getContextPath()%>/amazeui/js/polyfill/respond.min.js"></script>
<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.legacy.js"></script>
<![endif]-->

	<!--[if (gte IE 9)|!(IE)]><!-->
	<script src="<%=request.getContextPath()%>/amazeui/js/jquery.min.js"></script>
	<script src="<%=request.getContextPath()%>/amazeui/js/amazeui.min.js"></script>
	<!--<![endif]-->
	<script>
		$(function() {
			var errcode = <%=session.getAttribute("errcode")%>
			
		if (errcode == -1) {
				$('#err').modal('toggle');
			}
		

		});
	</script>
	<%session.removeAttribute("errcode"); %>
</body>
</html>