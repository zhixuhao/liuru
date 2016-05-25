package com.liuru.framework.dao;

import java.util.Collection;
import java.util.List;

/**
 * @author Will Yang
 */
public interface DAO
{
    /**
     * getName
     *
     * @return String
     */
    public String getName();

    /**
     * getConnection @
     * @return Connection
     */
    // Connection getConnection() ;
    
    /**
     * retrieve object by key
     *
     * @param pk
     *            key maybe simple type variable or an object
     */
    Object retrieve( Object pk );

    /**
     * 
     * @param pk
     * @param resultClass
     * @return
     * @deprecated
     */
    Object retrieve( Object pk, Class resultClass );

    /**
     * get a new key
     * @return Object
     */
    Object getNextPK();
    
    /**
     * get a new key
     * @param queryName
     *            String 
     * @return Object
     */
    Object getNextPK(String queryName);        

    /**
     * query
     *
     * @param queryName
     *            String
     * @param parameters
     *            Object
     * @return java.util.Collection @
     */
    Collection query( String queryName, Object parameters );

    Collection query( String queryName);
    
    /**
     * query
     *
     * @param queryName
     *            String
     * @param parameters
     *            Object
     * @param offset
     *            int
     * @param limit
     *            int
     * @return java.util.Collection @
     */
    Collection query( String queryName, Object parameters, int offset, int limit );

    /**
     * getCount
     *
     * @param queryName
     *            String
     * @param parameters
     * Object @
     * @return int
     */
    int getCount( String queryName, Object parameters );

    int getCount(String queryName);    
    /**
     * insert a new record according to an object
     *
     * @param o
     */
    void insert( Object o );

    void insert( String queryName, Object o );

    /**
     * update a record according to an object
     *
     * @param o
     */
    void update( Object o );

    void update( String queryName, Object o );

    /**
     * delete a record according to an object
     *
     * @param o
     */
    void delete( Object o );

    void delete( String sql, Object o );

    /**
     * Executes the provided dynamic SQL statement with given parameters.
     * <p>
     * The SQL statement is not defined in the Sqlmap XML files, instead, it is
     * generated dynamically in the codes.
     *
     * @param sql
     *            The dynamic SQL statement.
     * @param parameters
     *            The parameters, it can be null.
     * @return The query result set which is a collection of <code>Map</code>.
     *         The client of this class needs to convert the <code>Map</code>
     *         into model class if necessary.
     */
    Collection dynamicSQLQuery( String sql, List parameters );

    /**
     * Executes the provided dynamic SQL statement with given parameters.
     *
     * @param sql
     *            The dynamic SQL statement which is usually generated in code.
     * @param parameters
     *            The parameter to run the SQL statement.
     */
    void dynamicSQLUpdate( String sql, List parameters );
}
