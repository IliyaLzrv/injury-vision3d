import Card from '../ui/Card.jsx';

const LEVEL_STYLES = {
	CAUTION: {
		borderColor: '#F97316',
		icon: '⚠',
		label: 'Recovery awareness',
	},
	INFO: {
		borderColor: '#0EA5E9',
		icon: 'ℹ',
		label: 'Recovery awareness',
	},
	REST: {
		borderColor: '#14B8A6',
		icon: '◎',
		label: 'Recovery awareness',
	},
};

function getLevelStyle(level) {
	return LEVEL_STYLES[level] ?? LEVEL_STYLES.INFO;
}

export default function RecoverySuggestions({
	suggestions = [],
	loading = false,
	error = '',
	title = 'Recovery Awareness Suggestions',
	description = 'Rule-based reflections from your self-tracked pain and training data.',
	className = '',
	pdfSafe = false,
}) {
	const sectionStyle = pdfSafe
		? { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }
		: undefined;

	return (
		<section className={className}>
			<Card style={sectionStyle}>
				<h2
					className="text-lg font-semibold text-slate-900"
					style={pdfSafe ? { color: '#0f172a' } : undefined}
				>
					{title}
				</h2>
				<p
					className="mt-1 text-sm text-slate-500"
					style={pdfSafe ? { color: '#64748b' } : undefined}
				>
					{description}
				</p>

				{loading && (
					<p className="mt-5 text-sm text-slate-500">Loading suggestions…</p>
				)}

				{!loading && error && (
					<p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</p>
				)}

				{!loading && !error && suggestions.length === 0 && (
					<p className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
						No suggestions available yet. Keep logging to build recovery awareness.
					</p>
				)}

				{!loading && !error && suggestions.length > 0 && (
					<ul className="mt-5 space-y-3">
						{suggestions.map((suggestion, index) => {
							const style = getLevelStyle(suggestion.level);

							return (
								<li
									key={`${suggestion.level}-${index}`}
									className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
									style={
										pdfSafe
											? {
													borderLeftWidth: '4px',
													borderLeftColor: style.borderColor,
												}
											: undefined
									}
									data-suggestion-level={suggestion.level}
								>
									<div
										className="w-1 shrink-0 self-stretch rounded-full"
										style={{ backgroundColor: style.borderColor }}
										aria-hidden="true"
									/>
									<div className="min-w-0 flex-1">
										<div className="flex items-start gap-2">
											<span
												className="mt-0.5 text-base leading-none"
												aria-hidden="true"
											>
												{style.icon}
											</span>
											<div>
												<p
													className="text-xs font-semibold uppercase tracking-wide"
													style={{ color: style.borderColor }}
												>
													{style.label}
												</p>
												<p
													className="mt-1.5 text-sm leading-relaxed text-slate-700"
													style={pdfSafe ? { color: '#334155' } : undefined}
												>
													{suggestion.message}
												</p>
											</div>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</Card>
		</section>
	);
}
