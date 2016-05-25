package com.liuru.model;

import java.util.Collection;

public interface EHeijunka {
	
	/**
	 * Get shop order list by work center
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getShopOrderList(Object parameters)throws Exception;
	
	/**
	 * Get unplanned shop order list by work center
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getUnplannedShopOrderList(Object parameters)throws Exception;	
	
	/**
	 * Get total count of machines in the work center
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int getMachineCount(Object parameters)throws Exception;	
	
	/**
	 * Get event list by work center,machine
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getEventList(Object parameters)throws Exception;	
	
	/**
	 * Save event
	 * @param parameters
	 * @throws Exception
	 */
	public void saveEvent(Object parameters)throws Exception;	
	
	/**
	 * Update event
	 * @param parameters
	 * @throws Exception
	 */
	public void updateEvent(Object parameters)throws Exception;	
	
	/**
	 * Delete event
	 * @param parameters
	 * @throws Exception
	 */
	public void deleteEvent(Object parameters)throws Exception;	
	
	/**
	 * Update shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void updateShopOrder(Object parameters)throws Exception;	
	
	/**
	 * Get machine list by work center
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getMachineList(Object parameters) throws Exception;	
	
	/**
	 * Get available time spans of every resource
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getResourceAvailabilityList(Object parameters) throws Exception;
	
	/**
	 * Get user access info list
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getUserAccessInfoList(Object parameters) throws Exception;
	
	/**
	 * Get user view and edit list
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getAuthList(Object parameters) throws Exception;
	
	/**
	 * Update user access info
	 * @param parameters
	 * @throws Exception
	 */
	public void updateUserAccessInfo(Object parameters) throws Exception;
	
	/**
	 * Get shop order last end date time list
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getShopOrderLastEnddatetimeList(Object parameters) throws Exception;
	
	/**
	 * Call parent/child view for shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void callParnetChildView(Object parameters) throws Exception;
	
	
	/**
	 * Save shop order info by work center for AS400 to calculate the influence on parent item and child item. 
	 * @param parameters
	 * @throws Exception
	 */
	public void saveSOByWC(Object parameters)throws Exception;
	
	/**
	 * Delete shop order info by work center
	 * @param parameters
	 * @throws Exception
	 */
	public void deleteSOByWC(Object parameters)throws Exception;
	
	/**
	 * Get count of events by shop order
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int getEventCountByShopOrder(Object parameters) throws Exception;	
	
	/**
	 * Update shop order remark
	 * @param parameters
	 * @throws Exception
	 */
	public void updateShopOrderRemark(Object parameters)throws Exception;

	public Collection checkUserLogin(Object parameters)throws Exception;	

	/**
	 * Get record count in tmp_demand
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getDemand(Object parameters)throws Exception;	
	
	/**
	 * Get record count in tmp_supply
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getSupply(Object parameters)throws Exception;	
	
	/**
	 * Get supply item list by plant
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getSupplyItemList(Object parameters)throws Exception;		

	/**
	 * Update tmp_supply
	 * @param parameters
	 * @throws Exception
	 */
	public void updSupply(Object parameters)throws Exception;	
	
	/**
	 * Update tmp_demand
	 * @param parameters
	 * @throws Exception
	 */
	public void updDemand(Object parameters)throws Exception;	
	
	/**
	 * Insert peg_alloc_log
	 * @param parameters
	 * @throws Exception
	 */
	public void savAllocLog(Object parameters)throws Exception;	
	
	/**
	 * Get leadtime from item master
	 * @param parameters
	 * @throws Exception
	 */
	public Collection getLTFromItm(Object parameters)throws Exception;	
	
	/**
	 * Get leadtime from routing
	 * @param parameters
	 * @throws Exception
	 */
	public Collection getLTFromRtn(Object parameters)throws Exception;	
	
	/**
	 * Truncate tmp_demand
	 * @param parameters
	 * @throws Exception
	 */
	public void delTmpDmd(Object parameters)throws Exception;	
	
	/**
	 * Truncate tmp_suplly
	 * @param parameters
	 * @throws Exception
	 */
	public void delTmpSup(Object parameters)throws Exception;	
	
	/**
	 * Truncate tmp_itemlist
	 * @param parameters
	 * @throws Exception
	 */
	public void delTmpItemList(Object parameters)throws Exception;
	
