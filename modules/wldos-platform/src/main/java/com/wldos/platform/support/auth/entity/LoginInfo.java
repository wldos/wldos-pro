/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.platform.support.auth.entity;

/**
 * 在线用户信息。
 *
 * @author 元悉宇宙
 * @date 2021/5/2
 * @version 1.0
 */
public class LoginInfo {
	/** token ID */
	private String id;

	private long userId;

	private String loginName;

	private String domain;

	private String loginIP;

	private String netLocation;

	private String userAgent;

	private String os;

	private long loginTime;

	public LoginInfo(String id, long userId, String loginName, String domain, String loginIP, String netLocation, String userAgent, String os, long loginTime) {
		this.id = id;
		this.userId = userId;
		this.loginName = loginName;
		this.domain = domain;
		this.loginIP = loginIP;
		this.netLocation = netLocation;
		this.userAgent = userAgent;
		this.os = os;
		this.loginTime = loginTime;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getLoginIP() {
		return loginIP;
	}

	public void setLoginIP(String loginIP) {
		this.loginIP = loginIP;
	}

	public String getNetLocation() {
		return netLocation;
	}

	public void setNetLocation(String netLocation) {
		this.netLocation = netLocation;
	}

	public String getUserAgent() {
		return userAgent;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}

	public String getOs() {
		return os;
	}

	public void setOs(String os) {
		this.os = os;
	}

	public long getLoginTime() {
		return loginTime;
	}

	public void setLoginTime(long loginTime) {
		this.loginTime = loginTime;
	}
}