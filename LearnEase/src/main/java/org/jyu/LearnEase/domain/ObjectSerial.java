package org.jyu.LearnEase.domain;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.sql.rowset.serial.SerialBlob;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.output.ByteArrayOutputStream;

/**
 * 示例：    学习用   可删  
 * 以blob的形式存储和读取对象
 */
public class ObjectSerial {
	public static void main(String[] args) {
		// 创建测试用对象

		QuestionSelect questionSelect = new QuestionSelect();
		questionSelect.setAnalyse("程序计数器（又称指令计数器）");
		questionSelect.setAuthor("小A");
		questionSelect.setCreateTime(new Date());
		questionSelect.setDescription("CPU中有一个程序计数器（又称指令计数器），它用于存放（   ）");
		questionSelect.setDifficulty(1);
		questionSelect.setQuestionName("计算机一级");

		Map<String, Option> map1 = new HashMap<String, Option>();
		Option o1 = new Option();
		o1.setContent("正在执行的指令的内容");

		Option o2 = new Option();
		o2.setContent("第一种用for循环 ");

		map1.put("A", o1);
		map1.put("B", o2);

//		报错原因：把QuestSeclet的map改成了<String,String>,若要测试，可把map的key,value改为<String,Option>
//		questionSelect.setOptions(map1);

		try {
			// 将对象存入blob字段
			Class.forName("com.mysql.jdbc.Driver");
			Connection con = DriverManager.getConnection(
					"jdbc:mysql://localhost:3306/test", "root", "root");
			con.setAutoCommit(false);
			// 将一个对象序列化保存到数据库
			/*
			PreparedStatement pstmt = con
					.prepareStatement("insert into question (question) values (?)");
			pstmt.setObject(1, questionSelect);
			pstmt.executeUpdate();
			con.commit();  
			*/
			// 从数据库中提取记录
			Statement state = con.createStatement();
			// 获取id=20的 "request"字段
			ResultSet rs = state.executeQuery("select question from question where id = 20");
			if (rs.next()) {
				// 以下是读取的方法一定要注意了！
				Blob inblob = (Blob) rs.getBlob("question");
				InputStream is = inblob.getBinaryStream();
				BufferedInputStream input = new BufferedInputStream(is);

				byte[] buff = new byte[(int) inblob.length()];// 放到一个buff 字节数组
				while (-1 != (input.read(buff, 0, buff.length)))
					;

				ObjectInputStream in = new ObjectInputStream(
						new ByteArrayInputStream(buff));
				QuestionSelect q = (QuestionSelect) in.readObject();// 从IO流中读取出来.可以得到一个对象了
				System.out.println(q.getAnalyse());
				System.out.println(q.getAuthor());

				System.out.println(q.getQuestionName());
				
				Set<Entry<String, Option>> entrySet = q.getOptions().entrySet();
				for (Map.Entry<String, Option> entry : entrySet) {
					System.out.println(entry.getKey() + "--->"
							+ entry.getValue().getContent());
				}

			}
			
			/*
			 * 参考 方法二
			 * 将对象转为blob对象
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
			objectOutputStream.writeObject(questionSelect);
			byte[] byteArray = byteArrayOutputStream.toByteArray();	
			Blob blob = new SerialBlob(byteArray);
			*/
			
		} catch (Exception ex) {
			ex.printStackTrace();
			System.exit(1);
		}
	}
}