	/**
	 * Collect item list from tmp_demand
	 * @param parameters
	 * @throws Exception
	 */
	public void insTmpItemListFromDmd(Object parameters)throws Exception;
	
	/**
	 * Collect item list from tmp_supply
	 * @param parameters
	 * @throws Exception
	 */
	public void insTmpItemListFromSup(Object parameters)throws Exception;
	
	/**
	 * Collect demand from erp_ord_dtl on RM level
	 * @param parameters
	 * @throws Exception
	 */
	public void insDmdSORM(Object parameters)throws Exception;
	
	/**
	 * Collect demand from erp_ord_dtl on SFG (with enough inventory)level
	 * @param parameters
	 * @throws Exception
	 */
	public void insDmdSOSFG(Object parameters)throws Exception;
	
	/**
	 * Collect demand from erp_ord_dtl
	 * @param parameters
	 * @throws Exception
	 */
	public void insDmdSO(Object parameters)throws Exception;
	
	/**
	 * Collect demand from erp_plnord_dtl on RM level
	 * @param parameters
	 * @throws Exception
	 */
	public void insDmdPlnOrdRM(Object parameters)throws Exception;
	
	/**
	 * Collect demand from erp_plnord_dtl
	 * @param parameters
	 * @throws Exception
	 */
	public void insDmdPlnOrd(Object parameters)throws Exception;
	
	/**
	 * Collect supply from onhand
	 * @param parameters
	 * @throws Exception
	 */
	public void insSupOH(Object parameters)throws Exception;
	
	/**
	 * Collect supply from purchasing order
	 * @param parameters
	 * @throws Exception
	 */
	public void insSupPO(Object parameters)throws Exception;
	
	/**
	 * Collect supply from shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void insSupSO(Object parameters)throws Exception;
	
	/**
	 * Collect supply from plan order
	 * @param parameters
	 * @throws Exception
	 */
	public void insSupPL(Object parameters)throws Exception;
	
	/**
	 * Collect supply from tmp_demand
	 * @param parameters
	 * @throws Exception
	 */
	public void insSupFromTmpDmd(Object parameters)throws Exception;
	
	/**
	 * Delete tmp_ord_dtl
	 * @param parameters
	 * @throws Exception
	 */
	//public void delTmpOrdDtl(Object parameters)throws Exception;
	
	/**
	 * Collect order detail of FG
	 * @param parameters
	 * @throws Exception
	 */
	//public void insTmpOrdDtl(Object parameters)throws Exception;
	
	/**
	 * Collect order detail of FG
	 * @param parameters
	 * @throws Exception
	 */
	public void insPegOrd(Object parameters)throws Exception;
	
	/**
	 * Get pegging shop order list
	 * @param parameters
	 * @throws Exception
	 */
	public Collection getPegOrdList(Object parameters)throws Exception;	
	
	/**
	 * Collect pegging result
	 * @param parameters
	 * @throws Exception
	 */
	public void insPegOrdDtl(Object parameters)throws Exception;
	
	/**
	 * Get count of tmp_demand
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int getTmpDmdCount(Object parameters) throws Exception;
	
	/**
	 * Write system log
	 * @param parameters
	 * @throws Exception
	 */
	public void insSysLog(Object parameters)throws Exception;
	
	/**
	 * Update erp_sord start/end/due date from kanban
	 * @param parameters
	 * @throws Exception
	 */
	public void updErpSordFromKB(Object parameters)throws Exception;
	
	/**
	 * Delete tmp_oplist
	 * @param parameters
	 * @throws Exception
	 */
	public void delTmpOpList(Object parameters)throws Exception;
	
	/**
	 * Delete shop order routing by shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void delShopOrderRtn(Object parameters)throws Exception;
	
	/**
	 * Insert last op in tmp_oplist
	 * @param parameters
	 * @throws Exception
	 */
	public void insLastOp(Object parameters)throws Exception;
	
	/**
	 * Insert first op in tmp_oplist
	 * @param parameters
	 * @throws Exception
	 */
	public void insFirstOp(Object parameters)throws Exception;
	
	/**
	 * Insert op (FW) in tmp_oplist
	 * @param parameters
	 * @throws Exception
	 */
	public void insTmpOpListFW(Object parameters)throws Exception;
	
	/**
	 * Insert op (BW) in tmp_oplist
	 * @param parameters
	 * @throws Exception
	 */
	public void insTmpOpListBW(Object parameters)throws Exception;
	
