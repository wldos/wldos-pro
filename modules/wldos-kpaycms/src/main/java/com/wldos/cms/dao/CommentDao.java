/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.cms.dao;

import java.util.List;

import com.wldos.framework.mvc.dao.BaseDao;
import com.wldos.cms.entity.KComments;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;

/**
 * 评论repository操作类
 *
 * @author 元悉宇宙
 * @date 2021/4/17
 * @version 1.0
 */
public interface CommentDao extends BaseDao<KComments, Long> {

	@Query("select c.* from k_comments c where c.delete_flag=:delFlag and c.approved=:comStatus and c.pub_id=:pubId")
	List<KComments> queryCommentsByPubId(Long pubId, String delFlag, String comStatus);

	@Modifying
	@Query("update k_comments set approved=:comStatus where id=:id")
	void changeCommentStatus(Long id, String comStatus);
}
