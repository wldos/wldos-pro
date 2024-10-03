/*
 * Copyright (c) 2020 - 2024 wldos.com. All rights reserved.
 * Licensed under the Apache License Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or http://www.wldos.com or 306991142@qq.com
 *
 */

package com.wldos.common.utils.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.ServletRequest;

import com.wldos.common.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpHeaders;

/**
 * Http请求工具类
 *
 * @author 元悉宇宙
 * @date
 * @version V1.0
 */
public class HttpUtils {
	private static final Logger log = LoggerFactory.getLogger(HttpUtils.class);

	private HttpUtils() {
		throw new IllegalStateException("Utility class");
	}

	public static String getBodyString(ServletRequest request) {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = null;
		try (InputStream inputStream = request.getInputStream()) {
			reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
			String line = "";
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}
		}
		catch (IOException e) {
			log.warn("getBodyString IO异常！");
		}
		finally {
			if (reader != null) {
				try {
					reader.close();
				}
				catch (IOException e) {
					log.error(ObjectUtils.string(e.getMessage()), e);
				}
			}
		}
		return sb.toString();
	}

	/**
	 * 向指定 URL 发送GET方法的请求
	 *
	 * @param url 发送请求的 URL
	 * @param param 请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * @return 所代表远程资源的响应结果
	 */
	public static String sendGet(String url, String param) {
		return sendGet(url, param, StandardCharsets.UTF_8.name());
	}

	/**
	 * 带参数的url
	 *
	 * @param urlWithParams 带get参数的url
	 * @return 返回值
	 */
	public static String sendGet(String urlWithParams) {
		return sendGetFullUrl(urlWithParams, StandardCharsets.UTF_8.name());
	}

	private static final String RECEIVE_TEMPLATE = "recv - {}";

	private static final String KEEP_ALIVE = "Keep-Alive";

	private static String logTemplate(String exception) {
		return "调用HttpUtils.sendSSLPost " + exception + ", url={}, param={}";
	}

	/**
	 * 向指定 URL 发送GET方法的请求
	 *
	 * @param url 发送请求的 URL
	 * @param param 请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * @param contentType 编码类型
	 * @return 所代表远程资源的响应结果
	 */
	public static String sendGet(String url, String param, String contentType) {
		StringBuilder result = new StringBuilder();
		try {
			String urlNameString = url + "?" + param;
			log.info(RECEIVE_TEMPLATE, urlNameString);
			URL realUrl = new URL(urlNameString);
			URLConnection connection = realUrl.openConnection();
			connection.setRequestProperty(HttpHeaders.ACCEPT, "*/*");
			connection.setRequestProperty(HttpHeaders.CONNECTION, KEEP_ALIVE);
			connection.setRequestProperty(HttpHeaders.USER_AGENT, USER_AGENT);
			connection.connect();
			// 缓存读，自动关闭流，无需异常处理时关闭。
			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), contentType));
			String line;
			while ((line = in.readLine()) != null) {
				result.append(line);
			}
			log.info(RECEIVE_TEMPLATE, result);
		}
		catch (Exception e) {
			log.error(logTemplate(ObjectUtils.string(e.getCause())), url, param, e);
		}

		return result.toString();
	}

	/**
	 * 向指定 URL(带参数) 发送GET方法的下载请求
	 *
	 * @param url 发送请求的 URL (带参数)
	 * @return 下载输入流
	 */
	public static InputStream doGetInputStream(String url) {
		try {
			URL realUrl = new URL(url);
			URLConnection connection = realUrl.openConnection();
			connection.setRequestProperty(HttpHeaders.ACCEPT, "*/*");
			connection.setRequestProperty(HttpHeaders.CONNECTION, KEEP_ALIVE);
			connection.setRequestProperty(HttpHeaders.USER_AGENT, USER_AGENT);
			connection.connect();
			// 缓存读，自动关闭流，无需异常处理时关闭。
			return connection.getInputStream();
		}
		catch (Exception e) {
			log.error(logTemplate(ObjectUtils.string(e.getCause())), url, e);
		}

		return null;
	}

	/**
	 * 向指定 URL(带参数) 发送GET方法的请求
	 *
	 * @param url 发送请求的 URL (带参数)
	 * @param contentType 编码类型
	 * @return 所代表远程资源的响应结果
	 */
	public static String sendGetFullUrl(String url, String contentType) {
		StringBuilder result = new StringBuilder();
		try {
			log.info(RECEIVE_TEMPLATE, url);
			URL realUrl = new URL(url);
			URLConnection connection = realUrl.openConnection();
			connection.setRequestProperty(HttpHeaders.ACCEPT, "*/*");
			connection.setRequestProperty(HttpHeaders.CONNECTION, KEEP_ALIVE);
			connection.setRequestProperty(HttpHeaders.USER_AGENT, USER_AGENT);
			connection.connect();
			// 缓存读，自动关闭流，无需异常处理时关闭。
			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), contentType));
			String line;
			while ((line = in.readLine()) != null) {
				result.append(line);
			}
			log.info(RECEIVE_TEMPLATE, result);
		}
		catch (Exception e) {
			log.error(logTemplate(ObjectUtils.string(e.getCause())), url, e);
		}

		return result.toString();
	}

	private static final String USER_AGENT =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

	/**
	 * 向指定 URL 发送POST方法的请求
	 *
	 * @param url 发送请求的 URL
	 * @param param 请求参数，请求参数应该是 contentType 的形式,默认a=v1&b=v2&c=v3形式。
	 * @param contentType 请求头的参数内容类型
	 * @return 所代表远程资源的响应结果
	 */
	public static String sendPost(String url, String param, String contentType) {

		StringBuilder result = new StringBuilder();
		try {
			log.info(RECEIVE_TEMPLATE, url);
			URL realUrl = new URL(url);
			HttpURLConnection conn = (HttpURLConnection) realUrl.openConnection();
			conn.setRequestProperty(HttpHeaders.ACCEPT, "*/*");
			conn.setRequestMethod("POST");
			conn.setUseCaches(false);
			conn.setRequestProperty(HttpHeaders.CONNECTION, KEEP_ALIVE);
			conn.setRequestProperty(HttpHeaders.USER_AGENT, USER_AGENT);
			conn.setRequestProperty(HttpHeaders.ACCEPT_CHARSET, StandardCharsets.UTF_8.name());
			conn.setRequestProperty(HttpHeaders.CONTENT_TYPE, ObjectUtils.isBlank(contentType) ? "application/x-www-form-urlencoded" : contentType);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			// 自动执行重定向
			conn.setInstanceFollowRedirects(true);
			conn.connect();

			OutputStream out = conn.getOutputStream();
			out.write(param.getBytes(StandardCharsets.UTF_8));
			out.flush();
			out.close();
			BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8.name()));
			String line;
			while ((line = in.readLine()) != null) {
				result.append(line);
			}
			in.close();
			log.info(RECEIVE_TEMPLATE, result);

			conn.disconnect();
		}
		catch (Exception e) {
			log.error(logTemplate(ObjectUtils.string(e.getCause())), url, param, e);
		}

		return result.toString();
	}

	public static String sendSSLPost(String url, String param) {
		StringBuilder result = new StringBuilder();
		String urlNameString = url + "?" + param;
		try {
			log.info("sendSSLPost - {}", urlNameString);
			SSLContext sc = SSLContext.getInstance("TLSv1.2");
			sc.init(null, new TrustManager[] { new TrustAnyTrustManager() }, new java.security.SecureRandom());
			URL console = new URL(urlNameString);
			HttpsURLConnection conn = (HttpsURLConnection) console.openConnection();
			conn.setRequestProperty(HttpHeaders.ACCEPT, "*/*");
			conn.setRequestProperty(HttpHeaders.CONNECTION, KEEP_ALIVE);
			conn.setRequestProperty(HttpHeaders.USER_AGENT, USER_AGENT);
			conn.setRequestProperty(HttpHeaders.ACCEPT_CHARSET, StandardCharsets.UTF_8.name());
			conn.setRequestProperty(HttpHeaders.CONTENT_TYPE, StandardCharsets.UTF_8.name());
			conn.setDoOutput(true);
			conn.setDoInput(true);

			conn.setSSLSocketFactory(sc.getSocketFactory());
			conn.setHostnameVerifier(new TrustAnyHostnameVerifier());
			conn.connect();
			InputStream is = conn.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String ret = "";
			while ((ret = br.readLine()) != null) {
				if (!ret.trim().equals("")) {
					result.append(new String(ret.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8.name()));
				}
			}
			log.info(RECEIVE_TEMPLATE, result);
			br.close();
			conn.disconnect();
		}
		catch (Exception e) {
			log.error(logTemplate(ObjectUtils.string(e.getCause())), url, param, e);
		}

		return result.toString();
	}

	private static class TrustAnyTrustManager implements X509TrustManager {
		/**
		 * 客户端检查，防止中间人攻击，待实现
		 *
		 * @param chain 证书链
		 * @param authType 认证类型
		 */
		@Override
		public void checkClientTrusted(X509Certificate[] chain, String authType) {
			log.info("checkClientTrusted {}", authType);
		}

		/**
		 * 服务端验证，防止中间人攻击，待实现
		 *
		 * @param chain 证书链
		 * @param authType 认证类型
		 */
		@Override
		public void checkServerTrusted(X509Certificate[] chain, String authType) {
			log.info("checkServerTrusted {}", authType);
		}

		/**
		 * 获取许可签发者
		 *
		 * @return 签发证书
		 */
		@Override
		public X509Certificate[] getAcceptedIssuers() {
			return new X509Certificate[] {};
		}
	}

	private static class TrustAnyHostnameVerifier implements HostnameVerifier {
		@Override
		public boolean verify(String hostname, SSLSession session) {
			return true;
		}
	}
}