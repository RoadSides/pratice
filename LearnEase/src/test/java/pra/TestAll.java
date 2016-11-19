package pra;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.junit.Test;
import org.jyu.LearnEase.domain.Answer;
import org.jyu.LearnEase.domain.AnswerSelect;
import org.jyu.LearnEase.domain.Option;
import org.jyu.LearnEase.domain.Question;
import org.jyu.LearnEase.domain.QuestionLabel;
import org.jyu.LearnEase.domain.QuestionSelect;
import org.jyu.LearnEase.domain.SolutionSelect;
import org.jyu.LearnEase.domain.User;
import org.jyu.LearnEase.utils.QuestionType;
import org.jyu.LearnEase.utils.UUIDUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestAll {

	/*
	 * 小提示
	 * 删question前要先删除相应的solution
	 */
	
	
	private SessionFactory sessionFactory;

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public void te2() {
		Session currentSession = sessionFactory.getCurrentSession();
		Query query = currentSession.createQuery("from Question");
		List<Question> list = query.list();
		for (Question question : list) {
			System.out.println(question);
		}
	}

	@Test
	public void te() {
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext(
				"applicationContext.xml");
		TestAll testAll = (TestAll) applicationContext.getBean("haha");
		testAll.te2();
	}

	/**
	 * 添加用户
	 */
	@Test
	public void addUser() {
		String[] names = new String[] { "张三", "李四", "王五", "赵六", "田七", "朱八" };
		Session session = SessionFactoryUtils.getSession();
		session.beginTransaction();

		for (int i = 0; i < names.length; i++) {
			User user = new User();
			user.setName(names[i]);
			session.save(user);
		}

		session.getTransaction().commit();
		session.close();
	}

	/**
	 * 向数据库增加问题
	 */
	@Test
	public void addQuestion() {
		Session session = SessionFactoryUtils.getSession();
		session.beginTransaction();

		QuestionSelect questionSelect = new QuestionSelect();
		questionSelect.setDifficulty(1);
		questionSelect.setQuestionName("问题2");
		questionSelect.setDescription("问题2的描述");
		questionSelect.setAnalyse("问题2的分析");
		questionSelect.setAuthor("作者B");
		questionSelect.setCreateTime(new Date());

		// 给问题添加标签
		// 根据id找用户
		User user = (User) session.get(User.class, 2L);
		Set<QuestionLabel> labels = new HashSet<QuestionLabel>();
		// QuestionLabel label =
		// (QuestionLabel)session.get(QuestionLabel.class,"59e1260d4ea54356865c6bc4dd81236a");
		// label.setCount(label.getCount()+1);
		QuestionLabel label1 = new QuestionLabel();
		label1.setId(UUIDUtils.getUUID());
		label1.setLabelName("标签1");
		label1.setUser(user);
		label1.setCount(1);

		QuestionLabel label2 = new QuestionLabel();
		label2.setId(UUIDUtils.getUUID());
		label2.setLabelName("标签2");
		label2.setUser(user);
		label2.setCount(1);

		QuestionLabel label3 = new QuestionLabel();
		label3.setId(UUIDUtils.getUUID());
		label3.setLabelName("标签3");
		label3.setUser(user);
		label3.setCount(1);

		labels.add(label1);
		labels.add(label2);
		labels.add(label3);
		questionSelect.setLabels(labels);

		// 设置问题的题型
		questionSelect.setQuestionType(QuestionType.SINGLE);

		// 设置选择题的options
		Option option1 = new Option();
		option1.setContent("问题2选项1");
		option1.setQuestion(questionSelect);

		Option option2 = new Option();
		option2.setContent("问题2选项2");
		option2.setQuestion(questionSelect);

		Option option3 = new Option();
		option3.setContent("问题2选项3");
		option3.setQuestion(questionSelect);

		Map<String, Option> options = new HashMap<String, Option>();
		options.put("A", option1);
		options.put("B", option2);
		options.put("C", option3);
		questionSelect.setOptions(options);

		// 将questionSelect对象的Blob形式存到questionBlob属性中
		// SerialBlob questionBlob = ObjectSerialUtils
		// .objectToBlob(questionSelect);
		// questionSelect.setQuestionBlob(questionBlob);

		// 设置答案
		AnswerSelect answerSelect = new AnswerSelect();
		// answerSelect.setId(100); // 该参考答案设置id
		Set<String> answerSet = new HashSet<String>();
		answerSet.add("A");
		// answerSet.add("C");
		answerSelect.setAnswerSets(answerSet);

		answerSelect.setQuestion(questionSelect);

		// 将answer存为blob
		// Blob answerBlob = ObjectSerialUtils.objectToBlob(answerSelect);
		// answerSelect.setAnswerBlob(answerBlob);

		questionSelect.setAnswer(answerSelect);

		// 保存到数据库
		session.save(questionSelect);

		session.getTransaction().commit();
		session.close();
	}

	/**
	 * 回答问题
	 */
	@Test
	public void testSolution() {
		Session session = SessionFactoryUtils.getSession();
		session.beginTransaction();

		SolutionSelect solutionSelect = new SolutionSelect();
		// 通过id找问题
		QuestionSelect questionSelect = (QuestionSelect) session.get(
				QuestionSelect.class, "402891815858a0a2015858a0ad3e0000");
		solutionSelect.setQuestion(questionSelect);

		User user = (User) session.get(User.class, 2L);
		solutionSelect.setUser(user);

		solutionSelect.setDate(new Date());

		solutionSelect.setState(100); // state是什么东西，存什么的

		Set<String> solutionSet = new HashSet<String>();
		solutionSet.add("A");

		solutionSelect.setSolutionSet(solutionSet);

		// SerialBlob solutionBlob = ObjectSerialUtils
		// .objectToBlob(solutionSelect);
		// solutionSelect.setSolutionBlob(solutionBlob);

		session.save(solutionSelect);
		session.getTransaction().commit();
		session.close();
	}

	@Test
	public void getQuestion() {
		Session session = SessionFactoryUtils.getSession();
		QuestionSelect questionSelect = (QuestionSelect) session.get(
				QuestionSelect.class, "402891815858a0a2015858a0ad3e0000");
		System.out.println(questionSelect.getId());// 主键
		System.out.println(questionSelect.getDifficulty());// 难度
		System.out.println(questionSelect.getQuestionName());// 问题名称
		System.out.println(questionSelect.getDescription());// 描述
		System.out.println(questionSelect.getAnalyse());// 答案分析
		System.out.println(questionSelect.getAuthor());// 题目作者
		System.out.println(questionSelect.getCreateTime());// 创建时间
		System.out.println(questionSelect.getAnswer());
		System.out.println(questionSelect.getOptions());
		System.out.println(questionSelect.getLabels());// 该题目所属标签
		System.out.println(questionSelect.getQuestionType());
		// System.out.println(questionSelect.getQuestionBlob());
		// //新增，存放本类的blob对象，待测试
		session.close();
	}

	@Test
	public void teDelete() {
		Session session = SessionFactoryUtils.getSession();
		session.beginTransaction();
		Query query = session
				.createQuery("from SolutionSelect where questionId = '402891815858a0a2015858a0ad3e0000'");
		List<SolutionSelect> list = query.list();
		for (SolutionSelect solutionSelect : list) {
			if (solutionSelect != null)
				session.delete(solutionSelect);
		}
		QuestionSelect question = (QuestionSelect) session.get(
				QuestionSelect.class, "402891815858a0a2015858a0ad3e0000");
		if (question != null) {
			session.delete(question);
		}

		session.getTransaction().commit();
		session.close();
	}

	@Test
	public void teDeleteOptions() {
		Session session = SessionFactoryUtils.getSession();
		session.beginTransaction();

		SolutionSelect solutionSelect = (SolutionSelect) session.get(
				SolutionSelect.class, "402891815858a1d7015858a1e2480000");
		if (solutionSelect != null)
			session.delete(solutionSelect);

		session.getTransaction().commit();
		session.close();
	}
}
