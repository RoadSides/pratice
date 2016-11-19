package org.jyu.LearnEase.domain;

import java.io.Serializable;

/**
 * 标签
 */
public class Label implements Serializable{
	private String id; // id号
	private String labelName; // 标签名称
	private User user; // 用户
	private long count; // 出现的次数
	
	public Label(){}
	
	

	public synchronized String getId() {
		return id;
	}



	public synchronized void setId(String id) {
		this.id = id;
	}



	public String getLabelName() {
		return labelName;
	}

	public void setLabelName(String labelName) {
		this.labelName = labelName;
	}

	public long getCount() {
		return count;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setCount(long count) {
		this.count = count;
	}

	/**
	 * 测试用
	 */
	@Override
	public String toString() {
		return "Label [id=" + id + ", labelName=" + labelName + ", user="
				+ user + ", count=" + count + "]";
	}

	
}
