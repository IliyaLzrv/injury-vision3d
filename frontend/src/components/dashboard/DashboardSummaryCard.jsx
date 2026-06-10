const ACCENT_STYLES = {
	teal: {
		border: 'border-t-teal-500',
		icon: 'bg-teal-50 text-teal-600',
	},
	blue: {
		border: 'border-t-sky-500',
		icon: 'bg-sky-50 text-sky-600',
	},
	amber: {
		border: 'border-t-orange-500',
		icon: 'bg-orange-50 text-orange-600',
	},
	indigo: {
		border: 'border-t-indigo-400',
		icon: 'bg-indigo-50 text-indigo-500',
	},
	slate: {
		border: 'border-t-slate-400',
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
			className={`rounded-2xl border border-slate-200 border-t-4 bg-white p-5 shadow-sm shadow-slate-200/60 ${accentStyle.border}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-sm font-medium text-slate-500">{label}</p>
					<p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
						{value}
					</p>
					{hint && (
						<p className="mt-1 text-xs text-slate-400">{hint}</p>
					)}
				</div>
				<div
					className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentStyle.icon}`}
					aria-hidden="true"
				>
					<span className="h-2 w-2 rounded-full bg-current opacity-80" />
				</div>
			</div>
		</div>
	);
}
