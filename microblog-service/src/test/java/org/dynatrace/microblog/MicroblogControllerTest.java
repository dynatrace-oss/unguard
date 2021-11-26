package org.dynatrace.microblog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.assertj.core.api.Assertions;
import org.dynatrace.microblog.vulnerablefunctions.VulnerableFunctionCaller;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import io.opentracing.Tracer;

@WebMvcTest(MicroblogController.class)
class MicroblogControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private Tracer tracerMock;

	@MockBean
	private VulnerableFunctionCaller vulnerableFunctionCallerMock;

	@Test
	void getPost_CallsVulnerableFunction() throws Exception {
		this.mockMvc.perform(get("/post").param("id", "1"));
		verify(vulnerableFunctionCallerMock).callVulnerableFunctionOfJacksonDatabind();
	}
}