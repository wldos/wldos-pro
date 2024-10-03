/*
 * Copyright (c) 2020 - 2024 wldos.com. All rights reserved.
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or http://www.wldos.com or 306991142@qq.com
 */

package com.wldos.sys.core.repo;

import java.util.List;

import com.wldos.framework.repo.BaseRepo;
import com.wldos.sys.core.entity.WoUsermeta;

/**
 * 帖子扩展数据repository操作类
 *
 * @author 元悉宇宙
 * @date 2021/4/17
 * @version 1.0
 */
public interface UsermetaRepo extends BaseRepo<WoUsermeta, Long> {
	WoUsermeta findByUserIdAndMetaKey(Long userId, String MetaKey);

	List<WoUsermeta> findAllByUserId(Long userId);
}
