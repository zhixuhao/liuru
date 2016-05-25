package com.liuru.framework.exception;

/**
 * @author Will Yang
 */
public abstract class RootException extends RuntimeException
{
    /**
	 * 
	 */
	private static final long serialVersionUID = -7267141532948195359L;
	/**
	 * 
	 */
	public static final int SYS_EXCEPTION = 0;
    public static final int APP_EXCEPTION = 1;

    /**
     * The error code
     */
    protected String errorCode;

    /**
     * The parameter to replace the local defaultMessage
     */
    protected String[] params = new String[0];

    /**
     * This defaultMessage has nothing to do with the i18n issue.
     */
    protected String defaultMessage = null;

    /**
     * Constructor
     * @param message
     */
    public RootException(String message)
    {
        super(message);
    }

    /**
     * Constructor
     *
     * @param errorCode
     * @param defaultMessage
     */
    public RootException(String errorCode, String message)
    {
        super();
        this.errorCode = errorCode;
        this.defaultMessage = message;
    }

    /**
     *
     * @param errorCode
     * @param cause
     */
    public RootException(String errorCode, Throwable cause)
    {
        super(cause);
        this.errorCode = errorCode;
    }

    /**
     *
     * @param errorCode
     * @param params
     * @param cause
     */
    public RootException(String errorCode, String[] params,
                         String defaultMessage, Throwable cause)
    {
        super(cause);
        this.errorCode = errorCode;
        this.params = params;
        this.defaultMessage = defaultMessage;
    }

    public RootException(String errorCode, String[] params,
                         String defaultMessage)
    {
        super();
        this.errorCode = errorCode;
        this.params = params;
        this.defaultMessage = defaultMessage;
    }

    /**
     *
     * @param cause
     */
    public RootException(Throwable cause)
    {
        super(cause);
    }

    /**
     * Returns the error code.
     *
     * @return
     */
    public String getErrorCode()
    {
        return errorCode;
    }

    /**
     * Returns the parameters of this exception.
     *
     * @return
     */
    public String[] getParameters()
    {
        return params;
    }

    /**
     * @return
     */
    public String getDefaultMessage()
    {
        return defaultMessage;
    }

    /**
     * Returns the exception type.
     *
     * @return
     */
    public abstract int getType();
}
