const DISCLAIMER_TEXT =
	'InjuryVision 3D is a sports self-tracking and recovery awareness tool. It offers self-tracked data and general recovery reflection only — not clinical guidance or medical advice. For serious or persistent pain, consult a qualified professional.';

const VARIANT_STYLES = {
	dark: 'rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600',
	light: 'rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600',
	pdf: 'rounded-xl border p-4 text-sm leading-relaxed',
};

export default function ProductDisclaimer({ className = '', variant = 'light' }) {
	const isPdf = variant === 'pdf';

	return (
		<p
			role="note"
			className={`${VARIANT_STYLES[variant] ?? VARIANT_STYLES.light} ${className}`.trim()}
			style={
				isPdf
					? {
							borderColor: '#fde68a',
							backgroundColor: '#fef9c3',
							color: '#854d0e',
						}
					: undefined
			}
		>
			{DISCLAIMER_TEXT}
		</p>
	);
}
