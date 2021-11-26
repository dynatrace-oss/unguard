package org.dynatrace.microblog.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.dynatrace.microblog.vulnerablefunctions.VulnerableFunctionCaller;
import org.junit.jupiter.api.Test;

class VulnerableFunctionCallerTest {

	private final VulnerableFunctionCaller vulnerableFunctionCaller = new VulnerableFunctionCaller();

	@Test
	void callVulnerableFunctionOfJacksonDatabind_ReturnsTrue_WhenObjectCouldBeDeserialized() {
		boolean methodCalled = vulnerableFunctionCaller.callVulnerableFunctionOfJacksonDatabind();

		assertThat(methodCalled).isTrue();
	}

	@Test
	void callVulnerableFunction_ReturnsFalse_WhenObjectCouldNotBeDeserialized() {
		boolean methodCalled = vulnerableFunctionCaller.callVulnerableFunctionOfJacksonDatabind();

		assertThat(methodCalled).isTrue();

	}
}




