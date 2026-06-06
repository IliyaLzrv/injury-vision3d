package com.injuryvision.injury;

import com.injuryvision.injury.dto.CreateInjuryLogRequest;
import com.injuryvision.injury.dto.InjuryLogResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/injuries")
public class InjuryLogController {

	private final InjuryLogService injuryLogService;

	public InjuryLogController(InjuryLogService injuryLogService) {
		this.injuryLogService = injuryLogService;
	}

	@PostMapping
	public ResponseEntity<InjuryLogResponse> createInjuryLog(
		@AuthenticationPrincipal String email,
		@Valid @RequestBody CreateInjuryLogRequest request
	) {
		InjuryLogResponse response = injuryLogService.createInjuryLog(email, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
