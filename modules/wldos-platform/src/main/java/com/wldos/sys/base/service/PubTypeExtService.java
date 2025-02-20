/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.sys.base.service;

import java.util.List;

import com.wldos.framework.service.RepoService;
import com.wldos.support.cms.PubTypeExtOpener;
import com.wldos.support.cms.dto.PubTypeExt;
import com.wldos.sys.base.entity.KModelPubTypeExt;
import com.wldos.sys.base.repo.PubTypeExtRepo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 行业扩展属性service。
 *
 * @author 元悉宇宙
 * @date 2021/6/17
 * @version 1.0
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class PubTypeExtService extends RepoService<PubTypeExtRepo, KModelPubTypeExt, Long> implements PubTypeExtOpener {

	public List<PubTypeExt> queryExtPropsByPubType(String pubType) {
		return this.entityRepo.queryExtPropsByPubType(pubType);
	}
}
