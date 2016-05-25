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

public class EHeijunkaService {

	private static Log logger = LogFactory.getLog(EHeijunkaService.class);

	private EHeijunka eheijunka;

	public EHeijunka getEheijunka() {
		return eheijunka;
	}

	public void setEheijunka(EHeijunka eheijunka) {
		this.eheijunka = eheijunka;
	}

	/**
	 * Get shop order list by work center
	 * 
	 * @param parameters
	 * @return
	 */
	public ListRange getShopOrderList(Map parameters) {
		ListRange listRange = new ListRange();
		try {
			Collection shopOrderList = eheijunka.getShopOrderList(parameters);
			Iterator itr = shopOrderList.iterator();
			Map rowMap;
			String shopOrder;
			String item;
			String itemDescription;
			double remainQuantity;
			double remainHours;
			while (itr.hasNext()) {
				rowMap = (Map) itr.next();
				shopOrder = rowMap.get("ShopOrder").toString().trim();
				item = rowMap.get("Item").toString().trim();
				itemDescription = rowMap.get("ItemDescription").toString().trim();
				remainQuantity = Double.valueOf(rowMap.get("RemainQuantity").toString().trim());
				remainHours = Double.valueOf(rowMap.get("RemainHours").toString().trim());
				rowMap.put("displayInfo", shopOrder + "/" + item + "/" + itemDescription + "/" + remainQuantity + "/"
						+ remainHours + " Hours");
			}

			listRange.setData(shopOrderList.toArray());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listRange;
	}

	/**
	 * Get shop order list by work center (return json string)
	 * 
	 * @param parameters
	 * @return
	 */
	public String getUnpannedShopOrderList(Map parameters) {
		Collection resultList = new ArrayList();
		try {
			Map rowMap;
			long currentDateTime = Long.valueOf(new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

			Map shopOrderLastEnddatetimeMap = new HashMap();
			Collection shopOrderLastenddatetimeList = eheijunka.getShopOrderLastEnddatetimeList(parameters);
			Iterator shopOrderLastenddatetimeItr = shopOrderLastenddatetimeList.iterator();
			while (shopOrderLastenddatetimeItr.hasNext()) {
				rowMap = (Map) shopOrderLastenddatetimeItr.next();
				shopOrderLastEnddatetimeMap.put(rowMap.get("shopOrder").toString().trim(),
						rowMap.get("lastEndDateTime").toString().trim());
			}

			// String chjWCStr = "101401,150101";
			// if(parameters.get("workCenter")!=null&&chjWCStr.indexOf(parameters.get("workCenter").toString().trim())!=-1){
			// parameters.put("isCHJWC", true);
			// }

			Collection unplannedShopOrderList = eheijunka.getUnplannedShopOrderList(parameters);
			Iterator unplannedShopOrderItr = unplannedShopOrderList.iterator();

			String shopOrder;
			double remainHours;
			long lastEndDateTime;

			SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd HHmmss");
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
			String newParentStartDate;
			String newParentStartTime;
			String newChildStartDate;
			String newChildStartTime;
			Date newParentStartDateTime;
			Date newChildStartDateTime;
			String parentViewStr = "";
			String childViewStr = "";

			while (unplannedShopOrderItr.hasNext()) {
				rowMap = (Map) unplannedShopOrderItr.next();
				shopOrder = rowMap.get("ShopOrder").toString().trim();
				remainHours = Double.valueOf(rowMap.get("RemainHours").toString().trim());

				rowMap.put("Name", shopOrder);
				rowMap.put("Duration", remainHours);

				parentViewStr = "";
				childViewStr = "";
				if (rowMap.get("newStartDtP") != null) {
					parentViewStr = rowMap.get("newStartDtP").toString().trim();
				} else {
					parentViewStr = "0";
				}
	
				if (rowMap.get("newStartDtC") != null) {
					childViewStr = rowMap.get("newStartDtC").toString().trim();
				} else {
					childViewStr = "0";
				}
					
				if (rowMap.get("sourceP") != null) {
					parentViewStr += " " + rowMap.get("sourceP").toString().trim();
				}
				if (rowMap.get("sourceC") != null) {
					childViewStr += " " + rowMap.get("sourceC").toString().trim();
				}

				if (rowMap.get("delayP") != null && rowMap.get("delayP").toString().trim().equals("Y")) {
					parentViewStr = "<font color=\'red\'>" + parentViewStr + "</font>";
				}
				if (rowMap.get("delayC") != null && rowMap.get("delayC").toString().trim().equals("Y")) {
					childViewStr = "<font color=\'red\'>" + childViewStr + "</font>";
				}
				rowMap.put("ParentViewStr", parentViewStr);
				rowMap.put("ChildViewStr", childViewStr);

				// If Kanban of the shop order is pass due and shop order was
				// scheduled enough
				boolean addFlag = true;
				if (shopOrderLastEnddatetimeMap.containsKey(shopOrder)) {
					lastEndDateTime = Long.valueOf(shopOrderLastEnddatetimeMap.get(shopOrder).toString().trim());
					if (lastEndDateTime <= currentDateTime) {
						addFlag = false;
					}
				}

				if (addFlag) {
					resultList.add(rowMap);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		JSONArray jsonArry = new JSONArray();
		jsonArry.addAll(resultList);
		String jsonString = "{data :" + jsonArry.toString() + "}";
		return jsonString;
	}

	/**
	 * Get machine list
	 * 
	 * @param parameters
	 * @return
	 */
	public String getMachineList(Map parameters) {
		Collection list = new ArrayList();
		try {
			list = eheijunka.getMachineList(parameters);
		} catch (Exception e) {
			e.printStackTrace();
		}

		JSONArray jsonArry = new JSONArray();
		jsonArry.addAll(list);
		String jsonString = "{data :" + jsonArry.toString() + "}";
		return jsonString;
	}

	/**
	 * Get available time spans of every resource
	 * 
	 * @param parameters
	 * @return
	 */
	public String getResourceAvailabilityList(Map parameters) {
		Collection list = new ArrayList();
		try {
			list = eheijunka.getResourceAvailabilityList(parameters);

			if (list != null) {
				SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd HHmmss");
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
				Iterator itr = list.iterator();
				Map rowMap;
				String date;
				String startTime;
				String endTime;
				while (itr.hasNext()) {
					rowMap = (Map) itr.next();

					date = rowMap.get("Date").toString().trim();
					startTime = rowMap.get("StartTime").toString().trim();
					startTime = String.format("%06d", Integer.valueOf(startTime));
					endTime = rowMap.get("EndTime").toString().trim();
					endTime = String.format("%06d", Integer.valueOf(endTime));

					rowMap.put("StartDate", dateFormat.format((sdf1.parse(date + " " + startTime))) + "T"
							+ timeFormat.format((sdf1.parse(date + " " + startTime))));
					rowMap.put("EndDate", dateFormat.format((sdf1.parse(date + " " + endTime))) + "T"
							+ timeFormat.format((sdf1.parse(date + " " + endTime))));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		JSONArray jsonArry = new JSONArray();
		jsonArry.addAll(list);
		String jsonString = "{data :" + jsonArry.toString() + "}";
		return jsonString;
	}

	/**
	 * Get the event list by work center
	 * 
	 * @param parameters
	 * @return
	 */
	public String getEventList(Map parameters) {
		Collection list = new ArrayList();
		try {
			list = eheijunka.getEventList(parameters);

			if (list != null) {
				SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd HHmmss");
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
				DecimalFormat df = new DecimalFormat("#0.000");
				Iterator itr = list.iterator();
				Map rowMap;
				Date startDatetime;
				Date endDatetime;
				double duration;
				double hours;
				String startDate;
				String startTime;
				String endDate;
				String endTime;
				String dueDate;
				String dueTime;

				String newParentStartDate;
				String newParentStartTime;
				String newChildStartDate;
				String newChildStartTime;
				Date newParentStartDateTime;
				Date newChildStartDateTime;
				String parentViewStr = "";
				String childViewStr = "";
				String orginalEndDateInfo = "";
				String originalEndDateTimeRemark;

				while (itr.hasNext()) {
					rowMap = (Map) itr.next();

					startDate = rowMap.get("startDate").toString().trim();
					startTime = rowMap.get("startTime").toString().trim();
					startTime = String.format("%06d", Integer.valueOf(startTime));
					endDate = rowMap.get("endDate").toString().trim();
					endTime = rowMap.get("endTime").toString().trim();
					endTime = String.format("%06d", Integer.valueOf(endTime));

					hours = Double.valueOf(rowMap.get("Hours").toString().trim());

					startDatetime = sdf1.parse(startDate + " " + startTime);
					endDatetime = sdf1.parse(endDate + " " + endTime);
					duration = (endDatetime.getTime() - startDatetime.getTime()) / (double) (1000 * 60 * 60);

					rowMap.put("Duration", df.format(duration));
					rowMap.put("HRSGap", df.format(hours - duration));

					rowMap.put("StartDate", dateFormat.format(startDatetime) + "T" + timeFormat.format(startDatetime));
					rowMap.put("EndDate", dateFormat.format(endDatetime) + "T" + timeFormat.format(endDatetime));

					if (rowMap.get("DueDate") != null && !rowMap.get("DueDate").toString().trim().equals("0")) {
						dueDate = rowMap.get("DueDate").toString().trim();
						dueTime = rowMap.get("DueTime").toString().trim();
						dueTime = String.format("%06d", Integer.valueOf(dueTime));
						rowMap.put("DueDate", dateFormat.format((sdf1.parse(dueDate + " " + dueTime))) + "T"
								+ timeFormat.format((sdf1.parse(dueDate + " " + dueTime))));
					}

					parentViewStr = "";
					childViewStr = "";
					if (rowMap.get("newStartDtP") != null) {
						parentViewStr = rowMap.get("newStartDtP").toString().trim();
					} else {
						parentViewStr = "0";
					}
					
					if (rowMap.get("newStartDtC") != null) {
						childViewStr = rowMap.get("newStartDtC").toString().trim();
					} else {
						childViewStr = "0";
					}
					
					if (rowMap.get("sourceP") != null) {
						parentViewStr += " " + rowMap.get("sourceP").toString().trim();
					}
					if (rowMap.get("sourceC") != null) {
						childViewStr += " " + rowMap.get("sourceC").toString().trim();
					}

					if (rowMap.get("delayP") != null && rowMap.get("delayP").toString().trim().equals("Y")) {
						parentViewStr = "<font color=\'red\'>" + parentViewStr + "</font>";
					}
					if (rowMap.get("delayC") != null && rowMap.get("delayC").toString().trim().equals("Y")) {
						childViewStr = "<font color=\'red\'>" + childViewStr + "</font>";
					}
					rowMap.put("ParentViewStr", parentViewStr);
					rowMap.put("ChildViewStr", childViewStr);

					if (rowMap.get("OriginalEndDateTimeRemark") != null
							&& !rowMap.get("OriginalEndDateTimeRemark").toString().trim().equals("")) {
						originalEndDateTimeRemark = rowMap.get("OriginalEndDateTimeRemark").toString().trim();
						String originalEndStr = originalEndDateTimeRemark.substring(4, 6) + "/"
								+ originalEndDateTimeRemark.substring(6, 8);
						if (rowMap.get("RealEndDate") != null) {
							long orginalEndDateTime = Long.valueOf(originalEndDateTimeRemark);
							long realEndDate = Long.valueOf(rowMap.get("RealEndDate").toString().trim());
							long realEndTime = Long.valueOf(rowMap.get("RealEndTime").toString().trim());
							if (((realEndDate * 1000000) + realEndTime) > orginalEndDateTime) {
								orginalEndDateInfo = "<font color=\'#FF00FF\'>" + originalEndStr + "</font>  ";
							} else {
								orginalEndDateInfo = originalEndStr;
							}
						} else {
							orginalEndDateInfo = originalEndStr;
						}
						rowMap.put("OrginalEndDateInfo", orginalEndDateInfo);
					}
					
					if (rowMap.get("ID").toString().trim().equals("FX") && rowMap.get("EventType").toString().trim().equals("NW")) {
						rowMap.put("Draggable", "false");
						rowMap.put("Resizable", "false");
					} else {
						rowMap.put("Draggable", "true");
						rowMap.put("Resizable", "true");
					}
					
				}
			}

			// Store login user id & work center to session
			// String loginUserId =
			// WebContextFactory.get().getHttpServletRequest().getRemoteUser().toUpperCase();
			String loginUserId = WebContextFactory.get().getSession().getAttribute("uid").toString().toUpperCase();
			HttpSession session = WebContextFactory.get().getSession();
			if (session != null) {
				session.setAttribute("loginUserId", loginUserId);
				session.setAttribute("workCenter", parameters.get("workCenter"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		JSONArray jsonArry = new JSONArray();
		jsonArry.addAll(list);
		String jsonString = "{data :" + jsonArry.toString() + "}";
		return jsonString;
	}

	/**
	 * Save event list
	 * 
	 * @param parameters
	 * @return
	 */
	public int saveEventList(List<Map> eventList) {
		int flag = 0;

		if (eventList != null) {
			String eventId; // RRN
			String eventType;
			String removed; // Removed Flag
			String startTime;
			String endTime;

			List updatedShopOrderList = new ArrayList();
			// List influencedShopOrderList = new ArrayList();
			List firstTimeScheduledShopOrderList = new ArrayList();

			Map eventMap;
			Map tmpParameters;
			Map rowMap;
			String workCenter = "";
			String shopOrder;
			int op;

			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
			SimpleDateFormat timeFormat = new SimpleDateFormat("HHmmss");
			// String loginUserId =
			// WebContextFactory.get().getHttpServletRequest().getRemoteUser().toUpperCase();
			String loginUserId = WebContextFactory.get().getSession().getAttribute("uid").toString().toUpperCase();
			Date now = new Date();
			Date start = new Date();
			Date end = new Date();

			try {
				Iterator eventListItr = eventList.iterator();
				while (eventListItr.hasNext()) {
					eventMap = (Map) eventListItr.next();

					// Get work center
					workCenter = eventMap.get("workCenter").toString().trim();

					// Get shop order
					if (eventMap.get("shopOrder") != null) {
						shopOrder = eventMap.get("shopOrder").toString().trim();
						op = Integer.valueOf(eventMap.get("op").toString().trim());
						if (!updatedShopOrderList.contains(shopOrder) && !shopOrder.equals("0")
								&& !shopOrder.equals("")) {
							updatedShopOrderList.add(eventMap);
						}

						// if(!influencedShopOrderList.contains(shopOrder)&&!shopOrder.equals("0")&&!shopOrder.equals("")&&eventMap.get("removed")==null){
						// influencedShopOrderList.add(shopOrder);
						// }

						// Check if the shop order has ever been scheduled
						// Kanban
						if (!shopOrder.equals("0") && !shopOrder.equals("")) {
							int count = eheijunka.getEventCountByShopOrder(eventMap);
							if (count == 0) {
								firstTimeScheduledShopOrderList.add(eventMap);
							}
						}
					}

					if (eventMap.get("eventId") != null) {
						eventId = eventMap.get("eventId").toString().trim();
					} else {
						eventId = "";
					}

					if (eventMap.get("removed") != null && eventMap.get("removed").toString().trim().equals("TRUE")) { // If
																														// is
																														// to
																														// be
																														// removed
						tmpParameters = new HashMap();
						tmpParameters.put("eventId", eventId);
						tmpParameters.put("updatedBy", loginUserId);
						tmpParameters.put("updatedDate", dateFormat.format(now));
						tmpParameters.put("updatedTime", timeFormat.format(now));
						eheijunka.deleteEvent(tmpParameters);

						continue;
					}

					eventType = eventMap.get("eventType").toString().trim();

					startTime = eventMap.get("startTime").toString().trim();
					endTime = eventMap.get("endTime").toString().trim();

					start.setTime(Long.valueOf(startTime));
					end.setTime(Long.valueOf(endTime));

					eventMap.put("startDate", dateFormat.format(start));
					eventMap.put("startTime", timeFormat.format(start));
					eventMap.put("endDate", dateFormat.format(end));
					eventMap.put("endTime", timeFormat.format(end));

					double allocatedQuantity = 0;
					if (eventMap.get("allocatedQuantity") != null) {
						allocatedQuantity = Double.valueOf(eventMap.get("allocatedQuantity").toString().trim());
					}
					eventMap.put("allocatedHours", 0);

					if (eventType.equals("PD")) { // Production
						// Calculate standard working hours
						double requireQuantity = 0;
						double requireHours = 0;

						tmpParameters = new HashMap();
						tmpParameters.put("workCenter", eventMap.get("workCenter"));
						tmpParameters.put("shopOrder", eventMap.get("shopOrder"));
						tmpParameters.put("op", eventMap.get("op"));
						tmpParameters.put("plant", eventMap.get("plant"));
						Collection shopOrderList = eheijunka.getShopOrderList(tmpParameters);
						if (shopOrderList != null) {
							Iterator shopOrderItr = shopOrderList.iterator();
							while (shopOrderItr.hasNext()) {
								rowMap = (Map) shopOrderItr.next();
								if (rowMap.get("RequireQuantity") != null) {
									requireQuantity = Double.valueOf(rowMap.get("RequireQuantity").toString().trim());
								}
								if (rowMap.get("RequireHours") != null) {
									requireHours = Double.valueOf(rowMap.get("RequireHours").toString().trim());
								}

								break;
							}
						}

						DecimalFormat df = new DecimalFormat("#0.000");
						eventMap.put("allocatedHours", df.format((allocatedQuantity / requireQuantity) * requireHours));
					} else if (eventType.equals("SD")) { // Shut down
						eventMap.put("shopOrder", 0);
						eventMap.put("op", 0);
						eventMap.put("allocatedQuantity", 0);
						eventMap.put("allocatedHours", 0);
					}

					eventMap.put("updatedBy", loginUserId);
					eventMap.put("updatedDate", dateFormat.format(now));
					eventMap.put("updatedTime", timeFormat.format(now));

					if (eventMap.get("fixed") != null && eventMap.get("fixed").toString().trim().equals("TRUE")) {
						eventMap.put("id", "FX"); // Fix Kanban
					} else {
						eventMap.put("id", "E2");
					}

					if (eventId.equals("")) { // Check if this is a new event
						eheijunka.saveEvent(eventMap);
					} else {
						eheijunka.updateEvent(eventMap);
					}
				}

				// Update shop order remark before do updating shop order info
				if (firstTimeScheduledShopOrderList != null && firstTimeScheduledShopOrderList.size() > 0) {
					Iterator itr = firstTimeScheduledShopOrderList.iterator();
					while (itr.hasNext()) {
						Map newOrdRowMap = (Map) itr.next();
						tmpParameters = new HashMap();
						//tmpParameters.put("shopOrder", shopOrder);
						tmpParameters.put("shopOrder", newOrdRowMap.get("shopOrder").toString().trim());
						tmpParameters.put("op", Integer.valueOf(newOrdRowMap.get("op").toString().trim()));
						tmpParameters.put("plant", newOrdRowMap.get("plant").toString().trim());
						eheijunka.updateShopOrderRemark(tmpParameters);
					}
				}

				// Update shop order info in EH0010PF
				if (updatedShopOrderList != null && updatedShopOrderList.size() > 0) {
					Iterator itr = updatedShopOrderList.iterator();
					while (itr.hasNext()) {
						//shopOrder = (String) itr.next();
						Map updOrdRowMap = (Map) itr.next();
						// Update shop order info in EH0010PF
						tmpParameters = new HashMap();
						//tmpParameters.put("shopOrder", shopOrder);
						tmpParameters.put("shopOrder", updOrdRowMap.get("shopOrder").toString().trim());
						tmpParameters.put("op", Integer.valueOf(updOrdRowMap.get("op").toString().trim()));
						tmpParameters.put("plant", updOrdRowMap.get("plant").toString().trim());
						eheijunka.updateShopOrder(tmpParameters);

						// Update shop order start/end/due date in erp_sord
						//eheijunka.updErpSordFromKB(tmpParameters);
					}
				}

				// Remove previous shop order,work center info in EH0050W5
				// (AS400)
				// tmpParameters = new HashMap();
				// tmpParameters.put("workCenter", workCenter);
				// eheijunka.deleteSOByWC(tmpParameters);

				// //Save shop order,work center info to EH0050W5 (AS400)
				// if(influencedShopOrderList!=null&&influencedShopOrderList.size()>0){
				// Iterator itr = influencedShopOrderList.iterator();
				// while(itr.hasNext()){
				// shopOrder = (String)itr.next();
				//
				// //Save shop order,work center info to EH0050W5 (AS400)
				// tmpParameters = new HashMap();
				// tmpParameters.put("workCenter", workCenter);
				// tmpParameters.put("shopOrder", shopOrder);
				// eheijunka.saveSOByWC(tmpParameters);
				// }
				//
				// //Call parent/child view for shop order
				// tmpParameters = new HashMap();
				// tmpParameters.put("workCenter", workCenter);
				// eheijunka.callParnetChildView(tmpParameters);
				// }
			} catch (Exception e) {
				e.printStackTrace();
				flag = -1;
			}

		}

		return flag;
	}

	/**
	 * Check if use can edit the work center
	 * 
	 * @param parameters
	 * @return
	 */
	public String checkUserAccess(Map parameters) {
		String returnResult = "0";
		// String inUseUserId = "";
		String inUseUserId = "TESTID";

		String inUseWorkCenter = "";
		// String loginUserId =
		// WebContextFactory.get().getHttpServletRequest().getRemoteUser().toUpperCase();
		String loginUserId = WebContextFactory.get().getSession().getAttribute("uid").toString().toUpperCase();
		try {
			String workCenter = parameters.get("workCenter").toString().trim();

			int authFlag = this.getPruview(parameters);
			if (authFlag != 3 && authFlag != 1) {
				returnResult = "2";
				return returnResult;
			}

			Collection userAccessInfoList = eheijunka.getUserAccessInfoList(parameters);
			if (userAccessInfoList != null && userAccessInfoList.size() > 0) {
				Iterator itr = userAccessInfoList.iterator();
				Map rowMap;
				boolean canEdit = false;
				boolean useFlag = false;
				while (itr.hasNext()) {
					rowMap = (Map) itr.next();
					if (rowMap.get("UserId").toString().trim().toUpperCase().equals(loginUserId)
							&& rowMap.get("WorkCenter").toString().trim().equals(workCenter)) {
						canEdit = true;
					}

					if (rowMap.get("UseFlag").toString().trim().toUpperCase().equals("T")
							&& !rowMap.get("UserId").toString().trim().toUpperCase().equals(loginUserId)) { // Other
																											// one
																											// is
																											// editing
																											// the
																											// work
																											// center
						useFlag = true;

						inUseUserId = rowMap.get("UserId").toString().trim();
						inUseWorkCenter = rowMap.get("WorkCenter").toString().trim();
					}
				}

				if (useFlag) {// In use
					returnResult = 1 + "," + inUseUserId + "," + inUseWorkCenter;
				}

				if (!canEdit) {// Don't have the privilege to edit
					returnResult = "2";
				}
			} else {
				returnResult = "3";
			}

			if (parameters.get("editFlag") != null && Boolean.valueOf(parameters.get("editFlag").toString())
					&& returnResult.equals("0")) { // If can start to edit, lock
													// the work center first
				parameters.put("userId", loginUserId);
				parameters.put("useFlag", "T");
				eheijunka.updateUserAccessInfo(parameters);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return returnResult;
	}

	/**
	 * get user view and edit pruview
	 * 
	 * @return 0: View 1: Edit 3:No authorization control
	 */
	public int getPruview(Map parameters) {
		int resultFlag = 4;

		try {
			parameters.put("checkAuthControl", true);
			Collection workList = eheijunka.getAuthList(parameters);
			if (workList == null || workList.size() == 0) {
				return 3;
			}
		} catch (Exception e1) {
			e1.printStackTrace();
		}

		// String loginUserId =
		// WebContextFactory.get().getHttpServletRequest().getRemoteUser().toUpperCase();
		// String loginUserId = "TESTID";
		String loginUserId = WebContextFactory.get().getSession().getAttribute("uid").toString().toUpperCase();
		parameters.put("userId", loginUserId);
		try {
			Collection authList = eheijunka.getAuthList(parameters);
			logger.info("getPruview Collention:" + authList);
			if (authList != null && authList.size() > 0) {
				for (Object obj : authList) {
					Map rowMap = (Map) obj;

					if (rowMap.get("authFlag") != null) {
						String authFlag = rowMap.get("authFlag").toString().trim().toUpperCase();
						if (authFlag.indexOf("E") != -1) {
							resultFlag = 1;
						} else if (authFlag.indexOf("V") != -1) {
							resultFlag = 0;
						}
					}

					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("resultFlag=" + resultFlag);

		return resultFlag;
	}

	/**
	 * Unlock work center when not editing
	 * 
	 * @return
	 */
	public int unlockWorkCenter(Map parameters) {
		int resultFlag = 0;
		// String loginUserId =
		// WebContextFactory.get().getHttpServletRequest().getRemoteUser().toUpperCase();
		// String loginUserId = "TESTID";
		String loginUserId = WebContextFactory.get().getSession().getAttribute("uid").toString().toUpperCase();
		parameters.put("userId", loginUserId);
		parameters.put("useFlag", "T");
		try {
			Collection userAccessInfoList = eheijunka.getUserAccessInfoList(parameters);
			if (userAccessInfoList != null && userAccessInfoList.size() > 0) {
				parameters.put("useFlag", "F");
				eheijunka.updateUserAccessInfo(parameters);
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultFlag = 1;
		}

		return resultFlag;
	}

	/**
	 * Download report as excel file
	 * 
	 * @param map
	 * @return
	 * @throws Exception
	 * @throws ParseException
	 */
	public FileTransfer downloadReport(Map map) throws Exception {
		String type = map.get("type").toString().trim();
		String contextPath = WebContextFactory.get().getHttpServletRequest().getRealPath("/");

		String templateFile;
		String fileName = "";
		FileInputStream fis;
		POIFSFileSystem fs;
		HSSFWorkbook workBook = null;

		if (type.equals("unplannedshoporder")) {
			templateFile = contextPath + "/templates/UnplannedShopOrderList.xls";
			fileName = "UnplannedShopOrderList_" + map.get("workCenter").toString().trim();

			fis = new FileInputStream(templateFile);
			fs = new POIFSFileSystem(fis);
			workBook = new HSSFWorkbook(fs);

			// start to get unplanned shop order info
			List resultList = new ArrayList();
			Map rowMap;
			long currentDateTime = Long.valueOf(new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

			Map shopOrderLastEnddatetimeMap = new HashMap();
			Collection shopOrderLastenddatetimeList = eheijunka.getShopOrderLastEnddatetimeList(map);
			Iterator shopOrderLastenddatetimeItr = shopOrderLastenddatetimeList.iterator();
			while (shopOrderLastenddatetimeItr.hasNext()) {
				rowMap = (Map) shopOrderLastenddatetimeItr.next();
				shopOrderLastEnddatetimeMap.put(rowMap.get("shopOrder").toString().trim(),
						rowMap.get("lastEndDateTime").toString().trim());
			}

			// String chjWCStr = "101401,150101";
			// if(map.get("workCenter")!=null&&chjWCStr.indexOf(map.get("workCenter").toString().trim())!=-1){
			// map.put("isCHJWC", true);
			// }

			Collection unplannedShopOrderList = eheijunka.getUnplannedShopOrderList(map);
			Iterator unplannedShopOrderItr = unplannedShopOrderList.iterator();

			String shopOrder;
			double remainHours;
			long lastEndDateTime;

			SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd HHmmss");
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
			String newParentStartDate;
			String newParentStartTime;
			String newChildStartDate;
			String newChildStartTime;
			Date newParentStartDateTime;
			Date newChildStartDateTime;
			String parentViewStr = "";
			String childViewStr = "";
			while (unplannedShopOrderItr.hasNext()) {
				rowMap = (Map) unplannedShopOrderItr.next();
				shopOrder = rowMap.get("ShopOrder").toString().trim();
				remainHours = Double.valueOf(rowMap.get("RemainHours").toString().trim());

				rowMap.put("Name", shopOrder);
				rowMap.put("Duration", remainHours);

				parentViewStr = "";
				childViewStr = "";
				if (rowMap.get("newStartDateP") != null) {
					newParentStartDate = rowMap.get("newStartDateP").toString().trim();
				} else {
					newParentStartDate = "0";
				}
				if (rowMap.get("newStartTimeP") != null) {
					newParentStartTime = rowMap.get("newStartTimeP").toString().trim();
				} else {
					newParentStartTime = "0";
				}
				if (rowMap.get("newStartDateC") != null) {
					newChildStartDate = rowMap.get("newStartDateC").toString().trim();
				} else {
					newChildStartDate = "0";
				}
				if (rowMap.get("newStartTimeC") != null) {
					newChildStartTime = rowMap.get("newStartTimeC").toString().trim();
				} else {
					newChildStartTime = "0";
				}
				if (!newParentStartDate.equals("0") && !newParentStartDate.equals("99999999")) {
					newParentStartDate = String.format("%06d", Integer.valueOf(newParentStartDate));
					newParentStartTime = String.format("%06d", Integer.valueOf(newParentStartTime));
					newParentStartDateTime = sdf1.parse(newParentStartDate + " " + newParentStartTime);
					parentViewStr = dateFormat.format(newParentStartDateTime) + " "
							+ timeFormat.format(newParentStartDateTime);
				} else {
					parentViewStr = newParentStartDate;
				}
				if (!newChildStartDate.equals("0") && !newChildStartDate.equals("99999999")) {
					newChildStartDate = String.format("%06d", Integer.valueOf(newChildStartDate));
					newChildStartTime = String.format("%06d", Integer.valueOf(newChildStartTime));
					newChildStartDateTime = sdf1.parse(newChildStartDate + " " + newChildStartTime);
					childViewStr = dateFormat.format(newChildStartDateTime) + " "
							+ timeFormat.format(newChildStartDateTime);
				} else {
					childViewStr = newChildStartDate;
				}
				if (rowMap.get("sourceP") != null) {
					parentViewStr += " " + rowMap.get("sourceP").toString().trim();
				}
				if (rowMap.get("sourceC") != null) {
					childViewStr += " " + rowMap.get("sourceC").toString().trim();
				}

				rowMap.put("ParentViewStr", parentViewStr);
				rowMap.put("ChildViewStr", childViewStr);

				// If Kanban of the shop order is pass due and shop order was
				// scheduled enough
				boolean addFlag = true;
				if (shopOrderLastEnddatetimeMap.containsKey(shopOrder)) {
					lastEndDateTime = Long.valueOf(shopOrderLastEnddatetimeMap.get(shopOrder).toString().trim());
					if (lastEndDateTime <= currentDateTime) {
						addFlag = false;
					}
				}

				if (addFlag) {
					resultList.add(rowMap);
				}
			}
			//

			// start to write unplanned shop order to excel file
			HSSFCellStyle dateTimeCellStyle = workBook.createCellStyle();
			HSSFDataFormat format = workBook.createDataFormat();
			dateTimeCellStyle.setDataFormat(format.getFormat("yyyy/m/d HH:mm:ss"));

			CellStyle redCellStyle = workBook.createCellStyle();
			Font redFont = workBook.createFont(); //
			redFont.setColor(IndexedColors.RED.getIndex());
			redCellStyle.setFont(redFont);

			CellStyle orangeCellStyle = workBook.createCellStyle();
			Font orangeFont = workBook.createFont(); //
			orangeFont.setColor(IndexedColors.ORANGE.getIndex());
			orangeCellStyle.setFont(orangeFont);

			if (resultList != null && resultList.size() > 0) {
				HSSFSheet sheet = workBook.getSheetAt(0);
				HSSFRow row;
				HSSFCell cell;

				Iterator itr = resultList.iterator();
				int i = 0;
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
				while (itr.hasNext()) {
					rowMap = (Map) itr.next();

					row = sheet.createRow(i + 1);

					cell = row.createCell(0);
					cell.setCellValue(rowMap.get("ShopOrder").toString().trim());

					cell = row.createCell(1);
					cell.setCellValue(rowMap.get("Item").toString().trim());

					cell = row.createCell(2);
					cell.setCellValue(rowMap.get("ItemDescription").toString().trim());

					cell = row.createCell(3);
					cell.setCellValue(rowMap.get("SubFamily").toString().trim());

					cell = row.createCell(4);
					cell.setCellStyle(dateTimeCellStyle);
					cell.setCellValue(sdf.parse(String.valueOf(rowMap.get("OriginalStartDateTime").toString().trim())));

					cell = row.createCell(5);
					if (rowMap.get("delayC") != null && rowMap.get("delayC").toString().trim().equals("Y")) {
						cell.setCellStyle(redCellStyle);
					}
					cell.setCellValue(rowMap.get("ChildViewStr").toString().trim());

					cell = row.createCell(6);
					cell.setCellStyle(dateTimeCellStyle);
					cell.setCellValue(sdf.parse(String.valueOf(rowMap.get("OriginalEndDateTime").toString().trim())));

					cell = row.createCell(7);
					if (rowMap.get("delayP") != null && rowMap.get("delayP").toString().trim().equals("Y")) {
						cell.setCellStyle(orangeCellStyle);
					}
					cell.setCellValue(rowMap.get("ParentViewStr").toString().trim());

					cell = row.createCell(8);
					cell.setCellValue(rowMap.get("RemainHours").toString().trim());

					cell = row.createCell(9);
					cell.setCellValue(rowMap.get("RemainQuantity").toString().trim());

					cell = row.createCell(10);
					cell.setCellValue(rowMap.get("Family").toString().trim());

					cell = row.createCell(11);
					cell.setCellValue(rowMap.get("Priority").toString().trim());

					cell = row.createCell(12);
					cell.setCellValue(rowMap.get("WorkCenter").toString().trim());

					i++;
				}
			}
		} else if (type.equals("kanban")) {
			templateFile = contextPath + "/templates/KanbanList.xls";
			fileName = "KanbanList_" + map.get("workCenter").toString().trim();

			fis = new FileInputStream(templateFile);
			fs = new POIFSFileSystem(fis);
			workBook = new HSSFWorkbook(fs);

			CellStyle pinkCellStyle = workBook.createCellStyle();
			Font pinkFont = workBook.createFont(); //
			pinkFont.setColor(IndexedColors.PINK.getIndex());
			pinkCellStyle.setFont(pinkFont);

			Collection list = eheijunka.getEventList(map);

			if (list != null && list.size() > 0) {
				HSSFSheet sheet = workBook.getSheetAt(0);
				HSSFRow row;
				HSSFCell cell;

				Iterator itr = list.iterator();
				Map rowMap;
				int i = 0;
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
				SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd HHmmss");
				SimpleDateFormat dFormat = new SimpleDateFormat("yyyyMMdd");
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				SimpleDateFormat tFormat = new SimpleDateFormat("HHmmss");
				SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
				DecimalFormat df = new DecimalFormat("#0.000");
				long startDate;
				long startTime;
				long endDate;
				long endTime;
				long updatedDate;
				long updatedTime;
				String newParentStartDate;
				String newParentStartTime;
				String newChildStartDate;
				String newChildStartTime;
				Date newParentStartDateTime;
				Date newChildStartDateTime;
				String parentViewStr = "";
				String childViewStr = "";
				HSSFCellStyle dateTimeCellStyle = workBook.createCellStyle();
				HSSFDataFormat format = workBook.createDataFormat();
				dateTimeCellStyle.setDataFormat(format.getFormat("yyyy/m/d HH:mm:ss"));

				HSSFCellStyle dateCellStyle = workBook.createCellStyle();
				HSSFDataFormat dateformat = workBook.createDataFormat();
				dateCellStyle.setDataFormat(format.getFormat("yyyy/m/d"));

				HSSFCellStyle timeCellStyle = workBook.createCellStyle();
				HSSFDataFormat timeformat = workBook.createDataFormat();
				timeCellStyle.setDataFormat(format.getFormat("HH:mm:ss"));

				Date startDatetime;
				Date endDatetime;
				double duration;
				double hours;

				String orginalEndDateInfo = "";
				String originalEndDateTimeRemark;

				while (itr.hasNext()) {
					rowMap = (Map) itr.next();

					row = sheet.createRow(i + 1);

					cell = row.createCell(0);
					cell.setCellValue(rowMap.get("WorkCenter").toString().trim()); // WC#

					cell = row.createCell(1);
					cell.setCellValue(rowMap.get("ShopOrder").toString().trim()); // SO#

					cell = row.createCell(2);
					cell.setCellValue(rowMap.get("ResourceId").toString().trim()); // Machine

					if (rowMap.get("Family") != null) {
						cell = row.createCell(3);
						cell.setCellValue(rowMap.get("Family").toString().trim()); // Family
					}

					if (rowMap.get("SubFamily") != null) {
						cell = row.createCell(4);
						cell.setCellValue(rowMap.get("SubFamily").toString().trim()); // Sun-Family
					}

					if (rowMap.get("Item") != null) {
						cell = row.createCell(5);
						cell.setCellValue(rowMap.get("Item").toString().trim()); // Item
					}

					if (rowMap.get("ItemDescription") != null) {
						cell = row.createCell(6);
						cell.setCellValue(rowMap.get("ItemDescription").toString().trim()); // Item
																							// Description
					}

					if (rowMap.get("Priority") != null) {
						cell = row.createCell(7);
						cell.setCellValue(rowMap.get("Priority").toString().trim()); // Shop
																						// Order
																						// Priority
					}

					if (rowMap.get("Title") != null) {
						cell = row.createCell(8);
						cell.setCellValue(rowMap.get("Title").toString().trim()); // Title
					}

					if (rowMap.get("Quantity") != null) {
						cell = row.createCell(9);
						cell.setCellValue(rowMap.get("Quantity").toString().trim()); // Quantity
					}

					if (rowMap.get("Hours") != null) {
						cell = row.createCell(10);
						cell.setCellValue(rowMap.get("Hours").toString().trim()); // Hours
					}

					startDate = Long.valueOf(rowMap.get("startDate").toString().trim());
					startTime = Long.valueOf(rowMap.get("startTime").toString().trim());
					endDate = Long.valueOf(rowMap.get("endDate").toString().trim());
					endTime = Long.valueOf(rowMap.get("endTime").toString().trim());

					cell = row.createCell(11);
					cell.setCellStyle(dateCellStyle);
					// cell.setCellValue(dFormat.parse(String.valueOf(startDate)));
					cell.setCellValue(sdf.parse(String.valueOf(startDate * 1000000 + startTime)));

					cell = row.createCell(12);
					cell.setCellStyle(timeCellStyle);
					cell.setCellValue(sdf.parse(String.valueOf(startDate * 1000000 + startTime)));
					// cell.setCellValue(tFormat.parse(addPrefix(String.valueOf(startTime),6,"0")));

					parentViewStr = "";
					childViewStr = "";
					if (rowMap.get("newStartDateP") != null) {
						newParentStartDate = rowMap.get("newStartDateP").toString().trim();
					} else {
						newParentStartDate = "0";
					}
					if (rowMap.get("newStartTimeP") != null) {
						newParentStartTime = rowMap.get("newStartTimeP").toString().trim();
					} else {
						newParentStartTime = "0";
					}
					if (rowMap.get("newStartDateC") != null) {
						newChildStartDate = rowMap.get("newStartDateC").toString().trim();
					} else {
						newChildStartDate = "0";
					}
					if (rowMap.get("newStartTimeC") != null) {
						newChildStartTime = rowMap.get("newStartTimeC").toString().trim();
					} else {
						newChildStartTime = "0";
					}
					if (!newParentStartDate.equals("0") && !newParentStartDate.equals("99999999")) {
						newParentStartDate = String.format("%06d", Integer.valueOf(newParentStartDate));
						newParentStartTime = String.format("%06d", Integer.valueOf(newParentStartTime));
						newParentStartDateTime = sdf1.parse(newParentStartDate + " " + newParentStartTime);
						parentViewStr = dateFormat.format(newParentStartDateTime) + " "
								+ timeFormat.format(newParentStartDateTime);
					} else {
						parentViewStr = newParentStartDate;
					}
					if (!newChildStartDate.equals("0") && !newChildStartDate.equals("99999999")) {
						newChildStartDate = String.format("%06d", Integer.valueOf(newChildStartDate));
						newChildStartTime = String.format("%06d", Integer.valueOf(newChildStartTime));
						newChildStartDateTime = sdf1.parse(newChildStartDate + " " + newChildStartTime);
						childViewStr = dateFormat.format(newChildStartDateTime) + " "
								+ timeFormat.format(newChildStartDateTime);
					} else {
						childViewStr = newChildStartDate;
					}
					if (rowMap.get("sourceP") != null) {
						parentViewStr += " " + rowMap.get("sourceP").toString().trim();
					}
					if (rowMap.get("sourceC") != null) {
						childViewStr += " " + rowMap.get("sourceC").toString().trim();
					}

					cell = row.createCell(13);
					cell.setCellValue(childViewStr);

					if (rowMap.get("delayC") != null) {
						cell = row.createCell(14);
						cell.setCellValue(rowMap.get("delayC").toString().trim());
					}

					cell = row.createCell(15);
					cell.setCellStyle(dateCellStyle);
					// cell.setCellValue(dFormat.parse(String.valueOf(endDate)));
					cell.setCellValue(sdf.parse(String.valueOf(endDate * 1000000 + endTime)));

					cell = row.createCell(16);
					cell.setCellStyle(timeCellStyle);
					cell.setCellValue(sdf.parse(String.valueOf(endDate * 1000000 + endTime)));
					// cell.setCellValue(tFormat.parse(addPrefix(String.valueOf(endTime),6,"0")));

					cell = row.createCell(17);
					cell.setCellValue(parentViewStr);

					if (rowMap.get("delayP") != null) {
						cell = row.createCell(18);
						cell.setCellValue(rowMap.get("delayP").toString().trim());
					}

					if (rowMap.get("EventType").toString().trim().equals("PD")) {
						hours = Double.valueOf(rowMap.get("Hours").toString().trim());
						startDatetime = sdf1.parse(startDate + " " + String.format("%06d", startTime));
						endDatetime = sdf1.parse(endDate + " " + String.format("%06d", endTime));
						duration = (endDatetime.getTime() - startDatetime.getTime()) / (double) (1000 * 60 * 60);
						cell = row.createCell(19);
						cell.setCellValue(df.format(hours - duration)); // Hours
					}

					if (rowMap.get("updatedDate") != null) {
						updatedDate = Long.valueOf(rowMap.get("updatedDate").toString().trim());
						updatedTime = Long.valueOf(rowMap.get("updatedTime").toString().trim());

						cell = row.createCell(20);
						cell.setCellStyle(dateTimeCellStyle);
						cell.setCellValue(sdf.parse(String.valueOf(updatedDate * 1000000 + updatedTime)));
					}

					cell = row.createCell(21);
					if (rowMap.get("EventType").toString().trim().equals("PD")) { // Production
																					// Kanban
						cell.setCellValue("Production");
					} else {
						cell.setCellValue("Other");
					}

					if (rowMap.get("Status") != null) {
						cell = row.createCell(22);
						cell.setCellValue(rowMap.get("Status").toString().trim());
					}

					if (rowMap.get("OriginalEndDateTimeRemark") != null
							&& !rowMap.get("OriginalEndDateTimeRemark").toString().trim().equals("")) {
						cell = row.createCell(23);

						originalEndDateTimeRemark = rowMap.get("OriginalEndDateTimeRemark").toString().trim();
						orginalEndDateInfo = originalEndDateTimeRemark.substring(4, 6) + "/"
								+ originalEndDateTimeRemark.substring(6, 8);
						if (rowMap.get("RealEndDate") != null) {
							long orginalEndDateTime = Long.valueOf(originalEndDateTimeRemark);
							long realEndDate = Long.valueOf(rowMap.get("RealEndDate").toString().trim());
							long realEndTime = Long.valueOf(rowMap.get("RealEndTime").toString().trim());
							if (((realEndDate * 1000000) + realEndTime) > orginalEndDateTime) {
								cell.setCellStyle(pinkCellStyle);
							}
						}

						cell.setCellValue(orginalEndDateInfo);
					}

					i++;
				}
			}
		}

		if (workBook != null) {
			ByteArrayOutputStream buffer = new ByteArrayOutputStream();
			workBook.write(buffer);
			return new FileTransfer(fileName + ".xls", "application/xls", buffer.toByteArray());
		} else {
			return null;
		}
	}

	/**
	 * Calculate parent/child view
	 * 
	 * @param parameters
	 * @return
	 */
	public int parentChildView(Map parameters) {
		int resultFlag = 0;
		try {
			// Call parent/child view for shop order
			// eheijunka.callParnetChildView(parameters);
			Map shopOrderRowMap;
			Map prntRowMap;
			Map chldRowMap;
			long lngOrdRlsDte = 0;
			long lngOrdRlsTme = 0;
			long lngOrdDueDte = 0;
			long lngOrdDueTme = 0;
			String strPrntOrd = "";
			String strPrntDly = "";
			long lngPrntRlsDte = 0;
			long lngPrntRlsTme = 0;
			String strChldOrd = "";
			String strChldDly = "";
			long lngChldDueDte = 0;
			long lngChldDueTme = 0;

			// Initialize eh0050pf
			eheijunka.delPrntChldViewbyWC(parameters);

			Collection getShopOrderByWC = eheijunka.getShopOrderByWC(parameters);
			Iterator getShopOrderByWCItr = getShopOrderByWC.iterator();
			while (getShopOrderByWCItr.hasNext()) {
				shopOrderRowMap = (Map) getShopOrderByWCItr.next();
				lngOrdRlsDte = Long.valueOf(shopOrderRowMap.get("strdte").toString().trim());
				lngOrdRlsTme = Long.valueOf(shopOrderRowMap.get("strtme").toString().trim());
				lngOrdDueDte = Long.valueOf(shopOrderRowMap.get("enddte").toString().trim());
				lngOrdDueTme = Long.valueOf(shopOrderRowMap.get("endtme").toString().trim());

				Map shopOrderParm = new HashMap();
				shopOrderParm.put("ord_num", shopOrderRowMap.get("ord_num").toString().trim());
				shopOrderParm.put("ord_op", Integer.valueOf(shopOrderRowMap.get("ord_op").toString().trim()));
				shopOrderParm.put("plant", shopOrderRowMap.get("plant").toString().trim());
				// get parent view data
				Collection getPrntViewData = eheijunka.getPrntViewData(shopOrderParm);
				if (getPrntViewData != null && getPrntViewData.size() > 0) {
					Iterator getPrntViewDataItr = getPrntViewData.iterator();
					prntRowMap = (Map) getPrntViewDataItr.next();
					strPrntOrd = prntRowMap.get("prnt_ord").toString().trim();
					lngPrntRlsDte = Long.valueOf(prntRowMap.get("bct_enddte").toString().trim());
					lngPrntRlsTme = Long.valueOf(prntRowMap.get("bct_endtme").toString().trim());
					if (lngOrdDueDte * 1000000 + lngOrdDueTme > lngPrntRlsDte * 1000000 + lngPrntRlsTme) {
						strPrntDly = "Y";
					}
				}

				// get child view data
				Collection getChldViewData = eheijunka.getChldViewData(shopOrderParm);
				if (getChldViewData != null && getChldViewData.size() > 0) {
					Iterator getChldViewDataItr = getChldViewData.iterator();
					chldRowMap = (Map) getChldViewDataItr.next();
					strChldOrd = chldRowMap.get("chld_ord").toString().trim();
					lngChldDueDte = Long.valueOf(chldRowMap.get("sup_org_duedte").toString().trim());
					lngChldDueTme = Long.valueOf(chldRowMap.get("sup_org_duetme").toString().trim());
					if (lngOrdRlsDte * 1000000 + lngOrdRlsTme < lngChldDueDte * 1000000 + lngChldDueTme) {
						strPrntDly = "Y";
					}
				}

				// write child/parent view data into eh0050pf
				Map prntChldParm = new HashMap();
				prntChldParm.put("plant", shopOrderRowMap.get("plant").toString().trim());
				prntChldParm.put("ord_num", shopOrderRowMap.get("ord_num").toString().trim());
				prntChldParm.put("ord_op", Integer.valueOf(shopOrderRowMap.get("ord_op").toString().trim()));
				prntChldParm.put("chld_duedte", lngChldDueDte);
				prntChldParm.put("chld_duetme", lngChldDueTme);
				prntChldParm.put("chld_ord", strChldOrd);
				prntChldParm.put("chld_dly", strChldDly);
				prntChldParm.put("prnt_rlsdte", lngPrntRlsDte);
				prntChldParm.put("prnt_rlstme", lngPrntRlsTme);
				prntChldParm.put("prnt_ord", strPrntOrd);
				prntChldParm.put("prnt_dly", strPrntDly);
				eheijunka.insPrntChldView(prntChldParm);

			}

		} catch (Exception e) {
			e.printStackTrace();
			resultFlag = 1;
		}

		return resultFlag;
	}

	public String addPrefix(String inStr, int length, String appendStr) {
		String outStr = "";
		if (inStr.length() < length) {
			for (int i = 0; i < length - inStr.length(); i++) {
				outStr += appendStr;
			}
		}
		return outStr + inStr;
	}

	public Collection login(Map parameters) throws Exception {
		
		Collection userList = eheijunka.checkUserLogin(parameters);
		
		return userList;
	}

	private Date Date(long l) {
		// TODO Auto-generated method stub
		return null;
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
		Iterator getShopOrderByWithRtnPlantItr = getShopOrderWithRtnByPlant.iterator();
		// get FG information
		while (getShopOrderByWithRtnPlantItr.hasNext()) {
			ordRowMap = (Map) getShopOrderByWithRtnPlantItr.next();
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
					long tmpDT = dteDueDT.getTime() - (long) ((runHrs / 60 + othHrs) * 60 * 60 * 1000);
					dteRlsDT = new Date(tmpDT);
					lngRlsDte = Long.valueOf(dateYMD8.format(dteRlsDT));
					lngRlsTme = Long.valueOf(timeHMS6.format(dteRlsDT));
				} else {
					// forward calculation
					dteRlsDT = datetime14.parse(String.valueOf(lngRlsDte * 1000000 + lngRlsTme));
					long tmpDT = dteRlsDT.getTime() + (long) ((runHrs / 60 + othHrs) * 60 * 60 * 1000);
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
				shopOrderRtnParm.put("ostrdte", lngRlsDte);
				shopOrderRtnParm.put("ostrtme", lngRlsTme);
				shopOrderRtnParm.put("oenddte", lngDueDte);
				shopOrderRtnParm.put("oendtme", lngDueTme);
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
		double rtn_othHrs;
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
				rtn_othHrs = Double.valueOf(rtnRowMap.get("rtn_othhrs").toString().trim());
				reqQty = Double.valueOf(rtnRowMap.get("req_qty").toString().trim());
				batch = Double.valueOf(rtnRowMap.get("batch").toString().trim());
				runHrs = (reqQty / batch * rtn_runHrs / 60) + rtn_othHrs;
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
		
	/**
	 * Get assigned shop order list by work center (return json string)
	 * 
	 * @param parameters
	 * @return
	 */
	public String getPegChkCompltList(Map parameters) {
		//parameters: plant,workcenter,item,parm_po,parm_so,parm_pl,parm_upd	
		
		Collection resultList = new ArrayList();
		
		try {
			//update data
			if (parameters.get("parm_upd").toString().trim().equals("Y")) {
				
				eheijunka.execBalDemSupByPlant(parameters);
				
			};
			
			long currentDateTime = Long.valueOf(new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

			Map rowMap = new HashMap();
			Collection getPegChkCompltList = eheijunka.getPegChkCompltList(parameters);
			Iterator getPegChkCompltListItr = getPegChkCompltList.iterator();
			while (getPegChkCompltListItr.hasNext()) {
				rowMap = (Map) getPegChkCompltListItr.next();
				resultList.add(rowMap);
			}	
						
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
		JSONArray jsonArry = new JSONArray();
		jsonArry.addAll(resultList);
		String jsonString = "{data :" + jsonArry.toString() + "}";
		return jsonString;
		
	}
	
	/**
	 * Get assigned shop order list by work center (return json string)
	 * 
	 * @param parameters
	 * @return
	 */
	public String getPegChkCompltDtlList(Map parameters) {
		//parameters: plant,ordertype,order
				
		Collection resultList = new ArrayList();
		
		try {
			
			long currentDateTime = Long.valueOf(new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

			Map rowMap = new HashMap();
			Collection getPegChkCompltDtlList = eheijunka.getPegChkCompltDtlList(parameters);
			Iterator getPegChkCompltDtlListItr = getPegChkCompltDtlList.iterator();
			while (getPegChkCompltDtlListItr.hasNext()) {
				rowMap = (Map) getPegChkCompltDtlListItr.next();
				resultList.add(rowMap);
			}						
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
		JSONArray jsonArry = new JSONArray();
		jsonArry.addAll(resultList);
		String jsonString = "{data :" + jsonArry.toString() + "}";
		return jsonString;
		
	}
	
	public void AutoDspByWrkc (Map Parameters) throws Exception {
		//Parameters: plant, wrkc, frzDays
		
		Map ordRowMap;
		double runHrs = 0;
		String mach = "";
		String ord = "";
		int op = 0;
		long lngStrDt = 0;
		long lngEndDt = 0;
		long lngChldDt = 0;
		long wrkc = 0;
		Date dteStrDt;
		Date dteEndDt;
		
		//get minimum start date
		long lngMinStrDte = 0;
		long lngMinStrDt = 0;
		long frzDays = 0;
		long lngToday = 0;
		Date dteToday;

		SimpleDateFormat datetime14 = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateYMD8 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeHMS6 = new SimpleDateFormat("HHmmss");

		frzDays = Long.valueOf(Parameters.get("frzDays").toString().trim());
		lngToday = Long.valueOf(datetime14.format(new Date()));
		dteToday = datetime14.parse(String.valueOf(datetime14.format(new Date())));
		long tmpDt = dteToday.getTime() + (long) (frzDays * 24 * 60 * 60 * 1000);
		lngMinStrDte = Long.valueOf(dateYMD8.format(tmpDt));
		lngMinStrDt = lngMinStrDte * 1000000;
		
		//clear kanban behind minimum start date (exclude fixed cards)
		Parameters.put("minStrDte", lngMinStrDte);
		eheijunka.delOrdBehindMinDte(Parameters);
		
		if (Parameters.get("opt").toString().trim().equals("vchld")) {
			//by chld view
			Collection getDspShopOrderByChld = eheijunka.getDspShopOrderByChld(Parameters);
			Iterator getDspShopOrderByChldItr = getDspShopOrderByChld.iterator();
			
			while (getDspShopOrderByChldItr.hasNext()) {
				ordRowMap = (Map) getDspShopOrderByChldItr.next();
				
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
				
				// if start date/time earlier than child view, get child view as start date/time
				lngChldDt = Long.valueOf(ordRowMap.get("e1sdt").toString().trim());
				if (lngStrDt < lngChldDt) {
					lngStrDt = lngChldDt;
				}
				
				runHrs = Double.valueOf(ordRowMap.get("run_hrs").toString().trim());
				dteStrDt = datetime14.parse(String.valueOf(lngStrDt));
				long lngTmpDt = dteStrDt.getTime() + (long) (runHrs * 60 * 60 * 1000);
				dteEndDt = new Date(lngTmpDt);
				lngEndDt = Long.valueOf(datetime14.format(dteEndDt));
				ord = ordRowMap.get("ord_num").toString().trim();
				op = Integer.valueOf(ordRowMap.get("ord_op").toString().trim());
				wrkc = Long.valueOf(ordRowMap.get("wrkc").toString().trim());

				// dispatching in eheijunka
				Map dspOrdParm = new HashMap();
				dspOrdParm.put("e2id", "E2");
				dspOrdParm.put("wrkc", wrkc);
				dspOrdParm.put("plant", ordRowMap.get("plant").toString().trim());
				dspOrdParm.put("ord_num", ord);
				dspOrdParm.put("ord_op", op);
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
		} else {
			// by bcp view
			Collection getDspShopOrderByBcp = eheijunka.getDspShopOrderByBcp(Parameters);
			Iterator getDspShopOrderByBcpItr = getDspShopOrderByBcp.iterator();
			
			while (getDspShopOrderByBcpItr.hasNext()) {
				ordRowMap = (Map) getDspShopOrderByBcpItr.next();
				
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
				
				// if start date/time earlier than child view, get child view as start date/time
				lngChldDt = Long.valueOf(ordRowMap.get("e1sdt").toString().trim());
				if (lngStrDt < lngChldDt) {
					lngStrDt = lngChldDt;
				}
				
				runHrs = Double.valueOf(ordRowMap.get("run_hrs").toString().trim());
				dteStrDt = datetime14.parse(String.valueOf(lngStrDt));
				long lngTmpDt = dteStrDt.getTime() + (long) (runHrs * 60 * 60 * 1000);
				dteEndDt = new Date(lngTmpDt);
				lngEndDt = Long.valueOf(datetime14.format(dteEndDt));
				ord = ordRowMap.get("ord_num").toString().trim();
				op = Integer.valueOf(ordRowMap.get("ord_op").toString().trim());
				wrkc = Long.valueOf(ordRowMap.get("wrkc").toString().trim());

				// dispatching in eheijunka
				Map dspOrdParm = new HashMap();
				dspOrdParm.put("e2id", "E2");
				dspOrdParm.put("wrkc", wrkc);
				dspOrdParm.put("plant", ordRowMap.get("plant").toString().trim());
				dspOrdParm.put("ord_num", ord);
				dspOrdParm.put("ord_op", op);
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

		}
		
	}
	
	public void CalChldView(Map Parameters) throws Exception {
	//Parameters: plant, wrkc		
		try {
			// Call parent/child view for shop order
			// eheijunka.callParnetChildView(parameters);
			Map shopOrderRowMap;
			Map prntRowMap;
			Map chldRowMap;
			long lngOrdRlsDte = 0;
			long lngOrdRlsTme = 0;
			long lngOrdDueDte = 0;
			long lngOrdDueTme = 0;
			String strPrntOrd = "";
			String strPrntDly = "";
			long lngPrntRlsDte = 0;
			long lngPrntRlsTme = 0;
			String strChldOrd = "";
			String strChldDly = "";
			long lngChldDueDte = 0;
			long lngChldDueTme = 0;

			// Initialize eh0050pf
			eheijunka.delPrntChldViewbyWC(Parameters);

			Collection getShopOrderByWC = eheijunka.getShopOrderByWC(Parameters);
			Iterator getShopOrderByWCItr = getShopOrderByWC.iterator();
			while (getShopOrderByWCItr.hasNext()) {
				shopOrderRowMap = (Map) getShopOrderByWCItr.next();
				lngOrdRlsDte = Long.valueOf(shopOrderRowMap.get("strdte").toString().trim());
				lngOrdRlsTme = Long.valueOf(shopOrderRowMap.get("strtme").toString().trim());
				lngOrdDueDte = Long.valueOf(shopOrderRowMap.get("enddte").toString().trim());
				lngOrdDueTme = Long.valueOf(shopOrderRowMap.get("endtme").toString().trim());

				Map shopOrderParm = new HashMap();
				shopOrderParm.put("ord_num", shopOrderRowMap.get("ord_num").toString().trim());
				shopOrderParm.put("ord_op", Integer.valueOf(shopOrderRowMap.get("ord_op").toString().trim()));
				shopOrderParm.put("plant", shopOrderRowMap.get("plant").toString().trim());
				// get parent view data
				Collection getPrntViewData = eheijunka.getPrntViewData(shopOrderParm);
				if (getPrntViewData != null && getPrntViewData.size() > 0) {
					Iterator getPrntViewDataItr = getPrntViewData.iterator();
					prntRowMap = (Map) getPrntViewDataItr.next();
					strPrntOrd = prntRowMap.get("prnt_ord").toString().trim();
					lngPrntRlsDte = Long.valueOf(prntRowMap.get("bct_enddte").toString().trim());
					lngPrntRlsTme = Long.valueOf(prntRowMap.get("bct_endtme").toString().trim());
					if (lngOrdDueDte * 1000000 + lngOrdDueTme > lngPrntRlsDte * 1000000 + lngPrntRlsTme) {
						strPrntDly = "Y";
					}
				}

				// get child view data
				Collection getChldViewData = eheijunka.getChldViewData(shopOrderParm);
				if (getChldViewData != null && getChldViewData.size() > 0) {
					Iterator getChldViewDataItr = getChldViewData.iterator();
					chldRowMap = (Map) getChldViewDataItr.next();
					strChldOrd = chldRowMap.get("chld_ord").toString().trim();
					lngChldDueDte = Long.valueOf(chldRowMap.get("sup_org_duedte").toString().trim());
					lngChldDueTme = Long.valueOf(chldRowMap.get("sup_org_duetme").toString().trim());
					if (lngOrdRlsDte * 1000000 + lngOrdRlsTme < lngChldDueDte * 1000000 + lngChldDueTme) {
						strPrntDly = "Y";
					}
				}

				// write child/parent view data into eh0050pf
				Map prntChldParm = new HashMap();
				prntChldParm.put("plant", shopOrderRowMap.get("plant").toString().trim());
				prntChldParm.put("ord_num", shopOrderRowMap.get("ord_num").toString().trim());
				prntChldParm.put("ord_op", Integer.valueOf(shopOrderRowMap.get("ord_op").toString().trim()));
				prntChldParm.put("chld_duedte", lngChldDueDte);
				prntChldParm.put("chld_duetme", lngChldDueTme);
				prntChldParm.put("chld_ord", strChldOrd);
				prntChldParm.put("chld_dly", strChldDly);
				prntChldParm.put("prnt_rlsdte", lngPrntRlsDte);
				prntChldParm.put("prnt_rlstme", lngPrntRlsTme);
				prntChldParm.put("prnt_ord", strPrntOrd);
				prntChldParm.put("prnt_dly", strPrntDly);
				eheijunka.insPrntChldView(prntChldParm);

			}

		} catch (Exception e) {
			e.printStackTrace();
		}	
		
	}
	
	
	public void BalanceByWrkc(Map Parameters) throws Exception {
		//Parameters: plant, wrkc
		
		Map verParm = new HashMap();		
		
		String version = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		
		//initialize tmp_demand, tmp_supply, tmp_itemlist
		eheijunka.delTmpDmd(Parameters);
		eheijunka.delTmpSup(Parameters);
		eheijunka.delTmpItemList(Parameters);
				
		//collect item list
		verParm.put("plant", Parameters.get("plant").toString().trim());
		verParm.put("wrkc", Integer.valueOf(Parameters.get("wrkc").toString().trim()));
		verParm.put("version", version);
		eheijunka.insTmpItemListByWrkc(verParm);
		
		//get supply
		eheijunka.insSupOH(verParm);		
		
		eheijunka.insSupPO(verParm);
		
		eheijunka.insSupSO(verParm);
		
		eheijunka.insSupPL(verParm);
				
		//get demand
		eheijunka.insDmdSO(verParm);       //demand from shop order
		eheijunka.insDmdPlnOrd(verParm);   //demand from plan order
		
		//balance demand and supply
		this.BalanceDmdSup(verParm);
		
		//initialize tmp_assign_dtl
		eheijunka.delTmpAssignDtlByWrkc(verParm);

		//write detail record into peg_assign_dtl
		eheijunka.insTmpAssignDtl(verParm);	
		
	}
	
	public void BalDmdSup(Map parameters) throws Exception {
		//Parameters: plant, version

		//eheijunka.iniTmpTable(parameters);
		
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
	
}
