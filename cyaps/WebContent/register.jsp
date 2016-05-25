<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="net.sf.json.JSONArray,net.sf.json.JSONObject"%>
<!DOCTYPE html>
<html>
<head lang="en">
<meta charset="UTF-8">
<title>Login Page</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" />
<link rel="alternate icon" type="image/png"
	href="<%=request.getContextPath()%>/amazeui/i/favicon.png">
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
			<h1>易排产</h1>
		</div>
		<hr />
	</div>
	<div class="am-g">
		<div class="am-u-lg-6 am-u-md-8 am-u-sm-centered">
			<h3>用户注册</h3>
			<hr>

			<form method="post" class="am-form" action="register">
				<label for="username">用户名:</label> 
				<input type="text" name="username"
					id="userid" value="" minlength="1"  required> 
					<br> 
				<label for="username">工号:</label> 
				<input type="text" name="uid"
					id="uid" value="" minlength="1"  required> 
					<br> 
				<label for="password">密码:</label>
				<input type="password" name="password" id="passwordid" value="" required>
				<br />
				<label for="password_confirm">密码确认:</label>
				<input type="password" name="password_confirm" id="passwordcofid" value="" required>
				<br />
				<div class="am-cf">
					<input type="submit" name="" value="注册" id="subbmit"
						class="am-btn am-btn-primary am-btn-sm am-fl">
				</div>
			</form>
			<hr>
			<div class="footer">
				<small>Copyright © 2015 LiuRu. All Rights Reserved</small>
			</div>
		</div>
	</div>
	
	<div class="am-modal am-modal-alert" tabindex="-1" id="err0">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">用户注册</div>
			<div class="am-modal-bd">两次输入密码不一致</div>
			<div class="am-modal-footer">
				<span class="am-modal-btn">确定</span>
			</div>
		</div>
	</div>
	<div class="am-modal am-modal-alert" tabindex="-1" id="err1">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">用户注册</div>
			<div class="am-modal-bd">注册成功</div>
			<div class="am-modal-footer">
				<span class="am-modal-btn" onclick="location='<%=request.getContextPath()%>/project.jsp'">确定</span>
			</div>
		</div>
	</div>
	<div class="am-modal am-modal-alert" tabindex="-1" id="err2">
		<div class="am-modal-dialog">
			<div class="am-modal-hd">用户注册</div>
			<div class="am-modal-bd">已有用户名</div>
			<div class="am-modal-footer">
				<span class="am-modal-btn" >确定</span>
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
			var errcode0 = <%=session.getAttribute("errcode0")%>
			var errcode1 = <%=session.getAttribute("errcode1")%>
			var errcode2 = <%=session.getAttribute("errcode2")%>
			
		if (errcode0 == -1) {
				$('#err0').modal('toggle');
			}
		if (errcode1 == -1) {
			$('#err1').modal('toggle');
		}
		if (errcode2 == -1) {
			$('#err2').modal('toggle');
		}
		

		});
	</script>
	<%session.removeAttribute("errcode0"); %>
	<%session.removeAttribute("errcode1"); %>
	<%session.removeAttribute("errcode2"); %>
</body>
</html>