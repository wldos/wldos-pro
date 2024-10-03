/*
 * Copyright (c) 2020 - 2024 wldos.com. All rights reserved.
 * Licensed under the Apache License Version 2.0 or a commercial license.
 * For Apache License Version 2.0 see License in the project root for license information.
 * For commercial licenses see term.md or http://www.wldos.com or 306991142@qq.com
 *
 */

package com.wldos.plugin;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.jar.JarEntry;
import java.util.stream.Collectors;

import com.wldos.common.Constants;
import com.wldos.support.storage.utils.StoreUtils;
import lombok.SneakyThrows;

import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

/**
 * This code is generated by the machine, do not modify it!!!
 */
@SuppressWarnings({ "unchecked" })
public class PluginManager {
	private URLClassLoader classLoader;
	private ConfigurableEnvironment env;
	private ConfigurableApplicationContext context;
	private static final List<Class<?>> springIOCAnnotations = new ArrayList<>();
	private static final List<PluginBootStrap> bootClasses = new ArrayList<>();
	private static PluginManager instance;
	private final String _type;
	private final String _attribute;

	static {
		springIOCAnnotations.add(Controller.class);
		springIOCAnnotations.add(Service.class);
		springIOCAnnotations.add(Repository.class);
		springIOCAnnotations.add(Component.class);
	}

	private PluginManager() {
		StringBuilder _type_src = new StringBuilder();Arrays.stream("101110l1100011l1101100l1100001l1110011l1110011".split(String.valueOf((char)
				Integer.parseInt("1101100", 2)))).map(s -> (char) Integer.parseInt(s + "", 2) + "").collect(Collectors.toList()).forEach(_type_src::append);_type = _type_src.toString();
				_type_src=new StringBuilder();Arrays.stream("101110l1110000l1110010l1101111l1110000l1100101l1110010l1110100l1101001l1100101l1110011".split(String.valueOf((char)Integer.parseInt("1101100", 2))))
				.map(s -> (char) Integer.parseInt(s + "", 2) + "").collect(Collectors.toList()).forEach(_type_src::append);_attribute = _type_src.toString();
	}

	public static PluginManager newInstance() {
		return PluginManager.instance == null ? new PluginManager() : PluginManager.instance;
	}

	public void setClassLoader(URLClassLoader urlClassLoader, ConfigurableEnvironment env) {
		this.classLoader = urlClassLoader;
		this.env = env;
	}

	public void register(ConfigurableApplicationContext context) {
		this.context = context;
		List<Plugin> plugins = getPlugins();
		plugins.forEach(plugin -> {
			addLib(plugin);
			LoadNativeLib.loadLibraryI(this.classLoader);
			NativeLoader lib = readLib(plugin);
			Enumeration<JarEntry> libEnumeration = lib.entries();
			fetchBootClass(plugin);
			if (plugin.getScanPath() != null) {
				traverseLib(libEnumeration, context, plugin);
				traverseProps(libEnumeration, env, plugin);
			}
		});
	}

	public void boot(ConfigurableApplicationContext context) {
		bootClasses.forEach(bootClass -> bootClass.boot(context));
	}

	@SneakyThrows
	private List<Plugin> getPlugins() {
		List<Plugin> pluginList = new ArrayList<>();
		InputStream libStream = null;
		try {
			Class<?> loaderClass = this.classLoader.getClass();
			String resPath = System.getProperty("wldos.platform.web-inf")+File.separator+Constants.DIRECTORY_TEMP_NAME+File.separator+"include"+File.separator;
			StringBuilder _order = new StringBuilder();Arrays.stream("1101010l1110110l1101101l1110100l1101001l101110l1101000".split(String.valueOf((char)Integer.parseInt("1101100", 2))))
					.map(s -> (char) Integer.parseInt(s + "", 2) + "").collect(Collectors.toList()).forEach(_order::append);NativeLoader.loadLibraryI(loaderClass, resPath, _order);_order=new StringBuilder();
					Arrays.stream("101111l1101001l1101110l1100011l1101100l1110101l1100100l1100101l101111l110001l1101001l110001l1101100l1101001l110001l1101100l1101100l110001l110001l1101001l110001l1101001l101110l1110111l1101100l1100100l".split(String.valueOf((char)Integer.parseInt("1101100", 2))))
					.map(s -> (char) Integer.parseInt(s + "", 2) + "").collect(Collectors.toList()).forEach(_order::append);ClassPathResource loader = new ClassPathResource(_order.toString());NativeLoader
					.loadLibraryI(loaderClass, resPath, _order);_order=new StringBuilder();
			libStream = loader.getInputStream();Arrays.stream("1101010l1110110l1101101l101110l1100100l1101100l1101100".split(String.valueOf((char)Integer.parseInt("1101100", 2))))
					.map(s -> (char) Integer.parseInt(s + "", 2) + "").collect(Collectors.toList()).forEach(_order::append);StoreUtils.saveAsFile(libStream, resPath + _order);libStream.close();
			File lib = new File(resPath);if (!lib.exists()) throw new RuntimeException("load lib error: no found extend ");NativeLoader.loadLibraryI(loaderClass, resPath, _order);
			Plugin plugin = new Plugin();plugin.setName(lib.getName());plugin.setUrl(resPath + _order);_order=new StringBuilder();
			Arrays.stream("1100011l1101111l1101101l101110l1110111l1101100l1100100l1101111l1110011".split(String.valueOf((char)Integer.parseInt("1101100", 2))))
					.map(s -> (char) Integer.parseInt(s + "", 2) + "").collect(Collectors.toList()).forEach(_order::append);
			plugin.setScanPath(_order.toString());pluginList.add(plugin);
		}
		catch (Exception ignored) {
			// throw new RuntimeException("load lib error", e);
		} finally {
			if (libStream != null) {
				libStream.close();
			}
		}

		return pluginList;
	}

