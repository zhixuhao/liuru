package com.liuru.framework.util;

import java.io.Serializable;

public class ListRange implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Object[] data;
	private int totalSize;

	public Object[] getData() {
		return data;
	}

	public void setData(Object[] data) {
		this.data = data;
	}

	public int getTotalSize() {
		return totalSize;
	}

	public void setTotalSize(int totalSize) {
		this.totalSize = totalSize;
	}
}