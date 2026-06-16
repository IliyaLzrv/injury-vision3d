package com.injuryvision.training;

import com.injuryvision.training.dto.CreateTrainingLoadRequest;
import com.injuryvision.training.dto.TrainingLoadResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/training-loads")
public class TrainingLoadController {

	private final TrainingLoadService trainingLoadService;

	public TrainingLoadController(TrainingLoadService trainingLoadService) {
		this.trainingLoadService = trainingLoadService;
	}

	@GetMapping
	public ResponseEntity<List<TrainingLoadResponse>> getTrainingLoads(
		@AuthenticationPrincipal String email
	) {
		List<TrainingLoadResponse> loads = trainingLoadService.getTrainingLoadsForUser(email);
		return ResponseEntity.ok(loads);
	}

	@PostMapping
	public ResponseEntity<TrainingLoadResponse> createTrainingLoad(
		@AuthenticationPrincipal String email,
		@Valid @RequestBody CreateTrainingLoadRequest request
	) {
		TrainingLoadResponse response = trainingLoadService.createTrainingLoad(email, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
