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
 * Servlet implementation class wrktime
 */
@WebServlet("/wrktime")
public class wrktime extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public wrktime() {
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
		String xx = request.getParameter("time");
		System.out.println("method:"+method+" time: "+xx);
		PrintWriter pw = response.getWriter();
		JSONArray array = new JSONArray(); 
		String sql = "";
		HttpSession session = request.getSession();
		if(method.equals("delete")){
			String time = request.getParameter("time");
			sql = "delete from dta_cal_wrktime where wt_code = '"+time +"'";
			datam.delete_sql(sql);
		}
		else if (method.equals("edit")) {
			String former_time = request.getParameter("former_time");
			String time = request.getParameter("time");
			String time_name = request.getParameter("time_name");
			String starttime = request.getParameter("starttime");
			String endtime = request.getParameter("endtime");
			sql = "update dta_cal_wrktime set wt_code = '"+time+"',"+"wt_name='"+time_name+"',"+"wt_fr='"+starttime+"',"+"wt_to='"+endtime
					+"',"+"chg_by='"+(String)(session.getAttribute("user_name"))+"',"+"chg_date='"+timenow+"'"
			+" where wt_code = '"+ former_time +"'";
			datam.edit_sql(sql);
			sql = "update dta_cal_ws set wt_code = '"+time+"' where wt_code ='"+ former_time +"'";
			datam.edit_sql(sql);
		}
		else if (method.equals("add")) {
			String time = request.getParameter("time");
			String time_name = request.getParameter("time_name");
			String starttime = request.getParameter("starttime");
			String endtime = request.getParameter("endtime");
			sql = "insert into dta_cal_wrktime (wt_code,wt_name,wt_fr,wt_to,crt_by,crt_date) values("+"'"+time+"',"
					+"'"+time_name+"',"+"'"+starttime+"',"+"'"+endtime+"',"+"'"+(String)(session.getAttribute("user_name"))+"',"+"'"+timenow+"')";
			datam.add_sql(sql);
		}
		if(method.equals("add") || method.equals("edit") || method.equals("delete")){
			try {
				sql = "select * from dta_cal_wrktime ";
				ResultSet rs = datam.slect_sql(sql);
				ResultSetMetaData metaData = rs.getMetaData();  
				int columnCount = metaData.getColumnCount(); 
				while (rs.next()) {
					JSONObject jsonObj = new JSONObject();
					for (int i = 1; i <= columnCount; i++) {  
			            String columnName =metaData.getColumnLabel(i);  
			            columnName = columnName.toUpperCase();
			            String value = rs.getString(columnName);  
			            if(i == 4){
			            	String starttime = value.substring(0,value.length()-2);
			            	String starttime1 = starttime.substring(0,starttime.length()-2)+":"+starttime.substring(starttime.length()-2,starttime.length());
			            	jsonObj.put("starttime", starttime);  
			            	jsonObj.put("starttime1", starttime1);  
			            }
			            if(i == 5){
			            	String endtime = value.substring(0,value.length()-2);
			            	String endtime1 = endtime.substring(0,endtime.length()-2)+":"+endtime.substring(endtime.length()-2,endtime.length());
			            	jsonObj.put("endtime", endtime);  
			            	jsonObj.put("endtime1", endtime1);  
			            }
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
