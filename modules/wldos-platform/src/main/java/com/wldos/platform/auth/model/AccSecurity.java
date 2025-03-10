/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.platform.auth.model;

/**
 * 账户安全设置。
 *
 * @author 元悉宇宙
 * @date 2021/9/22
 * @version 1.0
 */
public class AccSecurity {
	/** 密码强度 */
	private String passStatus;

	/** 密保手机 */
	private String mobile;

	/** 密保问题 */
	private String secQuest;

	/** 备用邮箱 */
	private String bakEmail;

	/** mfa设备 */
	private String mfa;

	public String getPassStatus() {
		return passStatus;
	}

	public void setPassStatus(String passStatus) {
		this.passStatus = passStatus;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getSecQuest() {
		return secQuest;
	}

	public void setSecQuest(String secQuest) {
		this.secQuest = secQuest;
	}

	public String getBakEmail() {
		return bakEmail;
	}

	public void setBakEmail(String bakEmail) {
		this.bakEmail = bakEmail;
	}

	public String getMfa() {
		return mfa;
	}

	public void setMfa(String mfa) {
		this.mfa = mfa;
	}
}
