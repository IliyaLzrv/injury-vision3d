package com.injuryvision.report;

import com.injuryvision.report.dto.RecoveryOverviewResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

	private final ReportService reportService;

	public ReportController(ReportService reportService) {
		this.reportService = reportService;
	}

	@GetMapping("/recovery-overview")
	public ResponseEntity<RecoveryOverviewResponse> getRecoveryOverview(
		@AuthenticationPrincipal String email
	) {
		RecoveryOverviewResponse overview = reportService.getRecoveryOverview(email);
		return ResponseEntity.ok(overview);
	}
}
