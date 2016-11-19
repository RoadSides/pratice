package pra;

import org.junit.Test;
import org.jyu.LearnEase.utils.UUIDUtils;

public class TestUUID {
	
	@Test
	public void te(){
		String uuid = UUIDUtils.getUUID();
		System.out.println(uuid);
	}
}
