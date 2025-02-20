/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.handler;

import javax.servlet.http.HttpServletResponse;

import com.wldos.common.Constants;
import com.wldos.common.exception.BaseException;
import com.wldos.common.res.Result;
import com.wldos.support.auth.TokenForbiddenException;
import com.wldos.support.auth.TokenInvalidException;
import com.wldos.support.auth.UserInvalidException;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RefreshScope
@Slf4j
@RestControllerAdvice("com.wldos")
public class GlobalExceptionHandler {
	@Value("${wldos_platform_adminEmail:306991142#qq.com}")
	private String adminEmail;

	@ExceptionHandler(TokenInvalidException.class)
	public Result userTokenExceptionHandler(HttpServletResponse response, TokenInvalidException ex) {
		response.setStatus(401);
		log.error(ex.getMessage());
		return new Result(ex.getStatus(), ex.getMessage());
	}

	@ExceptionHandler(TokenForbiddenException.class)
	public Result tokenForbiddenExceptionHandler(HttpServletResponse response, TokenForbiddenException ex) {
		response.setStatus(403);
		log.error(ex.getMessage());
		return new Result(ex.getStatus(), ex.getMessage());
	}

	@ExceptionHandler(UserInvalidException.class)
	public Result userInvalidExceptionHandler(HttpServletResponse response, UserInvalidException ex) {
		response.setStatus(200);
		log.error(ex.getMessage());
		return new Result(ex.getStatus(), ex.getMessage());
	}

	@ExceptionHandler(BaseException.class)
	public Result baseExceptionHandler(HttpServletResponse response, BaseException ex) {
		log.error(ex.getMessage());
		response.setStatus(200);
		return new Result(ex.getStatus(), ex.getMessage());
	}

	@ExceptionHandler(Exception.class)
	public Result otherExceptionHandler(HttpServletResponse response, Exception ex) {
		response.setStatus(200);
		log.error(ex.getMessage(), ex);
		return new Result(Constants.EX_OTHER_CODE, "Sorry, the server is abnormal, please try again, or contact support: " + this.adminEmail);
	}
}