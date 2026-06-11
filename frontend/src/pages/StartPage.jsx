import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import { buttonStyles } from '../components/ui/buttonStyles.js';

const PREVIEW_ZONES = [
	{ label: 'Left Knee', pain: 6 },
	{ label: 'Left Ankle', pain: 8 },
	{ label: 'R. Shoulder', pain: 3 },
	{ label: 'Lower Back', pain: 4 },
];

const HOW_IT_WORKS = [
	{
		title: 'Select Body Part',
		description:
			'Click a zone on the interactive 3D model to focus your self-tracked recovery entry.',
	},
	{
		title: 'Log Pain & Activity',
		description:
			'Record pain level, recovery status, and training context for sports self-tracking.',
	},
	{
		title: 'Track Recovery',
		description:
			'Follow trends over time and review your weekly recovery awareness summary.',
	},
];

const SCREEN_PILLS = [
	{ label: '3D Body Map', to: '/body-map' },
	{ label: 'Dashboard', to: '/dashboard' },
	{ label: 'Injury History', to: '/body-map#injury-history' },
	{ label: 'Weekly Report', to: '/reports/weekly' },
	{ label: 'PDF Export', to: '/reports/weekly' },
	{ label: 'Smart Suggestions', to: null },
	{ label: 'MVP vs Stretch', to: null },
	{ label: 'Design System', to: null },
];

function painBarColor(level) {
	if (level >= 7) return 'bg-red-500';
	if (level >= 4) return 'bg-orange-500';
	return 'bg-green-500';
}

export default function StartPage() {
	return (
		<div className="min-h-dvh text-slate-900" style={{ backgroundColor: '#F8FAFC' }}>
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
					<div className="flex items-center gap-3">
						<div
							className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-sm font-bold text-white shadow-sm"
							aria-hidden="true"
						>
							IV
						</div>
						<div>
							<p className="text-sm font-semibold text-slate-900">InjuryVision 3D</p>
							<p className="text-[11px] text-slate-500">High-Fidelity Prototype</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Link to="/login" className={buttonStyles.secondary}>
							Log In
						</Link>
						<Link to="/register" className={buttonStyles.primary}>
							Get Started
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
				<div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-10">
					<section>
						<Badge variant="teal" className="mb-5">
							Sports Recovery Self-Tracking Tool
						</Badge>

						<h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
							Track Pain Visually.
							<br />
							Recover Smarter.
						</h1>

						<p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
							Select a body part on the interactive 3D model, log pain after
							training, and follow your recovery over time — all in one place.
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							<Link to="/body-map" className={buttonStyles.teal}>
								Open 3D Body Map
							</Link>
							<Link to="/dashboard" className={buttonStyles.secondary}>
								View Dashboard
							</Link>
						</div>

						<p className="mt-5 text-xs text-slate-400">
							Self-tracking tool only — not clinical guidance.
						</p>
					</section>

					<section aria-label="Product preview">
						<Card className="shadow-md shadow-slate-200/80">
							<div className="mb-5 flex items-center justify-between gap-3">
								<h2 className="text-base font-semibold text-slate-900">
									3D Body Map Preview
								</h2>
								<Badge variant="primary">Interactive</Badge>
							</div>

							<ul className="space-y-3">
								{PREVIEW_ZONES.map((zone) => (
									<li
										key={zone.label}
										className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
									>
										<span className="text-sm font-medium text-slate-700">
											{zone.label}
										</span>
										<span
											className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${painBarColor(zone.pain)}`}
										>
											{zone.pain}/10
										</span>
									</li>
								))}
							</ul>

							<div className="mt-4 grid gap-3 sm:grid-cols-2">
								<div className="rounded-xl border border-slate-200 bg-sky-50/50 p-4">
									<p className="text-xs font-medium text-slate-500">
										Recovery Progress
									</p>
									<p className="mt-1 text-2xl font-semibold text-slate-900">74%</p>
									<div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
										<div
											className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-500"
											style={{ width: '74%' }}
										/>
									</div>
								</div>

								<div className="rounded-xl border border-slate-200 bg-teal-50/50 p-4">
									<p className="text-xs font-medium text-slate-500">Pain Trend</p>
									<div className="mt-3 flex h-12 items-end gap-1">
										{[4, 6, 5, 7, 4, 3, 5].map((value, index) => (
											<div
												key={index}
												className="flex-1 rounded-sm bg-teal-400/80"
												style={{ height: `${value * 10}%` }}
												aria-hidden="true"
											/>
										))}
									</div>
									<p className="mt-2 text-[11px] text-slate-400">
										Visual preview only
									</p>
								</div>
							</div>
						</Card>
					</section>
				</div>

				<section className="mt-20">
					<h2 className="text-center text-2xl font-semibold text-slate-900">
						How it works
					</h2>
					<p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-500">
						Three simple steps for sports self-tracking and recovery awareness.
					</p>

					<div className="mt-8 grid gap-4 md:grid-cols-3">
						{HOW_IT_WORKS.map((step, index) => (
							<Card key={step.title}>
								<div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
									{index + 1}
								</div>
								<h3 className="text-base font-semibold text-slate-900">
									{step.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-slate-500">
									{step.description}
								</p>
							</Card>
						))}
					</div>
				</section>

				<section className="mt-16">
					<p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
						Prototype screens
					</p>
					<div className="mt-4 flex flex-wrap justify-center gap-2">
						{SCREEN_PILLS.map((pill) =>
							pill.to ? (
								<Link
									key={pill.label}
									to={pill.to}
									className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
								>
									{pill.label}
								</Link>
							) : (
								<span
									key={pill.label}
									className="cursor-not-allowed rounded-full border border-dashed border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-400"
									title="Coming in a future sprint"
								>
									{pill.label}
								</span>
							)
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
