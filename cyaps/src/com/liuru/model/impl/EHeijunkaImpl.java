package com.liuru.model.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

import com.liuru.framework.dao.DAO;
import com.liuru.model.EHeijunka;

public class EHeijunkaImpl implements EHeijunka{
	private DAO dao;
	
	public void setDao (DAO dao) {
		this.dao = dao; 
	}
	
	@Override
	public Collection getShopOrderList(Object parameters) throws Exception {
		//Step 1: Call CL program to calculate the shop order info for the work center, and store to EH0010PF
		//Map param = (Map)parameters;
		//String workCenter = "";
		//if(param.get("workCenter")!=null){
		//	workCenter  = param.get("workCenter").toString().trim();
		//	workCenter = String.format("%06d", Integer.valueOf(workCenter));
		//	String sql = "{CALL ICAPLCL/EH0010R ('"+workCenter+"')}";
		//	dao.dynamicSQLUpdate(sql, null); 
		//}		
		
		//Step 2: Get shop order list from EH0010PF by work center
		Collection list = dao.query("getShopOrderList",  parameters);
		return list;
	}
	
	@Override
	public Collection getUnplannedShopOrderList(Object parameters) throws Exception {
		//Step 1: Call CL program to calculate the shop order info for the work center, and store to EH0010PF
		//Map param = (Map)parameters;
		//String workCenter = "";
		//if(param.get("workCenter")!=null){
		//	workCenter  = param.get("workCenter").toString().trim();
		//	workCenter = String.format("%06d", Integer.valueOf(workCenter));
		//	String sql = "{CALL ICAPLCL/EH0010R ('"+workCenter+"')}";
		//	dao.dynamicSQLUpdate(sql, null);
		//}		
		
		//Step 2: Get unplanned shop order list from EH0010PF by work center
		Collection list = dao.query("getUnplannedShopOrderList",  parameters);
		return list;
	}	
	
	@Override
	public int getMachineCount(Object parameters) throws Exception {
		int count = 0;
		Collection list = dao.query("getMachineCount",  parameters);
		if(list!=null){
			Iterator itr = list.iterator();
			while(itr.hasNext()){
				Map rowMap = (Map)itr.next();
				if(rowMap.get("machineCount")!=null){
					count = Integer.valueOf(rowMap.get("machineCount").toString().trim());
				}
			}
		}
		
		return count;
	}

	@Override
	public Collection getEventList(Object parameters) throws Exception {
		//Only get events which start from 1 month ago
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		Calendar now = Calendar.getInstance();
		now.add(Calendar.MONTH, -1);
		String startDateStr = sdf.format(now.getTime());
		((Map)parameters).put("startDateStr", startDateStr);
		
		return dao.query("getEventList",  parameters);
	}

	@Override
	public void saveEvent(Object parameters) throws Exception {
		dao.insert("insertEvent", parameters);
	}

	@Override
	public void updateEvent(Object parameters) throws Exception {
		dao.update("updateEvent", parameters);
	}	
	
	@Override
	public void deleteEvent(Object parameters) throws Exception {
		dao.update("deleteEvent", parameters);
	}
	
	@Override
	public void updateShopOrder(Object parameters) throws Exception {
	//	String shopOrder = "";
	//	Map param = (Map)parameters;
	//	if(param.get("shopOrder")!=null){
	//		shopOrder  = param.get("shopOrder").toString().trim();
	//		shopOrder = String.format("%06d", Integer.valueOf(shopOrder));
	//		String sql = "{CALL ICAPLCL/EH0020R ('"+shopOrder+"')}";
	//		dao.dynamicSQLUpdate(sql, null);
	//	}
		dao.update("updateShopOrder", parameters);
	}	
	
	@Override
	public Collection getMachineList(Object parameters) throws Exception {
		return dao.query("getMachineList",  parameters);
	}
	
	@Override
	public Collection getResourceAvailabilityList(Object parameters) throws Exception {
		return dao.query("getResourceAvailabilityList",  parameters);
	}
	
	@Override
	public Collection getUserAccessInfoList(Object parameters) throws Exception {
		return dao.query("getUserAccessInfoList",  parameters);
	}
	
	@Override
	public Collection getAuthList(Object parameters) throws Exception {
		return dao.query("getAuthList",  parameters);
	}
	
	@Override
	public void updateUserAccessInfo(Object parameters) throws Exception {
		dao.update("updateUserAccessInfo", parameters);
	}

	@Override
	public Collection getShopOrderLastEnddatetimeList(Object parameters) throws Exception {
		return dao.query("getShopOrderLastEnddatetimeList",  parameters);
	}
	
