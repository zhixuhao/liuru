package com.javaweb;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.dao.*;
/**
 * Servlet implementation class registerServlet
 */

public class registerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public registerServlet() {
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
		String userString = request.getParameter("username");
		String psString = request.getParameter("password");
		String uidString = request.getParameter("uid");
		String pscofString = request.getParameter("password_confirm");
		if(!psString.equals(pscofString)){
			request.getSession().setAttribute("errcode0", -1);
			response.sendRedirect(request.getContextPath()+"/register.jsp");
			return;
		}
		data_manage datam = new data_manage();
		String sql = "INSERT INTO java_web.sys_user (uid,username, psw) VALUES ('"+uidString+"','"+userString+
				"', '"+psString+"')";
		String sql_name = "SELECT  count(iduser) FROM user WHERE username = '"+userString+"'";
		
		try {
				ResultSet resultSet = datam.slect_sql(sql_name);
				if(resultSet.next()){
					int count = resultSet.getInt(1);
					if(count > 0){
						request.getSession().setAttribute("errcode2", -1);
						response.sendRedirect(request.getContextPath()+"/register.jsp");
						return;
					}
				}
				
				datam.add_sql(sql);
				System.out.println("插入成功");	
				HttpSession session = request.getSession();
				session.setAttribute("user_name", userString);
				request.getSession().setAttribute("errcode1", -1);
				response.sendRedirect(request.getContextPath()+"/register.jsp");
				
				
			} 
		
		catch (SQLException e) {
				e.printStackTrace();
				}
	}
}
