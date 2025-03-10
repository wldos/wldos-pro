/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.platform.core.service;

import com.wldos.common.res.PageableResult;
import com.wldos.framework.common.AuditFields;
import com.wldos.common.enums.DeleteFlagEnum;
import com.wldos.common.enums.ValidStatusEnum;
import com.wldos.common.res.PageQuery;
import com.wldos.framework.mvc.service.EntityService;
import com.wldos.platform.core.dao.AppDao;
import com.wldos.platform.core.entity.WoApp;
import com.wldos.platform.core.entity.WoDomainApp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 应用管理service。
 *
 * @author 元悉宇宙
 * @date 2021/4/28
 * @version 1.0
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class AppService extends EntityService<AppDao, WoApp, Long> {

	/**
	 * 查询应用和子表域预订应用关联
	 *
	 * @param pageQuery 分页参数和查询条件
	 * @return 应用分页数据
	 */
	public PageableResult<WoApp> queryAppForPage(PageQuery pageQuery) {
		pageQuery.appendParam(AuditFields.DELETE_FLAG, DeleteFlagEnum.NORMAL.toString())
				.appendParam(AuditFields.IS_VALID, ValidStatusEnum.VALID.toString()); // 注意枚举类型必须转换为String，否则jdbc模板无法自动转换，会导致查询结果为空

		return this.execQueryForPage(WoApp.class, WoDomainApp.class, "wo_app", "wo_domain_app", "app_id", pageQuery);
	}
}
