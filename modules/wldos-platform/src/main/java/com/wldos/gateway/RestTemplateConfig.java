/*
 * Copyright (c) 2020 - 2025 yuanxiyuzhou. All rights reserved.
 * Created by 元悉宇宙 (306991142@qq.com)
 * Licensed under the Apache License, Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or contact 306991142@qq.com
 */

package com.wldos.gateway;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

/**
 * rest模板相关配置。
 *
 * @author 元悉宇宙
 * @date 2021/5/8
 * @version 1.0
 */
@RefreshScope
@Configuration
public class RestTemplateConfig {

	@Value("${restemplate.connection.timeout:50}")
	private int restConnTimeout;

	@Value("${restemplate.read.timeout:50}")
	private int restReadTimeout;

	@Bean
	//@LoadBalanced
	public RestTemplate restTemplate(ClientHttpRequestFactory simleClientHttpRequestFactory) {
		RestTemplate restTemplate = new RestTemplate();
		//配置自定义的message转换器
		List<HttpMessageConverter<?>> messageConverters = restTemplate.getMessageConverters();
		MappingJackson2HttpMessageConverter jsonConverter = new CustomMessageConverter();

		messageConverters.add(jsonConverter);
		restTemplate.setMessageConverters(messageConverters);

		return restTemplate;
	}


	@Bean
	public ClientHttpRequestFactory simpleClientHttpRequestFactory() {
		SimpleClientHttpRequestFactory reqFactory = new SimpleClientHttpRequestFactory();
		reqFactory.setConnectTimeout(this.restConnTimeout);
		reqFactory.setReadTimeout(this.restReadTimeout);
		return reqFactory;
	}
}