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
 * Servlet implementation class calender
 */
@WebServlet("/calender")
public class calender extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public calender() {
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
		String xx = request.getParameter("cal");
		System.out.println("method:"+method+" cal: "+xx+" time: "+timenow);
		PrintWriter pw = response.getWriter();
		JSONArray array = new JSONArray(); 
		String sql = "";
		HttpSession session = request.getSession();
		if(method.equals("delete")){
			String cal = request.getParameter("cal");
			sql = "delete from dta_cal where cal_code = '"+cal +"'";
			datam.delete_sql(sql);
		}
		else if (method.equals("edit")) {
			String former_cal = request.getParameter("former_cal");
			String cal = request.getParameter("cal");
			String cal_name = request.getParameter("cal_name");
			String cal_date = request.getParameter("cal_date");
			String cal_year = request.getParameter("cal_year");
			sql = "update dta_cal set cal_code = '"+cal+"',"+"cal_name='"+cal_name+"'," +"cal_date='"+cal_date+"'," +"cal_year='"+cal_year+"'," 
			+"chg_by='"+(String)(session.getAttribute("user_name"))+"'," +"chg_date='"+timenow+"'"
			+" where cal_code = '"+ former_cal +"'";
			datam.edit_sql(sql);
			sql = "update dta_cal_ws set cal_code = '"+cal+"' where cal_code ='"+ former_cal +"'";
			datam.edit_sql(sql);
		}
		else if (method.equals("add")) {
			String cal = request.getParameter("cal");
			String cal_name = request.getParameter("cal_name");
			String cal_date = request.getParameter("cal_date");
			String cal_year = request.getParameter("cal_year");
			sql = "insert into dta_cal (cal_code,cal_name,cal_year,cal_date,crt_by,crt_date) values("+"'"+cal+"',"
					+"'"+cal_name+"',"+"'"+cal_year+"',"+"'"+cal_date+"',"+"'"+(String)(session.getAttribute("user_name"))+"',"+"'"+timenow+"')";
			datam.add_sql(sql);
		}
		else if (method.equals("edit_click")){
			try {
				String cal = request.getParameter("cal");
				sql = "select cal_date from dta_cal where cal_code = '" + cal+"'";
				ResultSet rs = datam.slect_sql(sql);
				ResultSetMetaData metaData = rs.getMetaData();  
				int columnCount = metaData.getColumnCount(); 
				while (rs.next()) {
					JSONObject jsonObj = new JSONObject();
					for (int i = 1; i <= columnCount; i++) {  
			            String columnName =metaData.getColumnLabel(i);  
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
				sql = "select id,cal_code,cal_name,cal_year from dta_cal ";
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
