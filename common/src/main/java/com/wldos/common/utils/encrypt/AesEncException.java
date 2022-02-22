/*
 * Copyright (c) 2020 - 2022 wldos.com. All rights reserved.
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.common.utils.encrypt;

/**
 * 加密异常。
 *
 * @author 树悉猿
 * @date 2021/7/15
 * @since 1.0
 */
public class AesEncException extends RuntimeException{

	public AesEncException(String s, Exception e) {
		super(s, e);
	}

	public AesEncException(String s) {
		super(s);
	}
}
