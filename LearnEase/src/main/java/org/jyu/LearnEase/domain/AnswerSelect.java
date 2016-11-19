package org.jyu.LearnEase.domain;

import java.util.HashSet;
import java.util.Set;

/*
 * 选择题参考答案
 */
public class AnswerSelect extends Answer{
	
	private Set<String> answerSets = new HashSet<String>(); //答案	
	
	public Set<String> getAnswerSets() {
		return answerSets;
	}

	public void setAnswerSets(Set<String> answerSets) {
		this.answerSets = answerSets;
	}

	@Override
	public boolean judge(Solution solution) {
		
		if(solution instanceof SolutionSelect){
			return judge((SolutionSelect)solution);
		}
		return false;
	}
	
	public boolean judge(SolutionSelect solution) {
		
		if(solution!=null){
			return  solution.getSolutionSet().equals(answerSets);
		}
		return false;
	}
	
	
}
