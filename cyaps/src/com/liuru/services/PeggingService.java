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
import com.liuru.services.*;

public class PeggingService {

	private static Log logger = LogFactory.getLog(PeggingService.class);

	private EHeijunka eheijunka;

	public EHeijunka getEheijunka() {
		return eheijunka;
	}

	public void setEheijunka(EHeijunka eheijunka) {
		this.eheijunka = eheijunka;
	}

	public void BalanceDmdSup(Map parameters) throws Exception {
		//Parameters: plant, version

		String version = parameters.get("version").toString().trim();
		Map supplyItemRowMap;
		Map supplyRowMap;
		Map demandRowMap;
		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		Collection getSupplyItemList = eheijunka.getSupplyItemList(parameters);
		Iterator getSupplyItemListItr = getSupplyItemList.iterator();
		while (getSupplyItemListItr.hasNext()) {
			supplyItemRowMap = (Map) getSupplyItemListItr.next();

			// Get supply qty to assign to demand
			Map supplyItemKey = new HashMap();
			supplyItemKey.put("plant", supplyItemRowMap.get("plant"));
			supplyItemKey.put("item", supplyItemRowMap.get("item"));
			Collection getSupplyList = eheijunka.getSupply(supplyItemKey);
			Iterator getSupplyItr = getSupplyList.iterator();
			while (getSupplyItr.hasNext()) {
				supplyRowMap = (Map) getSupplyItr.next();

				if (supplyRowMap.get("ord_num").toString().trim().equals("51120151209083")) {
					int t = 1;
				}

				double tempQty;
				double remainQty;
				int idSupply;
				long longSupplyDueDate;
				long longSupplyDueTime;
				Date SupplyDueDateTime;

				remainQty = Double.valueOf(supplyRowMap.get("rem_qty").toString().trim());
				idSupply = Integer.valueOf(supplyRowMap.get("id").toString().trim());
				longSupplyDueDate = Long.valueOf(supplyRowMap.get("duedte").toString().trim());
				longSupplyDueTime = Long.valueOf(supplyRowMap.get("duetme").toString().trim());

				// Get demand qty
				Collection getDemandList = eheijunka.getDemand(supplyItemKey);
				Iterator getDemandItr = getDemandList.iterator();
				while (getDemandItr.hasNext()) {
					demandRowMap = (Map) getDemandItr.next();
					// Define variable
					double reqQty;
					double alcQty;
					int idDemand;
					long longDemandOrgRlsDate;
					long longDemandOrgRlsTime;
					long longDemandRlsDate;
					long longDemandRlsTime;
					Date DemandRlsDateTime;
					String strOrdType;
					long longToday = Long.valueOf(new SimpleDateFormat("yyyyMMdd").format(new Date()));

					reqQty = Double.valueOf(demandRowMap.get("req_qty").toString().trim());
					idDemand = Integer.valueOf(demandRowMap.get("id").toString().trim());
					longDemandOrgRlsDate = Long.valueOf(demandRowMap.get("org_rlsdte").toString().trim());
					longDemandOrgRlsTime = Long.valueOf(demandRowMap.get("org_rlstme").toString().trim());
					strOrdType = demandRowMap.get("ord_type").toString().trim();

					// Compare date
					if (longSupplyDueDate == 99999999) {
						longDemandRlsDate = longSupplyDueDate;
						longDemandRlsTime = longSupplyDueTime;
					} else {
						if (longSupplyDueDate * 1000000 + longSupplyDueTime >= longDemandOrgRlsDate * 1000000
								+ longDemandOrgRlsTime) {
							// Supply later then demand, supply due date
							// replaces demand release date
							longDemandRlsDate = longSupplyDueDate;
							longDemandRlsTime = longSupplyDueTime;
						} else {
							// If reschedule flag is 'Y', reschedule demand
							// release date
							// if (strRschld.equals("Y")) {
							// reschedule demand release date, demand release
							// date will be earlier
							longDemandRlsDate = longSupplyDueDate;
							longDemandRlsTime = longSupplyDueTime;
							// } else {
							// longDemandRlsDate=longDemandOrgRlsDate;
							// longDemandRlsTime=longDemandOrgRlsTime;
							// }
						}
						// If demand release date is earlier then today, to be
						// today
						if (longDemandRlsDate < longToday) {
							longDemandRlsDate = longToday;
							longDemandRlsTime = 235959;
						}
					}

					// Calculate qty
					if (remainQty > reqQty) {
						tempQty = remainQty - reqQty;
						alcQty = reqQty;
						reqQty = 0;
						remainQty = tempQty;
					} else {
						tempQty = reqQty - remainQty;
						alcQty = remainQty;
						remainQty = 0;
						reqQty = tempQty;
					}

					// Update demand
					Map leadtimeRowMap;
					// long leadtime = 0;
					double leadtime = 0;
					long ltMsecs = 0;
					long lngDmdDueDte;
					long lngDmdDueTme;
					Date dteDmdRlsDT;
					Date dteDmdDueDT;

					if (longDemandRlsDate == 99999999) {
						lngDmdDueDte = 99999999;
						lngDmdDueTme = 999999;
					} else {
						// Calculate due date
						Map leadtimeParm = new HashMap();
						if (strOrdType.equals("2SO")) {
							leadtimeParm.put("plant", parameters.get("plant").toString().trim());
							leadtimeParm.put("item", demandRowMap.get("prnt").toString().trim());
							Collection getLTFromRtnList = eheijunka.getLTFromRtn(leadtimeParm);
							if (getLTFromRtnList != null && getLTFromRtnList.size() > 0) {
								Iterator getLTFromRtnItr = getLTFromRtnList.iterator();
								leadtimeRowMap = (Map) getLTFromRtnItr.next();
								leadtime = Double.valueOf(leadtimeRowMap.get("lead_time").toString().trim());
								ltMsecs = (long) (leadtime * 60 * 60 * 1000); // Change
																				// hours
																				// to
																				// milliseconds
							}
						} else if (strOrdType.equals("4PL") || strOrdType.equals("5CO")) {
							leadtimeParm.put("item", demandRowMap.get("prnt").toString().trim());
							Collection getLTFromItmList = eheijunka.getLTFromItm(leadtimeParm);
							if (getLTFromItmList != null && getLTFromItmList.size() > 0) {
								Iterator getLTFromItmItr = getLTFromItmList.iterator();
								leadtimeRowMap = (Map) getLTFromItmItr.next();
								leadtime = Double.valueOf(leadtimeRowMap.get("lead_time").toString().trim());
								ltMsecs = (long) (leadtime * 24 * 60 * 60 * 1000); // Change
																					// days
																					// to
																					// milliseconds
							}
						}

						dteDmdRlsDT = datetime14.parse(String.valueOf(longDemandRlsDate * 1000000 + longDemandRlsTime));
						long tmpDT = dteDmdRlsDT.getTime() + ltMsecs;
						dteDmdDueDT = new Date(tmpDT);
						if (reqQty == 0) {
							lngDmdDueDte = Long.valueOf(dateYMD8.format(dteDmdDueDT));
							lngDmdDueTme = Long.valueOf(timeHMS6.format(dteDmdDueDT));
						} else {
							lngDmdDueDte = 99999999;
							lngDmdDueTme = 999999;
						}
					}

					Map demandParm = new HashMap();
					demandParm.put("idDemand", idDemand);
					demandParm.put("reqQty", reqQty);
					demandParm.put("rlsdte", longDemandRlsDate);
					demandParm.put("rlstme", longDemandRlsTime);
					demandParm.put("duedte", lngDmdDueDte);
					demandParm.put("duetme", lngDmdDueTme);
					demandParm.put("chld_ordtype", supplyRowMap.get("ord_type").toString().trim());
					demandParm.put("chld_ord", supplyRowMap.get("ord_num").toString().trim());
					eheijunka.updDemand(demandParm);

					// Save allocation log
					Map allocParm = new HashMap();

					allocParm.put("dem_plant", demandRowMap.get("plant").toString().trim());
					allocParm.put("dem_ord_type", demandRowMap.get("ord_type").toString().trim());
					allocParm.put("dem_ord_num", demandRowMap.get("ord_num").toString().trim());
					allocParm.put("dem_item", demandRowMap.get("prnt").toString().trim());
					allocParm.put("dem_org_qty", Double.valueOf(demandRowMap.get("org_qty").toString().trim()));
					// allocParm.put("dem_req_qty",Double.valueOf(demandRowMap.get("req_qty").toString().trim()));
					allocParm.put("dem_req_qty", reqQty);
					allocParm.put("dem_org_rlsdte", Integer.valueOf(demandRowMap.get("org_rlsdte").toString().trim()));
					allocParm.put("dem_org_rlstme", Integer.valueOf(demandRowMap.get("org_rlstme").toString().trim()));
					allocParm.put("dem_org_duedte", Integer.valueOf(demandRowMap.get("org_duedte").toString().trim()));
					allocParm.put("dem_org_duetme", Integer.valueOf(demandRowMap.get("org_duetme").toString().trim()));
					allocParm.put("dem_rlsdte", longDemandRlsDate);
					allocParm.put("dem_rlstme", longDemandRlsTime);
					allocParm.put("dem_duedte", lngDmdDueDte);
					allocParm.put("dem_duetme", lngDmdDueTme);
					allocParm.put("dem_schld", demandRowMap.get("schld").toString().trim());
					allocParm.put("dem_peg_lvl", 0);

					allocParm.put("sup_plant", supplyRowMap.get("plant").toString().trim());
					allocParm.put("sup_ord_type", supplyRowMap.get("ord_type").toString().trim());
					allocParm.put("sup_ord_num", supplyRowMap.get("ord_num").toString().trim());
					allocParm.put("sup_item", supplyRowMap.get("item").toString().trim());
					allocParm.put("sup_alc_qty", alcQty);
					allocParm.put("sup_rem_qty", remainQty);
					allocParm.put("sup_org_rlsdte", Integer.valueOf(supplyRowMap.get("org_rlsdte").toString().trim()));
					allocParm.put("sup_org_rlstme", Integer.valueOf(supplyRowMap.get("org_rlstme").toString().trim()));
					allocParm.put("sup_org_duedte", Integer.valueOf(supplyRowMap.get("org_duedte").toString().trim()));
					allocParm.put("sup_org_duetme", Integer.valueOf(supplyRowMap.get("org_duetme").toString().trim()));
					allocParm.put("sup_rlsdte", Integer.valueOf(supplyRowMap.get("rlsdte").toString().trim()));
					allocParm.put("sup_rlstme", Integer.valueOf(supplyRowMap.get("rlstme").toString().trim()));
					allocParm.put("sup_duedte", Integer.valueOf(supplyRowMap.get("duedte").toString().trim()));
					allocParm.put("sup_duetme", Integer.valueOf(supplyRowMap.get("duetme").toString().trim()));
					allocParm.put("sup_schld", supplyRowMap.get("schld").toString().trim());
					allocParm.put("version", version);
					eheijunka.savAllocLog(allocParm);

					if (remainQty == 0) {
						// Update supply, break demand loop
						Map supplyParm = new HashMap();
						supplyParm.put("idSupply", idSupply);
						supplyParm.put("remainQty", remainQty);
						eheijunka.updSupply(supplyParm);
						break;
					}

				}

				if (remainQty != 0) {
					// Update supply, break demand loop
					Map supplyParm = new HashMap();
					supplyParm.put("idSupply", idSupply);
					supplyParm.put("remainQty", remainQty);
					eheijunka.updSupply(supplyParm);
				}
			}
		}
	}

