package com.javaweb;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

//import com.sun.corba.se.spi.orbutil.fsm.Guard.Result;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
//import sun.text.normalizer.Trie.DataManipulate;

import com.dao.*;
/**
 * Servlet implementation class alter_user
 */
@WebServlet("/alter_user")
public class alter_user extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public alter_user() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setCharacterEncoding("UTF-8");
		data_manage datam = new data_manage();
		String method = request.getParameter("method");
		String xx = request.getParameter("id");
		System.out.println("method:"+method+" id: "+xx);
		PrintWriter pw = response.getWriter();
		JSONArray array = new JSONArray(); 
		String sql = "";
		if(method.equals("myapp")){
			String myapps = (String)request.getParameter("myapps");
			String uid = request.getParameter("uid");
			myapps = myapps.trim();
			String []myapparr = myapps.split(" ");
			sql = "delete from sys_myapp where uid =" + uid;
			datam.delete_sql(sql);
			System.out.println(myapps);
			for(int i = 0; i < myapparr.length;i++){
				sql = "insert into sys_myapp (uid,appid) values("+"'"+uid+"',"
						+"'"+myapparr[i]+"')";
				datam.add_sql(sql);
			}
			
			try{
				sql = "SELECT  * FROM sys_myapp WHERE uid = '"+uid+"'" ;
				ResultSet resultSet = datam.slect_sql(sql);
				String myapp = "";
				while(resultSet.next()){
					myapp = myapp + resultSet.getString("appid") + " ";
				}
				HttpSession session = request.getSession();
				session.setAttribute("myapp", myapp);
				System.out.println("myapp alter: "+myapp);
				JSONObject jsonObj = new JSONObject();
				jsonObj.put("myapp", myapp);
				pw.print(jsonObj);
				return;
			}
			catch (Exception e){
				
			}
		}
		else if(method.equals("delete")){
			sql = "delete from sys_user where uid = '"+xx +"'";
			datam.delete_sql(sql);
			sql = "delete from sys_user_menu where uid = '"+xx+"'" ;
			datam.delete_sql(sql);
		}
		else if (method.equals("edit")) {
			String uid = request.getParameter("uid");
			String password = request.getParameter("password");
			String email = request.getParameter("email");
			String firstname = request.getParameter("firstname");
			String lastname = request.getParameter("lastname");
			sql = "select * from sys_user where id = " + xx;
			String formeruid = "";
			try {
				ResultSet rs = datam.slect_sql(sql);
				while(rs.next()){
					formeruid = rs.getString("uid");
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			sql = "update sys_user set uid = '"+uid+"',"+"psw='"+password+"',"
			+"firstname='"+firstname+"',"+"lastname='"+lastname+"',"+"email='"+email+"' where id ="+ xx;
			datam.edit_sql(sql);
			sql = "update sys_user_menu set uid = '"+uid+"' where uid ='"+ formeruid +"'";
			datam.edit_sql(sql);
		}
		else if (method.equals("auth")) {
			String uid = request.getParameter("uid");
			String menuauth = request.getParameter("menuauth");
			menuauth = menuauth.trim();
			String []menuautharr = menuauth.split(" ");
			ResultSet rs = null;
			try {
				for(int i = 1;i <= 13; i ++){
					sql = "update sys_user_menu set roleid ='"+menuautharr[i-1]+ "' where uid = '" + uid +"' and menuid = "+i;
					datam.edit_sql(sql);
				}
			} catch (Exception e) {
				// TODO: handle exception
			}
			
		}
		else if (method.equals("add")) {
			String uid = request.getParameter("uid");
			String password = request.getParameter("password");	
			String email = request.getParameter("email");
			String firstname = request.getParameter("firstname");
			String lastname = request.getParameter("lastname");
			sql = "insert into sys_user (uid,psw,firstname,lastname,email) values("+"'"+uid+"',"
					+"'"+password+"',"+"'"+firstname+"',"+"'"+lastname+"',"+"'"+email+"')";
			datam.add_sql(sql);
			for(int i = 1;i<=13;i++){
				sql = "insert into sys_user_menu (uid,menuid,roleid) values("+"'"+uid+"',"
						+"'"+i+"',"+"'user')";
				datam.add_sql(sql);
			}
		}
			try {
				sql = "select * from sys_user ";
				ResultSet rs = datam.slect_sql(sql);
				ResultSetMetaData metaData = rs.getMetaData();  
				int columnCount = metaData.getColumnCount(); 
				while (rs.next()) {
					JSONObject jsonObj = new JSONObject();
					for (int i = 1; i <= columnCount; i++) {  
			            String columnName =metaData.getColumnLabel(i);  
			            columnName = columnName.toUpperCase();
			            String value = rs.getString(columnName);  
			            jsonObj.put(columnName, value);  
			        }
					sql = "select * from sys_user_menu where uid = '" + rs.getString("uid") +"'";
					ResultSet rs1 = datam.slect_sql(sql);
					String menurole = "";
	    			while(rs1.next()){
	    				menurole = menurole + rs1.getString("roleid") +" ";
	    			}
	    			jsonObj.put("MENUROLE", menurole); 
			        array.add(jsonObj); 
					
				}
				System.out.println(array);
				pw.print(array);
			} catch (Exception e) {
				// TODO: handle exception
			}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request,response);
	}

}
