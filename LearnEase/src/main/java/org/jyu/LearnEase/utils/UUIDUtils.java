package org.jyu.LearnEase.utils;

import java.util.UUID;

public class UUIDUtils {
	/**
	 * 获得随机的字符串
	 */
	public static String getUUID(){
		return UUID.randomUUID().toString().replace("-", "");
	}
}