	public void PegForAll(Map Parameters) throws Exception {
		// Parameter: plant, plnord(Y:include plan order), logOnly(Y:get pegging
		// log only)

		String version = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		if (Parameters.get("logOnly").toString().trim().equals("Y")) {
			version = Parameters.get("version").toString().trim();
		}
		int tmpCount = 0;
		int tmpDmdCount = 0;
		Map verParm = new HashMap();
		verParm.put("plant", Parameters.get("plant").toString().trim());
		verParm.put("version", version);

		// System log, logCode=PG0001, logType=PGM, logMsg=Start runnig auto
		// pegging program.
		Map logParm = new HashMap();
		logParm.put("logCode", "PG0001");
		logParm.put("logType", "PGM");
		logParm.put("logMsg", "Start runnig auto pegging program.");
		this.WrtPgmLog(logParm);
		
		// archive peg log 
		eheijunka.insArvPegAllocLog(verParm);
		eheijunka.delPegAllocLog(verParm);
			

		// initialize tmp_demand, tmp_supply, tmp_itemlist
		eheijunka.delTmpDmd(verParm);
		eheijunka.delTmpSup(verParm);
		eheijunka.delTmpItemList(verParm);

		// === first step, get demand in RM level ===

		// get demand from shop order, RM
		eheijunka.insDmdSORM(verParm);

		// get demand from shop order, SFG with enough onhand, without plan
		// order ??
		eheijunka.insDmdSOSFG(verParm);

		// get demand from planning order
		if (Parameters.get("plnOrd").toString().trim().equals("Y")) {
			eheijunka.insDmdPlnOrdRM(verParm);
		}

		// collect RM list
		eheijunka.insTmpItemListFromDmd(verParm);

		// === second step, get supply in RM level ===
		// get supply from inventory
		eheijunka.insSupOH(verParm);

		// get supply from purcharsing order
		eheijunka.insSupPO(verParm);

		// === Third step, run allocation, put the top sku into peg_ord_dtl ===

		this.BalanceDmdSup(verParm);

		if (Parameters.get("logOnly").toString().trim().equals("N")) {
			eheijunka.insPegOrdDtl(verParm);
		}

		// === Fourth step, prepare demand and supply for the SFG pegging (loop)
		// ===

		// do loop end condition: count>=6 or tmp_demand without record
		tmpCount = 0;
		while (tmpCount <= 10) {

			// convert demand to supply, refresh tmp_itemlist
			eheijunka.delTmpSup(verParm);
			eheijunka.delTmpItemList(verParm);
			eheijunka.insSupFromTmpDmd(verParm);
			eheijunka.insTmpItemListFromSup(verParm);

			// get supply from inventory
			eheijunka.insSupOH(verParm);

			// get supply from purcharsing order
			eheijunka.insSupPO(verParm);

			// initialize tmp_demand
			eheijunka.delTmpDmd(verParm);

			// get demand from shop order, SFG
			eheijunka.insDmdSO(verParm);

			// get demand from planning order, SFG
			if (Parameters.get("plnOrd").toString().trim().equals("Y")) {
				eheijunka.insDmdPlnOrd(verParm);
			}

			// get demand record count, if no demand, terminate loop
			tmpDmdCount = eheijunka.getTmpDmdCount(verParm);
			if (tmpDmdCount <= 0) {
				break;
			}

			// run allocation, put the top sku into peg_ord_dtl
			this.BalanceDmdSup(verParm);
			if (Parameters.get("logOnly").toString().trim().equals("N")) {
				eheijunka.insPegOrdDtl(verParm);
			}

			tmpCount = tmpCount + 1;
		} // end loop

		// === Fifth step, get pegging result ===
		// put the pegging due date in peg_ord
		// eheijunka.insPegOrd(verParm);
		if (Parameters.get("logOnly").toString().trim().equals("N")) {
			this.PegOrdDtlToPegOrd(verParm);
		}
		// === Sixth step, generate parent/child view
		// eheijunka.callParnetChildView(parameters);

		// System log, logCode=PG0002, logType=PGM, logMsg=Auto pegging program
		// ends.
		logParm.put("logCode", "PG0002");
		logParm.put("logType", "PGM");
		logParm.put("logMsg", "Auto pegging program ends");
		this.WrtPgmLog(logParm);

	}

