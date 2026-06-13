package com.injuryvision.report;

import com.injuryvision.auth.InvalidCredentialsException;
import com.injuryvision.common.BodyPart;
import com.injuryvision.common.RecoveryStatus;
import com.injuryvision.injury.InjuryLog;
import com.injuryvision.injury.InjuryLogRepository;
import com.injuryvision.training.TrainingLoad;
import com.injuryvision.training.TrainingLoadRepository;
import com.injuryvision.user.User;
import com.injuryvision.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class SuggestionService {

	private static final int HIGH_PAIN_THRESHOLD = 7;
	private static final int HIGH_TRAINING_LOAD_AVG = 500;
	private static final String LEVEL_INFO = "INFO";
	private static final String LEVEL_CAUTION = "CAUTION";

	private final InjuryLogRepository injuryLogRepository;
	private final TrainingLoadRepository trainingLoadRepository;
	private final UserRepository userRepository;

	public SuggestionService(
		InjuryLogRepository injuryLogRepository,
		TrainingLoadRepository trainingLoadRepository,
		UserRepository userRepository
	) {
		this.injuryLogRepository = injuryLogRepository;
		this.trainingLoadRepository = trainingLoadRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public List<RecoverySuggestion> generateSuggestions(String userEmail) {
		User user = userRepository.findByEmail(userEmail)
			.orElseThrow(InvalidCredentialsException::new);

		LocalDate today = LocalDate.now();
		LocalDate sevenDaysAgo = today.minusDays(6);
		LocalDate fourteenDaysAgo = today.minusDays(13);

		List<InjuryLog> allLogs = injuryLogRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
		List<InjuryLog> logsLast14Days = filterByLogDate(allLogs, fourteenDaysAgo, today);
		List<InjuryLog> logsLast7Days = filterByLogDate(allLogs, sevenDaysAgo, today);
		List<TrainingLoad> trainingLast7Days = filterTrainingByLogDate(
			trainingLoadRepository.findByUserIdOrderByCreatedAtDesc(user.getId()),
			sevenDaysAgo,
			today
		);

		List<RecoverySuggestion> suggestions = new ArrayList<>();

		applyHighSustainedPainRule(suggestions, logsLast14Days);
		applyPainNotImprovingRule(suggestions, logsLast7Days);
		applyHighTrainingLoadRule(suggestions, trainingLast7Days, logsLast7Days);
		applyMultipleActiveAreasRule(suggestions, logsLast7Days);
		applyRecoveringWellRule(suggestions, logsLast7Days);
		applyNoLogsThisWeekRule(suggestions, logsLast7Days);

		suggestions.add(new RecoverySuggestion(
			"These suggestions are based on your self-tracked data only and are not medical advice. "
				+ "If pain is serious or persistent, consult a qualified healthcare professional.",
			LEVEL_INFO
		));

		return suggestions;
	}

	private void applyHighSustainedPainRule(List<RecoverySuggestion> suggestions, List<InjuryLog> logs) {
		Map<BodyPart, Long> highPainCounts = new EnumMap<>(BodyPart.class);

		for (InjuryLog log : logs) {
			if (log.getPainLevel() >= HIGH_PAIN_THRESHOLD) {
				highPainCounts.merge(log.getBodyPart(), 1L, Long::sum);
			}
		}

		for (Map.Entry<BodyPart, Long> entry : highPainCounts.entrySet()) {
			if (entry.getValue() >= 3) {
				suggestions.add(new RecoverySuggestion(
					"Your " + formatBodyPart(entry.getKey())
						+ " has shown high pain across multiple sessions. "
						+ "Consider reducing training intensity and monitoring whether the discomfort improves.",
					LEVEL_CAUTION
				));
			}
		}
	}

	private void applyPainNotImprovingRule(List<RecoverySuggestion> suggestions, List<InjuryLog> logs) {
		Map<BodyPart, List<InjuryLog>> logsByPart = groupByBodyPart(logs);

		for (Map.Entry<BodyPart, List<InjuryLog>> entry : logsByPart.entrySet()) {
			List<InjuryLog> partLogs = entry.getValue();
			if (partLogs.size() < 2) {
				continue;
			}

			partLogs.sort(Comparator.comparing(InjuryLog::getCreatedAt));
			InjuryLog oldest = partLogs.get(0);
			InjuryLog newest = partLogs.get(partLogs.size() - 1);

			if (newest.getPainLevel() > oldest.getPainLevel()) {
				suggestions.add(new RecoverySuggestion(
					"Pain in your " + formatBodyPart(entry.getKey())
						+ " appears to be increasing this week. "
						+ "Consider tracking rest days and monitoring whether this area improves.",
					LEVEL_CAUTION
				));
			}
		}
	}

	private void applyHighTrainingLoadRule(
		List<RecoverySuggestion> suggestions,
		List<TrainingLoad> trainingLoads,
		List<InjuryLog> injuryLogs
	) {
		if (trainingLoads.isEmpty()) {
			return;
		}

		double averageLoad = trainingLoads.stream()
			.mapToInt(TrainingLoad::getLoadScore)
			.average()
			.orElse(0);

		boolean hasActivePain = injuryLogs.stream()
			.anyMatch(log -> log.getRecoveryStatus() == RecoveryStatus.ACTIVE);

		if (averageLoad > HIGH_TRAINING_LOAD_AVG && hasActivePain) {
			suggestions.add(new RecoverySuggestion(
				"Your training load was high this week while you have active pain areas. "
					+ "Tracking rest days alongside your pain logs may help spot patterns.",
				LEVEL_CAUTION
			));
		}
	}

	private void applyMultipleActiveAreasRule(List<RecoverySuggestion> suggestions, List<InjuryLog> logs) {
		long activeBodyParts = logs.stream()
			.filter(log -> log.getRecoveryStatus() == RecoveryStatus.ACTIVE)
			.map(InjuryLog::getBodyPart)
			.distinct()
			.count();

		if (activeBodyParts >= 3) {
			suggestions.add(new RecoverySuggestion(
				"You have multiple active pain areas this week. "
					+ "Consider prioritising rest and monitoring which areas improve first.",
				LEVEL_INFO
			));
		}
	}

	private void applyRecoveringWellRule(List<RecoverySuggestion> suggestions, List<InjuryLog> logs) {
		if (logs.isEmpty()) {
			return;
		}

		boolean hasRecovered = logs.stream()
			.anyMatch(log -> log.getRecoveryStatus() == RecoveryStatus.RECOVERED);

		boolean hasHighPain = logs.stream()
			.anyMatch(log -> log.getPainLevel() >= HIGH_PAIN_THRESHOLD);

		if (hasRecovered && !hasHighPain) {
			suggestions.add(new RecoverySuggestion(
				"Recovery progress looks positive this week based on your self-tracked data. "
					+ "Continue monitoring and maintain awareness of any returning discomfort.",
				LEVEL_INFO
			));
		}
	}

	private void applyNoLogsThisWeekRule(List<RecoverySuggestion> suggestions, List<InjuryLog> logs) {
		if (logs.isEmpty()) {
			suggestions.add(new RecoverySuggestion(
				"No pain logged this week. "
					+ "Keep tracking after sessions to build a useful recovery overview.",
				LEVEL_INFO
			));
		}
	}

	private List<InjuryLog> filterByLogDate(List<InjuryLog> logs, LocalDate start, LocalDate end) {
		return logs.stream()
			.filter(log -> !log.getLogDate().isBefore(start) && !log.getLogDate().isAfter(end))
			.toList();
	}

	private List<TrainingLoad> filterTrainingByLogDate(
		List<TrainingLoad> loads,
		LocalDate start,
		LocalDate end
	) {
		return loads.stream()
			.filter(load -> !load.getLogDate().isBefore(start) && !load.getLogDate().isAfter(end))
			.toList();
	}

	private Map<BodyPart, List<InjuryLog>> groupByBodyPart(List<InjuryLog> logs) {
		Map<BodyPart, List<InjuryLog>> grouped = new EnumMap<>(BodyPart.class);
		for (InjuryLog log : logs) {
			grouped.computeIfAbsent(log.getBodyPart(), key -> new ArrayList<>()).add(log);
		}
		return grouped;
	}

	private String formatBodyPart(BodyPart bodyPart) {
		return bodyPart.name().toLowerCase().replace('_', ' ');
	}
}
