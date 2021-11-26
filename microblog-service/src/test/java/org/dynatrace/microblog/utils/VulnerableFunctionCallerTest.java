package org.dynatrace.microblog.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class VulnerableFunctionCallerTest {

	@Test
	void callVulnerableFunction_callsVulnerableFunction() {
		String vulnerableFunction = "com.fasterxml.jackson.databind.jsontype.impl.SubTypeValidator.validateSubType";
		VulnerableFunctionCaller vulnerableFunctionCaller = new VulnerableFunctionCaller();

		boolean methodCalled = vulnerableFunctionCaller.callVulnerableFunctionOf(vulnerableFunction);

		assertThat(methodCalled).isTrue();
	}
}




