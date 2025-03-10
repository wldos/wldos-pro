/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.cms.controller;

import java.util.Map;

import com.wldos.framework.mvc.controller.EntityController;
import com.wldos.cms.entity.KPubs;
import com.wldos.cms.service.PubService;
import com.wldos.cms.vo.AuditPub;
import com.wldos.common.Constants;
import com.wldos.common.res.PageQuery;
import com.wldos.common.res.PageableResult;
import com.wldos.platform.core.enums.PubTypeEnum;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 内容管理controller。
 *
 * @author 元悉宇宙
 * @date 2021/6/12
 * @version 1.0
 */
@RequestMapping("/admin/cms/pub")
@RestController
public class PubController extends EntityController<PubService, KPubs> {

	/**
	 * 作品元素列表，作品内的章节、剧集或附件等
	 *
	 * @return 内容列表
	 */
	@RequestMapping("chapter")
	public PageableResult<AuditPub> adminPosts(@RequestParam Map<String, Object> params) {

		//查询列表数据
		PageQuery pageQuery = new PageQuery(params);
		pageQuery.pushFilter("pubType", PubTypeEnum.listSubType());
		// 业务对象需要作多租隔离处理：当前域-->所有分类 + 当前租户 => 当前管理员可管对象
		this.applyTenantFilter(pageQuery);

		return this.service.queryAdminPubs(this.getDomainId(), pageQuery);
	}

	/**
	 * 作品管理列表
	 *
	 * @return 作品列表
	 */
	@RequestMapping("book")
	public PageableResult<AuditPub> adminBooks(@RequestParam Map<String, Object> params) {

		//查询列表数据
		PageQuery pageQuery = new PageQuery(params);
		pageQuery.pushParam("parentId", Constants.TOP_PUB_ID);
		// 业务对象需要作多租隔离处理：当前域-->所有分类 + 当前租户 => 当前管理员可管对象
		this.applyTenantFilter(pageQuery);

		return this.service.queryAdminPubs(this.getDomainId(), pageQuery);
	}

	/**
	 * 信息管理列表
	 *
	 * @return 信息列表
	 */
	@RequestMapping("info")
	public PageableResult<AuditPub> adminInfo(@RequestParam Map<String, Object> params) {

		//查询列表数据
		PageQuery pageQuery = new PageQuery(params);
		pageQuery.pushParam("pubType", PubTypeEnum.INFO.getName());
		// 业务对象需要作多租隔离处理：当前域-->所有分类 + 当前租户 => 当前管理员可管对象
		this.applyTenantFilter(pageQuery);

		return this.service.queryAdminPubs(this.getDomainId(), pageQuery);
	}

	/**
	 * 内容发布
	 *
	 * @param pub 待发布审核内容
	 * @return 是否
	 */
	@PostMapping("publish")
	public Boolean publishPost(@RequestBody AuditPub pub) {
		this.service.publishPub(pub.getId(), pub.getPubType());
		return Boolean.TRUE;
	}

	/**
	 * 内容下线
	 *
	 * @param pub 待发布审核内容
	 * @return 是否
	 */
	@PostMapping("offline")
	public Boolean offlinePost(@RequestBody AuditPub pub) {
		this.service.offlinePub(pub);
		return Boolean.TRUE;
	}
}
