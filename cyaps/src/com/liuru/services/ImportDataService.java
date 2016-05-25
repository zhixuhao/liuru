package com.liuru.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

//import java.beans.Statement;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.liuru.framework.util.ListRange;
import com.liuru.model.EHeijunka;
import com.liuru.services.DBConnUtil;


public class ImportDataService {
	
	private static Log logger = LogFactory.getLog(ImportDataService.class);
	
	private EHeijunka eheijunka;

	public EHeijunka getEheijunka() {
		return eheijunka;
	}

	public void setEheijunka(EHeijunka eheijunka) {
		this.eheijunka = eheijunka;
	}	

	//insert or delete record via mysql connection
	public boolean exeInsDel (Map parameters) throws Exception {
		//parameters: sql
		
		boolean flag = true;
		
		Connection conn = null;
		Statement st = null;
		String sql = parameters.get("sql").toString().trim();
		conn = DBConnUtil.getMysqlConn();
				
		try{
			st = conn.createStatement();
			int i = st.executeUpdate(sql);
			if (i==0) {
			//	flag = false;
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBConnUtil.closeAll(null, st, conn);
		}
		
		return flag;
		
	}
		
	//import item 
	@SuppressWarnings("finally")
	public boolean importItemMaster (Map parameters) throws Exception {
		//Parameter: 
		
		boolean flag = false;
		
		Map exeParm = new HashMap();
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		String sql = "SELECT MB001,MB002,MB003,MB080,CASE MB005 WHEN 'CW010' THEN 'RM' WHEN 'CW011' THEN 'SF' ELSE 'FG' END  FROM INVMB WHERE MB109='Y'";
		conn = DBConnUtil.getSqlConn();
				
		try{
			st = conn.createStatement();
			rs = st.executeQuery(sql);
			if (rs != null) {
				
				//clear imp_itm 
				exeParm.put("sql", "delete from imp_itm");
				boolean f = this.exeInsDel(exeParm);
				
				//insert item 
				if (f == true) {
					while (rs.next()) {
						
						sql = "insert into imp_itm(item,item_desc,spec,m_type) values('" + rs.getString(1).trim() + "','" + rs.getString(2).trim() + "','" + rs.getString(3).trim() + "','" + rs.getString(5).trim() + "')";
						exeParm.put("sql", sql);
						flag = this.exeInsDel(exeParm);
						//if (flag == true) {
						//	System.out.println("Insert done!");
						//}
						
					}
					
					//run storage process, import data to erp_inv
					exeParm.put("sql", "call impItm(@flag)");
					f = this.exeInsDel(exeParm);					
				}
		
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBConnUtil.closeAll(rs, st, conn);
			flag = true;
			return flag;
		}
	}
	
	//import inventory 
	@SuppressWarnings("finally")
	public boolean importInv (Map parameters) throws Exception {
		//Parameter: 
		
		boolean flag = false;
		
		Map exeParm = new HashMap();
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		String sql = "SELECT B.MC003,A.MC001,A.MC002,A.MC007 FROM INVMC A LEFT JOIN CMSMC B ON A.MC002=B.MC001";
		conn = DBConnUtil.getSqlConn();
				
		try{
			st = conn.createStatement();
			rs = st.executeQuery(sql);
			if (rs != null) {
				
				//clear imp_itm 
				exeParm.put("sql", "delete from imp_inv");
				boolean f = this.exeInsDel(exeParm);
				
				//insert item 
				if (f == true) {
					while (rs.next()) {
						
						sql = "insert into imp_inv(plant,ord_type,ord_num,ord_op,item,whs,ohd_qty,avai_qty,ohddte,ohdtme) "
								+ "values('" + rs.getString(1).trim() + "','1OH',0,0,'" + rs.getString(2).trim() + "','" + rs.getString(3).trim() + "'," + Double.valueOf(rs.getString(4)) + "," + Double.valueOf(rs.getString(4)) + ",0,0)";
						exeParm.put("sql", sql);
						flag = this.exeInsDel(exeParm);
						//if (flag == true) {
						//	System.out.println("Insert done!");
						//}
						
					}
					
					//run storage process, import data to erp_inv
					exeParm.put("sql", "call impInv(@flag)");
					f = this.exeInsDel(exeParm);
				}
		
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBConnUtil.closeAll(rs, st, conn);
			flag = true;
			return flag;
		}
		
	}	

	//import order header 
	@SuppressWarnings("finally")
	public boolean importSord (Map parameters) throws Exception {
		//Parameter: 
		
		boolean flag = false;
				
		Map exeParm = new HashMap();
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		String sql = "SELECT TA019,LTRIM(RTRIM(TA001)) + LTRIM(RTRIM(TA002)),TA006,TA021,TA015,TA009,TA010  FROM MOCTA  WHERE TA013='Y' AND UPPER(TA011)<>'Y' ORDER BY TA001,TA002";
		conn = DBConnUtil.getSqlConn();
				
		try{
			st = conn.createStatement();
			rs = st.executeQuery(sql);
			if (rs != null) {
				
				//clear imp_itm 
				exeParm.put("sql", "delete from imp_sord");
				boolean f = this.exeInsDel(exeParm);
				
				//insert item 
				if (f == true) {
					while (rs.next()) {
						
						sql = "insert into imp_sord(plant,ord_type,ord_num,ord_op,item,wrkc,req_qty,rlsdte,rlstme,duedte,duetme,orlsdte,orlstme,oduedte,oduetme) "
								+ "values('" + rs.getString(1).trim() + "','2SO','" + rs.getString(2).trim() + "',10,'" + rs.getString(3).trim() + "'," 
								+ Double.valueOf(rs.getString(4)) + "," + Double.valueOf(rs.getString(5)) + "," + Long.valueOf(rs.getString(6)) + ",0," + Long.valueOf(rs.getString(7)) + ",0," 
								+ Long.valueOf(rs.getString(6)) + ",0," + Long.valueOf(rs.getString(7)) + ",0)";
						exeParm.put("sql", sql);
						flag = this.exeInsDel(exeParm);
						//if (flag == true) {
						//	System.out.println("Insert done!");
						//}
						
					}
					
					//run storage process, import data to erp_sord
					exeParm.put("sql", "call impSord(@flag)");
					f = this.exeInsDel(exeParm);
				}
		
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBConnUtil.closeAll(rs, st, conn);
			flag = true;
			return flag;
		}
		
//		return flag;
		
	}	
	
	//import order detail 
	@SuppressWarnings("finally")
	public boolean importSordDtl (Map parameters) throws Exception {
		//Parameter: 
		
		boolean flag=false;
		
		Map exeParm = new HashMap();
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		String sql = "SELECT TA019,LTRIM(RTRIM(TB001))+ LTRIM(RTRIM(TB002)),TB003,TA006,TB004,TA009,TA010  FROM MOCTA LEFT JOIN MOCTB ON TA001=TB001 AND TA002=TB002 WHERE TA013='Y' AND UPPER(TA011)<>'Y' ORDER BY TB001,TB002,TB003";
		conn = DBConnUtil.getSqlConn();
				
		try{
			st = conn.createStatement();
			rs = st.executeQuery(sql);
			if (rs != null) {
				
				//clear imp_itm 
				exeParm.put("sql", "delete from imp_sord_dtl");
				boolean f = this.exeInsDel(exeParm);
				
				//insert item 
				if (f == true) {
					while (rs.next()) {
						
						sql = "insert into imp_sord_dtl(plant,ord_type,ord_num,ord_op,item,prnt,req_qty,rlsdte,rlstme,duedte,duetme) "
								+ "values('" + rs.getString(1).trim() + "','2SO','" + rs.getString(2).trim() + "',10,'" + rs.getString(3).trim() + "','" 
								+ rs.getString(4) + "'," + Double.valueOf(rs.getString(5)) + "," + Long.valueOf(rs.getString(6)) + ",0," + Long.valueOf(rs.getString(7)) + ",0)";
						exeParm.put("sql", sql);
						flag = this.exeInsDel(exeParm);
						//if (flag == true) {
						//	System.out.println("Insert done!");
						//}
						
					}
					
					//run storage process, import data to erp_sord_dtl
					exeParm.put("sql", "call impSordDtl(@flag)");
					f = this.exeInsDel(exeParm);
				}
		
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DBConnUtil.closeAll(rs, st, conn);
			flag = true;
			return flag;
		}
		
	}
	
	//import inventory 
	@SuppressWarnings("finally")
	public boolean importHpo (Map parameters) throws Exception {
			//Parameter: 
			
			boolean flag = false;
			
			Map exeParm = new HashMap();
			Connection conn = null;
			Statement st = null;
			ResultSet rs = null;
			String sql = "SELECT TC010,LTRIM(RTRIM(TD001))+LTRIM(RTRIM(TD002)),TD003,TD004,TD008,TD015,TD012 FROM PURTD LEFT JOIN PURTC ON TC001=TD001 AND TC002=TD002 WHERE TD016<>'Y' AND TD018='Y'";
			conn = DBConnUtil.getSqlConn();
					
			try{
				st = conn.createStatement();
				rs = st.executeQuery(sql);
				if (rs != null) {
					
					//clear imp_itm 
					exeParm.put("sql", "delete from imp_hpo");
					boolean f = this.exeInsDel(exeParm);
										
					//insert item 
					if (f == true) {
						while (rs.next()) {
							
							sql = "insert into imp_hpo(plant,ord_type,ord_num,ord_line,item,pur_qty,rcv_qty,rlsdte,rlstme,duedte,duetme) "
									+ "values('" + rs.getString(1).trim() + "','3PO','" + rs.getString(2).trim() + "','" + rs.getString(3).trim() + "','" + rs.getString(4) + "'," + Double.valueOf(rs.getString(5)) + "," + Double.valueOf(rs.getString(6)) + ",0,0," + Long.valueOf(rs.getString(7)) + ",0)";
							exeParm.put("sql", sql);
							flag = this.exeInsDel(exeParm);
							//if (flag == true) {
							//	System.out.println("Insert done!");
							//}
							
						}
						
						//run storage process, import data to erp_hpo
						exeParm.put("sql", "call impHpo(@flag)");
						f = this.exeInsDel(exeParm);
					}
			
				}
				
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				DBConnUtil.closeAll(rs, st, conn);
				flag = true;
				return flag;
			}
	}
	
}