	public void PegOrdDtlToPegOrd(Map Parameters) throws Exception {

		// String version= new SimpleDateFormat("yyyyMMddHHmmss").format(new
		// Date());
		Map ordRowMap;

		// Get order list
		Collection getPegOrdList = eheijunka.getPegOrdList(Parameters);
		Iterator getPegOrdListItr = getPegOrdList.iterator();
		while (getPegOrdListItr.hasNext()) {
			ordRowMap = (Map) getPegOrdListItr.next();

			Map ordParm = new HashMap();
			ordParm.put("plant", ordRowMap.get("plant").toString().trim());
			ordParm.put("ord_type", ordRowMap.get("ord_type").toString().trim());
			ordParm.put("ord_num", ordRowMap.get("ord_num").toString().trim());
			ordParm.put("version", Parameters.get("version").toString().trim());
			eheijunka.insPegOrd(ordParm);

		}

	}

	public void WrtPgmLog(Map Parameters) throws Exception {

		// Write system log
		// input parameter: logCode, logType, logMsg
		eheijunka.insSysLog(Parameters);

	}

	public void CalShopOrderRtnByPlant(Map Parameters) throws Exception {
		// Parameter: plant

		Map ordRowMap;

		// Get shop order list by plant
		Collection getShopOrderWithRtnByPlant = eheijunka.getShopOrderWithRtnByPlant(Parameters);
		Iterator getShopOrderWithRtnByPlantItr = getShopOrderWithRtnByPlant.iterator();
		// get FG information
		while (getShopOrderWithRtnByPlantItr.hasNext()) {
			ordRowMap = (Map) getShopOrderWithRtnByPlantItr.next();
			Map ordParm = new HashMap();
			ordParm.put("plant", ordRowMap.get("plant").toString().trim());
			ordParm.put("ord_type", ordRowMap.get("ord_type").toString().trim());
			ordParm.put("ord_num", ordRowMap.get("ord_num").toString().trim());
			ordParm.put("direction", "BW");
			this.CalShopOrderRtnByOrder(ordParm);
		}

	}

