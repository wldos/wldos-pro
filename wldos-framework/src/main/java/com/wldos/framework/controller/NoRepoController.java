/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.framework.controller;

import com.wldos.framework.service.NoRepoService;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * 无实体controller，用于没有唯一确定的数据仓(spring data repository)操作的场景。
 *
 * @author 元悉宇宙
 * @date 2021/5/5
 * @version 1.0
 */
public abstract class NoRepoController<S extends NoRepoService> extends AbstractController {

	@Autowired
	protected S service;
}