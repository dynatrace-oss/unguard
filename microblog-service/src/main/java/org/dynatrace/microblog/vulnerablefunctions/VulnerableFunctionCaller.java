package org.dynatrace.microblog.vulnerablefunctions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class VulnerableFunctionCaller {

	private final Logger logger = LoggerFactory.getLogger(VulnerableFunctionCaller.class);

	/**
	 * Creates a scenario where the vulnerable function of "SubTypeValidator.validateSubType" of the
	 * "com.fasterxml.jackson.databind" library is called. Causes the vulnerability "Deserialization of untrusted data".
	 * The method doesn't check if the method is really called, it has to be done manually e.g. by creating a breakpoint
	 * in "validateSubType" and run the tests in debug mode.
	 *
	 * @return true if an object with a polymorphic subtype was successfully deserialized.
	 */
	@SuppressWarnings("deprecation") //Deprecated method call is necessary, we'd like to call a vulnerable function here.
	public boolean callVulnerableFunctionOfJacksonDatabind() {
		String vulnerableFunction = "com.fasterxml.jackson.databind.jsontype.impl.SubTypeValidator.validateSubType";
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping();
		try {
			final Person john = new Person("John", 25, new DomesticNumber(43, 0));
			String serializedJohn = mapper.writeValueAsString(john);

			if(mapper.readValue(serializedJohn, Person.class) != null) {
				logger.info(String.format("Vulnerable function %s was called.", vulnerableFunction));
				return true;
			}
		} catch (JsonProcessingException e) {
			logger.warn(String.format("Exception while trying to call vulnerable function %s ", vulnerableFunction), e);
		}
		return false;
	}
}
