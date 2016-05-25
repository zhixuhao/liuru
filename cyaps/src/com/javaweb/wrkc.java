package com.javaweb;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
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
 * Servlet implementation class wrkc
 */
@WebServlet("/wrkc")
public class wrkc extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public wrkc() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setCharacterEncoding("UTF-8");
		Date now = new Date();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String timenow = format.format(now);
		data_manage datam = new data_manage();
		String method = request.getParameter("method");
		String xx = request.getParameter("wrkc");
		System.out.println("method:"+method+" wrkc: "+xx);
		PrintWriter pw = response.getWriter();
		JSONArray array = new JSONArray(); 
		String sql = "";
		HttpSession session = request.getSession();
		if(method.equals("delete")){
			String wrkc = request.getParameter("wrkc");
			sql = "delete from dta_wrkc where wrkc = '"+wrkc +"'";
			datam.delete_sql(sql);
			sql = "delete from dta_wrkc_auth where wrkc = '"+wrkc+"'" ;
			datam.delete_sql(sql);
			sql = "delete from dta_wrkc_mach where wrkc = '"+wrkc+"'" ;
			datam.delete_sql(sql);
		}
		else if (method.equals("edit")) {
			String former_wrkc = request.getParameter("former_wrkc");
			String wrkc = request.getParameter("wrkc");
			String wrkc_name = request.getParameter("wrkc_name");
			String plant = request.getParameter("plant");
			String used = request.getParameter("used");
			String used_by = request.getParameter("used_by");
			sql = "update dta_wrkc set wrkc = '"+wrkc+"',"+"wrkc_name='"+wrkc_name+"',"
			+"plant='"+plant+"',"+"used='"+used+"',"+"used_by='"+used_by
			+"',"+"chg_by='"+(String)(session.getAttribute("user_name"))+"',"+"chg_date='"+timenow+"' where wrkc = '"+ former_wrkc +"'";
			datam.edit_sql(sql);
			sql = "update dta_wrkc_auth set wrkc = '"+wrkc+"' where wrkc ='"+ former_wrkc +"'";
			datam.edit_sql(sql);
			sql = "update dta_wrkc_mach set wrkc = '"+wrkc+"' where wrkc ='"+ former_wrkc +"'";
			datam.edit_sql(sql);
		}
		else if (method.equals("add")) {
			String wrkc = request.getParameter("wrkc");
			String wrkc_name = request.getParameter("wrkc_name");
			String plant = request.getParameter("plant");
			String used = request.getParameter("used");
			String used_by = request.getParameter("used_by");
			sql = "insert into dta_wrkc (wrkc,wrkc_name,plant,used,used_by,crt_by,crt_date) values("+"'"+wrkc+"',"
					+"'"+wrkc_name+"',"+"'"+plant+"',"+"'"+used+"',"+"'"+used_by+"',"+"'"+(String)(session.getAttribute("user_name"))+"',"+"'"+timenow+"')";
			datam.add_sql(sql);
		}
		else if (method.equals("reset")) {
			String wrkc = request.getParameter("wrkc");
			sql = "update dta_wrkc set used='', used_by='' where wrkc = '"+ wrkc +"'";
			datam.edit_sql(sql);
		}
		else if(method.equals("add_mach")){
			String wrkc = request.getParameter("wrkc");
			String mach = request.getParameter("mach");
			sql = "insert into dta_wrkc_mach (wrkc,mach,crt_by,crt_date) values(" + "'" + wrkc +"',"+"'"+mach+"',"+"'"
			+(String)(session.getAttribute("user_name"))+"',"+"'"+timenow + "')";
			datam.add_sql(sql);
		}
		else if(method.equals("delete_mach")){
			String wrkc = request.getParameter("wrkc");
			String mach = request.getParameter("mach");
			sql = "delete from dta_wrkc_mach where wrkc = '"+wrkc+"'" +"and mach = '" + mach +"'";
			datam.delete_sql(sql);
		}
		else if(method.equals("delete_user")){
			String wrkc = request.getParameter("wrkc");
			String uid = request.getParameter("uid");
			sql = "delete from dta_wrkc_auth where wrkc = '"+wrkc+"'" +"and uid = '" + uid +"'";
			datam.delete_sql(sql);
		}
		else if(method.equals("add_user")){
			String wrkc = request.getParameter("wrkc");
			String uid = request.getParameter("uid");
			String auth = request.getParameter("auth");
			sql = "insert into dta_wrkc_auth (wrkc,uid,auth,crt_by,crt_date) values(" + "'" + wrkc +"',"+"'"+uid+"',"+"'"+auth+"',"+"'"
			+(String)(session.getAttribute("user_name"))+"',"+"'"+timenow + "')";
			datam.add_sql(sql);
		}
		else if(method.equals("edit_user")){
			String wrkc = request.getParameter("wrkc");
			String uid = request.getParameter("uid");
			String auth = request.getParameter("auth");
			sql = "update dta_wrkc_auth set auth='"+auth+"',"+"chg_by='"+(String)(session.getAttribute("user_name"))+"',"+"chg_date='"+timenow+"' where wrkc = '"+ wrkc +"' and uid = '" + uid +"'";
			datam.edit_sql(sql);
		}
		if(method.equals("mach_click") || method.equals("add_mach") || method.equals("delete_mach")){
			try{
				String wrkc = request.getParameter("wrkc");
				sql = "select * from dta_wrkc_mach where wrkc = '"+wrkc+"'";
				ResultSet rs = datam.slect_sql(sql);
				ResultSetMetaData metaData = rs.getMetaData();  
				int columnCount = metaData.getColumnCount(); 
				while (rs.next()) {
					JSONObject jsonObj = new JSONObject();
					for (int i = 1; i <= columnCount; i++) {  
			            String columnName =metaData.getColumnLabel(i);  
			            String value = rs.getString(columnName);  
			            columnName = columnName.toUpperCase();
			            jsonObj.put(columnName, value);  
			        }
			        array.add(jsonObj); 
				}
				System.out.println(array);
				pw.print(array);
			}
			catch(Exception e){
				
			}
		}
		if(method.equals("add") || method.equals("edit") || method.equals("delete") || method.equals("reset")){
			try {
				sql = "select * from dta_wrkc ";
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
		if(method.equals("user_click") || method.equals("add_user") || method.equals("delete_user")|| method.equals("edit_user")){
			try {
				String wrkc = request.getParameter("wrkc");
				sql = "select * from dta_wrkc_auth where wrkc = '" + wrkc +"'";
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
		// TODO Auto-generated method stub
		doGet(request,response);
	}

}
