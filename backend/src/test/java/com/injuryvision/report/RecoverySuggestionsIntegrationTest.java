package com.injuryvision.report;

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
class RecoverySuggestionsIntegrationTest {

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
	void suggestionsWithoutJwtFails() throws Exception {
		mockMvc.perform(get("/api/reports/suggestions"))
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.message").value("Unauthorized"));
	}

	@Test
	void suggestionsWithNoLogsReturnsNoLogsAndDisclaimer() throws Exception {
		mockMvc.perform(get("/api/reports/suggestions")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(2))
			.andExpect(jsonPath("$[0].level").value("INFO"))
			.andExpect(jsonPath("$[0].message").value(
				"No pain logged this week. Keep tracking after sessions to build a useful recovery overview."
			))
			.andExpect(jsonPath("$[1].message").value(
				"These suggestions are based on your self-tracked data only and are not medical advice. "
					+ "If pain is serious or persistent, consult a qualified healthcare professional."
			));
	}

	@Test
	void suggestionsIncludeHighSustainedPainRule() throws Exception {
		createInjuryLog("LEFT_KNEE", "PAIN", 8, "ACTIVE", "High pain 1");
		createInjuryLog("LEFT_KNEE", "PAIN", 9, "ACTIVE", "High pain 2");
		createInjuryLog("LEFT_KNEE", "PAIN", 7, "ACTIVE", "High pain 3");

		mockMvc.perform(get("/api/reports/suggestions")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].level").value("CAUTION"))
			.andExpect(jsonPath("$[0].message").value(
				"Your left knee has shown high pain across multiple sessions. "
					+ "Consider reducing training intensity and monitoring whether the discomfort improves."
			))
			.andExpect(jsonPath("$[?(@.message =~ /.*not medical advice.*/)]").exists());
	}

	@Test
	void suggestionsIncludePainIncreasingRule() throws Exception {
		createInjuryLog("RIGHT_ANKLE", "PAIN", 4, "ACTIVE", "Earlier pain");
		createInjuryLog("RIGHT_ANKLE", "PAIN", 6, "ACTIVE", "Later pain");

		mockMvc.perform(get("/api/reports/suggestions")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].level").value("CAUTION"))
			.andExpect(jsonPath("$[0].message").value(
				"Pain in your right ankle appears to be increasing this week. "
					+ "Consider tracking rest days and monitoring whether this area improves."
			));
	}

	@Test
	void suggestionsIncludeRecoveringWellRule() throws Exception {
		createInjuryLog("LEFT_KNEE", "PAIN", 3, "RECOVERED", "Feeling better");

		mockMvc.perform(get("/api/reports/suggestions")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].level").value("INFO"))
			.andExpect(jsonPath("$[0].message").value(
				"Recovery progress looks positive this week based on your self-tracked data. "
					+ "Continue monitoring and maintain awareness of any returning discomfort."
			));
	}

	@Test
	void suggestionsOnlyIncludeCurrentUsersData() throws Exception {
		RegisterRequest otherUser = new RegisterRequest();
		otherUser.setFullName("Alex Athlete");
		otherUser.setEmail("alex@example.com");
		otherUser.setPassword("secret123");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(otherUser)))
			.andExpect(status().isCreated());

		String otherToken = loginAndGetToken("alex@example.com", "secret123");

		createInjuryLogWithToken(otherToken, "HEAD", "PAIN", 9, "ACTIVE", "Alex log 1");
		createInjuryLogWithToken(otherToken, "CHEST", "PAIN", 9, "ACTIVE", "Alex log 2");
		createInjuryLogWithToken(otherToken, "ABDOMEN", "PAIN", 9, "ACTIVE", "Alex log 3");

		mockMvc.perform(get("/api/reports/suggestions")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(2))
			.andExpect(jsonPath("$[0].message").value(
				"No pain logged this week. Keep tracking after sessions to build a useful recovery overview."
			));
	}

	private void createInjuryLog(
		String bodyPart,
		String injuryType,
		int painLevel,
		String recoveryStatus,
		String notes
	) throws Exception {
		createInjuryLogWithToken(token, bodyPart, injuryType, painLevel, recoveryStatus, notes);
	}

	private void createInjuryLogWithToken(
		String authToken,
		String bodyPart,
		String injuryType,
		int painLevel,
		String recoveryStatus,
		String notes
	) throws Exception {
		ObjectNode request = objectMapper.createObjectNode();
		request.put("bodyPart", bodyPart);
		request.put("injuryType", injuryType);
		request.put("painLevel", painLevel);
		request.put("recoveryStatus", recoveryStatus);
		request.put("notes", notes);

		mockMvc.perform(post("/api/injuries")
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
