/*
 * Copyright (c) 2020 - 2024 wldos.com. All rights reserved.
 * Licensed under the Apache License Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or http://www.wldos.com or 306991142@qq.com
 *
 */

package com.wldos.support.resource.enums;

/**
 * 资源相关枚举值。
 *
 * @author 元悉宇宙
 * @date 2021/4/27
 * @version 1.0
 */
public enum ResourceEnum {

	MENU("菜单", "menu"),
	BUTTON("操作", "button"),
	WEB_SERV("服务", "webServ"),
	DATA_SERV("数据", "dataServ"),
	STATIC("静态", "_static"),
	ADMIN_MENU("管理菜单", "admin_menu"),
	ADMIN_BUTTON("管理操作", "admin_button"),
	OTHER("其他", "other");

	private final String label;

	private final String value;

	ResourceEnum(String label, String value) {
		this.label = label;
		this.value = value;
	}

	public String getLabel() {
		return label;
	}

	public String getValue() {
		return value;
	}

	@Override
	public String toString() {
		return "{label: '" + this.label + "', value: '" + this.value + "'}";
	}
}