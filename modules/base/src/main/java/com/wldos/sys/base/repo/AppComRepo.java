/*
 * Copyright (c) 2020 - 2022 wldos.com. All rights reserved.
 * Licensed under the AGPL or a commercial license.
 * For AGPL see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.sys.base.repo;

import java.util.List;

import com.wldos.sys.base.entity.WoDomainApp;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

/**
 * 租户领域应用管理仓库操作类。
 *
 * @author 树悉猿
 * @date 2021/4/27
 * @version 1.0
 */
public interface AppComRepo extends PagingAndSortingRepository<WoDomainApp, Long> {

	List<WoDomainApp> findAllByDeleteFlagEqualsAndIsValidEquals(@Param("deleteFlag") String deleteFlag, @Param("isValid") String isValid);
}
