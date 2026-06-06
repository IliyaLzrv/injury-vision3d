package com.injuryvision.injury;

public class InjuryLogNotFoundException extends RuntimeException {

	public InjuryLogNotFoundException() {
		super("Injury log not found");
	}
}
