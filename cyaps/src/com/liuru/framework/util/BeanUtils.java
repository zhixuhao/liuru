package com.liuru.framework.util;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.beanutils.ConstructorUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public final class BeanUtils {

	private static Log logger = LogFactory.getLog(BeanUtils.class);

	/**
	 * map2Bean convert an object of type Map to an object of type <clazz>
	 * 
	 * @param map
	 *            Map map
	 * @param clazz
	 *            Class type of result
	 * @return Object
	 */
	public static final Object map2Bean(Map map, Class clazz) {
		if (map == null) {
			return null;
		}

		Object result = null;
		try {
			if (map != null && !map.isEmpty() && clazz != null) {
				result = ConstructorUtils.invokeConstructor(clazz, null);
				// result = clazz.newInstance();
				Method methods[] = clazz.getDeclaredMethods();
				int length = methods.length;
				String methodNames[] = new String[length];
				for (int i = 0; i < length; i++) {
					methodNames[i] = methods[i].getName();
				}
				for (Iterator iter = map.keySet().iterator(); iter.hasNext();) {
					try {
						String key = (String) iter.next();
						Object para = map.get(key);
						int index = ArrayUtils.indexOf(methodNames, "set"
								+ StringUtils.capitalize(key));
						if (index != -1) {

							Method method = methods[index];
							String paraType = method.getParameterTypes()[0]
									.getName();

							if ("int".equalsIgnoreCase(paraType)) {
								if (null == para) {
									logger
											.warn("褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�兼槸null锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸int锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0");
								} else if (para instanceof Integer) {
									method.invoke(result,
											new Object[] { (Integer) para });
								} else if (para instanceof BigDecimal) {
									method.invoke(result,
											new Object[] { new Integer(
													((BigDecimal) para)
															.toString()) });
								} else {
									throw new RuntimeException(
											"褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�肩殑绫诲瀷鏄�"
													+ para.getClass().getName()
													+ "锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸int锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0");
								}
							}
							// 濡傛灉dto涓殑绫诲瀷涓簂ong
							else if ("long".equalsIgnoreCase(paraType)) {
								if (null == para) {
									logger
											.warn("褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�兼槸null锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸long锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0");
								} else if (para instanceof Long) {
									method.invoke(result,
											new Object[] { (Long) para });
								} else if (para instanceof BigDecimal) {
									method.invoke(result,
											new Object[] { new Long(
													((BigDecimal) para)
															.toString()) });
								} else {
									throw new RuntimeException(
											"褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�肩殑绫诲瀷鏄�"
													+ para.getClass().getName()
													+ "锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸long锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0");

								}
							}
							// 濡傛灉dto涓殑绫诲瀷涓篺loat
							else if ("float".equalsIgnoreCase(paraType)) {
								if (null == para) {
									logger
											.warn("褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�兼槸null锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸float锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0");
								} else if (para instanceof Float) {
									method.invoke(result,
											new Object[] { (Float) para });
								} else if (para instanceof BigDecimal) {
									method.invoke(result,
											new Object[] { new Float(
													((BigDecimal) para)
															.toString()) });
								} else {
									throw new RuntimeException(
											"褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�肩殑绫诲瀷鏄�"
													+ para.getClass().getName()
													+ "锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸float锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0.0");

								}
							}
							// 濡傛灉dto涓殑绫诲瀷涓篸ouble
							else if ("double".equalsIgnoreCase(paraType)) {
								if (null == para) {
									logger
											.warn("褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�兼槸null锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸double锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0.0");
								} else if (para instanceof Double) {
									method.invoke(result,
											new Object[] { (Double) para });
								} else if (para instanceof BigDecimal) {
									method.invoke(result,
											new Object[] { new Double(
													((BigDecimal) para)
															.toString()) });
								} else {
									throw new RuntimeException(
											"褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�肩殑绫诲瀷鏄�"
													+ para.getClass().getName()
													+ "锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸double锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:0.0");

								}
							}
							// 濡傛灉dto涓殑绫诲瀷涓篶har
							else if ("char".equalsIgnoreCase(paraType)) {
								if (null == para) {
									logger
											.warn("褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�兼槸null锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸double锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:涔辩爜");
								} else if (para instanceof Character) {
									method
											.invoke(
													result,
													new Object[] { ((Character) para) });
								} else {
									throw new RuntimeException(
											"褰撴墽琛孏enUtils.map2Bean鏂规硶鏃讹紝浠巑ap涓幏寰楃殑閿负鈥�"
													+ key
													+ "鈥濈殑瀵瑰簲鐨勫�肩殑绫诲瀷鏄�"
													+ para.getClass().getName()
													+ "锛岃�屽湪DTO["
													+ clazz.getName()
													+ "]涓殑灞炴�"
													+ key
													+ "]鐨勭被鍨嬫槸char锛屽鑷村["
													+ key
													+ "]瀵硅薄璧嬪�煎け璐ワ紝灏嗕細浣跨敤DTO涓睘鎬х殑榛樿鍊�:涔辩爜");

								}
							} else {
								method.invoke(result, new Object[] { para });
							}

						}

					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
			return result;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
