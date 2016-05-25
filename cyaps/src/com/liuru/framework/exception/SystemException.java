package com.liuru.framework.exception;

/**
 * @author Will Yang
 */
public class SystemException extends RootException
{
    /**
	 * 
	 */
	private static final long serialVersionUID = -4256164956419513593L;

	public SystemException( String message )
    {
        super( message );
    }
    
    /**
     * @param arg0
     * @param arg1
     */
    public SystemException( String errorCode, Throwable cause )
    {
        super( errorCode, cause );
    }

    /**
     * @param errorCode
     * @param defaultMessage
     */
    public SystemException( String errorCode, String message )
    {
        super( errorCode, message );
    }

    /**
     * @param errorCode
     * @param params
     * @param cause
     */
    public SystemException( String errorCode, String[] params,
            String defaultMessage, Throwable cause )
    {
        super( errorCode, params, defaultMessage, cause );
    }

    /**
     * @param errorCode
     * @param params
     * @param defaultMessage
     */
    public SystemException( String errorCode, String[] params,
            String defaultMessage )
    {
        super( errorCode, params, defaultMessage );
    }

    /**
     * @param arg0
     */
    public SystemException( Throwable cause )
    {
        super( cause );
    }

    public int getType()
    {
        return SYS_EXCEPTION;
    }

}