	@Override
	public void callParnetChildView(Object parameters) throws Exception{
		String workCenter = "";
		Map param = (Map)parameters;
		if(param.get("workCenter")!=null){
			workCenter  = param.get("workCenter").toString().trim();
			workCenter = String.format("%06d", Integer.valueOf(workCenter));			
			String sql = "{CALL ICAPLCL/EH0050C ('"+workCenter+"')}";
			dao.dynamicSQLUpdate(sql, null);
		}		
	}
	
	@Override
	public void saveSOByWC(Object parameters)throws Exception{
		dao.insert("insertSOByWC", parameters);
	}
	
	@Override
	public void deleteSOByWC(Object parameters)throws Exception{
		dao.update("deleteSOByWC", parameters);
	}
	
	@Override
	public int getEventCountByShopOrder(Object parameters) throws Exception {
		return dao.getCount("getEventCountByShopOrder",  parameters);
	}	
	
	@Override
	public void updateShopOrderRemark(Object parameters)throws Exception {
		dao.update("updateShopOrderRemark", parameters);
	}

	@Override
	public Collection checkUserLogin(Object parameters) throws Exception {
		// TODO Auto-generated method stub
		Collection list = dao.query("checkUserLogin",  parameters);
		return list;
	}

	
	@Override
	public Collection getDemand(Object parameters) throws Exception {
		Collection list = dao.query("getDemand",  parameters);
		return list;
	}

	@Override
	public Collection getSupply(Object parameters) throws Exception {
		Collection list = dao.query("getSupply",  parameters);
		return list;
	}
	
	@Override
	public Collection getSupplyItemList(Object parameters) throws Exception {
		Collection list = dao.query("getSupplyItemList",  parameters);
		return list;
	}	
	
	@Override
	public void updSupply(Object parameters) throws Exception {

		dao.update("updSupply", parameters);
	}		
	
	@Override
	public void updDemand(Object parameters) throws Exception {

		dao.update("updDemand", parameters);
	}		
	
	@Override
	public void savAllocLog(Object parameters) throws Exception {

		dao.update("savAllocLog", parameters);
	}		
	
	@Override
	public Collection getLTFromItm(Object parameters) throws Exception {

		return dao.query("getLTFromItm", parameters);
	}		
	
	@Override
	public Collection getLTFromRtn(Object parameters) throws Exception {

		return dao.query("getLTFromRtn", parameters);
	}		

	@Override
	public void delTmpDmd(Object parameters) throws Exception {

		dao.update("delTmpDmd", parameters);
	}		
	
	@Override
	public void delTmpSup(Object parameters) throws Exception {

		dao.update("delTmpSup", parameters);
	}
	
	@Override
	public void delTmpItemList(Object parameters) throws Exception {

		dao.update("delTmpItemList", parameters);
	}
	
	@Override
	public void insTmpItemListFromDmd(Object parameters)throws Exception{
		dao.insert("insTmpItemListFromDmd", parameters);
	}
	
	@Override
	public void insTmpItemListFromSup(Object parameters)throws Exception{
		dao.insert("insTmpItemListFromSup", parameters);
	}
	
	@Override
	public void insDmdSORM(Object parameters)throws Exception{
		dao.insert("insDmdSORM", parameters);
	}
	
	@Override
	public void insDmdSOSFG(Object parameters)throws Exception{
		dao.insert("insDmdSOSFG", parameters);
	}
	
	@Override
	public void insDmdSO(Object parameters)throws Exception{
		dao.insert("insDmdSO", parameters);
	}
	
	@Override
	public void insDmdPlnOrdRM(Object parameters)throws Exception{
		dao.insert("insDmdPlnOrdRM", parameters);
	}
	
	@Override
	public void insDmdPlnOrd(Object parameters)throws Exception{
		dao.insert("insDmdPlnOrd", parameters);
	}
	
	@Override
	public void insSupOH(Object parameters)throws Exception{
		dao.insert("insSupOH", parameters);
	}
	
	@Override
	public void insSupPO(Object parameters)throws Exception{
		dao.insert("insSupPO", parameters);
	}
	
	@Override
	public void insSupSO(Object parameters)throws Exception{
		dao.insert("insSupSO", parameters);
	}
	
	@Override
	public void insSupPL(Object parameters)throws Exception{
		dao.insert("insSupPL", parameters);
	}
	
	@Override
	public void insSupFromTmpDmd(Object parameters)throws Exception{
		dao.insert("insSupFromTmpDmd", parameters);
	}
	
	//@Override
	//public void delTmpOrdDtl(Object parameters) throws Exception {

	//	dao.update("delTmpOrdDtl", parameters);
	//}
	
	//@Override
	//public void insTmpOrdDtl(Object parameters)throws Exception{
	//	dao.insert("insTmpOrdDtl", parameters);
	//}
	
	@Override
	public void insPegOrd(Object parameters)throws Exception{
		dao.insert("insPegOrd", parameters);
	}
	
	@Override
	public Collection getPegOrdList(Object parameters) throws Exception {

		return dao.query("getPegOrdList", parameters);
	}
	
