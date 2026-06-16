package com.injuryvision.injury.dto;

import com.injuryvision.common.BodyPart;
import com.injuryvision.common.InjuryType;
import com.injuryvision.common.RecoveryStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateInjuryLogRequest {

	@NotNull(message = "Body part is required")
	private BodyPart bodyPart;

	@NotNull(message = "Injury type is required")
	private InjuryType injuryType;

	@NotNull(message = "Pain level is required")
	@Min(value = 1, message = "Pain level must be at least 1")
	@Max(value = 10, message = "Pain level must be at most 10")
	private Integer painLevel;

	@NotNull(message = "Recovery status is required")
	private RecoveryStatus recoveryStatus;

	@Size(max = 2000, message = "Notes must be at most 2000 characters")
	private String notes;

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
}
