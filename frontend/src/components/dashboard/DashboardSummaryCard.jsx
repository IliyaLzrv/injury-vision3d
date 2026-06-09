const ACCENT_STYLES = {
	teal: 'border-teal-200 bg-teal-50/60 text-teal-700',
	blue: 'border-sky-200 bg-sky-50/60 text-sky-700',
	amber: 'border-amber-200 bg-amber-50/60 text-amber-700',
	slate: 'border-slate-200 bg-slate-50 text-slate-600',
};

export default function DashboardSummaryCard({
	label,
	value,
	accent = 'teal',
}) {
	const accentStyle = ACCENT_STYLES[accent] ?? ACCENT_STYLES.teal;

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
			<p className="text-sm font-medium text-slate-500">{label}</p>
			<p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
				{value}
			</p>
			<div
				className={`mt-3 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${accentStyle}`}
				aria-hidden="true"
			>
				Recovery tracking
			</div>
		</div>
	);
}
