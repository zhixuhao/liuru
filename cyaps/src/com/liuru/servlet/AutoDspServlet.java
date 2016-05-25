package com.liuru.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.liuru.services.*;


/**
 * Servlet implementation class LoginServlet
 */
// @WebServlet("/autodsp")
public class AutoDspServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AutoDspServlet() {
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
		String strWrkc = request.getParameter("wrkc");
		String strdays = request.getParameter("days");
		
		String strchld = request.getParameter("chld");
		String strbcp = request.getParameter("bcp");
		String strcw = request.getParameter("cw");
		String stristype = request.getParameter("istype");
		HttpSession session = ((HttpServletRequest) request).getSession();
		String uid = (String) session.getAttribute("uid");
		//String strVbcp = request.getParameter("vbcp");
		Map parm = new HashMap();
		parm.put("plant", strPlant);
		parm.put("wrkc", strWrkc);
		parm.put("frzDays", strdays);
		parm.put("uid",uid);
		parm.put("chld",strchld);
		parm.put("bcp",strbcp);
		parm.put("cw",strcw);
		parm.put("istype",stristype);
		//parm.put("vbcp", strVbcp);
		
		System.out.println("plant: "+ strPlant);
		System.out.println("wrkc: "+ strWrkc);
		System.out.println("Frz Days: "+ strdays);
		
		System.out.println("chld: "+ strchld);
		System.out.println("bcp: "+ strbcp);
		System.out.println("cw: "+ strcw);
		System.out.println("istype: "+ stristype);
		//System.out.println("bcp: "+ strVbcp);
		
		try{
			
			WebApplicationContext wac = WebApplicationContextUtils
					.getWebApplicationContext(getServletContext());
			EHeijunkaService service = (EHeijunkaService) wac
					.getBean("service-EHeijunkaService");
			
			
			service.AutoDspByWrkc(parm);
			
			System.out.println("function result : done");
			
		}catch(Exception e){
			e.printStackTrace();
		}
		System.out.println("function done");
		response.sendRedirect("login.jsp");

	}

}
