package org.jyu.LearnEase.domain;

import java.io.Serializable;

public class User implements Serializable{

	private long id;
	private String name;
	/*
	private String password;
	private String email;
	*/
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + "]";
	}
	
}
