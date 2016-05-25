package com.liuru.servlet;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ibm.as400.access.UserList;
import com.liuru.services.EHeijunkaService;

/**
 * Servlet implementation class LoginServlet
 */
// @WebServlet("/login")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LoginServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		Map userRowMap = new HashMap();
		boolean checkFlag = false;
		
		try {
			Map parm = new HashMap();
			parm.put("uid", request.getParameter("uid"));
			parm.put("psw", request.getParameter("psw"));
			WebApplicationContext wac = WebApplicationContextUtils
					.getWebApplicationContext(getServletContext());
			EHeijunkaService service = (EHeijunkaService) wac
					.getBean("service-EHeijunkaService");
			Collection userList = service.login(parm);
			Iterator userListItr = userList.iterator();
			if (userListItr.hasNext()) {
				userRowMap = (Map) userListItr.next();
				request.getSession().setAttribute("uid", request.getParameter("uid"));
				request.getSession().setAttribute("view", 1);
				request.getSession().setAttribute("alter", 1);
				request.getSession().setAttribute("file", 1);
				this.getServletConfig().getServletContext()
	            .getRequestDispatcher("/home.jsp").forward(request, response); 
			} else {
				request.getSession().setAttribute("errcode", -1);
				response.sendRedirect("index.jsp");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			request.getSession().setAttribute("errcode", -1);
			response.sendRedirect("index.jsp");
		}
	}

}
