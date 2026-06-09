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
class RecoveryOverviewIntegrationTest {

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
	void recoveryOverviewWithValidJwtReturnsSummary() throws Exception {
		createInjuryLog("LEFT_KNEE", "PAIN", 8, "ACTIVE", "Sharp pain");
		createInjuryLog("LEFT_KNEE", "STRAIN", 4, "RECOVERING", "Improving");
		createInjuryLog("RIGHT_ANKLE", "SPRAIN", 2, "RECOVERED", "Back to training");

		mockMvc.perform(get("/api/reports/recovery-overview")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.activeCount").value(1))
			.andExpect(jsonPath("$.recoveringCount").value(1))
			.andExpect(jsonPath("$.recoveredCount").value(1))
			.andExpect(jsonPath("$.totalLogs").value(3))
			.andExpect(jsonPath("$.averagePainLevel").value(4.666666666666667))
			.andExpect(jsonPath("$.highestPainLevel").value(8))
			.andExpect(jsonPath("$.mostAffectedBodyPart").value("LEFT_KNEE"))
			.andExpect(jsonPath("$.latestLogDate").exists())
			.andExpect(jsonPath("$.user").doesNotExist())
			.andExpect(jsonPath("$.userId").doesNotExist())
			.andExpect(jsonPath("$.password").doesNotExist());
	}

	@Test
	void recoveryOverviewWithoutJwtFails() throws Exception {
		mockMvc.perform(get("/api/reports/recovery-overview"))
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.message").value("Unauthorized"));
	}

	@Test
	void recoveryOverviewOnlyIncludesCurrentUsersLogs() throws Exception {
		createInjuryLog("LEFT_KNEE", "PAIN", 6, "ACTIVE", "Jordan log");

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

		mockMvc.perform(get("/api/reports/recovery-overview")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.totalLogs").value(1))
			.andExpect(jsonPath("$.activeCount").value(1))
			.andExpect(jsonPath("$.recoveringCount").value(0))
			.andExpect(jsonPath("$.recoveredCount").value(0))
			.andExpect(jsonPath("$.highestPainLevel").value(6))
			.andExpect(jsonPath("$.mostAffectedBodyPart").value("LEFT_KNEE"));
	}

	@Test
	void recoveryOverviewWithNoLogsReturnsSafeDefaults() throws Exception {
		mockMvc.perform(get("/api/reports/recovery-overview")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.activeCount").value(0))
			.andExpect(jsonPath("$.recoveringCount").value(0))
			.andExpect(jsonPath("$.recoveredCount").value(0))
			.andExpect(jsonPath("$.totalLogs").value(0))
			.andExpect(jsonPath("$.averagePainLevel").value(0))
			.andExpect(jsonPath("$.highestPainLevel").value(0))
			.andExpect(jsonPath("$.mostAffectedBodyPart").doesNotExist())
			.andExpect(jsonPath("$.latestLogDate").doesNotExist());
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
