package com.dao;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.nutz.ioc.IocException;

public class data_manage {
	public Connection conn;
	public data_manage(){
		conn = connection_cons();
	}
	public Connection connection_cons(){
		Connection conn = null;
		try {
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
			String url = "jdbc:sqlserver://localhost:1433; DatabaseName=liuru";	
			String username = "sa";	
			String password = "zhixuhao";	
			conn = DriverManager.getConnection(url,username,password);
			if(conn != null){
				return conn;
			}
			else{
				System.out.println("数据库连接失败...0");
			}
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			System.out.println("数据库连接失败...1");
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("数据库连接失败...2");
			e.printStackTrace();
		}
		return conn;
	}
	public void delete_sql(String sql){
		
		Statement st = null;
		try {
			//PreparedStatement statement = conn.prepareStatement(sql);
			//statement = conn.prepareStatement(sql);
			//int resultSet = statement.executeUpdate(sql);
			st = conn.createStatement();
			int i = st.executeUpdate(sql);
			if (i==0) {
			//	flag = false;
			}
			System.out.println("删除成功");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("删除失败");
		}
	}
	
	public ResultSet slect_sql(String sql){
		
		Statement st = null;
		ResultSet rs = null;
		try {
			//PreparedStatement statement = conn.prepareStatement(sql);
			//statement = conn.prepareStatement(sql);
			//rs = statement.executeQuery();
			st = conn.createStatement();
			rs = st.executeQuery(sql);
			System.out.println("查询成功");
			
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("查询失败");
		}
		return rs;
	}
	
	public void add_sql(String sql){
		
		Statement st = null;
		try {
			//PreparedStatement statement = conn.prepareStatement(sql);
			//statement = conn.prepareStatement(sql);
			//int resultSet = statement.executeUpdate(sql);
			st = conn.createStatement();
			int i = st.executeUpdate(sql);
			if (i==0) {
			//	flag = false;
			}
			System.out.println("添加成功");
			
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("添加失败");
		}
	}
	
	public void edit_sql(String sql){
		
		Statement st = null;
		try {
			//PreparedStatement statement = conn.prepareStatement(sql);
			//statement = conn.prepareStatement(sql);
			//int resultSet = statement.executeUpdate(sql);		
			st = conn.createStatement();
			int i = st.executeUpdate(sql);
			if (i==0) {
			//	flag = false;
			}
			System.out.println("编辑成功");
			
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("编辑失败");
		}
	}
}
