/*
 * Copyright (c) 2020 - 2022 wldos.com. All rights reserved.
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.sys.core.repo;

import java.util.List;

import com.wldos.sys.core.entity.WoOrgUser;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * 用户归属组织仓库操作类。
 *
 * @author 树悉猿
 * @date 2021/5/9
 * @version 1.0
 */
public interface OrgUserRepo extends PagingAndSortingRepository<WoOrgUser, Long> {
	@Modifying
	@Query("delete from wo_org_user where org_id=:orgId and user_id in (:ids)")
	void removeOrgStaff(List<Long> ids, Long orgId);

	@Modifying
	@Query("delete from wo_org_user where user_com_id=:userComId and org_id=:orgId and user_id in (:ids)")
	void removeTenantAdmin(List<Long> ids, Long userComId, Long orgId);

	@Query("select c.* from wo_org_user c where c.is_valid =:isValid and c.delete_flag =:deleteFlag and c.org_id=:orgId and c.arch_id=:archId and c.com_id=:comId and c.user_id in (:userIds)")
	List<WoOrgUser> queryAllByUserIds(Long orgId, Long archId, Long comId, List<Long> userIds, String isValid, String deleteFlag);

	/**
	 * 查询某租户管理员列表
	 *
	 * @param tAdminOrgId 租户管理员系统用户组id
	 * @param userComId 待查询的租户id
	 * @param userIds 待查询用户id
	 * @param isValid 是否有效
	 * @param deleteFlag 删除标识
	 * @return 租户管理员列表
	 */
	@Query("select c.* from wo_org_user c where c.is_valid =:isValid and c.delete_flag =:deleteFlag and c.org_id=:tAdminOrgId and c.user_com_id=:userComId and c.user_id in (:userIds)")
	List<WoOrgUser> queryAllByUserIds(Long tAdminOrgId, Long userComId, List<Long> userIds, String isValid, String deleteFlag);

	/**
	 * 指定组织为超级管理员组，取出管理员
	 *
	 * @param platComId 平台系统组id
	 * @param AdminOrgCode 超级管理用户组
	 * @param orgId 待删除组织id
	 * @return 删除组是超级管理员组时返回所有超级管理员，否则返回空
	 */
	@Query("select u.* from wo_org_user u where exists (select 1 from wo_org g where g.id=u.org_id "
			+ "and g.arch_id=u.arch_id and g.com_id=u.com_id and g.delete_flag='normal' and g.is_valid='1' and g.com_id=:platComId and g.org_code=:AdminOrgCode and g.id=:orgId)")
	List<WoOrgUser> existsAdmin(Long platComId, String AdminOrgCode, Long orgId);

}
