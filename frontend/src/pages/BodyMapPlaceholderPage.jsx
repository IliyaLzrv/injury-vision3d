import { Link } from 'react-router-dom';

export default function BodyMapPlaceholderPage() {
	return (
		<div className="min-h-dvh bg-slate-950 text-slate-100">
			<div className="mx-auto max-w-3xl px-6 py-16">
				<h1 className="text-3xl font-semibold tracking-tight">3D Body Map</h1>
				<p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
					3D Body Map will be implemented in IJ3D-14.
				</p>

				<Link
					to="/dashboard"
					className="mt-8 inline-flex rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-700/50 hover:text-emerald-300"
				>
					← Back to dashboard
				</Link>
			</div>
		</div>
	);
}
