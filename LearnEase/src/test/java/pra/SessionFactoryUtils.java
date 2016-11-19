package pra;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
/*
 * 获取session连接
 */

public class SessionFactoryUtils {
	private static SessionFactory sessionFactory = null;
	
	static{
		sessionFactory = new Configuration().configure().buildSessionFactory();
	}
	
	public static Session getSession(){
		Session session = null;
		
		session = sessionFactory.openSession();
		
		return session;
	}
	
}
