/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.platform.support.resource.vo;

/**
 * 动态路由绑定。
 *
 * @author 元悉宇宙
 * @date 2023/4/8
 * @version 1.0
 */
public class DynRoute {
	/** 路由path */
	private String path;

	private String module;

	/** 绑定的分类别名 */
	private DynSet conf;

	public DynRoute() {
	}

	public DynRoute(String module, DynSet dynSet) {
		this.module = module;
		this.conf = dynSet;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public DynSet getConf() {
		return conf;
	}

	public void setConf(DynSet conf) {
		this.conf = conf;
	}
}
