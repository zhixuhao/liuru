package com.javaweb;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.dao.*;
/**
 * Servlet Filter implementation class authFilter
 * 在web3.0中，不需要在web.xml中进行配置了，通过下面的一句话就可以filter name class url绑定，可以配置过滤多个url
 */
@WebFilter(urlPatterns={"/project.jsp"})//,"/manufacturing/eHeijunka2/project1.jsp"})
public class authFilter implements Filter {

    /**
     * Default constructor. 
     */
    public authFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		data_manage datam = new data_manage();
		HttpSession session = ((HttpServletRequest) request).getSession();
		String uid = (String) session.getAttribute("uid");
		String sql0 = "select a.menuid,b.applvl from sys_user_menu a left join sys_role b on a.roleid=b.roleid where uid = \'"+uid+"\' order by convert(int,a.menuid)";
		ResultSet resultSet = null;
		ResultSet resultSet1 = null;
		ResultSet resultSet2 = null;
		ResultSet resultSet3 = null;
		String menuarr = "";
		String menuroleid = "";
		String apparr = "";
		String appurl = "";
		String apparrid = "";
		int applvl=0;
		try {
			resultSet = datam.slect_sql(sql0);
				while(resultSet.next()){
					String mname = "";
					String menuid = resultSet.getString("menuid");
					applvl = Integer.valueOf(resultSet.getString("applvl"));
					menuroleid = menuroleid + resultSet.getString("applvl") + " ";
					sql0 = "SELECT  * FROM sys_menu WHERE menuid = \'"+menuid +"\'";
					resultSet1 = datam.slect_sql(sql0);
					while(resultSet1.next()){
						mname = resultSet1.getString("menuname");
						
					}
					
					menuarr = menuarr + mname+" ";
					
					
					
					sql0 = "SELECT  * FROM sys_menu_app where menuid = \'"+menuid +"\' and applvl <= "+applvl;
					resultSet2 = datam.slect_sql(sql0);
					while(resultSet2.next()){
						String appid = resultSet2.getString("appid");
						apparrid = apparrid + appid + " ";
						sql0 = "SELECT  * FROM sys_app WHERE appid = \'"+appid +"\'";
						resultSet3 = datam.slect_sql(sql0);
						while(resultSet3.next()){
							apparr = apparr + resultSet3.getString("appname") + " ";
							appurl = appurl + resultSet3.getString("appurl") + " ";
						}
					}
				}
				String sql = "SELECT * FROM sys_menu_app ";
				ResultSet resultSettmp = datam.slect_sql(sql);
				String menuapp = "";
				while(resultSettmp.next()){
					menuapp = menuapp + resultSettmp.getString("menuid") + " " +resultSettmp.getString("appid") + " ";
				}
				System.out.println("menuapp: " + menuapp);
				session.setAttribute("menuapp", menuapp); 
				System.out.println("menuarr:" + menuarr);
				System.out.println("apparr:" + apparr);
				System.out.println("appurl:" + appurl);
				System.out.println("appid:" + apparrid);
				System.out.println("menuroleid:" + menuroleid);
				session.setAttribute("menuarr", menuarr); 
				session.setAttribute("apparr", apparr); 
				session.setAttribute("appurl", appurl); 
				session.setAttribute("appid", apparrid); 
				session.setAttribute("menuroleid", menuroleid); 
			}
		catch (SQLException e) {
				e.printStackTrace();
				}
	
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
		System.out.println("authFilter init.....");
	}

}
