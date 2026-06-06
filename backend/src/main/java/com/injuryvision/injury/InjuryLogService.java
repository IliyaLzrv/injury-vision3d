package com.injuryvision.injury;

import com.injuryvision.auth.InvalidCredentialsException;
import com.injuryvision.injury.dto.CreateInjuryLogRequest;
import com.injuryvision.injury.dto.InjuryLogResponse;
import com.injuryvision.user.User;
import com.injuryvision.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class InjuryLogService {

	private final InjuryLogRepository injuryLogRepository;
	private final UserRepository userRepository;

	public InjuryLogService(InjuryLogRepository injuryLogRepository, UserRepository userRepository) {
		this.injuryLogRepository = injuryLogRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public InjuryLogResponse createInjuryLog(String email, CreateInjuryLogRequest request) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(InvalidCredentialsException::new);

		InjuryLog injuryLog = new InjuryLog();
		injuryLog.setUser(user);
		injuryLog.setBodyPart(request.getBodyPart());
		injuryLog.setInjuryType(request.getInjuryType());
		injuryLog.setPainLevel(request.getPainLevel());
		injuryLog.setRecoveryStatus(request.getRecoveryStatus());
		injuryLog.setNotes(request.getNotes());
		injuryLog.setLogDate(LocalDate.now());

		InjuryLog saved = injuryLogRepository.save(injuryLog);

		return InjuryLogResponse.from(saved);
	}

	@Transactional(readOnly = true)
	public List<InjuryLogResponse> getInjuryLogsForUser(String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(InvalidCredentialsException::new);

		return injuryLogRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
			.map(InjuryLogResponse::from)
			.toList();
	}
}
