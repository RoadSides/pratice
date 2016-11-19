package org.jyu.LearnEase.domain;

import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

/**
 * 用户提交的解答
 */
public abstract class Solution implements Serializable{
	private String id;			//用户答案id
	private Question question;	//对应的问题		
	private User  user;			//用户
	private Date date;			//答题日期	
	private int state; 			//答题情况          ??存什么东西
	
//	private Blob solutionBlob;  //存储solution类对应的Blob对象
	
	public synchronized String getId() {
		return id;
	}

	public synchronized void setId(String id) {
		this.id = id;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	/*
	public Blob getSolutionBlob() {
		return solutionBlob;
	}

	public void setSolutionBlob(Blob solutionBlob) {
		this.solutionBlob = solutionBlob;
	}	
	*/
	
	/*
	 * 保存			
	 */
	public abstract void save();
	
	/*
	 * 提交答案
	 */
	public abstract void submit();
	
	
}
