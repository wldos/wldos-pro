/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.cms.vo;

/**
 * 剧集。
 *
 * @author 元悉宇宙
 * @date 2021/6/22
 * @version 1.0
 */
public class Series extends Chapter {
	private Long id;

	private String pubTitle;

	private String pubContent;

	private Long parentId;

	private String pubStatus;

	public Series() {
	}

	public Series(Long id, String pubTitle, String pubContent, Long parentId, String pubStatus) {
		this.id = id;
		this.pubTitle = pubTitle;
		this.pubContent = pubContent;
		this.parentId = parentId;
		this.pubStatus = pubStatus;
	}

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

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getPubStatus() {
		return pubStatus;
	}

	public void setPubStatus(String pubStatus) {
		this.pubStatus = pubStatus;
	}

}
