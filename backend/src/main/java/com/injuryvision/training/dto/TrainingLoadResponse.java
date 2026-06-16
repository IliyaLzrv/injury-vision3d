package com.injuryvision.training.dto;

import com.injuryvision.common.TrainingType;
import com.injuryvision.training.TrainingLoad;

import java.time.Instant;
import java.time.LocalDate;

public class TrainingLoadResponse {

	private Long id;
	private TrainingType trainingType;
	private Integer durationMinutes;
	private Integer intensity;
	private Integer loadScore;
	private String notes;
	private LocalDate logDate;
	private Instant createdAt;

	public static TrainingLoadResponse from(TrainingLoad trainingLoad) {
		TrainingLoadResponse response = new TrainingLoadResponse();
		response.setId(trainingLoad.getId());
		response.setTrainingType(trainingLoad.getTrainingType());
		response.setDurationMinutes(trainingLoad.getDurationMinutes());
		response.setIntensity(trainingLoad.getIntensity());
		response.setLoadScore(trainingLoad.getLoadScore());
		response.setNotes(trainingLoad.getNotes());
		response.setLogDate(trainingLoad.getLogDate());
		response.setCreatedAt(trainingLoad.getCreatedAt());
		return response;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public Integer getLoadScore() {
		return loadScore;
	}

	public void setLoadScore(Integer loadScore) {
		this.loadScore = loadScore;
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

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}
}
