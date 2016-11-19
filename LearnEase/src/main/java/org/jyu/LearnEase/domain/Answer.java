package org.jyu.LearnEase.domain;

import java.io.Serializable;
import java.sql.Blob;

/*
 * 参考答案
 */
public abstract class Answer implements Serializable{
	private long id; //答案的id

	private Question question;   // 存储问题的id
	
	/*
	private Blob answerBlob;     
		
	public Blob getAnswerBlob() {
		return answerBlob;
	}

	public void setAnswerBlob(Blob answerBlob) {
		this.answerBlob = answerBlob;
	}
	*/

	// 判断答题是否正确
	public abstract boolean judge(Solution solution);


	public long getId() {
		return id;
	}


	public void setId(long id) {
		this.id = id;
	}


	public Question getQuestion() {
		return question;
	}


	public void setQuestion(Question question) {
		this.question = question;
	}	
}
