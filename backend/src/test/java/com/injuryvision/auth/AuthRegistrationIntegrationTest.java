package com.injuryvision.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.injuryvision.auth.dto.RegisterRequest;
import com.injuryvision.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthRegistrationIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	@Test
	void registerNewUserSuccessfully() throws Exception {
		RegisterRequest request = new RegisterRequest();
		request.setFullName("Alex Runner");
		request.setEmail("alex@example.com");
		request.setPassword("secret123");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.message").value("Registration successful"))
			.andExpect(jsonPath("$.token").isNotEmpty())
			.andExpect(jsonPath("$.user.fullName").value("Alex Runner"))
			.andExpect(jsonPath("$.user.email").value("alex@example.com"))
			.andExpect(jsonPath("$.user.role").value("ATHLETE"))
			.andExpect(jsonPath("$.user.id").exists())
			.andExpect(jsonPath("$.user.createdAt").exists())
			.andExpect(jsonPath("$.user.password").doesNotExist());

		var savedUser = userRepository.findByEmail("alex@example.com").orElseThrow();
		assertThat(savedUser.getPassword()).isNotEqualTo("secret123");
		assertThat(savedUser.getPassword()).startsWith("$2a$");
	}

	@Test
	void rejectDuplicateEmail() throws Exception {
		RegisterRequest request = new RegisterRequest();
		request.setFullName("Alex Runner");
		request.setEmail("duplicate@example.com");
		request.setPassword("secret123");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated());

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.message").value("Email is already registered"));
	}

	@Test
	void rejectPasswordTooShort() throws Exception {
		RegisterRequest request = new RegisterRequest();
		request.setFullName("Alex Runner");
		request.setEmail("shortpass@example.com");
		request.setPassword("12345");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.password").value("Password must be at least 6 characters"));
	}

	@Test
	void rejectInvalidEmailFormat() throws Exception {
		RegisterRequest request = new RegisterRequest();
		request.setFullName("Alex Runner");
		request.setEmail("not-an-email");
		request.setPassword("secret123");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors.email").value("Email must be valid"));
	}

	@Test
	void rejectMissingRequiredFields() throws Exception {
		RegisterRequest request = new RegisterRequest();

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.fullName").value("Full name is required"))
			.andExpect(jsonPath("$.errors.email").value("Email is required"))
			.andExpect(jsonPath("$.errors.password").value("Password is required"));
	}
}
