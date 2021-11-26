package org.dynatrace.microblog.vulnerablefunctions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class VulnerableFunctionCaller {

	Logger logger = LoggerFactory.getLogger(VulnerableFunctionCaller.class);

	@SuppressWarnings("deprecation") //Deprecated method call is necessary, we'd like to call a vulnerable function here.
	public boolean callVulnerableFunctionOf(String vulnerableLib) {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping();

		try {
			final Person john = new Person("John", 25, new DomesticNumber(43, 0));
			String serializedJohn = mapper.writeValueAsString(john);

			if(mapper.readValue(serializedJohn, Person.class) != null) {
				logger.info(String.format("Vulnerable function %s called.", vulnerableLib));
				return true;
			}
		} catch (JsonProcessingException e) {
			logger.warn(String.format("Exception while trying to call vulnerable function %s ", vulnerableLib), e);
		}
		return false;
	}
}
