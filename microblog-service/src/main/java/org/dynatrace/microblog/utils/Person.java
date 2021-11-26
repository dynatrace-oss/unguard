package org.dynatrace.microblog.utils;

public class Person {
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
