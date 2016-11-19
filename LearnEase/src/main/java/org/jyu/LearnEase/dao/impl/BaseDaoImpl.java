package org.jyu.LearnEase.dao.impl;

import org.jyu.LearnEase.dao.BaseDao;

import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

public abstract class BaseDaoImpl<T> extends HibernateDaoSupport implements BaseDao<T>{
	
	public void save(T t) {
		this.getHibernateTemplate().save(t);
	}

	public void delete(T t) {
		this.getHibernateTemplate().delete(t);
	}

	public void update(T t) {
		this.getHibernateTemplate().update(t);
	}
}
