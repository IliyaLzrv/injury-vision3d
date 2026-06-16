package com.injuryvision.injury.dto;

import com.injuryvision.common.BodyPart;
import com.injuryvision.common.InjuryType;
import com.injuryvision.common.RecoveryStatus;
import com.injuryvision.injury.InjuryLog;

import java.time.Instant;
import java.time.LocalDate;

public class InjuryLogResponse {

	private Long id;
	private BodyPart bodyPart;
	private InjuryType injuryType;
	private Integer painLevel;
	private RecoveryStatus recoveryStatus;
	private String notes;
	private LocalDate logDate;
	private Instant createdAt;

	public static InjuryLogResponse from(InjuryLog injuryLog) {
		InjuryLogResponse response = new InjuryLogResponse();
		response.setId(injuryLog.getId());
		response.setBodyPart(injuryLog.getBodyPart());
		response.setInjuryType(injuryLog.getInjuryType());
		response.setPainLevel(injuryLog.getPainLevel());
		response.setRecoveryStatus(injuryLog.getRecoveryStatus());
		response.setNotes(injuryLog.getNotes());
		response.setLogDate(injuryLog.getLogDate());
		response.setCreatedAt(injuryLog.getCreatedAt());
		return response;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BodyPart getBodyPart() {
		return bodyPart;
	}

	public void setBodyPart(BodyPart bodyPart) {
		this.bodyPart = bodyPart;
	}

	public InjuryType getInjuryType() {
		return injuryType;
	}

	public void setInjuryType(InjuryType injuryType) {
		this.injuryType = injuryType;
	}

	public Integer getPainLevel() {
		return painLevel;
	}

	public void setPainLevel(Integer painLevel) {
		this.painLevel = painLevel;
	}

	public RecoveryStatus getRecoveryStatus() {
		return recoveryStatus;
	}

	public void setRecoveryStatus(RecoveryStatus recoveryStatus) {
		this.recoveryStatus = recoveryStatus;
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
