package com.injuryvision.report;

import com.injuryvision.report.dto.RecoveryOverviewResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

	private final ReportService reportService;
	private final SuggestionService suggestionService;

	public ReportController(ReportService reportService, SuggestionService suggestionService) {
		this.reportService = reportService;
		this.suggestionService = suggestionService;
	}

	@GetMapping("/recovery-overview")
	public ResponseEntity<RecoveryOverviewResponse> getRecoveryOverview(
		@AuthenticationPrincipal String email
	) {
		RecoveryOverviewResponse overview = reportService.getRecoveryOverview(email);
		return ResponseEntity.ok(overview);
	}

	@GetMapping("/suggestions")
	public ResponseEntity<List<RecoverySuggestion>> getSuggestions(
		@AuthenticationPrincipal String email
	) {
		List<RecoverySuggestion> suggestions = suggestionService.generateSuggestions(email);
		return ResponseEntity.ok(suggestions);
	}
}
