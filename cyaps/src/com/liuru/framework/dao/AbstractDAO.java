package com.liuru.framework.dao;

import org.springframework.beans.factory.BeanNameAware;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

/**
 * 
 * @author Will Yang
 */

public abstract class AbstractDAO extends SqlMapClientDaoSupport implements DAO, BeanNameAware
{
    private String name;
    
    /*
     *  (non-Javadoc)
     * @see org.springframework.beans.factory.BeanNameAware#setBeanName(java.lang.String)
     */
    public void setBeanName( String name )
    {
        this.name = name;
    }
    
    /*
     *  (non-Javadoc)
     * @see com.mmm.cnmis.framework.dao.DAO#getName()
     */
    public String getName()
    {
        return name;
    }

}