	/**
	 * Delete processed op in tmp_oplist
	 * @param parameters
	 * @throws Exception
	 */
	public void delTmpOpListProcess(Object parameters)throws Exception;
	
	/**
	 * Get shop order and routing information for calculation
	 * @param parameters
	 * @throws Exception
	 */
	public Collection getRtnForShopOrder(Object parameters)throws Exception;
	
	/**
	 * Get shop order and routing information for calculation
	 * @param parameters
	 * @throws Exception
	 */
	public Collection getRtnForAllocOrd(Object parameters)throws Exception;
	
	/**
	 * Insert routing for shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void insTmpSordRtn(Object parameters)throws Exception;
	
	/**
	 * Get count of tmp_oplist
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int getTmpOpListCount(Object parameters) throws Exception;
	
	/**
	 * Delete record in tmp_sord_rtn
	 * @param parameters
	 * @throws Exception
	 */
	public void delTmpSordRtn(Object parameters)throws Exception;
	
	/**
	 * Insert routing for shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void insErpSordRtnBW(Object parameters)throws Exception;
	
	/**
	 * Insert routing for shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void insErpSordRtnFW(Object parameters)throws Exception;
	
	/**
	 * Insert routing for shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void insExpRtnLog(Object parameters)throws Exception;
	
	/**
	 * Get shop order by workcenter
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getShopOrderByWC(Object parameters)throws Exception;	
	
	/**
	 * Get parent view data
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getPrntViewData(Object parameters)throws Exception;	
	
	/**
	 * Get child view data
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getChldViewData(Object parameters)throws Exception;
	
	/**
	 * Delete parent/child view by workcenter
	 * @param parameters
	 * @throws Exception
	 */
	public void delPrntChldViewbyWC(Object parameters)throws Exception;
	
	/**
	 * Insert parent/child view
	 * @param parameters
	 * @throws Exception
	 */
	public void insPrntChldView(Object parameters)throws Exception;
	
	/**
	 * Get count of dta_rtn_map
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int getRtnMapCount(Object parameters) throws Exception;
	
	/**
	 * Get routing data for shop order calculation
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getShopOrderDtaRtn(Object parameters)throws Exception;
	
	/**
	 * Insert routing for shop order
	 * @param parameters
	 * @throws Exception
	 */
	public void insShopOrderRtn(Object parameters)throws Exception;
	
	/**
	 * Update erp_sord start/end/due date from routing
	 * @param parameters
	 * @throws Exception
	 */
	public void updErpSordFromRtn(Object parameters)throws Exception;
	
	/**
	 * Insert demand from C/O by super bom
	 * @param parameters
	 * @throws Exception
	 */
	public void insDmdFromSOBySbom(Object parameters)throws Exception;
	
	/**
	 * Insert demand from PL by super bom
	 * @param parameters
	 * @throws Exception
	 */
	public void insDmdFromPLBySbom(Object parameters)throws Exception;
	
	/**
	 * Insert demand from PL by super bom
	 * @param parameters
	 * @throws Exception
	 */
	public void insSupOHRMSFG(Object parameters)throws Exception;
	
	/**
	 * Get shop order release date from peg order
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getPegOrdRlsDteList(Object parameters)throws Exception;
	
	/**
	 * Update erp_sord start/end/due date from peg order
	 * @param parameters
	 * @throws Exception
	 */
	public void updErpSordFromPeg(Object parameters)throws Exception;
	
	/**
	 * Update plan order start/end/due date from peg order
	 * @param parameters
	 * @throws Exception
	 */
	public void updErpPlnOrdFromPeg(Object parameters)throws Exception;
	
	/**
	 * Get shop order with routing data by plant
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getShopOrderWithRtnByPlant(Object parameters)throws Exception;
	
	/**
	 * Delete shop order allocation by plant
	 * @param parameters
	 * @throws Exception
	 */
	//public void delAtdSordAllocByPlant(Object parameters)throws Exception;

	/**
	 * Insert allocation 
	 * @param parameters
	 * @throws Exception
	 */
	public void insAtdSordAllocFg(Object parameters)throws Exception;
	
	/**
	 * Insert routing 
	 * @param parameters
	 * @throws Exception
	 */
	public void insAtdOrdRtnFg(Object parameters)throws Exception;
	
