package com.liuru.services;

import com.liuru.model.EHeijunka;
import java.io.PrintStream;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class SessionListener
  implements HttpSessionListener
{
  private EHeijunka eheijunka;

  public EHeijunka getEheijunka()
  {
    return this.eheijunka;
  }

  public void setEheijunka(EHeijunka eheijunka) {
    this.eheijunka = eheijunka;
  }

  public void sessionCreated(HttpSessionEvent sessionEvent)
  {
    HttpSession session = sessionEvent.getSession();

    System.out.println("Session created: " + session);
  }

  public void sessionDestroyed(HttpSessionEvent sessionEvent)
  {
    System.out.println("sessionDestroyed....begin");

    HttpSession session = sessionEvent.getSession();

    String loginUserId = "";
    String workCenter = "";
    if (session.getAttribute("loginUserId") != null) {
      loginUserId = session.getAttribute("loginUserId").toString();
    }
    if (session.getAttribute("workCenter") != null) {
      workCenter = session.getAttribute("workCenter").toString();
    }

    if ((!loginUserId.equals("")) && (!workCenter.equals(""))) {
      Map parameters = new HashMap();
      parameters.put("userId", loginUserId);
      parameters.put("workCenter", workCenter);
      parameters.put("useFlag", "T");
      try {
        ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(session.getServletContext());
        EHeijunka eHeijunka = (EHeijunka)ctx.getBean("model-EHeijunka");
        Collection userAccessInfoList = eHeijunka.getUserAccessInfoList(parameters);
        if ((userAccessInfoList != null) && (userAccessInfoList.size() > 0)) {
          System.out.println("hhhhhhhhhhh");
          parameters.put("useFlag", "F");
          eHeijunka.updateUserAccessInfo(parameters);
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    System.out.println("sessionDestroyed......ending");
  }
}