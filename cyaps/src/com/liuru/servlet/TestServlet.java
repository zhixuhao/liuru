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
// @WebServlet("/login")
public class TestServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public TestServlet() {
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
		//String strOrder = "52520151218071";
		String strPlnOrd = "N";
		//String version="A20160127150120";
		Map parm = new HashMap();
		//parm.put("key", "value");
		parm.put("plant", strPlant);
		//parm.put("ord_num",strOrder);
		//parm.put("ord_type","2SO");
		//parm.put("direction", "BW");
		//parm.put("plnOrd", strPlnOrd);
		//parm.put("logOnly", "N");
		//parm.put("frzDays", request.getParameter("frzDays"));
		//parm.put("version", version);
		//parm.put("parmPO", "Y");
		//parm.put("parmSO", "Y");
		//parm.put("parmPL", "Y");
		//parm.put("wrkc", 5);
		System.out.println("input plant is "+strPlant);
		try{
			
			WebApplicationContext wac = WebApplicationContextUtils
					.getWebApplicationContext(getServletContext());
			EHeijunkaService eHjkService = (EHeijunkaService) wac
					.getBean("service-EHeijunkaService");
//			ImportDataService iDtaService = (ImportDataService) wac
//			.getBean("service-ImportDataService");
//			PeggingService pegService = (PeggingService) wac
//			.getBean("service-PeggingService");
	
			
			eHjkService.BalDmdSup(parm);
			//service.ExplodeMutilRtn(parm);
			//service.CalBroadcastingDate(parm);
			//service.CalShopOrderRtnByPlant(parm);
			//service.AutoDispatchByPlant(parm);
			//service.PegForSingleByWrkc(parm);
			//service.getPegAssignOrderList(parm);
			//service.importItemMaster();
			System.out.println("function result : done");
			
		}catch(Exception e){
			e.printStackTrace();
		}
		System.out.println("function done");
		response.sendRedirect("index.jsp");

	}

}