	public void CalShopOrderRtnByOrder(Map Parameters) throws Exception {
		// Parameter: plant, ord_type, ord_num, direction(BW/FW)

		long lngRtnMapCount;
		double reqQty = 0;
		double runHrs = 0;
		double othHrs = 0;
		double constHrs = 0;
		double batch = 0;
		double rtnRunHrs = 0;
		long lngRlsDte = 0;
		long lngRlsTme = 0;
		long lngDueDte = 0;
		long lngDueTme = 0;
		Date dteRlsDT;
		Date dteDueDT;
		// Define date format
		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		lngRtnMapCount = eheijunka.getRtnMapCount(Parameters);
		if (lngRtnMapCount > 1) {
			// Mutil-operation calculation
			this.ExplodeMutilRtn(Parameters);
		} else {

			Map shopOrderRowMap = new HashMap();
			Collection getShopOrderDtaRtn = eheijunka.getShopOrderDtaRtn(Parameters);
			Iterator getShopOrderDtaRtnItr = getShopOrderDtaRtn.iterator();
			while (getShopOrderDtaRtnItr.hasNext()) {
				shopOrderRowMap = (Map) getShopOrderDtaRtnItr.next();

				reqQty = Double.valueOf(shopOrderRowMap.get("req_qty").toString().trim());
				rtnRunHrs = Double.valueOf(shopOrderRowMap.get("run_hrs").toString().trim());
				othHrs = Double.valueOf(shopOrderRowMap.get("oth_hrs").toString().trim());
				constHrs = Double.valueOf(shopOrderRowMap.get("const_hrs").toString().trim());
				batch = Double.valueOf(shopOrderRowMap.get("batch").toString().trim());
				lngRlsDte = Long.valueOf(shopOrderRowMap.get("rlsdte").toString().trim());
				lngRlsTme = Long.valueOf(shopOrderRowMap.get("rlstme").toString().trim());
				lngDueDte = Long.valueOf(shopOrderRowMap.get("duedte").toString().trim());
				lngDueTme = Long.valueOf(shopOrderRowMap.get("duetme").toString().trim());

				// Calculate routing run hours
				if (constHrs == 0) {
					runHrs = reqQty / batch * rtnRunHrs;
				} else {
					runHrs = constHrs; // constant run hours
				}

				// Calculate release date/time and due date/time
				if (Parameters.get("direction").toString().trim().equals("BW")) {
					// backward calculation
					dteDueDT = datetime14.parse(String.valueOf(lngDueDte * 1000000 + lngDueTme));
					long tmpDT = dteDueDT.getTime() - (long) (runHrs * 60 * 60 * 1000);
					dteRlsDT = new Date(tmpDT);
					lngRlsDte = Long.valueOf(dateYMD8.format(dteRlsDT));
					lngRlsTme = Long.valueOf(timeHMS6.format(dteRlsDT));
				} else {
					// forward calculation
					dteRlsDT = datetime14.parse(String.valueOf(lngRlsDte * 1000000 + lngRlsTme));
					long tmpDT = dteRlsDT.getTime() + (long) (runHrs * 60 * 60 * 1000);
					dteDueDT = new Date(tmpDT);
					lngDueDte = Long.valueOf(dateYMD8.format(dteDueDT));
					lngDueTme = Long.valueOf(timeHMS6.format(dteDueDT));
				}

				// delete shop order routing
				eheijunka.delShopOrderRtn(Parameters);

				// create new shop order routing
				Map shopOrderRtnParm = new HashMap();
				shopOrderRtnParm.put("plant", Parameters.get("plant").toString().trim());
				shopOrderRtnParm.put("ord_type", Parameters.get("ord_type").toString().trim());
				shopOrderRtnParm.put("ord_num", Parameters.get("ord_num").toString().trim());
				shopOrderRtnParm.put("meth", "DF");
				shopOrderRtnParm.put("ord_op", Integer.valueOf(shopOrderRowMap.get("op").toString().trim()));
				shopOrderRtnParm.put("item", shopOrderRowMap.get("item").toString().trim());
				shopOrderRtnParm.put("req_qty", reqQty);
				shopOrderRtnParm.put("run_hrs", runHrs);
				shopOrderRtnParm.put("strdte", lngRlsDte);
				shopOrderRtnParm.put("strtme", lngRlsTme);
				shopOrderRtnParm.put("enddte", lngDueDte);
				shopOrderRtnParm.put("endtme", lngDueTme);
				shopOrderRtnParm.put("position", "F");
				shopOrderRtnParm.put("direction", Parameters.get("direction").toString().trim());
				eheijunka.insShopOrderRtn(shopOrderRtnParm);

			}

		}

		// update shop order start date/time and end date/time
		eheijunka.updErpSordFromRtn(Parameters);

	}

