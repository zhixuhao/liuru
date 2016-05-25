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
 * Servlet implementation class cal_time
 */
@WebServlet("/cal_time")
public class cal_time extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public cal_time() {
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
		String xx = request.getParameter("id");
		System.out.println("method:"+method+" id: "+xx);
		PrintWriter pw = response.getWriter();
		JSONArray array = new JSONArray(); 
		String sql = "";
		HttpSession session = request.getSession();
		if(method.equals("delete")){
			String id = request.getParameter("id");
			sql = "delete from dta_cal_ws where id = '"+id +"'";
			datam.delete_sql(sql);
			
		}
		else if (method.equals("edit")) {
			String id = request.getParameter("id");
			String wcal_type = request.getParameter("wcal_type");
			String plant = request.getParameter("plant");
			String wrkc = request.getParameter("wrkc");
			String mach = request.getParameter("mach");
			String cal_code = request.getParameter("cal_code");
			String wt_code = request.getParameter("wt_code");
			sql = "update dta_cal_ws set wcal_type = '"+wcal_type+"',"+"plant='"+plant+"',"+"wrkc='"
			+wrkc+"',"+"mach='"+mach+"',"+"cal_code='"+cal_code+"',"+"wt_code='"+wt_code+"',"+"chg_by='"+(String)(session.getAttribute("user_name"))+"',"+"chg_date='"+timenow+"'"
			+" where id = '"+ id +"'";
			
			datam.edit_sql(sql);
		}
		else if (method.equals("add")) {
			String wcal_type = request.getParameter("wcal_type");
			String plant = request.getParameter("plant");
			String wrkc = request.getParameter("wrkc");
			String mach = request.getParameter("mach");
			String cal_code = request.getParameter("cal_code");
			String wt_code = request.getParameter("wt_code");
			sql = "insert into dta_cal_ws (wcal_type,plant,wrkc,mach,cal_code,wt_code,crt_by,crt_date) values(" + "'" + wcal_type 
					+"',"+"'"+plant+"',"+"'"+wrkc+"',"+"'"+mach+"',"+"'"+cal_code+"',"+"'"+wt_code+"',"+"'"
					+(String)(session.getAttribute("user_name"))+"',"+"'"+timenow + "')";
			datam.add_sql(sql);
		}
		else if(method.equals("add_cstm")){
			String cstm_date = request.getParameter("cstm_date");
			String starttime = request.getParameter("starttime");
			String endtime = request.getParameter("endtime");
			String plant = request.getParameter("plant");
			String wrkc = request.getParameter("wrkc");
			String type = request.getParameter("type");
			String mach = request.getParameter("mach");
			sql = "insert into dta_cal_cstm (cstm_type,plant,wrkc,mach,cstm_date,cstm_fr,cstm_to,crt_by,crt_date) values(" + "'" + type 
					+"',"+"'"+plant+"',"+"'"+wrkc+"',"+"'"+mach+"',"+"'"+cstm_date+"',"+"'"+starttime+"',"+"'"+endtime+"',"+"'"
					+(String)(session.getAttribute("user_name"))+"',"+"'"+timenow + "')";
			datam.add_sql(sql);
		}
		else if(method.equals("delete_cstm")){
			
			String plant = request.getParameter("plant");
			String wrkc = request.getParameter("wrkc");
			String type = request.getParameter("type");
			String mach = request.getParameter("mach");
			String cstm_date = request.getParameter("cstm_date");
			if(type.equals("P")) sql = "delete from dta_cal_cstm where cstm_type = '"+type +"' and plant = '" + plant +"' and cstm_date = '" + cstm_date+"'";
			if(type.equals("w")) sql = "delete from dta_cal_cstm where cstm_type = '"+type +"' and plant = '" + plant +"' and wrkc = '" +"' and cstm_date = '" + cstm_date+"'";
			if(type.equals("M")) sql = "delete from dta_cal_cstm where cstm_type = '"+type +"' and plant = '" + plant +"' and wrkc = '" + wrkc +"' and mach = '"+mach+"' and cstm_date = '" + cstm_date+"'";
			System.out.println(sql);
			datam.delete_sql(sql);
		}
		if(method.equals("add_cstm") || method.equals("delete_cstm") || method.equals("cstm_click")){
			String plant = request.getParameter("plant");
			String wrkc = request.getParameter("wrkc");
			String type = request.getParameter("type");
			String mach = request.getParameter("mach");
			try {
				sql = "select * from dta_cal_cstm where cstm_type = '"+type +"' and plant = '" + plant +"' and wrkc = '" + wrkc +"' and mach = '"+mach+"'";
				ResultSet rs = datam.slect_sql(sql);
				ResultSetMetaData metaData = rs.getMetaData();  
				int columnCount = metaData.getColumnCount(); 
				while (rs.next()) {
					JSONObject jsonObj = new JSONObject();
					for (int i = 1; i <= columnCount; i++) {  
			            String columnName =metaData.getColumnLabel(i); 
			            columnName = columnName.toUpperCase();
			            String value = rs.getString(columnName);  
			            if(i == 6){
			            	String starttime = value;
			            	String starttime1 = starttime.substring(0,2)+":"+starttime.substring(2,4);
			            	jsonObj.put("starttime", starttime);  
			            	jsonObj.put("starttime1", starttime1);  
			            	continue;
			            }
			            if(i == 7){
			            	String endtime = value;
			            	String endtime1 = endtime.substring(0,2)+":"+endtime.substring(2,4);
			            	jsonObj.put("endtime", endtime);  
			            	jsonObj.put("endtime1", endtime1);  
			            	continue;
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
		if(method.equals("add") || method.equals("edit") || method.equals("delete")){
			try {
				sql = "select * from dta_cal_ws ";
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
