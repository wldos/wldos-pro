/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.cms.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

/**
 * 点赞、收藏实体表。
 *
 * @author 元悉宇宙
 * @date 2021/8/19
 * @version 1.0
 */
@Table
public class KStars {
	@Id
	private Long id;

	/** 发布的各种内容：帖子、产品、作品、评论等 */
	private Long objectId;

	private Long userId;

	private String stars;

	private String likes;

	public KStars() {
	}

	public static KStars of(Long id, Long objectId, Long userId, String stars, String likes) {
		return new KStars(id, objectId, userId, stars, likes);
	}

	private KStars(Long id, Long objectId, Long userId, String stars, String likes) {
		this.id = id;
		this.objectId = objectId;
		this.userId = userId;
		this.stars = stars;
		this.likes = likes;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getObjectId() {
		return objectId;
	}

	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getStars() {
		return stars;
	}

	public void setStars(String stars) {
		this.stars = stars;
	}

	public String getLikes() {
		return likes;
	}

	public void setLikes(String likes) {
		this.likes = likes;
	}
}
