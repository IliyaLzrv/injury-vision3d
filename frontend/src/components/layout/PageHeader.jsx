import Badge from '../ui/Badge.jsx';

export default function PageHeader({
	eyebrow,
	title,
	description,
	actions,
	badge,
}) {
	return (
		<header className="mb-5 sm:mb-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 flex-1">
					{eyebrow && (
						<p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
							{eyebrow}
						</p>
					)}
					<div className="mt-0.5 flex flex-wrap items-center gap-2 sm:gap-3">
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
							{title}
						</h1>
						{badge && <Badge variant="teal">{badge}</Badge>}
					</div>
					{description && (
						<p className="mt-1.5 max-w-3xl text-sm text-slate-500">
							{description}
						</p>
					)}
				</div>
				{actions && (
					<div className="flex shrink-0 flex-wrap items-center gap-2">
						{actions}
					</div>
				)}
			</div>
		</header>
	);
}
