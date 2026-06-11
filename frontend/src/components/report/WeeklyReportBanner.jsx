export default function WeeklyReportBanner() {
	return (
		<div
			className="rounded-2xl border px-5 py-4 shadow-sm"
			style={{
				borderColor: '#bae6fd',
				background: 'linear-gradient(to right, #eff6ff, #f0fdfa)',
			}}
		>
			<p
				className="text-sm leading-relaxed"
				style={{ color: '#334155' }}
			>
				<span className="font-semibold" style={{ color: '#0284c7' }}>
					Weekly recovery summary:
				</span>{' '}
				This weekly report summarizes your self-tracked pain entries, recovery
				status, and training load reflection.
			</p>
		</div>
	);
}
