package com.liuru.framework.exception;

/**
 * @author Will Yang
 */
public class ApplicationException extends RootException
{
    /**
	 * 
	 */
	private static final long serialVersionUID = 9179865289705384268L;

	public ApplicationException( String message )
    {
        super( message );
    }
    
    /**
     * 
     * @param errorCode
     * @param cause
     */
    public ApplicationException( String errorCode, Throwable cause )
    {
        super( errorCode, cause );
    }

    /**
     * @param errorCode
     * @param defaultMessage
     */
    public ApplicationException( String errorCode, String message )
    {
        super( errorCode, message );
    }

    /**
     * @param errorCode
     * @param params
     * @param cause
     */
    public ApplicationException( String errorCode, String[] params,
            String defaultMessage, Throwable cause )
    {
        super( errorCode, params, defaultMessage, cause );
    }

    /**
     * @param errorCode
     * @param params
     * @param defaultMessage
     */
    public ApplicationException( String errorCode, String[] params,
            String defaultMessage )
    {
        super( errorCode, params, defaultMessage );
    }

    /**
     * @param cause
     */
    public ApplicationException( Throwable cause )
    {
        super( cause );
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.mmm.cnmis.framework.exception.RootException#getType()
     */
    public int getType()
    {
        return APP_EXCEPTION;
    }

}