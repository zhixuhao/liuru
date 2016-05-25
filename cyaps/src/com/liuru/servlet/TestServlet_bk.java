package com.liuru.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.liuru.services.EHeijunkaService;

/**
 * Servlet implementation class LoginServlet
 */
// @WebServlet("/login")
public class TestServlet_bk extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public TestServlet_bk() {
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
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// todo
		System.out.println("function start");
		String strPlant = request.getParameter("plant");
		String strPlnOrd = "N";
		Map parm = new HashMap();
		//parm.put("key", "value");
		parm.put("plant", strPlant);
		parm.put("PlnOrd", strPlnOrd);
		System.out.println("input plant is "+strPlant);
		try{
			
			WebApplicationContext wac = WebApplicationContextUtils
					.getWebApplicationContext(getServletContext());
			EHeijunkaService service = (EHeijunkaService) wac
					.getBean("service-EHeijunkaService");
			service.PegForAll(parm);
			System.out.println("function result : done");
			
		}catch(Exception e){
			e.printStackTrace();
		}
		System.out.println("function done");
		response.sendRedirect("index.jsp");

	}

}
