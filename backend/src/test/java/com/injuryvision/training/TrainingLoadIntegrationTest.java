package com.injuryvision.training;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.injuryvision.auth.dto.LoginRequest;
import com.injuryvision.auth.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TrainingLoadIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	private String token;

	@BeforeEach
	void setUp() throws Exception {
		RegisterRequest registerRequest = new RegisterRequest();
		registerRequest.setFullName("Jordan Athlete");
		registerRequest.setEmail("jordan@example.com");
		registerRequest.setPassword("secret123");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(registerRequest)))
			.andExpect(status().isCreated());

		token = loginAndGetToken("jordan@example.com", "secret123");
	}

	@Test
	void createTrainingLoadWithValidJwtSucceeds() throws Exception {
		ObjectNode request = validTrainingLoadRequest();

		mockMvc.perform(post("/api/training-loads")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.trainingType").value("RUNNING"))
			.andExpect(jsonPath("$.durationMinutes").value(45))
			.andExpect(jsonPath("$.intensity").value(7))
			.andExpect(jsonPath("$.loadScore").value(315))
			.andExpect(jsonPath("$.notes").value("Evening run"))
			.andExpect(jsonPath("$.logDate").exists())
			.andExpect(jsonPath("$.createdAt").exists())
			.andExpect(jsonPath("$.user").doesNotExist())
			.andExpect(jsonPath("$.userId").doesNotExist());
	}

	@Test
	void createTrainingLoadWithoutJwtFails() throws Exception {
		ObjectNode request = validTrainingLoadRequest();

		mockMvc.perform(post("/api/training-loads")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.message").value("Unauthorized"));
	}

	@Test
	void getTrainingLoadsWithValidJwtReturnsOwnLogs() throws Exception {
		createTrainingLoadWithToken(token, "GYM", 60, 8, "Strength session");
		createTrainingLoadWithToken(token, "RECOVERY", 30, 3, "Light mobility");

		mockMvc.perform(get("/api/training-loads")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(2))
			.andExpect(jsonPath("$[0].trainingType").value("RECOVERY"))
			.andExpect(jsonPath("$[1].trainingType").value("GYM"))
			.andExpect(jsonPath("$[0].user").doesNotExist());
	}

	@Test
	void getTrainingLoadsDoesNotReturnAnotherUsersLogs() throws Exception {
		createTrainingLoadWithToken(token, "RUNNING", 40, 6, "Jordan run");

		RegisterRequest otherUser = new RegisterRequest();
		otherUser.setFullName("Alex Athlete");
		otherUser.setEmail("alex@example.com");
		otherUser.setPassword("secret123");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(otherUser)))
			.andExpect(status().isCreated());

		String otherToken = loginAndGetToken("alex@example.com", "secret123");
		createTrainingLoadWithToken(otherToken, "BASKETBALL", 90, 9, "Alex practice");
		createTrainingLoadWithToken(otherToken, "FOOTBALL", 80, 8, "Alex match");

		mockMvc.perform(get("/api/training-loads")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(1))
			.andExpect(jsonPath("$[0].trainingType").value("RUNNING"));
	}

	@Test
	void createTrainingLoadWithIntensityBelowOneFails() throws Exception {
		ObjectNode request = validTrainingLoadRequest();
		request.put("intensity", 0);

		mockMvc.perform(post("/api/training-loads")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.intensity").value("Intensity must be at least 1"));
	}

	@Test
	void createTrainingLoadWithIntensityAboveTenFails() throws Exception {
		ObjectNode request = validTrainingLoadRequest();
		request.put("intensity", 11);

		mockMvc.perform(post("/api/training-loads")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.intensity").value("Intensity must be at most 10"));
	}

	@Test
	void createTrainingLoadWithInvalidDurationFails() throws Exception {
		ObjectNode request = validTrainingLoadRequest();
		request.put("durationMinutes", 0);

		mockMvc.perform(post("/api/training-loads")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.durationMinutes").value("Duration must be at least 1 minute"));
	}

	private ObjectNode validTrainingLoadRequest() {
		ObjectNode request = objectMapper.createObjectNode();
		request.put("trainingType", "RUNNING");
		request.put("durationMinutes", 45);
		request.put("intensity", 7);
		request.put("notes", "Evening run");
		return request;
	}

	private void createTrainingLoadWithToken(
		String authToken,
		String trainingType,
		int durationMinutes,
		int intensity,
		String notes
	) throws Exception {
		ObjectNode request = objectMapper.createObjectNode();
		request.put("trainingType", trainingType);
		request.put("durationMinutes", durationMinutes);
		request.put("intensity", intensity);
		request.put("notes", notes);

		mockMvc.perform(post("/api/training-loads")
				.header("Authorization", "Bearer " + authToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated());
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		LoginRequest request = new LoginRequest();
		request.setEmail(email);
		request.setPassword(password);

		String responseBody = mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();

		JsonNode json = objectMapper.readTree(responseBody);
		String loginToken = json.get("token").asText();
		assertThat(loginToken).isNotBlank();
		return loginToken;
	}
}
