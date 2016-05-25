package com.liuru.services;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.liuru.model.EHeijunka;

public class DBConnUtil {
	
	private static Log logger = LogFactory.getLog(DBConnUtil.class);
	
	private EHeijunka eheijunka;

	public EHeijunka getEheijunka() {
		return eheijunka;
	}

	public void setEheijunka(EHeijunka eheijunka) {
		this.eheijunka = eheijunka;
	}

	private static String sqlJdbcDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
	private static String sqlJdbcUrl = "jdbc:sqlserver://192.168.10.250:1433; DatabaseName=TAYOR";
	private static String sqlJdbcUser = "haison";
	private static String sqlJdbcPsw = "tayor_123";
	
	private static String mySqlJdbcDriver = "com.mysql.jdbc.Driver";
	private static String mySqlJdbcUrl = "jdbc:mysql://192.168.10.250:3306/hjk";
	private static String mySqlJdbcUser = "tayor";
	private static String mySqlJdbcPsw = "tayor_123";
	
	//create connection
	public static Connection getSqlConn(){  
        Connection conn = null;
        try {
            Class.forName(sqlJdbcDriver);
            conn = DriverManager.getConnection(sqlJdbcUrl, sqlJdbcUser, sqlJdbcPsw);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }
	
	//create connection
		public static Connection getMysqlConn(){  
	        Connection conn = null;
	        try {
	            Class.forName(mySqlJdbcDriver);
	            conn = DriverManager.getConnection(mySqlJdbcUrl, mySqlJdbcUser, mySqlJdbcPsw);
	        } catch (ClassNotFoundException e) {
	            e.printStackTrace();
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	        return conn;
	    }
		
	//close connection for (insert/update/delete)
	public static void closeAll(ResultSet rs ,Statement st,Connection conn){  
        if(rs != null){
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(st != null){
            try {
                st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(conn != null){
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
	
	//close connection for (query)
	public static void closeAll(ResultSet rs ,PreparedStatement ps,Connection conn){ 
        if(rs != null){
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(ps != null){
            try {
                ps.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(conn != null){
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
	
	
}
