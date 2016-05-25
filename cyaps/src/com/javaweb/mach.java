package com.javaweb;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.dao.data_manage;

/**
 * Servlet implementation class mach
 */
@WebServlet("/mach")
public class mach extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public mach() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		Date now = new Date();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String timenow = format.format(now);
		data_manage datam = new data_manage();
		String method = request.getParameter("method");
		String xx = request.getParameter("mach");
		System.out.println("method:"+method+" mach: "+xx);
		PrintWriter pw = response.getWriter();
		JSONArray array = new JSONArray(); 
		String sql = "";
		HttpSession session = request.getSession();
		if(method.equals("delete")){
			String mach = request.getParameter("mach");
			sql = "delete from dta_mach where mach = '"+mach +"'";
			datam.delete_sql(sql);
			sql = "delete from dta_mach_item where mach = '"+mach+"'" ;
			datam.delete_sql(sql);
			sql = "delete from dta_wrkc_mach where mach = '"+mach+"'" ;
			datam.delete_sql(sql);
		}
		else if (method.equals("edit")) {
			String former_mach = request.getParameter("former_mach");
			String mach = request.getParameter("mach");
			String mach_name = request.getParameter("mach_name");
			sql = "update dta_mach set mach = '"+mach+"',"+"mach_name='"+mach_name+"',"+"chg_by = '"+(String)(session.getAttribute("user_name"))
					+"',"+"chg_date = '"+timenow+"'"
			+" where mach = '"+ former_mach +"'";
			datam.edit_sql(sql);
			sql = "update dta_wrkc_mach set mach = '"+mach+"' where mach ='"+ former_mach +"'";
			datam.edit_sql(sql);
			sql = "update dta_mach_item set mach = '"+mach+"' where mach ='"+ former_mach +"'";
			datam.edit_sql(sql);
		}
		else if (method.equals("add")) {
			String mach = request.getParameter("mach");
			String mach_name = request.getParameter("mach_name");
			sql = "insert into dta_mach (mach,mach_name,crt_by,crt_date) values("+"'"+mach+"',"
					+"'"+mach_name+"',"+"'"+(String)(session.getAttribute("user_name"))+"',"
							+"'"+timenow+"')";
			datam.add_sql(sql);
		}
		else if(method.equals("add_item")){
			String mach = request.getParameter("mach");
			String item = request.getParameter("item");
			sql = "insert into dta_mach_item (mach,item,crt_by,crt_date) values("+"'"+mach+"',"
					+"'"+item+"',"+"'"+(String)(session.getAttribute("user_name"))+"',"
							+"'"+timenow+"')";
			datam.add_sql(sql);
		}
		else if(method.equals("delete_item")){
			String mach = request.getParameter("mach");
			String item = request.getParameter("item");
			sql = "delete from dta_mach_item where item = '"+item+"' and mach = '" + mach +"'" ;
			datam.delete_sql(sql);
		}
		if(method.equals("add_item") || method.equals("delete_item") || method.equals("item_click")){
			try {
				String mach = request.getParameter("mach");
				sql = "select * from dta_mach_item where mach = '" + mach +"'";
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
			        array.add(jsonObj); 
				}
				System.out.println(array);
				pw.print(array);
			} catch (Exception e) {
				// TODO: handle exception
			}
		}
		if(method.equals("add") || method.equals("edit") || method.equals("delete")){
			try {
				sql = "select * from dta_mach ";
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
			        array.add(jsonObj); 
				}
				System.out.println(array);
				pw.print(array);
			} catch (Exception e) {
				// TODO: handle exception
			}
		}
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request,response);
	}

}
