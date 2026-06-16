package com.injuryvision.report;

import com.injuryvision.auth.InvalidCredentialsException;
import com.injuryvision.common.BodyPart;
import com.injuryvision.common.RecoveryStatus;
import com.injuryvision.injury.InjuryLog;
import com.injuryvision.injury.InjuryLogRepository;
import com.injuryvision.report.dto.RecoveryOverviewResponse;
import com.injuryvision.user.User;
import com.injuryvision.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

	private final InjuryLogRepository injuryLogRepository;
	private final UserRepository userRepository;

	public ReportService(InjuryLogRepository injuryLogRepository, UserRepository userRepository) {
		this.injuryLogRepository = injuryLogRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public RecoveryOverviewResponse getRecoveryOverview(String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(InvalidCredentialsException::new);

		List<InjuryLog> logs = injuryLogRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

		RecoveryOverviewResponse response = new RecoveryOverviewResponse();
		response.setTotalLogs(logs.size());

		if (logs.isEmpty()) {
			response.setActiveCount(0);
			response.setRecoveringCount(0);
			response.setRecoveredCount(0);
			response.setAveragePainLevel(0);
			response.setHighestPainLevel(0);
			response.setMostAffectedBodyPart(null);
			response.setLatestLogDate(null);
			return response;
		}

		long activeCount = 0;
		long recoveringCount = 0;
		long recoveredCount = 0;
		int painSum = 0;
		int highestPainLevel = 0;
		Map<BodyPart, Long> bodyPartCounts = new EnumMap<>(BodyPart.class);

		for (InjuryLog log : logs) {
			RecoveryStatus status = log.getRecoveryStatus();
			if (status == RecoveryStatus.ACTIVE) {
				activeCount++;
			} else if (status == RecoveryStatus.RECOVERING) {
				recoveringCount++;
			} else if (status == RecoveryStatus.RECOVERED) {
				recoveredCount++;
			}

			int painLevel = log.getPainLevel();
			painSum += painLevel;
			if (painLevel > highestPainLevel) {
				highestPainLevel = painLevel;
			}

			bodyPartCounts.merge(log.getBodyPart(), 1L, Long::sum);
		}

		response.setActiveCount(activeCount);
		response.setRecoveringCount(recoveringCount);
		response.setRecoveredCount(recoveredCount);
		response.setAveragePainLevel((double) painSum / logs.size());
		response.setHighestPainLevel(highestPainLevel);
		response.setMostAffectedBodyPart(findMostAffectedBodyPart(bodyPartCounts));
		response.setLatestLogDate(logs.get(0).getLogDate());

		return response;
	}

	private BodyPart findMostAffectedBodyPart(Map<BodyPart, Long> bodyPartCounts) {
		BodyPart mostAffected = null;
		long highestCount = 0;

		for (Map.Entry<BodyPart, Long> entry : bodyPartCounts.entrySet()) {
			long count = entry.getValue();
			if (count > highestCount) {
				highestCount = count;
				mostAffected = entry.getKey();
			}
		}

		return mostAffected;
	}
}
