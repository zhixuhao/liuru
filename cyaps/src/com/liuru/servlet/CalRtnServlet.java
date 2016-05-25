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

import com.liuru.services.*;


/**
 * Servlet implementation class LoginServlet
 */
// @WebServlet("/autodsp")
public class CalRtnServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CalRtnServlet() {
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
		System.out.println("Auto scheduling start");
		String strPlant = request.getParameter("plant");

		Map parm = new HashMap();
		parm.put("plant", strPlant);
		
		System.out.println("plant is "+ strPlant + ";");
		try{
			
			WebApplicationContext wac = WebApplicationContextUtils
					.getWebApplicationContext(getServletContext());
			EHeijunkaService service = (EHeijunkaService) wac
					.getBean("service-EHeijunkaService");
			
			
			service.CalShopOrderRtnByPlant(parm);
			
			System.out.println("function result : done");
			
		}catch(Exception e){
			e.printStackTrace();
		}
		System.out.println("function done");
		response.sendRedirect("index.jsp");

	}

}
