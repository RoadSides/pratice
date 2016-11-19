package org.jyu.LearnEase.domain;

import java.util.HashSet;
import java.util.Set;

public class QuestionLabel extends Label {
	private Set<Question> questions = new HashSet<Question>();

	public synchronized Set<Question> getQuestions() {
		return questions;
	}

	public synchronized void setQuestions(Set<Question> questions) {
		this.questions = questions;
	}

	
}
