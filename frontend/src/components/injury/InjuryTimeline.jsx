import { useMemo, useState } from 'react';
import { BODY_PART_LABELS } from '../body/bodyParts.js';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import { buttonStyles } from '../ui/buttonStyles.js';
import { getLogTimestamp } from '../report/weeklyReportUtils.js';
import EditInjuryLogModal from './EditInjuryLogModal.jsx';
import {
	formatLabel,
	formatLogDate,
	INJURY_TYPE_LABELS,
	RECOVERY_STATUS_LABELS,
} from './injuryLogUtils.js';

function recoveryBadgeVariant(status) {
	if (status === 'RECOVERED') return 'green';
	if (status === 'RECOVERING') return 'indigo';
	return 'orange';
}

export default function InjuryTimeline({
	logs = [],
	loading = false,
	errorMessage = '',
	onRefresh,
	showHeader = true,
}) {
	const [editingLog, setEditingLog] = useState(null);

	const sortedLogs = useMemo(
		() => [...logs].sort((a, b) => getLogTimestamp(b) - getLogTimestamp(a)),
		[logs]
	);

	function handleUpdateSuccess() {
		onRefresh?.();
	}

	return (
		<>
			<section>
				{showHeader && (
					<header className="mb-5">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<h2 className="text-xl font-semibold tracking-tight text-slate-900">
									Injury History
								</h2>
								<p className="mt-1.5 max-w-2xl text-sm text-slate-500">
									Timeline of all logged pain entries across all body parts.
								</p>
							</div>
							<Badge variant="teal">High-Fidelity Prototype</Badge>
						</div>

						<div className="mt-4 flex flex-wrap gap-2">
							{['Body Part', 'Status', 'Activity Type', 'Last 30 days'].map(
								(filter) => (
									<span
										key={filter}
										className="cursor-default rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm"
										title="Visual filter — coming in a future sprint"
									>
										{filter}
									</span>
								)
							)}
						</div>
					</header>
				)}

				<Card padding={false} className="overflow-hidden">
					{loading && (
						<p className="p-6 text-sm text-slate-500">Loading injury history…</p>
					)}

					{!loading && errorMessage && (
						<p className="m-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{errorMessage}
						</p>
					)}

					{!loading && !errorMessage && sortedLogs.length === 0 && (
						<p className="m-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
							No injury history yet. Log pain on the 3D body map to build your
							timeline.
						</p>
					)}

					{!loading && !errorMessage && sortedLogs.length > 0 && (
						<ol className="relative px-6 py-6">
							<div
								className="absolute bottom-6 left-[2.15rem] top-6 w-px bg-slate-200"
								aria-hidden="true"
							/>
							{sortedLogs.map((log, index) => {
								const painLevel = Number(log.painLevel);
								const isHighPain = painLevel >= 7;
								const isModeratePain = painLevel >= 4 && painLevel < 7;

								return (
									<li
										key={log.id}
										className={`relative pl-10 ${index < sortedLogs.length - 1 ? 'pb-5' : ''}`}
									>
										<span
											className={`absolute left-3 top-5 h-3 w-3 rounded-full border-2 border-white ring-1 ring-slate-100 ${
												isHighPain
													? 'bg-red-500'
													: isModeratePain
														? 'bg-orange-500'
														: 'bg-sky-500'
											}`}
											aria-hidden="true"
										/>
										<div
											className={`rounded-xl border bg-white p-4 shadow-sm ${
												isHighPain
													? 'border-red-200 bg-red-50/30'
													: isModeratePain
														? 'border-orange-200 bg-orange-50/20'
														: 'border-slate-200'
											}`}
										>
											<div className="flex flex-wrap items-start justify-between gap-3">
												<div>
													<p className="text-xs font-medium text-slate-400">
														{formatLogDate(log)}
													</p>
													<p className="mt-1 text-base font-semibold text-slate-900">
														{formatLabel(log.bodyPart, BODY_PART_LABELS)}
													</p>
													<p className="mt-0.5 text-sm text-slate-500">
														{formatLabel(log.injuryType, INJURY_TYPE_LABELS)}
													</p>
												</div>
												<div className="flex flex-wrap items-center gap-2">
													<Badge variant={isHighPain ? 'red' : 'muted'}>
														Pain {log.painLevel}/10
													</Badge>
													<Badge
														variant={recoveryBadgeVariant(log.recoveryStatus)}
													>
														{formatLabel(
															log.recoveryStatus,
															RECOVERY_STATUS_LABELS
														)}
													</Badge>
												</div>
											</div>

											{log.notes && (
												<p className="mt-3 text-sm leading-relaxed text-slate-600">
													{log.notes}
												</p>
											)}

											{onRefresh && (
												<button
													type="button"
													onClick={() => setEditingLog(log)}
													className={`${buttonStyles.secondary} mt-4 px-3 py-1.5 text-xs`}
												>
													Update
												</button>
											)}
										</div>
									</li>
								);
							})}
						</ol>
					)}
				</Card>
			</section>

			<EditInjuryLogModal
				isOpen={Boolean(editingLog)}
				onClose={() => setEditingLog(null)}
				injuryLog={editingLog}
				onSuccess={handleUpdateSuccess}
			/>
		</>
	);
}
