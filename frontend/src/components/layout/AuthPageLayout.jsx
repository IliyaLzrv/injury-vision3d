import { Link } from 'react-router-dom';
import ProductDisclaimer from '../common/ProductDisclaimer.jsx';

export const authInputClassName =
	'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-400/0 focus:border-sky-300 focus:ring-2';

export default function AuthPageLayout({ title, subtitle, children, footer }) {
	return (
		<div
			className="flex min-h-dvh flex-col items-center justify-center px-4 py-10 sm:px-6"
			style={{ backgroundColor: '#F8FAFC' }}
		>
			<div className="mb-8 flex items-center gap-3">
				<div
					className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
					style={{ background: 'linear-gradient(to bottom right, #0EA5E9, #14B8A6)' }}
					aria-hidden="true"
				>
					IV
				</div>
				<div>
					<Link to="/" className="text-sm font-semibold text-slate-900 hover:text-sky-600">
						InjuryVision 3D
					</Link>
					<p className="text-[11px] text-slate-500">High-Fidelity Prototype</p>
				</div>
			</div>

			<div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
				{subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
				{children}
			</div>

			{footer}

			<ProductDisclaimer variant="light" className="mt-6 w-full max-w-md" />
		</div>
	);
}
