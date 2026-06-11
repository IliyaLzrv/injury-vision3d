const ACCENT_STYLES = {
	teal: {
		border: 'border-t-[#14B8A6]',
		icon: 'bg-teal-50 text-teal-600',
	},
	blue: {
		border: 'border-t-[#0EA5E9]',
		icon: 'bg-sky-50 text-sky-600',
	},
	amber: {
		border: 'border-t-[#F97316]',
		icon: 'bg-orange-50 text-orange-600',
	},
	indigo: {
		border: 'border-t-[#818CF8]',
		icon: 'bg-indigo-50 text-indigo-500',
	},
	slate: {
		border: 'border-t-[#94A3B8]',
		icon: 'bg-slate-100 text-slate-600',
	},
};

export default function DashboardSummaryCard({
	label,
	value,
	accent = 'teal',
	hint,
}) {
	const accentStyle = ACCENT_STYLES[accent] ?? ACCENT_STYLES.teal;

	return (
		<div
			className={`rounded-xl border border-slate-200 border-t-[3px] bg-white p-5 shadow-sm ${accentStyle.border}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
						{label}
					</p>
					<p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
						{value}
					</p>
					{hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
				</div>
				<div
					className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentStyle.icon}`}
					aria-hidden="true"
				>
					<span className="h-2 w-2 rounded-full bg-current opacity-80" />
				</div>
			</div>
		</div>
	);
}
