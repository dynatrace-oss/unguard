package org.dynatrace.microblog.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

class VulnerableFunctionCallerTest {

	String vulnerableLib = "com.fasterxml.jackson.databind";

	@Test
	void callVulnerableFunction_callsVulnerableFunction() {
		String expectedVulnerableFunction = "com.fasterxml.jackson.databind.jsontype.impl.SubTypeValidator.validateSubType";
		VulnerableFunctionCaller vulnerableFunctionCaller = new VulnerableFunctionCaller();

		String vulnerableFunction = vulnerableFunctionCaller.callVulnerableFunctionOf(vulnerableLib);

		assertThat(vulnerableFunction).isEqualTo(expectedVulnerableFunction);
	}

	@Test
	void name2() throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enableDefaultTyping();

		final Person john = new Person("john", 25, new DomesticNumber(43, 0));

		String serializedJohn = mapper.writeValueAsString(john);

		//here the vulnerable function of "com.fasterxml.jackson.databind.jsontype.impl.SubTypeValidator.validateSubType" is called
		Person deserializedJohn = mapper.readValue(serializedJohn, Person.class);

	}
}

class Person {
	public String name;
	public int age;
	public PhoneNumber phone;

	public Person() {
	}
	public Person(String name, int age, PhoneNumber phone) {
		this.name = name;
		this.age = age;
		this.phone = phone;
	}
}
abstract class PhoneNumber {
	public int areaCode, local;

	public PhoneNumber() {
	}
	public PhoneNumber(int areaCode, int local) {
		this.areaCode = areaCode;
		this.local = local;
	}
}
class InternationalNumber extends PhoneNumber {
	public int countryCode;

	public InternationalNumber() {
	}
	public InternationalNumber(int areaCode, int local, int countryCode) {
		super(areaCode, local);
		this.countryCode = countryCode;
	}
}
class DomesticNumber extends PhoneNumber {
	public DomesticNumber() {
	}
	public DomesticNumber(int areaCode, int local) {
		super(areaCode, local);
	}
}




