package com.injuryvision.injury;

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
class InjuryLogIntegrationTest {

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
	void createInjuryLogWithValidJwtSucceeds() throws Exception {
		ObjectNode request = validInjuryLogRequest();

		mockMvc.perform(post("/api/injuries")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.bodyPart").value("LEFT_KNEE"))
			.andExpect(jsonPath("$.injuryType").value("PAIN"))
			.andExpect(jsonPath("$.painLevel").value(6))
			.andExpect(jsonPath("$.recoveryStatus").value("RECOVERING"))
			.andExpect(jsonPath("$.notes").value("Sore after training"))
			.andExpect(jsonPath("$.logDate").exists())
			.andExpect(jsonPath("$.createdAt").exists())
			.andExpect(jsonPath("$.user").doesNotExist())
			.andExpect(jsonPath("$.userId").doesNotExist());
	}

	@Test
	void createInjuryLogWithoutJwtFails() throws Exception {
		ObjectNode request = validInjuryLogRequest();

		mockMvc.perform(post("/api/injuries")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.message").value("Unauthorized"));
	}

	@Test
	void createInjuryLogWithPainLevelBelowOneFails() throws Exception {
		ObjectNode request = validInjuryLogRequest();
		request.put("painLevel", 0);

		mockMvc.perform(post("/api/injuries")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.painLevel").value("Pain level must be at least 1"));
	}

	@Test
	void createInjuryLogWithPainLevelAboveTenFails() throws Exception {
		ObjectNode request = validInjuryLogRequest();
		request.put("painLevel", 11);

		mockMvc.perform(post("/api/injuries")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.painLevel").value("Pain level must be at most 10"));
	}

	@Test
	void getInjuryLogsWithValidJwtReturnsOwnLogs() throws Exception {
		ObjectNode firstLog = validInjuryLogRequest();
		ObjectNode secondLog = validInjuryLogRequest();
		secondLog.put("bodyPart", "RIGHT_ANKLE");
		secondLog.put("painLevel", 4);

		mockMvc.perform(post("/api/injuries")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(firstLog)))
			.andExpect(status().isCreated());

		mockMvc.perform(post("/api/injuries")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(secondLog)))
			.andExpect(status().isCreated());

		mockMvc.perform(get("/api/injuries")
				.header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(2))
			.andExpect(jsonPath("$[0].bodyPart").value("RIGHT_ANKLE"))
			.andExpect(jsonPath("$[1].bodyPart").value("LEFT_KNEE"))
			.andExpect(jsonPath("$[0].user").doesNotExist())
			.andExpect(jsonPath("$[0].userId").doesNotExist());
	}

	@Test
	void getInjuryLogsWithoutJwtFails() throws Exception {
		mockMvc.perform(get("/api/injuries"))
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.message").value("Unauthorized"));
	}

	@Test
	void getInjuryLogsDoesNotReturnAnotherUsersLogs() throws Exception {
		ObjectNode request = validInjuryLogRequest();

		mockMvc.perform(post("/api/injuries")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isCreated());

		RegisterRequest otherUser = new RegisterRequest();
		otherUser.setFullName("Alex Athlete");
		otherUser.setEmail("alex@example.com");
		otherUser.setPassword("secret123");

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(otherUser)))
			.andExpect(status().isCreated());

		String otherToken = loginAndGetToken("alex@example.com", "secret123");

		mockMvc.perform(get("/api/injuries")
				.header("Authorization", "Bearer " + otherToken))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(0));
	}

	@Test
	void createInjuryLogWithMissingRequiredFieldsFails() throws Exception {
		ObjectNode request = objectMapper.createObjectNode();
		request.put("notes", "Missing required fields");

		mockMvc.perform(post("/api/injuries")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Validation failed"))
			.andExpect(jsonPath("$.errors.bodyPart").value("Body part is required"))
			.andExpect(jsonPath("$.errors.injuryType").value("Injury type is required"))
			.andExpect(jsonPath("$.errors.painLevel").value("Pain level is required"))
			.andExpect(jsonPath("$.errors.recoveryStatus").value("Recovery status is required"));
	}

	private ObjectNode validInjuryLogRequest() {
		ObjectNode request = objectMapper.createObjectNode();
		request.put("bodyPart", "LEFT_KNEE");
		request.put("injuryType", "PAIN");
		request.put("painLevel", 6);
		request.put("recoveryStatus", "RECOVERING");
		request.put("notes", "Sore after training");
		return request;
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
