package com.injuryvision.auth.dto;

import com.injuryvision.common.UserRole;
import com.injuryvision.user.User;

import java.time.Instant;

public class UserResponse {

	private Long id;
	private String fullName;
	private String email;
	private UserRole role;
	private Instant createdAt;

	public static UserResponse from(User user) {
		UserResponse response = new UserResponse();
		response.setId(user.getId());
		response.setFullName(user.getFullName());
		response.setEmail(user.getEmail());
		response.setRole(user.getRole());
		response.setCreatedAt(user.getCreatedAt());
		return response;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public UserRole getRole() {
		return role;
	}

	public void setRole(UserRole role) {
		this.role = role;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}
}
