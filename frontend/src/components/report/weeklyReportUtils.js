export function getLogTimestamp(log) {
	if (log.logDate) {
		const [year, month, day] = log.logDate.split('-').map(Number);
		return new Date(year, month - 1, day).getTime();
	}

	if (log.createdAt) {
		return new Date(log.createdAt).getTime();
	}

	return 0;
}

export function getCurrentWeekRange() {
	const now = new Date();
	const day = now.getDay();
	const diffToMonday = day === 0 ? -6 : 1 - day;

	const start = new Date(now);
	start.setDate(now.getDate() + diffToMonday);
	start.setHours(0, 0, 0, 0);

	const end = new Date(start);
	end.setDate(start.getDate() + 6);
	end.setHours(23, 59, 59, 999);

	return { start, end };
}

export function formatWeekRange(start, end) {
	const options = { month: 'short', day: 'numeric', year: 'numeric' };
	const startLabel = start.toLocaleDateString(undefined, options);
	const endLabel = end.toLocaleDateString(undefined, options);
	return `${startLabel} – ${endLabel}`;
}

export function filterLogsByWeek(logs, weekRange) {
	return logs.filter((log) => {
		const timestamp = getLogTimestamp(log);
		return (
			timestamp >= weekRange.start.getTime() &&
			timestamp <= weekRange.end.getTime()
		);
	});
}
