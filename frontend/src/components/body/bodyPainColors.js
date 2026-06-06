/** Neutral body color when no injury log exists for a part. */
export const BODY_STATUS_COLORS = {
	NONE: '#94a3b8',
	LOW_PAIN: '#a3e635',
	MEDIUM_PAIN: '#f97316',
	HIGH_PAIN: '#ef4444',
	RECOVERING: '#818cf8',
	RECOVERED: '#22c55e',
};

export const BODY_PAIN_LEGEND = [
	{ key: 'none', label: 'No log', color: BODY_STATUS_COLORS.NONE },
	{ key: 'low', label: 'Low pain', color: BODY_STATUS_COLORS.LOW_PAIN },
	{ key: 'medium', label: 'Medium pain', color: BODY_STATUS_COLORS.MEDIUM_PAIN },
	{ key: 'high', label: 'High pain', color: BODY_STATUS_COLORS.HIGH_PAIN },
	{ key: 'recovering', label: 'Recovering', color: BODY_STATUS_COLORS.RECOVERING },
	{ key: 'recovered', label: 'Recovered', color: BODY_STATUS_COLORS.RECOVERED },
];

const SELECTED_COLOR = '#6ee7b7';

function getLogTimestamp(log) {
	if (log.createdAt) {
		return new Date(log.createdAt).getTime();
	}

	if (log.logDate) {
		return new Date(log.logDate).getTime();
	}

	return 0;
}

export function buildLatestLogByBodyPart(injuryLogs = []) {
	const latestByPart = {};

	for (const log of injuryLogs) {
		if (!log?.bodyPart) {
			continue;
		}

		const existing = latestByPart[log.bodyPart];
		if (!existing || getLogTimestamp(log) > getLogTimestamp(existing)) {
			latestByPart[log.bodyPart] = log;
		}
	}

	return latestByPart;
}

export function getBodyPartStatusColor(log) {
	if (!log) {
		return BODY_STATUS_COLORS.NONE;
	}

	if (log.recoveryStatus === 'RECOVERED') {
		return BODY_STATUS_COLORS.RECOVERED;
	}

	if (log.recoveryStatus === 'RECOVERING') {
		return BODY_STATUS_COLORS.RECOVERING;
	}

	if (log.recoveryStatus === 'ACTIVE') {
		const painLevel = Number(log.painLevel);
		if (painLevel >= 7) {
			return BODY_STATUS_COLORS.HIGH_PAIN;
		}
		if (painLevel >= 4) {
			return BODY_STATUS_COLORS.MEDIUM_PAIN;
		}
		return BODY_STATUS_COLORS.LOW_PAIN;
	}

	return BODY_STATUS_COLORS.NONE;
}

export function brightenColor(hex, amount = 0.18) {
	const normalized = hex.replace('#', '');
	const num = Number.parseInt(normalized, 16);
	const r = Math.min(255, ((num >> 16) & 255) + Math.round(255 * amount));
	const g = Math.min(255, ((num >> 8) & 255) + Math.round(255 * amount));
	const b = Math.min(255, (num & 255) + Math.round(255 * amount));

	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getBodyPartDisplayColor({
	bodyPart,
	latestLogByBodyPart,
	selectedBodyPart,
	hovered,
}) {
	if (selectedBodyPart === bodyPart) {
		return SELECTED_COLOR;
	}

	const statusColor = getBodyPartStatusColor(latestLogByBodyPart[bodyPart]);

	if (hovered) {
		return brightenColor(statusColor);
	}

	return statusColor;
}
