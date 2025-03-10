/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.platform.support.cms.vo;

import java.sql.Timestamp;
import java.util.List;

import com.wldos.platform.support.cms.model.IMeta;
import com.wldos.platform.support.cms.model.KModelMeta;
import com.wldos.platform.support.term.dto.Term;

public class Product extends KModelMeta implements IMeta {

	// 内容pub id
	private Long id;

	private String pubTitle;

	private String pubContent;

	private String pubName;

	private Long parentId;

	private String pubType;

	private String pubMimeType;

	private Long commentCount;

	private Long createBy;

	private Timestamp createTime;

	private Long updateBy;

	private Timestamp updateTime;

	private Long domainId;

	private Long comId;

	private List<Long> termTypeIds; // 一个发布内容可以属于多个分类

	/** 标签列表 */
	private List<Term> tags;

	/** 面包屑及seo元素 */
	private SeoCrumbs seoCrumbs;

	private String realNo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPubTitle() {
		return pubTitle;
	}

	public void setPubTitle(String pubTitle) {
		this.pubTitle = pubTitle;
	}

	public String getPubContent() {
		return pubContent;
	}

	public void setPubContent(String pubContent) {
		this.pubContent = pubContent;
	}

	public String getPubName() {
		return pubName;
	}

	public void setPubName(String pubName) {
		this.pubName = pubName;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getPubType() {
		return pubType;
	}

	public void setPubType(String pubType) {
		this.pubType = pubType;
	}

	public String getPubMimeType() {
		return pubMimeType;
	}

	public void setPubMimeType(String pubMimeType) {
		this.pubMimeType = pubMimeType;
	}

	public Long getCommentCount() {
		return commentCount;
	}

	public void setCommentCount(Long commentCount) {
		this.commentCount = commentCount;
	}

	public Long getCreateBy() {
		return createBy;
	}

	public void setCreateBy(Long createBy) {
		this.createBy = createBy;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(Long updateBy) {
		this.updateBy = updateBy;
	}

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public Long getDomainId() {
		return domainId;
	}

	public void setDomainId(Long domainId) {
		this.domainId = domainId;
	}

	public Long getComId() {
		return comId;
	}

	public void setComId(Long comId) {
		this.comId = comId;
	}

	public List<Long> getTermTypeIds() {
		return termTypeIds;
	}

	public void setTermTypeIds(List<Long> termTypeIds) {
		this.termTypeIds = termTypeIds;
	}

	public List<Term> getTags() {
		return tags;
	}

	public void setTags(List<Term> tags) {
		this.tags = tags;
	}

	public SeoCrumbs getSeoCrumbs() {
		return seoCrumbs;
	}

	public void setSeoCrumbs(SeoCrumbs seoCrumbs) {
		this.seoCrumbs = seoCrumbs;
	}

	public String getRealNo() {
		return realNo;
	}

	public void setRealNo(String realNo) {
		this.realNo = realNo;
	}
}
