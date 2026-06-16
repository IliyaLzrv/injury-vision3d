package com.injuryvision.training.dto;

import com.injuryvision.common.TrainingType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreateTrainingLoadRequest {

	@NotNull(message = "Training type is required")
	private TrainingType trainingType;

	@NotNull(message = "Duration is required")
	@Min(value = 1, message = "Duration must be at least 1 minute")
	private Integer durationMinutes;

	@NotNull(message = "Intensity is required")
	@Min(value = 1, message = "Intensity must be at least 1")
	@Max(value = 10, message = "Intensity must be at most 10")
	private Integer intensity;

	@Size(max = 2000, message = "Notes must be at most 2000 characters")
	private String notes;

	private LocalDate logDate;

	public TrainingType getTrainingType() {
		return trainingType;
	}

	public void setTrainingType(TrainingType trainingType) {
		this.trainingType = trainingType;
	}

	public Integer getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(Integer durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public Integer getIntensity() {
		return intensity;
	}

	public void setIntensity(Integer intensity) {
		this.intensity = intensity;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDate getLogDate() {
		return logDate;
	}

	public void setLogDate(LocalDate logDate) {
		this.logDate = logDate;
	}
}
