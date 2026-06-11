import { useMemo } from 'react';
import { BODY_PART_LABELS } from '../body/bodyParts.js';
import { formatLabel } from '../injury/injuryLogUtils.js';
import { getLogTimestamp } from './weeklyReportUtils.js';

function painBarWidth(level) {
	return `${Math.min(100, Math.max(0, level * 10))}%`;
}

function painBarColor(level) {
	if (level >= 7) return '#ef4444';
	if (level >= 4) return '#f97316';
	return '#22c55e';
}

export default function WeeklyBodyPartSummary({ logs = [] }) {
	const bodyPartEntries = useMemo(() => {
		const latestByPart = new Map();

		for (const log of logs) {
			const key = log.bodyPart;
			const existing = latestByPart.get(key);
			if (!existing || getLogTimestamp(log) > getLogTimestamp(existing)) {
				latestByPart.set(key, log);
			}
		}

		return [...latestByPart.values()].sort(
			(a, b) => getLogTimestamp(b) - getLogTimestamp(a)
		);
	}, [logs]);

	return (
		<section
			className="h-full rounded-2xl border p-6 shadow-sm"
			style={{
				borderColor: '#e2e8f0',
				backgroundColor: '#ffffff',
			}}
		>
			<h2 className="text-lg font-semibold" style={{ color: '#0f172a' }}>
				Body Part Summary
			</h2>
			<p className="mt-1 text-sm" style={{ color: '#64748b' }}>
				Latest self-tracked pain per area this week
			</p>

			{bodyPartEntries.length === 0 ? (
				<p
					className="mt-6 rounded-lg border border-dashed px-4 py-6 text-center text-sm"
					style={{
						borderColor: '#cbd5e1',
						backgroundColor: '#f8fafc',
						color: '#64748b',
					}}
				>
					No body part data logged this week.
				</p>
			) : (
				<ul className="mt-6 space-y-4">
					{bodyPartEntries.map((log) => (
						<li key={log.id ?? log.bodyPart}>
							<div className="mb-1.5 flex items-center justify-between gap-2">
								<span className="text-sm font-medium" style={{ color: '#334155' }}>
									{formatLabel(log.bodyPart, BODY_PART_LABELS)}
								</span>
								<span className="text-xs font-semibold" style={{ color: '#64748b' }}>
									{log.painLevel}/10
								</span>
							</div>
							<div
								className="h-2 overflow-hidden rounded-full"
								style={{ backgroundColor: '#f1f5f9' }}
							>
								<div
									className="h-full rounded-full"
									style={{
										width: painBarWidth(log.painLevel),
										backgroundColor: painBarColor(log.painLevel),
									}}
								/>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