	public void ExplodeMutilRtn(Map Parameters) throws Exception {
		// Parameter: plant, ord_type, ord_num, direction(BW/FW)

		Map rtnRowMap;
		Map insRtnParm = new HashMap();
		Map dteParm = new HashMap();
		long lngStrDte;
		long lngStrTme;
		Date dteStrDt;
		long lngEndDte;
		long lngEndTme;
		Date dteEndDt;
		Date dteStrDT;
		Date dteEndDT;
		String position;
		double rtn_runHrs;
		double runHrs;
		double reqQty;
		double batch;
		double offsetPer;
		double offsetHrs;
		long tmpOpListCnt;
		String version = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		Parameters.put("version", version);

		// Define date format
		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		// Initialize tmp_oplist
		eheijunka.delTmpOpList(Parameters);

		// Initialize tmp_sord_rtn
		// eheijunka.delTmpSordRtn(Parameters);

		// Initialize erp_sord_rtn by shop order
		eheijunka.delShopOrderRtn(Parameters);

		// Type: BW=backward (FG->RM); FW=forward (RM->FG)
		if (Parameters.get("direction").toString().trim().equals("BW")) {
			// Get last operation
			eheijunka.insLastOp(Parameters);
		} else {
			// Get first operation
			eheijunka.insFirstOp(Parameters);
		}

		tmpOpListCnt = eheijunka.getTmpOpListCount(Parameters);

		// do loop
		while (tmpOpListCnt > 0) {
			Collection getRtnForShopOrder = eheijunka.getRtnForShopOrder(Parameters);
			Iterator getRtnForShopOrderItr = getRtnForShopOrder.iterator();
			while (getRtnForShopOrderItr.hasNext()) {
				rtnRowMap = (Map) getRtnForShopOrderItr.next();

				// Get run hours
				rtn_runHrs = Double.valueOf(rtnRowMap.get("rtn_runhrs").toString().trim());
				reqQty = Double.valueOf(rtnRowMap.get("req_qty").toString().trim());
				batch = Double.valueOf(rtnRowMap.get("batch").toString().trim());
				runHrs = reqQty / batch * rtn_runHrs;
				offsetPer = Double.valueOf(rtnRowMap.get("offset_per").toString().trim());

				if (Parameters.get("direction").toString().trim().equals("BW")) {

					// BW, get end date and calculate start date;
					if (rtnRowMap.get("position").toString().trim().equals("L")) {
						lngEndDte = Long.valueOf(rtnRowMap.get("duedte").toString().trim());
						lngEndTme = Long.valueOf(rtnRowMap.get("duetme").toString().trim());
					} else {
						// if (offsetPer != 0) {
						dteParm.put("parmInDt", Long.valueOf(rtnRowMap.get("nb_strdte").toString().trim()) * 1000000
								+ Long.valueOf(rtnRowMap.get("nb_strtme").toString().trim()));
						dteParm.put("parmDiff", runHrs * (1 - offsetPer));
						dteParm.put("parmType", "H");
						dteEndDt = this.CalDateDur(dteParm);
						lngEndDte = Long.valueOf(dateYMD8.format(dteEndDt));
						lngEndTme = Long.valueOf(timeHMS6.format(dteEndDt));
						// } else {
						// lngEndDte =
						// Long.valueOf(rtnRowMap.get("nb_strdte").toString().trim());
						// lngEndTme =
						// Long.valueOf(rtnRowMap.get("nb_strtme").toString().trim());
						// }
					}
					dteEndDT = datetime14.parse(String.valueOf(lngEndDte * 1000000 + lngEndTme));
					long tmpDT = dteEndDT.getTime() - (long) (runHrs * 60 * 60 * 1000);
					dteStrDT = new Date(tmpDT);
					lngStrDte = Long.valueOf(dateYMD8.format(dteStrDT));
					lngStrTme = Long.valueOf(timeHMS6.format(dteStrDT));
				} else {

					// FW, get start date and calculate end date;
					if (rtnRowMap.get("position").toString().trim().equals("F")) {
						lngStrDte = Long.valueOf(rtnRowMap.get("rlsdte").toString().trim());
						lngStrTme = Long.valueOf(rtnRowMap.get("rlstme").toString().trim());
					} else {
						// if (offsetPer != 0) {
						dteParm.put("parmInDt", Long.valueOf(rtnRowMap.get("nb_strdte").toString().trim()) * 1000000
								+ Long.valueOf(rtnRowMap.get("nb_strtme").toString().trim()));
						dteParm.put("parmDiff", runHrs * offsetPer);
						dteParm.put("parmType", "H");
						dteStrDt = this.CalDateDur(dteParm);
						lngStrDte = Long.valueOf(dateYMD8.format(dteStrDt));
						lngStrTme = Long.valueOf(timeHMS6.format(dteStrDt));
						// } else {
						// lngStrDte =
						// Long.valueOf(rtnRowMap.get("nb_enddte").toString().trim());
						// lngStrTme =
						// Long.valueOf(rtnRowMap.get("nb_endtme").toString().trim());
						// }
					}
					dteStrDT = datetime14.parse(String.valueOf(lngStrDte * 1000000 + lngStrTme));
					long tmpDT = dteStrDT.getTime() + (long) (runHrs * 60 * 60 * 1000);
					dteEndDT = new Date(tmpDT);
					lngEndDte = Long.valueOf(dateYMD8.format(dteEndDT));
					lngEndTme = Long.valueOf(timeHMS6.format(dteEndDT));
				}

				// Insert shop order routing in temp file
				insRtnParm.put("plant", Parameters.get("plant").toString().trim());
				insRtnParm.put("ord_type", Parameters.get("ord_type").toString().trim());
				insRtnParm.put("ord_num", Parameters.get("ord_num").toString().trim());
				insRtnParm.put("meth", rtnRowMap.get("meth").toString().trim());
				insRtnParm.put("ord_op", rtnRowMap.get("op").toString().trim());
				insRtnParm.put("op_nb", rtnRowMap.get("op_nb").toString().trim());
				insRtnParm.put("wrkc", Long.valueOf(rtnRowMap.get("wrkc").toString().trim()));
				insRtnParm.put("item", rtnRowMap.get("item").toString().trim());
				insRtnParm.put("req_qty", rtnRowMap.get("req_qty").toString().trim());
				insRtnParm.put("run_hrs", runHrs);
				insRtnParm.put("strdte", lngStrDte);
				insRtnParm.put("strtme", lngStrTme);
				insRtnParm.put("enddte", lngEndDte);
				insRtnParm.put("endtme", lngEndTme);
				insRtnParm.put("position", rtnRowMap.get("position").toString().trim());
				insRtnParm.put("direction", Parameters.get("direction").toString().trim());
				insRtnParm.put("version", version);
				insRtnParm.put("prnt_plant", "");
				insRtnParm.put("prnt_ordtype", "");
				insRtnParm.put("prnt_ord", "");
				insRtnParm.put("disp_seq", 0);
				// eheijunka.insTmpSordRtn(insRtnParm);

				// Write explode log
				eheijunka.insExpRtnLog(insRtnParm);

				if (Parameters.get("direction").toString().trim().equals("BW")) {
					// Insert new op in tmp_oplist
					eheijunka.insTmpOpListBW(insRtnParm);
				} else {
					// Forward
					eheijunka.insTmpOpListFW(insRtnParm);
				}

				// Remove processed op
				eheijunka.delTmpOpListProcess(insRtnParm);

			}

			// get tmp_oplist count
			tmpOpListCnt = eheijunka.getTmpOpListCount(Parameters);

		} // while loop

		//
		if (Parameters.get("direction").toString().trim().equals("BW")) {
			// Backward
			// Insert shop order routing in erp_sord_rtn
			eheijunka.insErpSordRtnBW(insRtnParm);
		} else {
			// Forward
			eheijunka.insErpSordRtnFW(insRtnParm);
		}

	}

