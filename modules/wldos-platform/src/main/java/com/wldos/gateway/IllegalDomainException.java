/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.gateway;

import com.wldos.common.Constants;
import com.wldos.common.exception.BaseException;

/**
 * 非法域名请求异常。
 *
 * @author 元悉宇宙
 * @date 2021/8/6
 * @version 1.0
 */
public class IllegalDomainException extends BaseException {

	public IllegalDomainException(String message) {
		super(message, Constants.TOKEN_FORBIDDEN_CODE);
	}
}