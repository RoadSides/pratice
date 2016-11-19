package org.jyu.LearnEase.Test;

import org.jyu.LearnEase.domain.SolutionSelect;

public class B extends A{
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public boolean judge(A a) {
		if(a instanceof B){
			return judge((B)a);
		}
		return false;
	}
	public boolean judge(B a) {
		if(a!=null){
			System.out.println("ssssssssssssssssss");
			return  true;
		}
		return false;
	}
	
}
