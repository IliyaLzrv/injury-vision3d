import { BODY_PAIN_LEGEND } from './bodyPainColors.js';

const DISPLAY_LABELS = {
	none: 'No Data',
	low: 'Light Pain',
	medium: 'Moderate Pain',
	high: 'High Pain',
	recovering: 'Recovering',
	recovered: 'Healthy / Recovered',
};

export default function BodyStatusLegend() {
	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
			<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
				Body status legend
			</p>
			<div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
				{BODY_PAIN_LEGEND.map((item) => (
					<div key={item.key} className="flex items-center gap-2 text-xs text-slate-600">
						<span
							className="h-3 w-3 rounded-full border border-slate-200 shadow-sm"
							style={{ backgroundColor: item.color }}
							aria-hidden="true"
						/>
						<span>{DISPLAY_LABELS[item.key] ?? item.label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
