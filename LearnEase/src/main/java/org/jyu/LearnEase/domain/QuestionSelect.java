package org.jyu.LearnEase.domain;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/*
 * 多选题
 */
public class QuestionSelect extends Question implements Serializable{
    private static final long serialVersionUID =1L;

	private Map<String,Option> options = new HashMap<String,Option>();

	public Map<String, Option> getOptions() {
		return options;
	}

	public void setOptions(Map<String, Option> options) {
		this.options = options;
	}

	

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}
