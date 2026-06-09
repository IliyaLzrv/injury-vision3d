package com.injuryvision.training;

import com.injuryvision.auth.InvalidCredentialsException;
import com.injuryvision.training.dto.CreateTrainingLoadRequest;
import com.injuryvision.training.dto.TrainingLoadResponse;
import com.injuryvision.user.User;
import com.injuryvision.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrainingLoadService {

	private final TrainingLoadRepository trainingLoadRepository;
	private final UserRepository userRepository;

	public TrainingLoadService(
		TrainingLoadRepository trainingLoadRepository,
		UserRepository userRepository
	) {
		this.trainingLoadRepository = trainingLoadRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public TrainingLoadResponse createTrainingLoad(String email, CreateTrainingLoadRequest request) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(InvalidCredentialsException::new);

		LocalDate logDate = request.getLogDate() != null ? request.getLogDate() : LocalDate.now();
		int loadScore = request.getDurationMinutes() * request.getIntensity();

		TrainingLoad trainingLoad = new TrainingLoad();
		trainingLoad.setUser(user);
		trainingLoad.setTrainingType(request.getTrainingType());
		trainingLoad.setDurationMinutes(request.getDurationMinutes());
		trainingLoad.setIntensity(request.getIntensity());
		trainingLoad.setLoadScore(loadScore);
		trainingLoad.setNotes(request.getNotes());
		trainingLoad.setLogDate(logDate);

		TrainingLoad saved = trainingLoadRepository.save(trainingLoad);

		return TrainingLoadResponse.from(saved);
	}

	@Transactional(readOnly = true)
	public List<TrainingLoadResponse> getTrainingLoadsForUser(String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(InvalidCredentialsException::new);

		return trainingLoadRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
			.map(TrainingLoadResponse::from)
			.toList();
	}
}
