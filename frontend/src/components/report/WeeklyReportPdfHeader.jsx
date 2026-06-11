export default function WeeklyReportPdfHeader({
	athleteName,
	periodLabel,
	generatedDate,
}) {
	return (
		<div
			className="overflow-hidden rounded-2xl border shadow-sm"
			style={{
				borderColor: '#e2e8f0',
				backgroundColor: '#ffffff',
			}}
		>
			<div
				className="px-6 py-5"
				style={{
					background: 'linear-gradient(to right, #0ea5e9, #14b8a6)',
				}}
			>
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div
							className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
							style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
						>
							IV
						</div>
						<div>
							<p className="text-sm font-semibold text-white">InjuryVision 3D</p>
							<p className="text-xs text-white/80">Recovery awareness report</p>
						</div>
					</div>
					<p className="text-xs text-white/90">Self-tracked · Not medical advice</p>
				</div>
				<h2 className="mt-4 text-2xl font-semibold text-white">
					Weekly Recovery Report
				</h2>
			</div>

			<div
				className="grid gap-4 px-6 py-4 sm:grid-cols-3"
				style={{ backgroundColor: '#f8fafc' }}
			>
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#64748b' }}>
						Athlete
					</p>
					<p className="mt-1 text-sm font-medium" style={{ color: '#0f172a' }}>
						{athleteName || 'Athlete'}
					</p>
				</div>
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#64748b' }}>
						Period
					</p>
					<p className="mt-1 text-sm font-medium" style={{ color: '#0f172a' }}>
						{periodLabel}
					</p>
				</div>
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#64748b' }}>
						Generated
					</p>
					<p className="mt-1 text-sm font-medium" style={{ color: '#0f172a' }}>
						{generatedDate}
					</p>
				</div>
			</div>
		</div>
	);
}
