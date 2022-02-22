/*
 * Copyright (c) 2020 - 2022 wldos.com. All rights reserved.
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.auth.controller;

import java.util.HashMap;
import java.util.Map;

import com.wldos.auth.service.AuthCodeService;
import com.wldos.base.controller.NoRepoController;
import com.wldos.common.res.Result;
import com.wldos.auth.vo.CaptchaVO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 验证码相关控制器。
 *
 * @author 树悉猿
 * @date 2021/4/29
 * @version 1.0
 */
@RestController
@RequestMapping("authcode")
public class AuthcodeController extends NoRepoController {

	private final AuthCodeService authCodeService;

	public AuthcodeController(AuthCodeService authCodeService) {
		this.authCodeService = authCodeService;
	}

	@GetMapping("code")
	public Result authCode() {
		Map<String, String> map = this.authCodeService.genCode();

		return resJson.format(map);
	}

	@PostMapping("check")
	public Result checkCode(@RequestBody CaptchaVO captchaVO) {
		Map<String, String> res = new HashMap<>();
		String status = "status";
		if (!this.authCodeService.checkCode(captchaVO)) {
			res.put(status, "error");
		}
		else
			res.put(status, "ok");

		return resJson.format(res);
	}
}
