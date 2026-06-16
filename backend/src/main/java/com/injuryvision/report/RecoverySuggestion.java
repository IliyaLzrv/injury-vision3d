package com.injuryvision.report;

public class RecoverySuggestion {

	private String message;
	private String level;

	public RecoverySuggestion() {
	}

	public RecoverySuggestion(String message, String level) {
		this.message = message;
		this.level = level;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}
}
