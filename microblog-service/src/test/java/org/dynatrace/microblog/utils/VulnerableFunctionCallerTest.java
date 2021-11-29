package org.dynatrace.microblog.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.dynatrace.microblog.vulnerablefunctions.VulnerableFunctionCaller;
import org.junit.jupiter.api.Test;

class VulnerableFunctionCallerTest {

	private final VulnerableFunctionCaller vulnerableFunctionCaller = new VulnerableFunctionCaller();

	@Test
	void callVulnerableFunctionOfJacksonDatabind_ReturnsTrue_WhenObjectCouldBeDeserialized() {
		assertThat(vulnerableFunctionCaller.callVulnerableFunctionOfJacksonDatabind()).isTrue();
	}
}




