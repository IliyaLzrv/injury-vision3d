import { BODY_PART_LABELS } from '../body/bodyParts.js';
import {
	formatLabel,
	formatLogDate,
	INJURY_TYPE_LABELS,
	RECOVERY_STATUS_LABELS,
} from '../injury/injuryLogUtils.js';

export default function WeeklyReportLogList({ logs = [] }) {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
			<h2 className="text-lg font-semibold text-slate-900">
				Recent injury logs this week
			</h2>
			<p className="mt-1 text-sm text-slate-500">
				Self-tracked pain and recovery entries from the current week.
			</p>

			{logs.length === 0 ? (
				<p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
					No injury logs recorded this week.
				</p>
			) : (
				<ul className="mt-4 space-y-3">
					{logs.map((log) => (
						<li
							key={log.id}
							className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
						>
							<div className="flex flex-wrap items-start justify-between gap-2">
								<div>
									<p className="font-medium text-slate-900">
										{formatLabel(log.bodyPart, BODY_PART_LABELS)}
									</p>
									<p className="mt-0.5 text-xs text-slate-500">
										{formatLogDate(log)}
									</p>
								</div>
								<span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs text-slate-600">
									Pain {log.painLevel}/10
								</span>
							</div>

							<dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
								<div>
									<dt className="text-xs uppercase tracking-wide text-slate-500">
										Injury type
									</dt>
									<dd className="text-slate-700">
										{formatLabel(log.injuryType, INJURY_TYPE_LABELS)}
									</dd>
								</div>
								<div>
									<dt className="text-xs uppercase tracking-wide text-slate-500">
										Recovery status
									</dt>
									<dd className="text-slate-700">
										{formatLabel(log.recoveryStatus, RECOVERY_STATUS_LABELS)}
									</dd>
								</div>
							</dl>

							{log.notes && (
								<p className="mt-3 text-sm leading-relaxed text-slate-600">
									{log.notes}
								</p>
							)}
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
