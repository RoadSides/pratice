package org.jyu.LearnEase.dao;

import org.jyu.LearnEase.domain.User;

public interface UserDao {
	/**
	 * 增加用户
	 */
	public void add(User user);
	
	/**
	 * 更新用户
	 */
	public void update(User user);
	
	/**
	 * 删除用户
	 */
	public void delete(User user);
	
}
