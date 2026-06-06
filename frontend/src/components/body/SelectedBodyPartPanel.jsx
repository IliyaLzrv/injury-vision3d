import { BODY_PART_LABELS } from './bodyParts.js';

export default function SelectedBodyPartPanel({
	selectedBodyPart,
	onAddInjuryLog,
}) {
	if (!selectedBodyPart) {
		return (
			<aside className="flex h-full min-h-[280px] flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-5">
				<h2 className="text-sm font-medium text-slate-200">Body part details</h2>
				<div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
					<div
						className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800/60 text-slate-500"
						aria-hidden="true"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="h-6 w-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
							/>
						</svg>
					</div>
					<p className="mt-4 text-base font-medium text-slate-300">
						Select a body part
					</p>
					<p className="mt-2 max-w-[220px] text-sm text-slate-500">
						Click a body part on the 3D model to view details and add an injury
						log.
					</p>
				</div>
			</aside>
		);
	}

	const label = BODY_PART_LABELS[selectedBodyPart] ?? selectedBodyPart;

	return (
		<aside className="flex h-full min-h-[280px] flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-5">
			<p className="text-xs uppercase tracking-wide text-slate-500">
				Selected body part
			</p>
			<h2 className="mt-1 text-xl font-semibold text-slate-100">{label}</h2>

			<p className="mt-4 text-sm leading-relaxed text-slate-400">
				Track pain level, recovery status, and personal notes for this body part
				over time.
			</p>

			<div className="mt-6">
				<button
					type="button"
					onClick={() => onAddInjuryLog?.(selectedBodyPart)}
					className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
				>
					Add Injury Log
				</button>
			</div>

			<p className="mt-auto pt-6 text-xs leading-relaxed text-slate-500">
				InjuryVision 3D is for sports self-tracking and recovery awareness only. It
				does not provide medical diagnosis.
			</p>
		</aside>
	);
}
