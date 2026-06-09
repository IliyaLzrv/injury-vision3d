const DISCLAIMER_TEXT =
	'InjuryVision 3D is a sports self-tracking and recovery awareness tool. It does not provide medical diagnosis, treatment advice, or injury prediction. For serious or persistent pain, users should consult a qualified professional.';

export default function ProductDisclaimer({ className = '' }) {
	return (
		<p
			role="note"
			className={`rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm leading-relaxed text-slate-300 ${className}`.trim()}
		>
			{DISCLAIMER_TEXT}
		</p>
	);
}
