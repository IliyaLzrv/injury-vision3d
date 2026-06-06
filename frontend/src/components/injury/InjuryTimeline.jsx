import { BODY_PART_LABELS } from '../body/bodyParts.js';
import {
	formatLabel,
	formatLogDate,
	INJURY_TYPE_LABELS,
	RECOVERY_STATUS_LABELS,
} from './injuryLogUtils.js';

export default function InjuryTimeline({ logs = [], loading = false, errorMessage = '' }) {
	return (
		<section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
			<h2 className="text-lg font-semibold text-slate-100">Injury history timeline</h2>
			<p className="mt-1 text-sm text-slate-400">
				Scan your pain and recovery progress over time for sports self-awareness.
			</p>

			{loading && (
				<p className="mt-6 text-sm text-slate-400">Loading injury history…</p>
			)}

			{!loading && errorMessage && (
				<p className="mt-6 rounded-lg border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
					{errorMessage}
				</p>
			)}

			{!loading && !errorMessage && logs.length === 0 && (
				<p className="mt-6 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6 text-center text-sm text-slate-400">
					No injury history yet
				</p>
			)}

			{!loading && !errorMessage && logs.length > 0 && (
				<ol className="relative mt-6 space-y-0 border-l border-slate-700 pl-6">
					{logs.map((log, index) => (
						<li key={log.id} className={`relative ${index < logs.length - 1 ? 'pb-6' : ''}`}>
							<span
								className="absolute -left-[1.6rem] top-1.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400"
								aria-hidden="true"
							/>
							<div className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3">
								<div className="flex flex-wrap items-start justify-between gap-2">
									<div>
										<p className="font-medium text-slate-100">
											{formatLabel(log.bodyPart, BODY_PART_LABELS)}
										</p>
										<p className="mt-0.5 text-xs text-slate-500">
											{formatLogDate(log)}
										</p>
									</div>
									<span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-xs text-slate-300">
										Pain {log.painLevel}/10
									</span>
								</div>

								<dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
									<div>
										<dt className="text-xs uppercase tracking-wide text-slate-500">
											Injury type
										</dt>
										<dd className="text-slate-300">
											{formatLabel(log.injuryType, INJURY_TYPE_LABELS)}
										</dd>
									</div>
									<div>
										<dt className="text-xs uppercase tracking-wide text-slate-500">
											Recovery status
										</dt>
										<dd className="text-slate-300">
											{formatLabel(log.recoveryStatus, RECOVERY_STATUS_LABELS)}
										</dd>
									</div>
								</dl>

								{log.notes && (
									<p className="mt-3 text-sm leading-relaxed text-slate-400">
										{log.notes}
									</p>
								)}
							</div>
						</li>
					))}
				</ol>
			)}
		</section>
	);
}
