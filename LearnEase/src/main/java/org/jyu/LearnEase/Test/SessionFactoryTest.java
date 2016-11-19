package org.jyu.LearnEase.Test;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.junit.Test;



public class SessionFactoryTest extends SpringUtils{
	
	public void testSessionFactory(){
		context.getBean("sessionFactory");
	}
	
	@Test
	public void testCountProduct(){
		SessionFactory sessionFactory = (SessionFactory)context.getBean("sessionFactory");
		Session session = sessionFactory.openSession();
		Long count = (Long)session.createQuery("select count(*) from answer").uniqueResult();
		System.out.println(count);
		session.close();
	}
}
