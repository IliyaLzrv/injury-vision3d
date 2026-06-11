import { BODY_PART_LABELS } from '../body/bodyParts.js';
import {
	formatLabel,
	formatLogDate,
	INJURY_TYPE_LABELS,
	RECOVERY_STATUS_LABELS,
} from '../injury/injuryLogUtils.js';

export default function WeeklyReportLogList({ logs = [] }) {
	return (
		<section
			className="rounded-2xl border p-6 shadow-sm"
			style={{
				borderColor: '#e2e8f0',
				backgroundColor: '#ffffff',
			}}
		>
			<h2 className="text-lg font-semibold" style={{ color: '#0f172a' }}>
				Log Summary
			</h2>
			<p className="mt-1 text-sm" style={{ color: '#64748b' }}>
				Self-tracked pain and recovery entries from the current week.
			</p>

			{logs.length === 0 ? (
				<p
					className="mt-4 rounded-lg border border-dashed px-4 py-6 text-center text-sm"
					style={{
						borderColor: '#cbd5e1',
						backgroundColor: '#f8fafc',
						color: '#64748b',
					}}
				>
					No injury logs recorded this week.
				</p>
			) : (
				<div className="mt-4 overflow-x-auto">
					<table className="w-full min-w-[480px] text-left text-sm">
						<thead>
							<tr
								className="border-b text-xs font-semibold uppercase tracking-wide"
								style={{ borderColor: '#e2e8f0', color: '#64748b' }}
							>
								<th className="pb-3 pr-4">Date</th>
								<th className="pb-3 pr-4">Body part</th>
								<th className="pb-3 pr-4">Type</th>
								<th className="pb-3 pr-4">Pain</th>
								<th className="pb-3">Status</th>
							</tr>
						</thead>
						<tbody>
							{logs.map((log) => (
								<tr
									key={log.id}
									className="border-b"
									style={{ borderColor: '#f1f5f9' }}
								>
									<td className="py-3 pr-4" style={{ color: '#475569' }}>
										{formatLogDate(log)}
									</td>
									<td className="py-3 pr-4 font-medium" style={{ color: '#0f172a' }}>
										{formatLabel(log.bodyPart, BODY_PART_LABELS)}
									</td>
									<td className="py-3 pr-4" style={{ color: '#475569' }}>
										{formatLabel(log.injuryType, INJURY_TYPE_LABELS)}
									</td>
									<td className="py-3 pr-4" style={{ color: '#0f172a' }}>
										{log.painLevel}/10
									</td>
									<td className="py-3" style={{ color: '#475569' }}>
										{formatLabel(log.recoveryStatus, RECOVERY_STATUS_LABELS)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
