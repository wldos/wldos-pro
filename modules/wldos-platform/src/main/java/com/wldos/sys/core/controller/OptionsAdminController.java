/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.sys.core.controller;

import java.util.List;

import com.wldos.framework.controller.RepoController;
import com.wldos.support.system.entity.WoOptions;
import com.wldos.sys.base.service.OptionsService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 系统配置相关controller。
 *
 * @author 元悉宇宙
 * @date 2021/5/2
 * @version 1.0
 */
@RestController
@RequestMapping("admin/sys/options")
public class OptionsAdminController extends RepoController<OptionsService, WoOptions> {
	@GetMapping("")
	public List<WoOptions> fetchAllOptions() {
		return this.service.findAll();
	}

}
