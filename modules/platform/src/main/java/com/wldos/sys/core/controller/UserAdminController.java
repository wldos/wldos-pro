/*
 * Copyright (c) 2020 - 2022 wldos.com. All rights reserved.
 * Licensed under the AGPL or a commercial license.
 * For AGPL see License in the project root for license information.
 * For commercial licenses see term.md or https://www.wldos.com
 *
 */

package com.wldos.sys.core.controller;

import java.util.List;
import java.util.Map;

import com.wldos.base.controller.RepoController;
import com.wldos.common.res.PageableResult;
import com.wldos.common.res.PageQuery;
import com.wldos.auth.service.LoginAuthService;
import com.wldos.auth.vo.Login;
import com.wldos.sys.base.vo.Menu;
import com.wldos.auth.vo.PasswdModifyParams;
import com.wldos.auth.vo.Register;
import com.wldos.sys.core.entity.WoOrg;
import com.wldos.sys.core.entity.WoUser;
import com.wldos.sys.core.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户管理相关controller。
 *
 * @author 树悉猿
 * @date 2021/5/2
 * @version 1.0
 */
@RestController
@RequestMapping("admin/sys/user")
public class UserAdminController extends RepoController<UserService, WoUser> {

	private final LoginAuthService loginAuthService;

	public UserAdminController(LoginAuthService loginAuthService) {
		this.loginAuthService = loginAuthService;
	}

	/**
	 * 可管理的用户列表
	 *
	 * @param params 查询参数
	 * @return 用户列表
	 */
	@GetMapping("")
	public PageableResult<WoUser> listQuery(@RequestParam Map<String, Object> params) {
		//查询列表数据
		PageQuery pageQuery = new PageQuery(params);

		this.applyTenantFilter(pageQuery);

		return this.service.queryUserForPage(new WoUser(), pageQuery);
	}

	/**
	 * 查询组织下的用户列表
	 *
	 * @param params 查询参数
	 * @return 用户列表
	 */
	@GetMapping("org")
	public PageableResult<WoUser> listOrgUser(@RequestParam Map<String, Object> params) {
		//查询列表数据
		PageQuery pageQuery = new PageQuery(params);

		return this.service.queryUserForPage(new WoUser(), pageQuery);
	}

	/**
	 * 查询租户下的管理员列表
	 *
	 * @param params 查询参数,根据uComId(本租户id)、orgId(租户管理系统用户组,隶属于comId=0的平台)查询租户管理用户组下归属本租户的人员（即本租户的管理员）
	 * @return 租户管理员列表
	 */
	@GetMapping("com")
	public PageableResult<WoUser> listComAdminUser(@RequestParam Map<String, Object> params) {
		//查询列表数据
		PageQuery pageQuery = new PageQuery(params);
		// 查询租户管理员组织id，并作为查询参数, 注意前端要传递的租户id是uComId（用户公司），而非comId（组织公司）
		WoOrg tAdminOrg = this.service.queryTenantAdminOrg();
		pageQuery.pushParam("orgId", tAdminOrg.getId());

		return this.service.queryUserForPage(new WoUser(), pageQuery);
	}

	/**
	 * 可添加的用户列表
	 *
	 * @param params 查询参数
	 * @return 可添加用户
	 */
	@GetMapping("select")
	public PageableResult<WoUser> listSelect(@RequestParam Map<String, Object> params) {
		//查询列表数据
		PageQuery pageQuery = new PageQuery(params);

		// @todo 应该过滤掉平台管理用户组
		return this.service.execQueryForPage(new WoUser(), pageQuery);
	}

	/**
	 * 获取用户有权限的管理菜单
	 *
	 * @return 管理菜单
	 */
	@GetMapping("adminMenu")
	public List<Menu> adminMenu() {
		return this.service.queryAdminMenuByUser(this.getDomainId(), this.getTenantId(), this.getCurUserId());
	}

	/**
	 * 管理员后台设置新密码，直接覆盖原密码
	 *
	 * @param passwdModifyParams 密码修改参数
	 * @return 密码修改结果
	 */
	@PostMapping("passwd4admin")
	public Login changePasswd4admin(@RequestBody PasswdModifyParams passwdModifyParams) {

		getLog().info("用户id: {} 密码修改, 修改人id：{}", passwdModifyParams.getId(), this.getCurUserId());
		Login user = this.loginAuthService.changePasswd4admin(passwdModifyParams);
		if (user == null) {
			getLog().info("{} 密码修改失败", passwdModifyParams.getId());
			user = new Login();
			user.setStatus("error");
			user.setNews("密码修改失败，请重试！");
		}
		return user;
	}

	/**
	 * 管理员后台添加新用户
	 *
	 * @param register 用户注册信息
	 * @return 注册结果
	 */
	@PostMapping("register4admin")
	public Login addUser4admin(@RequestBody Register register) {
		register.setId(this.nextId());
		register.setRegisterIp(this.getUserIp());
		register.setLoginName(register.getEmail());
		getLog().info("register= {} ", register.getLoginName());
		return this.loginAuthService.addUser4admin(this.getDomainId(), register);
	}
}