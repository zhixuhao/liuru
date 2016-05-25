package com.liuru.services;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.io.FileTransfer;

import com.liuru.framework.util.ListRange;
import com.liuru.model.EHeijunka;

public class CommonService {
	
	private static Log logger = LogFactory.getLog(CommonService.class);
	
	private EHeijunka eheijunka;

	public EHeijunka getEheijunka() {
		return eheijunka;
	}

	public void setEheijunka(EHeijunka eheijunka) {
		this.eheijunka = eheijunka;
	}

	public Date CalDateDur(Map Parameters) throws Exception {
		// Parameter: parmInDt, parmDiff, parmType(D:Days, H:Hours, M:Minutes)

		long lngInDt = 0;
		long tmpDt = 0;
		double dblDiff = 0;
		String Type = "";
		Date dteInDt;
		Date dteOutDt;

		// Define date format
		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		lngInDt = Long.valueOf(Parameters.get("parmInDt").toString().trim());
		dblDiff = Double.valueOf(Parameters.get("parmDiff").toString().trim());
		Type = Parameters.get("parmType").toString().trim();

		if (Type.equals("H")) {
			dteInDt = datetime14.parse(String.valueOf(lngInDt));
			tmpDt = dteInDt.getTime() + (long) (dblDiff * 60 * 60 * 1000);
		} else if (Type.equals("D")) {
			dteInDt = datetime14.parse(String.valueOf(lngInDt));
			tmpDt = dteInDt.getTime() + (long) (dblDiff * 24 * 60 * 60 * 1000);
		} else if (Type.equals("M")) {
			dteInDt = datetime14.parse(String.valueOf(lngInDt));
			tmpDt = dteInDt.getTime() + (long) (dblDiff * 60 * 1000);
		}
		dteOutDt = new Date(tmpDt);

		return dteOutDt;

	}
	
	public void WrtPgmLog(Map Parameters) throws Exception {

		// Write system log
		// input parameter: logCode, logType, logMsg
		eheijunka.insSysLog(Parameters);

	}
	
}
