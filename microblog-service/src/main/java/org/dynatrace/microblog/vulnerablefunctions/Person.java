package org.dynatrace.microblog.vulnerablefunctions;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Person {
	public String name;
	public int age;
	public PhoneNumber phone;

	public Person(
			@JsonProperty("name") String name,
			@JsonProperty("age") int age,
			@JsonProperty("phone") PhoneNumber phone) {
		this.name = name;
		this.age = age;
		this.phone = phone;
	}
}
abstract class PhoneNumber {
	public int areaCode, local;

	public PhoneNumber(int areaCode, int local) {
		this.areaCode = areaCode;
		this.local = local;
	}
}

class DomesticNumber extends PhoneNumber {
	public DomesticNumber(
			@JsonProperty("areaCode") int areaCode,
			@JsonProperty("local") int local) {
		super(areaCode, local);
	}
}
