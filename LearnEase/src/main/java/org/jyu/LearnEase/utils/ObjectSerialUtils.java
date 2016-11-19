package org.jyu.LearnEase.utils;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.sql.rowset.serial.SerialBlob;

import org.jyu.LearnEase.domain.Option;
import org.jyu.LearnEase.domain.QuestionSelect;

public class ObjectSerialUtils {
	
	/*
	 * 把对象转换成blob对象
	 */
	public static <T> SerialBlob objectToBlob(T t){
		SerialBlob blob = null;
		try {
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
			objectOutputStream.writeObject(t);
			byte[] byteArray = byteArrayOutputStream.toByteArray();	
			blob = new SerialBlob(byteArray);
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		return blob;
	}
	
	/**
	 * 把blob对象转成Question类型
	 */
	public static Object blobToQuestion(Blob blob, QuestionType questionType){
		
		try {
			InputStream inputStream = blob.getBinaryStream();
			BufferedInputStream bufferedInputStream = new BufferedInputStream(inputStream);
			// 放到一个buff 字节数组
			byte[] buff = new byte[(int) blob.length()];
			while (-1 != (bufferedInputStream.read(buff, 0, buff.length)))
				;

			ObjectInputStream in = new ObjectInputStream(
					new ByteArrayInputStream(buff));
			
			if(questionType != QuestionType.PROGRAM){
				QuestionSelect q = (QuestionSelect) in.readObject();// 从IO流中读取出来.可以得到一个对象了
				
				//测试
				System.out.println(q.getAnalyse());
				System.out.println(q.getAuthor());
				System.out.println(q.getQuestionName());
				
			}else{
				System.out.println("没有对应的问题类型");
			}
						
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		return null;
	}
	
	
}