	/**
	 * Get dispatch shop order by plant
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getDspShopOrderByPlant(Object parameters)throws Exception;
	
	/**
	 * Get last datetime from machine by workcenter
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getMachineTimeByWrkc(Object parameters)throws Exception;
	
	/**
	 * Update processed flag in atd_sord_alloc
	 * @param parameters
	 * @throws Exception
	 */
	public void updAtdSordAllocProcessed(Object parameters)throws Exception;
	
	/**
	 * Dispatch order in eheijunka 
	 * @param parameters
	 * @throws Exception
	 */
	public void insDspOrder(Object parameters)throws Exception;
	
	/**
	 * Update dispatching order header
	 * @param parameters
	 * @throws Exception
	 */
	public void updDspOrderHeader(Object parameters)throws Exception;
	
	/**
	 * Collect allocated order
	 * @param parameters
	 * @throws Exception
	 */
	public void insAtdSordAllocSfg(Object parameters)throws Exception;
	
	/**
	 * Get dispatch order count
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public int getDspOrderCount(Object parameters) throws Exception;
	
	/**
	 * Delete order behind min start date
	 * @param parameters
	 * @throws Exception
	 */
	public void delOrdBehindMinDte(Object parameters)throws Exception;	
	
	/**
	 * Get allocated order list
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getAllocOrdList(Object parameters)throws Exception;
	
	/**
	 * Insert broadcasting routing 
	 * @param parameters
	 * @throws Exception
	 */
	public void insAtdOrdRtnBW(Object parameters)throws Exception;
	
	
	/**
	 * Insert item list by workcenter 
	 * @param parameters
	 * @throws Exception
	 */
	public void insTmpItemListByWrkc(Object parameters)throws Exception;
	
	/**
	 * delete order from peg_assign_hd by workcenter
	 * @param parameters
	 * @throws Exception
	 */
	public void delPegAssignHdByWrkc(Object parameters)throws Exception;	
	
	/**
	 * delete order from peg_assign_dtl by workcenter
	 * @param parameters
	 * @throws Exception
	 */
	public void delPegAssignDtlByWrkc(Object parameters)throws Exception;
	
	/**
	 * Insert header record to peg_assign_hd 
	 * @param parameters
	 * @throws Exception
	 */
	public void insPegAssignHd(Object parameters)throws Exception;
	
	/**
	 * Insert detail record to peg_assign_dtl 
	 * @param parameters
	 * @throws Exception
	 */
	public void insPegAssignDtl(Object parameters)throws Exception;
	
	/**
	 * Get check completeness order list by workcenter
	 * @param parameters
	 * @param limit 
	 * @param start 
	 * @return
	 * @throws Exception
	 */
	public Collection getPegChkCompltList(Object parameters)throws Exception;
	
	/**
	 * Get check completeness order detail list by workcenter
	 * @param parameters
	 * @param limit 
	 * @param start 
	 * @return
	 * @throws Exception
	 */
	public Collection getPegChkCompltDtlList(Object parameters)throws Exception;
	
	/**
	 * Insert history record to arvpeg_alloc_log 
	 * @param parameters
	 * @throws Exception
	 */
	public void insArvPegAllocLog(Object parameters)throws Exception;
	
	/**
	 * truncate table peg_alloc_log
	 * @param parameters
	 * @throws Exception
	 */
	public void delPegAllocLog(Object parameters)throws Exception;
	
	/**
	 * Get dispatching shop order list by work center
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getDspShopOrderByChld(Object parameters)throws Exception;	
	
	/**
	 * Get dispatching shop order list by work center
	 * @param parameters
	 * @return
	 * @throws Exception
	 */
	public Collection getDspShopOrderByBcp(Object parameters)throws Exception;	
	
	/**
	 * delete order from tmp_assign_dtl by workcenter
	 * @param parameters
	 * @throws Exception
	 */
	public void delTmpAssignDtlByWrkc(Object parameters)throws Exception;	
	
	/**
	 * Insert record to tmp_assign_dtl 
	 * @param parameters
	 * @throws Exception
	 */
	public void insTmpAssignDtl(Object parameters)throws Exception;
	
	/**
	 * execute stored procedure BalDemSupByPlant 
	 * @param parameters
	 * @throws Exception
	 */
	public void execBalDemSupByPlant(Object parameters)throws Exception;
	
}
