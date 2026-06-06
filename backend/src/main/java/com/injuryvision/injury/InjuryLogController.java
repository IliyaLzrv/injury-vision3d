package com.injuryvision.injury;

import com.injuryvision.injury.dto.CreateInjuryLogRequest;
import com.injuryvision.injury.dto.InjuryLogResponse;
import com.injuryvision.injury.dto.UpdateInjuryLogRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/injuries")
public class InjuryLogController {

	private final InjuryLogService injuryLogService;

	public InjuryLogController(InjuryLogService injuryLogService) {
		this.injuryLogService = injuryLogService;
	}

	@GetMapping
	public ResponseEntity<List<InjuryLogResponse>> getInjuryLogs(
		@AuthenticationPrincipal String email
	) {
		List<InjuryLogResponse> logs = injuryLogService.getInjuryLogsForUser(email);
		return ResponseEntity.ok(logs);
	}

	@PostMapping
	public ResponseEntity<InjuryLogResponse> createInjuryLog(
		@AuthenticationPrincipal String email,
		@Valid @RequestBody CreateInjuryLogRequest request
	) {
		InjuryLogResponse response = injuryLogService.createInjuryLog(email, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<InjuryLogResponse> updateInjuryLog(
		@AuthenticationPrincipal String email,
		@PathVariable Long id,
		@Valid @RequestBody UpdateInjuryLogRequest request
	) {
		InjuryLogResponse response = injuryLogService.updateInjuryLog(email, id, request);
		return ResponseEntity.ok(response);
	}
}
