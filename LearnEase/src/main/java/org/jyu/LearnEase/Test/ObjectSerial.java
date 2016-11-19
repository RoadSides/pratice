package org.jyu.LearnEase.Test;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ObjectSerial {
    public static void main(String[] args) {
        //创建测试用对象
         City beijing = new City();
         beijing.setName("北京");
         beijing.setCode("010");
         City shanghai = new City();
         shanghai.setName("上海");
         shanghai.setCode("020");
         City tianjin = new City();
         tianjin.setName("天津");
         tianjin.setCode("021");
         List<City> cityList = new ArrayList<City>();
         cityList.add(beijing);
         cityList.add(shanghai);
         cityList.add(tianjin);
         
         TestObject obj = new TestObject();
         obj.setName("yangsq");
         obj.setPassword("111");
         obj.setDate(new Date());
         obj.setCityList(cityList);
        
         try{
          //将对象存入blob字段
          Class.forName("com.mysql.jdbc.Driver");
          Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "root");
          con.setAutoCommit(false);
          //将一个对象序列化保存到数据库
          PreparedStatement pstmt = con.prepareStatement("insert into obj (object) values (?)");
          pstmt.setObject(1, obj);
          pstmt.executeUpdate();
          con.commit();
          //从数据库中提取记录
          Statement state = con.createStatement();
          ResultSet rs = state.executeQuery("select object from obj");
          if (rs.next()) {
              //以下是读取的方法一定要注意了！
              Blob inblob = (Blob) rs.getBlob("object");
              InputStream is = inblob.getBinaryStream();
              BufferedInputStream input = new BufferedInputStream(is);
             
              byte[] buff = new byte[(int) inblob.length()];//放到一个buff 字节数组
              while(-1 != (input.read(buff, 0, buff.length)));
             
              ObjectInputStream in =new ObjectInputStream(new ByteArrayInputStream(buff));
              TestObject w3 = (TestObject)in.readObject();//从IO流中读取出来.可以得到一个对象了
              System.out.println(w3.getName());
              System.out.println(w3.getPassword());
              System.out.println(w3.getDate());
              System.out.println(w3.getCityList());
          }
         
         } catch (Exception ex) {
          ex.printStackTrace();
          System.exit(1);
         }
    }
}