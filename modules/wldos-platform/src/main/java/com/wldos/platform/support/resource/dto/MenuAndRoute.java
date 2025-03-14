/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.platform.support.resource.dto;

import java.util.List;
import java.util.Map;

import com.wldos.platform.support.resource.vo.Menu;
import com.wldos.platform.support.resource.vo.Route;

/**
 * 菜单和路由。
 *
 * @author 元悉宇宙
 * @date 2021/9/8
 * @version 1.0
 */
public class MenuAndRoute {
	private List<Menu> menu;

	private Map<String, Route> route;

	public MenuAndRoute() {
	}

	public MenuAndRoute(List<Menu> menu, Map<String, Route> route) {
		this.menu = menu;
		this.route = route;
	}

	public List<Menu> getMenu() {
		return menu;
	}

	public void setMenu(List<Menu> menu) {
		this.menu = menu;
	}

	public Map<String, Route> getRoute() {
		return route;
	}

	public void setRoute(Map<String, Route> route) {
		this.route = route;
	}
}