	@Override
	public void insPegOrdDtl(Object parameters)throws Exception{
		dao.insert("insPegOrdDtl", parameters);
	}
	
	@Override
	public int getTmpDmdCount(Object parameters) throws Exception {
		return dao.getCount("getTmpDmdCount",  parameters);
	}
	
	@Override
	public void insSysLog(Object parameters)throws Exception{
		dao.insert("insSysLog", parameters);
	}
	
	@Override
	public void updErpSordFromKB(Object parameters)throws Exception{
		dao.update("updErpSordFromKB", parameters);
	}
	
	@Override
	public void delTmpOpList(Object parameters) throws Exception {

		dao.delete("delTmpOpList", parameters);
	}
	
	@Override
	public void delShopOrderRtn(Object parameters) throws Exception {

		dao.delete("delShopOrderRtn", parameters);
	}
	
	@Override
	public void insLastOp(Object parameters)throws Exception{
		dao.insert("insLastOp", parameters);
	}
	
	@Override
	public void insFirstOp(Object parameters)throws Exception{
		dao.insert("insFirstOp", parameters);
	}
	
	@Override
	public void insTmpOpListFW(Object parameters)throws Exception{
		dao.insert("insTmpOpListFW", parameters);
	}
	
	@Override
	public void insTmpOpListBW(Object parameters)throws Exception{
		dao.insert("insTmpOpListBW", parameters);
	}
		
	@Override
	public void delTmpOpListProcess(Object parameters)throws Exception{
		dao.delete("delTmpOpListProcess", parameters);
	}
	
	@Override
	public Collection getRtnForShopOrder(Object parameters) throws Exception {

		return dao.query("getRtnForShopOrder", parameters);
	}
	
	@Override
	public Collection getRtnForAllocOrd(Object parameters) throws Exception {

		return dao.query("getRtnForAllocOrd", parameters);
	}
	
	@Override
	public void insTmpSordRtn(Object parameters)throws Exception{
		dao.insert("insTmpSordRtn", parameters);
	}
	
	@Override
	public int getTmpOpListCount(Object parameters) throws Exception {
		return dao.getCount("getTmpOpListCount",  parameters);
	}
	
	@Override
	public void delTmpSordRtn(Object parameters)throws Exception{
		dao.delete("delTmpSordRtn", parameters);
	}
	
	@Override
	public void insErpSordRtnBW(Object parameters)throws Exception{
		dao.insert("insErpSordRtnBW", parameters);
	}
	
	@Override
	public void insErpSordRtnFW(Object parameters)throws Exception{
		dao.insert("insErpSordRtnFW", parameters);
	}
	
	@Override
	public void insExpRtnLog(Object parameters)throws Exception{
		dao.insert("insExpRtnLog", parameters);
	}
	
	@Override
	public Collection getShopOrderByWC(Object parameters) throws Exception {
		Collection list = dao.query("getShopOrderByWC",  parameters);
		return list;
	}
	
	@Override
	public Collection getPrntViewData(Object parameters) throws Exception {
		Collection list = dao.query("getPrntViewData",  parameters);
		return list;
	}
	
	@Override
	public Collection getChldViewData(Object parameters) throws Exception {
		Collection list = dao.query("getChldViewData",  parameters);
		return list;
	}
	
	@Override
	public void delPrntChldViewbyWC(Object parameters)throws Exception{
		dao.delete("delPrntChldViewbyWC", parameters);
	}
	
	@Override
	public void insPrntChldView(Object parameters)throws Exception{
		dao.insert("insPrntChldView", parameters);
	}
	
	@Override
	public int getRtnMapCount(Object parameters) throws Exception {
		return dao.getCount("getRtnMapCount",  parameters);
	}
	
	@Override
	public Collection getShopOrderDtaRtn(Object parameters) throws Exception {
		Collection list = dao.query("getShopOrderDtaRtn",  parameters);
		return list;
	}
	
	@Override
	public void insShopOrderRtn(Object parameters)throws Exception{
		dao.insert("insShopOrderRtn", parameters);
	}
	
	@Override
	public void updErpSordFromRtn(Object parameters)throws Exception{
		dao.update("updErpSordFromRtn", parameters);
	}
	
	@Override
	public void insDmdFromSOBySbom(Object parameters)throws Exception{
		dao.insert("insDmdFromSOBySbom", parameters);
	}
	
	@Override
	public void insDmdFromPLBySbom(Object parameters)throws Exception{
		dao.insert("insDmdFromPLBySbom", parameters);
	}
	
	@Override
	public void insSupOHRMSFG(Object parameters)throws Exception{
		dao.insert("insSupOHRMSFG", parameters);
	}
	
	@Override
	public Collection getPegOrdRlsDteList(Object parameters) throws Exception {

		return dao.query("getPegOrdRlsDteList", parameters);
	}
	
