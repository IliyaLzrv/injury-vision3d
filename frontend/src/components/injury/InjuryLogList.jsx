import { useState } from 'react';
import { BODY_PART_LABELS } from '../body/bodyParts.js';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import { buttonStyles } from '../ui/buttonStyles.js';
import EditInjuryLogModal from './EditInjuryLogModal.jsx';
import {
	formatLabel,
	formatLogDate,
	INJURY_TYPE_LABELS,
	RECOVERY_STATUS_LABELS,
} from './injuryLogUtils.js';

export default function InjuryLogList({
	logs = [],
	loading = false,
	errorMessage = '',
	onRefresh,
}) {
	const [editingLog, setEditingLog] = useState(null);

	function handleUpdateSuccess() {
		onRefresh?.();
	}

	return (
		<>
			<section className="mt-6">
				<Card>
					<h3 className="text-base font-semibold text-slate-900">All injury logs</h3>
					<p className="mt-1 text-sm text-slate-500">
						Compact list view of your self-tracked entries.
					</p>

					{loading && (
						<p className="mt-6 text-sm text-slate-500">Loading injury logs…</p>
					)}

					{!loading && errorMessage && (
						<p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{errorMessage}
						</p>
					)}

					{!loading && !errorMessage && logs.length === 0 && (
						<p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
							No injury logs yet
						</p>
					)}

					{!loading && !errorMessage && logs.length > 0 && (
						<ul className="mt-6 divide-y divide-slate-100">
							{logs.map((log) => {
								const isHighPain = Number(log.painLevel) >= 7;

								return (
									<li
										key={log.id}
										className={`flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 ${
											isHighPain ? 'rounded-lg border border-red-100 bg-red-50/30 px-3' : ''
										}`}
									>
										<div>
											<p className="font-medium text-slate-900">
												{formatLabel(log.bodyPart, BODY_PART_LABELS)}
											</p>
											<p className="mt-0.5 text-xs text-slate-500">
												{formatLogDate(log)} ·{' '}
												{formatLabel(log.injuryType, INJURY_TYPE_LABELS)}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Badge variant={isHighPain ? 'red' : 'muted'}>
												Pain {log.painLevel}/10
											</Badge>
											<Badge variant="indigo">
												{formatLabel(
													log.recoveryStatus,
													RECOVERY_STATUS_LABELS
												)}
											</Badge>
											<button
												type="button"
												onClick={() => setEditingLog(log)}
												className={`${buttonStyles.secondary} px-3 py-1 text-xs`}
											>
												Update
											</button>
										</div>
									</li>
								);
							})}
						</ul>
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
