/*
 * Copyright (c) 2020 - 2023 wldos.com. All rights reserved.
 * Licensed under the Apache License Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.common.dto;

/**
 * sql中出现的table。
 *
 * @author 树悉猿
 * @date 2021/12/28
 * @version 1.0
 */
public class SQLTable {
	private String tableName;

	/** 实体类型 */
	private Class<?> type;

	private String alias;

	public SQLTable() {}

	public static SQLTable of(Class<?> type, String alias) {
		return new SQLTable(null, alias, type);
	}

	public static SQLTable of(Class<?> type, String tableName, String alias) {
		return new SQLTable(tableName, alias, type);
	}

	private SQLTable(String tableName, String alias, Class<?> type) {
		this.tableName = tableName;
		this.alias = alias;
		this.type = type;
	}

	public String getTableName() {
		return tableName;
	}

	public String getAlias() {
		return alias;
	}

	public Class<?> getType() {
		return type;
	}
}