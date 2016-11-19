package org.jyu.LearnEase.dao;

import java.util.List;


public interface BaseDao<T> {
	
	public void save(T t);
	public void delete(T t) ;
	public void update(T t);
}
