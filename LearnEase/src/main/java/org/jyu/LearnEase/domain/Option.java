package org.jyu.LearnEase.domain;

import java.io.Serializable;

/*
 * 选项
 */
public class Option implements Serializable{
    private static final long serialVersionUID = 45588761424202513L;

	private Long id;//选项的id
	private String content;// 选项内容
	private Question question; 
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Question getQuestion() {
		return question;
	}
	public void setQuestion(Question question) {
		this.question = question;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	


	
}