	public void PegbySuperBOM(Map Parameters) throws Exception {

		String version = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		// long leadTime =
		// Long.valueOf(Parameters.get("leadTime").toString().trim());
		long leadTime = 5;

		// Initialize tmp_demand, tmp_supply, tmp_itemlist
		eheijunka.delTmpDmd(Parameters);
		eheijunka.delTmpSup(Parameters);
		eheijunka.delTmpItemList(Parameters);

		// get FG plan order and S/O, convert to demand
		eheijunka.insDmdFromSOBySbom(Parameters);
		eheijunka.insDmdFromPLBySbom(Parameters);

		// get supply item(RM) list
		eheijunka.insTmpItemListFromDmd(Parameters);

		// get SFG S/O, convert to RM on hand and RM on hand
		eheijunka.insSupOHRMSFG(Parameters);

		// balance supply and demand
		Parameters.put("version", version);
		this.BalanceDmdSup(Parameters);
		eheijunka.insPegOrdDtl(Parameters);
		this.PegOrdDtlToPegOrd(Parameters);

		// update erp_sord, change fg due date
		Map ordRowMap;
		long lngRlsDte = 0;
		long lngRlsTme = 0;
		long lngDueDte = 0;
		long lngDueTme = 0;
		Date dteRlsDT;
		Date dteDueDT;
		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		// Get order list
		Collection getPegOrdRlsDteList = eheijunka.getPegOrdRlsDteList(Parameters);
		Iterator getPegOrdRlsDteListItr = getPegOrdRlsDteList.iterator();
		while (getPegOrdRlsDteListItr.hasNext()) {
			ordRowMap = (Map) getPegOrdRlsDteListItr.next();
			if (lngRlsDte != 99999999) {
				lngRlsDte = Long.valueOf(ordRowMap.get("rlsdte").toString().trim());
				lngRlsTme = Long.valueOf(ordRowMap.get("rlsdte").toString().trim());
				dteRlsDT = datetime14.parse(String.valueOf(lngRlsDte * 1000000 + lngRlsTme));
				long tmpDT = dteRlsDT.getTime() + (long) (leadTime * 24 * 60 * 60 * 1000);
				dteDueDT = new Date(tmpDT);
				lngDueDte = Long.valueOf(dateYMD8.format(dteDueDT));
				lngDueTme = Long.valueOf(timeHMS6.format(dteDueDT));
			}

			Map ordParm = new HashMap();
			ordParm.put("plant", ordRowMap.get("plant").toString().trim());
			ordParm.put("ord_type", ordRowMap.get("ord_type").toString().trim());
			ordParm.put("ord_num", ordRowMap.get("ord_num").toString().trim());
			ordParm.put("rlsdte", lngRlsDte);
			ordParm.put("rlstme", lngRlsTme);
			ordParm.put("duedte", lngDueDte);
			ordParm.put("duetme", lngDueTme);
			if (ordRowMap.get("ord_type").toString().trim().equals("2SO")) {
				eheijunka.updErpSordFromPeg(ordParm);
			} else if (ordRowMap.get("ord_type").toString().trim().equals("4PL")) {
				eheijunka.updErpPlnOrdFromPeg(ordParm);
			}
		}
	}

	public void AutoDispatchByPlant(Map Parameters) throws Exception {
		// Parameter: plant, frzDays

		Parameters.put("logOnly", "Y");
		Parameters.put("plnOrd", "N");
		String version = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		version = "A" + version;
		Parameters.put("version", version);

		long lngMinStrDte = 0;
		long frzDays = 0;
		long lngToday = 0;
		Date dteToday;

		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		frzDays = Long.valueOf(Parameters.get("frzDays").toString().trim()) - 1;
		lngToday = Long.valueOf(datetime14.format(new Date()));
		dteToday = datetime14.parse(String.valueOf(datetime14.format(new Date())));
		long tmpDt = dteToday.getTime() + (long) (frzDays * 24 * 60 * 60 * 1000);
		lngMinStrDte = Long.valueOf(dateYMD8.format(tmpDt));

		// pegging calculation
		this.PegForAll(Parameters);

		// delete kanban behind min start date
		Parameters.put("minStrDte", lngMinStrDte);
		eheijunka.delOrdBehindMinDte(Parameters);

		// get FG information
		eheijunka.insAtdSordAllocFg(Parameters);
		// get FG routing
		eheijunka.insAtdOrdRtnFg(Parameters);

		// dispatch order
		this.DispatchShorOrder(Parameters);

		// collect allocated order
		eheijunka.insAtdSordAllocSfg(Parameters);
		
		//calculate broadcasting date/time
		this.CalBroadcastingDate(Parameters);
		
		int tmpCount = eheijunka.getDspOrderCount(Parameters);
		while (tmpCount > 0) {
			// dispatch order
			this.DispatchShorOrder(Parameters);
			// collect allocated order
			eheijunka.insAtdSordAllocSfg(Parameters);
			//calculate broadcasting date/time
			this.CalBroadcastingDate(Parameters);
			tmpCount = eheijunka.getDspOrderCount(Parameters);
		}
	}

