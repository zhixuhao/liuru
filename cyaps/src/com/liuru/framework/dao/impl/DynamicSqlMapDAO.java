package com.liuru.framework.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.liuru.framework.dao.AbstractDAO;
import com.liuru.framework.exception.ApplicationException;
import com.liuru.framework.util.BeanUtils;
import com.liuru.framework.util.ListRange;

/**
 * @author Will Yang
 * @version 1.0
 */
public class DynamicSqlMapDAO extends AbstractDAO {
	private static Log logger = LogFactory.getLog(DynamicSqlMapDAO.class);

	public Object getNextPK() {
		return getSqlMapClientTemplate().queryForObject(getName() + ".nextpk",
				null);
	}
	
	public Object getNextPK(String queryName) {
		return getSqlMapClientTemplate().queryForObject(getName()+"."+queryName + ".nextpk",
				null);
	}		

	public Object retrieve(Object pk) {
		System.out.println("----------------------"+getName() );
		return getSqlMapClientTemplate().queryForObject(
				getName() + ".retrieve", pk);
	}

	public Object retrieve(Object pk, Class resultClass) {
		Object obj = retrieve(pk);
		if (obj instanceof Map) {
			logger
					.info("in config files, resultClass of query "
							+ getName()
							+ ".retrieve is defined as Map. it is automaticly convert to object of type "
							+ resultClass.getName() + ".");
			return BeanUtils.map2Bean((Map) obj, resultClass);
		} else {
			return obj;
		}
	}

	public Collection query(String queryName, Object parameter) {
		return getSqlMapClientTemplate().queryForList(
				getName() + "." + queryName, parameter);
	}

	public Collection query(String queryName) {
		return getSqlMapClientTemplate().queryForList(
				getName() + "." + queryName);
	}		

	public Collection query(String queryName, Object parameter, int offset,
			int limit) {
		logger
				.info("In query() of " + getName() + ", queryName = "
						+ queryName);
		logger.info("Parameter type: " + parameter.getClass().getName());
		if (parameter instanceof Map) {
			logger.info("Map size = " + ((Map) parameter).size());
			java.util.Iterator it = ((Map) parameter).keySet().iterator();
			while (it.hasNext()) {
				Object key = it.next();
				Object value = ((Map) parameter).get(key);
				logger
						.info("Key = "
								+ key
								+ ", value = "
								+ value
								+ " Value type = "
								+ (value != null ? value.getClass().getName()
										: "null"));
			}
		}
		List list = getSqlMapClientTemplate().queryForList(
				getName() + "." + queryName, parameter, offset, limit);
		return list;
	}
	
	public int getCount(String queryName) {
		String sqlMapName = getName() + "." + queryName + ".count";
		List list = getSqlMapClientTemplate().queryForList(sqlMapName);

		if (list.size() != 1) {
			// TODO i18n
			// throw new SystemException( "No record returned from the query: "
			// + getName() + "." + queryName );
		}
		Map map = (Map) list.get(0);
		Object[] v = map.values().toArray();
		if (v.length < 1) {
			// Ignore
		}
		return ((Number) v[0]).intValue();
	}	
	
	public int getCount(String queryName, Object parameters) {
		String sqlMapName = getName() + "." + queryName + ".count";
		List list = getSqlMapClientTemplate().queryForList(sqlMapName,
				parameters);

		if (list.size() != 1) {
			// TODO i18n
			// throw new SystemException( "No record returned from the query: "
			// + getName() + "." + queryName );
		}
		Map map = (Map) list.get(0);
		Object[] v = map.values().toArray();
		if (v.length < 1) {
			// Ignore
		}
		return ((Number) v[0]).intValue();
	}

	public void insert(Object o) {
		getSqlMapClientTemplate().insert(getName() + ".insert", o);
	}

	public void update(Object o) {
		getSqlMapClientTemplate().update(getName() + ".update", o);
	}

	public void delete(Object o) {
		getSqlMapClientTemplate().delete(getName() + ".delete", o);
	}

	public void update(String queryName, Object o) {
		getSqlMapClientTemplate().update(getName() + "." + queryName, o);
	}

	public void insert(String queryName, Object o) {
		getSqlMapClientTemplate().insert(getName() + "." + queryName, o);
	}

	public void delete(String sql, Object o) {
		getSqlMapClientTemplate().delete(getName() + "." + sql, o);
	}

	public Collection dynamicSQLQuery(String sql,
			List parameters) {
		Connection conn = null;
		PreparedStatement pstmt = null;
		List result = new ArrayList();
		try {
			conn = getSqlMapClientTemplate().getDataSource().getConnection();
		} catch (SQLException e) {
			throw new ApplicationException("Connection to data source fails.");
		}

		try {
			pstmt = conn.prepareStatement(sql);
		} catch (SQLException e) {
			throw new ApplicationException("Dynamic SQL error:" + e.getMessage());
		}

		if (parameters != null) {
			for (int i = 0; i < parameters.size(); i++) {
				try {
					pstmt.setObject(i + 1, parameters.get(i));
				} catch (SQLException e) {
					throw new ApplicationException("Dynamic SQL parameter error锛�"
							+ e.getMessage() + " parmas锛�" + parameters.get(i));
				}
			}
		}

		try {
			ResultSet rs = pstmt.executeQuery();
			while (rs.next()) {
				Map record = new HashMap();
				int columnCount = rs.getMetaData().getColumnCount();
				for (int j = 1; j <= columnCount; j++) {
					String columnName = rs.getMetaData().getColumnLabel(j);
					record.put(columnName, rs.getObject(j));
				}
				result.add(record);
			}

		} catch (SQLException e) {
			throw new ApplicationException("Dynamic SQL execution error: " + e.getMessage());
		}

		try {
			if (pstmt != null) {
				pstmt.close();
			}
			if (conn != null) {
				conn.close();
			}
		} catch (SQLException ex) {

		}
		return result;
	}

	public void dynamicSQLUpdate(String sql, List parameters) {
		Connection conn = null;
		PreparedStatement pstmt = null;
		try {
			conn = getSqlMapClientTemplate().getDataSource().getConnection();
		} catch (SQLException e) {
			throw new ApplicationException("Connetion to data source fails.");
		}

		try {
			pstmt = conn.prepareStatement(sql);
		} catch (SQLException e) {
			throw new ApplicationException("Dynamic SQL error:" + e.getMessage());
		}

		if (parameters != null) {
			for (int i = 0; i < parameters.size(); i++) {
				try {
					pstmt.setObject(i + 1, parameters.get(i));
				} catch (SQLException e) {
					throw new ApplicationException("Dynamic SQL parameter error锛�"
							+ e.getMessage() + " params锛�" + parameters.get(i));
				}
			}
		}

		try {
			pstmt.executeUpdate();
		} catch (SQLException e) {
			throw new ApplicationException("Dynamic SQL execution error: " + e.getMessage());
		}

		try {
			if (pstmt != null) {
				pstmt.close();
			}
			if (conn != null) {
				conn.close();
			}
		} catch (SQLException ex) {

		}
	}
}