	@Override
	public void updErpSordFromPeg(Object parameters)throws Exception{
		dao.update("updErpSordFromPeg", parameters);
	}
	
	@Override
	public void updErpPlnOrdFromPeg(Object parameters)throws Exception{
		dao.update("updErpPlnOrdFromPeg", parameters);
	}
	
	@Override
	public Collection getShopOrderWithRtnByPlant(Object parameters) throws Exception {

		return dao.query("getShopOrderWithRtnByPlant", parameters);
	}
	
	//@Override
	//public void delAtdSordAllocByPlant(Object parameters)throws Exception{
	//	dao.delete("delAtdSordAllocByPlant", parameters);
	//}
	
	@Override
	public void insAtdSordAllocFg(Object parameters)throws Exception{
		dao.insert("insAtdSordAllocFg", parameters);
	}
	
	@Override
	public void insAtdOrdRtnFg(Object parameters)throws Exception{
		dao.insert("insAtdOrdRtnFg", parameters);
	}
	
	@Override
	public Collection getDspShopOrderByPlant(Object parameters) throws Exception {

		return dao.query("getDspShopOrderByPlant", parameters);
	}
	
	@Override
	public Collection getMachineTimeByWrkc(Object parameters) throws Exception {

		return dao.query("getMachineTimeByWrkc", parameters);
	}
	
	@Override
	public void updAtdSordAllocProcessed(Object parameters)throws Exception{
		dao.update("updAtdSordAllocProcessed", parameters);
	}
	
	@Override
	public void insDspOrder(Object parameters)throws Exception{
		dao.insert("insDspOrder", parameters);
	}
	
	@Override
	public void updDspOrderHeader(Object parameters)throws Exception{
		dao.update("updDspOrderHeader", parameters);
	}
	
	@Override
	public void insAtdSordAllocSfg(Object parameters)throws Exception{
		dao.insert("insAtdSordAllocSfg", parameters);
	}
	
	@Override
	public int getDspOrderCount(Object parameters) throws Exception {
		return dao.getCount("getDspOrderCount",  parameters);
	}
	
	@Override
	public void delOrdBehindMinDte(Object parameters) throws Exception {

		dao.update("delOrdBehindMinDte", parameters);
	}	
	
	@Override
	public Collection getAllocOrdList(Object parameters) throws Exception {

		return dao.query("getAllocOrdList", parameters);
	}
	
	@Override
	public void insAtdOrdRtnBW(Object parameters)throws Exception{
		dao.insert("insAtdOrdRtnBW", parameters);
	}
	
	@Override
	public void insTmpItemListByWrkc(Object parameters)throws Exception{
		dao.insert("insTmpItemListByWrkc", parameters);
	}
	
	@Override
	public void delPegAssignHdByWrkc(Object parameters)throws Exception{
		dao.delete("delPegAssignHdByWrkc", parameters);
	}
	
	@Override
	public void delPegAssignDtlByWrkc(Object parameters)throws Exception{
		dao.delete("delPegAssignDtlByWrkc", parameters);
	}
	
	@Override
	public void insPegAssignHd(Object parameters)throws Exception{
		dao.insert("insPegAssignHd", parameters);
	}
	
	@Override
	public void insPegAssignDtl(Object parameters)throws Exception{
		dao.insert("insPegAssignDtl", parameters);
	}
	
	@Override
	public Collection getPegChkCompltList(Object parameters) throws Exception {
		
		return dao.query("getPegChkCompltList", parameters);
	}
	
	@Override
	public Collection getPegChkCompltDtlList(Object parameters) throws Exception {
		
		return dao.query("getPegChkCompltDtlList", parameters);
	}
	
	@Override
	public void insArvPegAllocLog(Object parameters)throws Exception{
		dao.insert("insArvPegAllocLog", parameters);
	}
	
	@Override
	public void delPegAllocLog(Object parameters)throws Exception{
		dao.delete("delPegAllocLog", parameters);
	}
	
	@Override
	public Collection getDspShopOrderByChld(Object parameters) throws Exception {

		return dao.query("getDspShopOrderByChld", parameters);
	}
	
	@Override
	public Collection getDspShopOrderByBcp(Object parameters) throws Exception {

		return dao.query("getDspShopOrderByBcp", parameters);
	}
	
	@Override
	public void delTmpAssignDtlByWrkc(Object parameters)throws Exception{
		dao.delete("delTmpAssignDtlByWrkc", parameters);
	}
	
	@Override
	public void insTmpAssignDtl(Object parameters)throws Exception{
		dao.insert("insTmpAssignDtl", parameters);
	}
	
	@Override
	public void execBalDemSupByPlant(Object parameters)throws Exception{
		dao.insert("execBalDemSupByPlant", parameters);
	}
	
}
