package com.subsplit;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SubsplitApplicationTests {

	static {
		com.subsplit.common.config.EnvLoader.load();
	}

	@Test
	void contextLoads() {
	}

}