	public void DispatchShorOrder(Map Parameters) throws Exception {
		// Parameter: plant, minStrDt
		Map ordRowMap;
		double runHrs = 0;
		String mach = "";
		String ordOp = "";
		long lngStrDt = 0;
		long lngEndDt = 0;
		long wrkc = 0;
		Date dteStrDt;
		Date dteEndDt;
		long lngMinStrDt = Long.valueOf(Parameters.get("minStrDte").toString().trim()) * 1000000;

		// Define date format
		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		Collection getDspShopOrderByPlant = eheijunka.getDspShopOrderByPlant(Parameters);
		Iterator getDspShopOrderByPlantItr = getDspShopOrderByPlant.iterator();
		while (getDspShopOrderByPlantItr.hasNext()) {
			ordRowMap = (Map) getDspShopOrderByPlantItr.next();

			// get machine and start date/time(earliest)
			Map wrkcParm = new HashMap();
			wrkcParm.put("wrkc", Long.valueOf(ordRowMap.get("wrkc").toString().trim()));
			Collection getMachineTimeByWrkc = eheijunka.getMachineTimeByWrkc(wrkcParm);
			if (getMachineTimeByWrkc != null && getMachineTimeByWrkc.size() > 0) {
				Iterator getMachineTimeByWrkcItr = getMachineTimeByWrkc.iterator();
				Map wrkcRowMap = (Map) getMachineTimeByWrkcItr.next();
				lngStrDt = Long.valueOf(wrkcRowMap.get("mindate").toString().trim());
				mach = String.valueOf(wrkcRowMap.get("mach").toString().trim());
			}

			// start date/time must later than frozen date/time
			if (lngStrDt < lngMinStrDt) {
				lngStrDt = lngMinStrDt;
			}
			runHrs = Double.valueOf(ordRowMap.get("run_hrs").toString().trim());
			dteStrDt = datetime14.parse(String.valueOf(lngStrDt));
			long lngTmpDt = dteStrDt.getTime() + (long) (runHrs * 60 * 60 * 1000);
			dteEndDt = new Date(lngTmpDt);
			lngEndDt = Long.valueOf(datetime14.format(dteEndDt));
			ordOp = ordRowMap.get("ord_num").toString().trim() + "/"
					+ String.valueOf(ordRowMap.get("ord_op").toString().trim());
			wrkc = Long.valueOf(ordRowMap.get("wrkc").toString().trim());

			// dispatching in eheijunka
			Map dspOrdParm = new HashMap();
			dspOrdParm.put("e2id", "E2");
			dspOrdParm.put("wrkc", wrkc);
			dspOrdParm.put("ord_num", ordOp);
			dspOrdParm.put("mach", mach);
			dspOrdParm.put("req_qty", Double.valueOf(ordRowMap.get("req_qty").toString().trim()));
			dspOrdParm.put("run_hrs", runHrs);
			dspOrdParm.put("e2type", "PD");
			dspOrdParm.put("e2cls", "sch-event-undefined");
			dspOrdParm.put("strdte", Long.valueOf(dateYMD8.format(dteStrDt)));
			dspOrdParm.put("strtme", Long.valueOf(timeHMS6.format(dteStrDt)));
			dspOrdParm.put("enddte", Long.valueOf(dateYMD8.format(dteEndDt)));
			dspOrdParm.put("endtme", Long.valueOf(timeHMS6.format(dteEndDt)));
			dspOrdParm.put("updby", "TESTID");
			dspOrdParm.put("upddte", Long.valueOf(dateYMD8.format(new Date())));
			dspOrdParm.put("updtme", Long.valueOf(timeHMS6.format(new Date())));
			eheijunka.insDspOrder(dspOrdParm);
			eheijunka.updDspOrderHeader(dspOrdParm);

		}

		// mark processed order
		eheijunka.updAtdSordAllocProcessed(Parameters);
	}

