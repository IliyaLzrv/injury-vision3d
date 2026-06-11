const DISCLAIMER_TEXT =
	'InjuryVision 3D is a sports self-tracking and recovery awareness tool. It does not provide medical diagnosis, treatment advice, or injury prediction. For serious or persistent pain, users should consult a qualified professional.';

const VARIANT_STYLES = {
	dark: 'rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm leading-relaxed text-slate-300',
	light: 'rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600',
	pdf: 'rounded-xl border border-[#fde68a] bg-[#fef9c3] p-4 text-sm leading-relaxed text-[#854d0e]',
};

export default function ProductDisclaimer({ className = '', variant = 'dark' }) {
	return (
		<p
			role="note"
			className={`${VARIANT_STYLES[variant] ?? VARIANT_STYLES.dark} ${className}`.trim()}
			style={
				variant === 'pdf'
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
