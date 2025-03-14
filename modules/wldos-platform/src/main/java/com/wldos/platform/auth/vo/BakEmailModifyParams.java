/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.platform.auth.vo;

import com.wldos.platform.auth.model.ModifyParams;

/**
 * 备用邮箱修改参数。
 *
 * @author 元悉宇宙
 * @date 2022/5/21
 * @version 1.0
 */
public class BakEmailModifyParams implements ModifyParams {
	/** 登录用户id */
	private Long id;

	private String oldBakEmail;

	private String bakEmail;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOldBakEmail() {
		return oldBakEmail;
	}

	public void setOldBakEmail(String oldBakEmail) {
		this.oldBakEmail = oldBakEmail;
	}

	public String getBakEmail() {
		return bakEmail;
	}

	public void setBakEmail(String bakEmail) {
		this.bakEmail = bakEmail;
	}

	@Override
	public String getOld() {
		return this.oldBakEmail;
	}

	@Override
	public String getNew() {
		return this.bakEmail;
	}
}