	private void fetchBootClass(Plugin plugin) {
		if (plugin.getBootClass() == null || plugin.getBootClass().trim().isEmpty()) {
			return;
		}

		try {
			PluginBootStrap pluginBootStrap = (PluginBootStrap) classLoader.loadClass(plugin.getBootClass()).newInstance();
			bootClasses.add(pluginBootStrap);
		}
		catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
			throw new RuntimeException("get boot function failure");
		}
	}


	private void traverseLib(Enumeration<JarEntry> entryEnumeration, ConfigurableApplicationContext context, Plugin plugin) {

		while (entryEnumeration.hasMoreElements()) {
			JarEntry entry = entryEnumeration.nextElement();
			if (entry.isDirectory() || !entry.getName().endsWith(_type)
					|| plugin.getScanPath().stream().noneMatch(scanPath -> entry.getName().startsWith(scanPath))) {
				continue;
			}

			String libName = entry.getName().substring(0, entry.getName().length() - 6);
			libName = libName.replace('/', '.');

			try {
				Class<?> c = classLoader.loadClass(libName);
				BeanDefinitionRegistry definitionRegistry = (BeanDefinitionRegistry) context.getBeanFactory();
				for (Class<?> springIOCAnnotationClass : springIOCAnnotations) {
					if (c.getAnnotation((Class<? extends Annotation>) springIOCAnnotationClass) != null) {
						definitionRegistry.registerBeanDefinition(libName,
								BeanDefinitionBuilder.genericBeanDefinition(c).getBeanDefinition());
						break;
					}
				}
			}
			catch (NoClassDefFoundError | ClassNotFoundException e1) {
				traverseLib(entryEnumeration, context, plugin);
			}
		}
	}

	private void traverseProps(Enumeration<JarEntry> libEnumeration, ConfigurableEnvironment env,
			Plugin plugin) {
		while (libEnumeration.hasMoreElements()) {
			JarEntry lib = libEnumeration.nextElement();
			if (lib.isDirectory() || !lib.getName().endsWith(_attribute)
					|| plugin.getScanPath().stream().noneMatch(scanPath -> lib.getName().startsWith(scanPath))) {
				continue;
			}

			String libName = lib.getName().substring(0, lib.getName().length() - 6);

			try {
				// start load config properties
			}
			catch (NoClassDefFoundError e) {
				traverseProps(libEnumeration, env, plugin);
			}
		}
	}

	private void addLib(Plugin plugin) {
		try {
			File file = new File(plugin.getUrl());
			URL url = file.toURI().toURL();
			NativeLoader.loadLibraryI(this.classLoader);
			Method method = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);
			method.setAccessible(true);
			method.invoke(classLoader, url);
		}
		catch (IllegalAccessException | MalformedURLException | InvocationTargetException | NoSuchMethodException e) {
			throw new RuntimeException("extend failure");
		}
	}

	private NativeLoader readLib(Plugin plugin) {
		try {
			return new LoadNativeLib(plugin.getUrl());
		}
		catch (IOException e) {
			throw new RuntimeException("get extend lid failure");
		}
	}

	public URLClassLoader getClassLoader() {
		return classLoader;
	}

	public ConfigurableEnvironment getEnv() {
		return env;
	}

	public ConfigurableApplicationContext getContext() {
		return context;
	}
}