package org.jyu.LearnEase.domain;

import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;
import java.util.Set;

import org.jyu.LearnEase.utils.QuestionType;


/*
 * 题型
 */
public class Question implements Serializable{
    private static final long serialVersionUID = 455887614243L;
 
	public Question() {}

	private String id;// 主键

	private int difficulty;// 难度

	private String questionName;;// 问题名称
	private String description;// 描述
	private String analyse;// 答案分析
	private String author;// 题目作者
	private Date createTime;// 创建时间
	private Answer answer;
	private Set<QuestionLabel> labels;// 该题目所属标签

	private QuestionType questionType;   

//	private Blob questionBlob;   //存放本类的blob对象
	
	public int getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(int difficulty) {
		this.difficulty = difficulty;
	}

	
	public Answer getAnswer() {
		return answer;
	}

	public void setAnswer(Answer answer) {
		this.answer = answer;
	}

	public synchronized Set<QuestionLabel> getLabels() {
		return labels;
	}

	public synchronized void setLabels(Set<QuestionLabel> labels) {
		this.labels = labels;
	}

	public QuestionType getQuestionType() {
		return questionType;
	}

	public void setQuestionType(QuestionType questionType) {
		this.questionType = questionType;
	}

	/*
	public Blob getQuestionBlob() {
		return questionBlob;
	}

	public void setQuestionBlob(Blob questionBlob2) {
		this.questionBlob = questionBlob2;
	}
	*/
	
	public synchronized String getId() {
		return id;
	}

	public synchronized void setId(String id) {
		this.id = id;
	}

	public String getQuestionName() {
		return questionName;
	}

	public void setQuestionName(String questionName) {
		this.questionName = questionName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAnalyse() {
		return analyse;
	}

	public void setAnalyse(String analyse) {
		this.analyse = analyse;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}	
}
