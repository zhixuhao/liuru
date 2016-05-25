package com.javaweb;

import java.beans.Statement;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.dao.*;
/**
 * Servlet implementation class loginServlet
 */

public class loginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public loginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		data_manage datam = new data_manage();
		String userString = request.getParameter("uid");
		String psString = request.getParameter("password");
		String sql = "SELECT  * FROM sys_app";
		ResultSet resultSet = null;
		HttpSession session = request.getSession();
		try {
				resultSet = datam.slect_sql(sql);
				while(resultSet.next()){
					session.setAttribute(resultSet.getString("appid"), resultSet.getString("appurl"));
				}
				sql = "SELECT  * FROM sys_user WHERE uid = \'"+userString + "\'AND psw = \'"+psString+"\'";
				resultSet = datam.slect_sql(sql);
				if(resultSet.next()){
						String firstname = resultSet.getString("firstname");
						String lastname = resultSet.getString("lastname");
						session.setAttribute("user_name", firstname+" "+lastname);
						String uid = resultSet.getString("uid");
						session.setAttribute("uid", uid);
						response.sendRedirect(request.getContextPath()+"/project.jsp");
					}
					else{
						request.getSession().setAttribute("errcode", -1);
						response.sendRedirect(request.getContextPath()+"/login.jsp");
					}
				sql = "SELECT  * FROM sys_myapp WHERE uid = '"+userString +"'";
				resultSet = datam.slect_sql(sql);
				String myapp = "";
				while(resultSet.next()){
					myapp = myapp + resultSet.getString("appid") + " ";
				}
				System.out.println("myapp: "+myapp);
				session.setAttribute("myapp", myapp);
		}
			
		catch (SQLException e) {
				e.printStackTrace();
		}
	}
}


