export default function DashboardInsightBanner() {
	return (
		<div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-teal-50 px-5 py-4 shadow-sm">
			<p className="text-sm leading-relaxed text-slate-700">
				<span className="font-semibold text-sky-700">Recovery awareness:</span>{' '}
				This week, your self-tracked pain data shows your most active area and
				recovery progress. Use this overview to reflect on training load and
				recovery awareness.
			</p>
		</div>
	);
}
