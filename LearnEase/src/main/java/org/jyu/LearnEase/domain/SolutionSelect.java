package org.jyu.LearnEase.domain;

import java.util.HashSet;
import java.util.Set;

public class SolutionSelect extends Solution{
	//table 为 learn_solution
	private Set<String> solutionSet =new HashSet<String>();
	
	public Set<String> getSolutionSet() {
		return solutionSet;
	}

	public void setSolutionSet(Set<String> solutionSet) {
		this.solutionSet = solutionSet;
	}

	@Override
	public void save() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void submit() {
		// TODO Auto-generated method stub
		
	}

}