	public void CalBroadcastingDate(Map Parameters) throws Exception {
		// Parameter: plant, version
		Map allocOrdRowMap;
		Map rtnRowMap;
		Map insRtnParm = new HashMap();
		Map dteParm = new HashMap();
		long lngStrDte;
		long lngStrTme;
		Date dteStrDt;
		long lngEndDte;
		long lngEndTme;
		Date dteEndDt;
		Date dteStrDT;
		Date dteEndDT;
		String position;
		double rtn_runHrs;
		double runHrs;
		double reqQty;
		double batch;
		double offsetPer;
		double offsetHrs;
		long tmpOpListCnt;
		long lngPrntStrDte;
		long lngPrntStrTme;
		long lngDispSeq;
		String strPrntPlant;
		String strPrntOrdType;
		String strPrntOrd;
		String version = Parameters.get("version").toString().trim();

		// Define date format
		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		Collection getAllocOrdList = eheijunka.getAllocOrdList(Parameters);
		Iterator getAllocOrdListItr = getAllocOrdList.iterator();
		while (getAllocOrdListItr.hasNext()) {
			allocOrdRowMap = (Map) getAllocOrdListItr.next();
			lngPrntStrDte=Long.valueOf(allocOrdRowMap.get("bct_strdte").toString().trim());
			lngPrntStrTme=Long.valueOf(allocOrdRowMap.get("bct_strtme").toString().trim());
			lngDispSeq=Long.valueOf(allocOrdRowMap.get("disp_seq").toString().trim());
			strPrntPlant=allocOrdRowMap.get("prnt_plant").toString().trim();
			strPrntOrdType=allocOrdRowMap.get("prnt_ordtype").toString().trim();
			strPrntOrd=allocOrdRowMap.get("prnt_ord").toString().trim();
			Map ordParm = new HashMap();
			ordParm.put("plant",allocOrdRowMap.get("plant").toString().trim());
			ordParm.put("ord_type",allocOrdRowMap.get("ord_type").toString().trim());
			ordParm.put("ord_num",allocOrdRowMap.get("ord_num").toString().trim());
			ordParm.put("version",version);
			ordParm.put("prnt_plant",strPrntPlant);
			ordParm.put("prnt_ordtype",strPrntOrdType);
			ordParm.put("prnt_ord",strPrntOrd);
			
			// Initialize tmp_oplist
			eheijunka.delTmpOpList(ordParm);

			// Get last operation
			eheijunka.insLastOp(ordParm);

			tmpOpListCnt = eheijunka.getTmpOpListCount(ordParm);

			// do loop
			while (tmpOpListCnt > 0) {
				Collection getRtnForAllocOrd = eheijunka.getRtnForAllocOrd(ordParm);
				Iterator getRtnForAllocOrdItr = getRtnForAllocOrd.iterator();
				while (getRtnForAllocOrdItr.hasNext()) {
					rtnRowMap = (Map) getRtnForAllocOrdItr.next();
					
					if (rtnRowMap.get("ord_num").toString().trim().equals("51120151225045")) {
						int i=1;
					}

					// Get run hours
					rtn_runHrs = Double.valueOf(rtnRowMap.get("rtn_runhrs").toString().trim());
					reqQty = Double.valueOf(rtnRowMap.get("req_qty").toString().trim());
					batch = Double.valueOf(rtnRowMap.get("batch").toString().trim());
					runHrs = reqQty / batch * rtn_runHrs;
					offsetPer = Double.valueOf(rtnRowMap.get("offset_per").toString().trim());

					// BW, get end date and calculate start date;
					if (rtnRowMap.get("position").toString().trim().equals("L")) {
						lngEndDte = lngPrntStrDte;
						lngEndTme = lngPrntStrTme;
					} else {
						dteParm.put("parmInDt", Long.valueOf(rtnRowMap.get("nb_strdte").toString().trim()) * 1000000
								+ Long.valueOf(rtnRowMap.get("nb_strtme").toString().trim()));
						dteParm.put("parmDiff", runHrs * (1 - offsetPer));
						dteParm.put("parmType", "H");
						dteEndDt = this.CalDateDur(dteParm);
						lngEndDte = Long.valueOf(dateYMD8.format(dteEndDt));
						lngEndTme = Long.valueOf(timeHMS6.format(dteEndDt));
					}
					dteEndDT = datetime14.parse(String.valueOf(lngEndDte * 1000000 + lngEndTme));
					long tmpDT = dteEndDT.getTime() - (long) (runHrs * 60 * 60 * 1000);
					dteStrDT = new Date(tmpDT);
					lngStrDte = Long.valueOf(dateYMD8.format(dteStrDT));
					lngStrTme = Long.valueOf(timeHMS6.format(dteStrDT));

					// Insert shop order routing in temp file
					insRtnParm.put("plant", allocOrdRowMap.get("plant").toString().trim());
					insRtnParm.put("ord_type", allocOrdRowMap.get("ord_type").toString().trim());
					insRtnParm.put("ord_num", allocOrdRowMap.get("ord_num").toString().trim());
					insRtnParm.put("meth", rtnRowMap.get("meth").toString().trim());
					insRtnParm.put("ord_op", rtnRowMap.get("op").toString().trim());
					insRtnParm.put("op_nb", rtnRowMap.get("op_nb").toString().trim());
					insRtnParm.put("wrkc", Long.valueOf(rtnRowMap.get("wrkc").toString().trim()));
					insRtnParm.put("item", rtnRowMap.get("item").toString().trim());
					insRtnParm.put("req_qty", rtnRowMap.get("req_qty").toString().trim());
					insRtnParm.put("run_hrs", runHrs);
					insRtnParm.put("strdte", lngStrDte);
					insRtnParm.put("strtme", lngStrTme);
					insRtnParm.put("enddte", lngEndDte);
					insRtnParm.put("endtme", lngEndTme);
					insRtnParm.put("position", rtnRowMap.get("position").toString().trim());
					insRtnParm.put("direction", "BW");
					insRtnParm.put("version", version);
					insRtnParm.put("prnt_plant",strPrntPlant );
					insRtnParm.put("prnt_ordtype", strPrntOrdType);
					insRtnParm.put("prnt_ord", strPrntOrd);
					insRtnParm.put("disp_seq", lngDispSeq);
					// Write explode log
					eheijunka.insExpRtnLog(insRtnParm);
					// Insert new op in tmp_oplist
					eheijunka.insTmpOpListBW(insRtnParm);

					// Remove processed op
					eheijunka.delTmpOpListProcess(insRtnParm);

				}
				// get tmp_oplist count
				tmpOpListCnt = eheijunka.getTmpOpListCount(ordParm);

			} // while loop

			//

			// Backward
			// Insert shop order routing in atd_ord_rtn
			eheijunka.insAtdOrdRtnBW(insRtnParm);

		}

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
	
	public void PegForSingleByWrkc(Map Parameters) throws Exception {
		//Parameters: plant, wrkc, item(op), planner code(op), parm_po(op), parm_so(op), parm_pl(op)
		
		Map verParm = new HashMap();		
		
		String version = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		
		//initialize tmp_demand, tmp_supply, tmp_itemlist
		eheijunka.delTmpDmd(Parameters);
		eheijunka.delTmpSup(Parameters);
		eheijunka.delTmpItemList(Parameters);
				
		//collect item list
		verParm.put("plant", Parameters.get("plant").toString().trim());
		verParm.put("wrkc", Integer.valueOf(Parameters.get("wrkc").toString().trim()));
		verParm.put("parm_po", Parameters.get("parm_po").toString().trim());
		verParm.put("parm_so", Parameters.get("parm_so").toString().trim());
		verParm.put("parm_pl", Parameters.get("parm_pl").toString().trim());
		verParm.put("version", version);
		eheijunka.insTmpItemListByWrkc(verParm);
		
		//get supply
		eheijunka.insSupOH(verParm);
		
		if (Parameters.get("parm_po").toString().trim().equals("Y")) {
			eheijunka.insSupPO(verParm);
		}
		
		if (Parameters.get("parm_so").toString().trim().equals("Y")) {
			eheijunka.insSupSO(verParm);
		}
		
		if (Parameters.get("parm_pl").toString().trim().equals("Y")) {
			eheijunka.insSupPL(verParm);
		}
		
		//get demand
		eheijunka.insDmdSO(verParm);       //demand from shop order
		eheijunka.insDmdPlnOrd(verParm);   //demand from plan order
		
		//balance demand and supply
		this.BalanceDmdSup(verParm);
		
		//initialize peg_assign_ord
		eheijunka.delPegAssignDtlByWrkc(verParm);
		eheijunka.delPegAssignHdByWrkc(verParm);
		
		//write record into peg_assign_hd
		eheijunka.insPegAssignHd(verParm);
		
		//write detail record into peg_assign_dtl
		eheijunka.insPegAssignDtl(verParm);	
		
	}
	
	
	public void test(Map Parameters) {
		System.out.println("test");
	}
	
}
