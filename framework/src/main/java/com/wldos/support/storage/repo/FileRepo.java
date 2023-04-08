/*
 * Copyright (c) 2020 - 2023 wldos.com. All rights reserved.
 * Licensed under the Apache License Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.support.storage.repo;

import com.wldos.support.storage.entity.WoFile;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * 文件仓库操作类。
 *
 * @author 树悉猿
 * @date 2021/4/27
 * @version 1.0
 */
public interface FileRepo extends PagingAndSortingRepository<WoFile, Long> {
}
