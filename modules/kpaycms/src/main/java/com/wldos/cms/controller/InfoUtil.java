/*
 * Copyright (c) 2020 - 2023 wldos.com. All rights reserved.
 * Licensed under the AGPL or a commercial license.
 * For AGPL see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.cms.controller;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wldos.cms.vo.Pub;
import com.wldos.common.utils.ObjectUtils;
import com.wldos.sys.base.dto.PubTypeExt;

import org.springframework.util.ReflectionUtils;

/**
 * 信息工具类。
 *
 * @author 树悉猿
 * @date 2022/1/10
 * @version 1.0
 */
class InfoUtil {

	static Pub extractPubInfo(String json) throws JsonProcessingException {
		Pub pub = new Pub();
		Class<Pub> pubClass = Pub.class;
		ObjectMapper om = new ObjectMapper();

		Map<String, Object> params = om.readValue(json, new TypeReference<Map<String, Object>>() {});

		Map<String, Object> entity = new HashMap<>(); // pub实体参数
		Map<String, Object> remain = new HashMap<>(); // 辅助参数

		params.forEach((key, value) -> {
			if (value == null)
				return;
			Field f = ReflectionUtils.findField(pubClass, key);
			if (f == null) {
				remain.put(key, value);
				return;
			}
			entity.put(key, value);
		});

		if (!entity.isEmpty())
			pub = om.readValue(om.writeValueAsString(entity), new TypeReference<Pub>() {});

		List<PubTypeExt> pubTypeExs = remain.entrySet().parallelStream()
				.filter(entry -> !ObjectUtils.isBlank(entry.getValue()))
				.map(entry -> PubTypeExt.of(entry.getKey(), entry.getValue().toString())).collect(Collectors.toList());

		pub.setPubTypeExt(pubTypeExs);

		return pub;
	}
}
