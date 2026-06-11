import { BODY_PART_LABELS } from '../body/bodyParts.js';
import { formatLabel } from '../injury/injuryLogUtils.js';
import { getLoadLabel } from '../training/trainingLoadUtils.js';

function buildReflectionBullets({ overview, weeklyLogs, weeklyTrainingLoads }) {
	const bullets = [];

	if (weeklyLogs.length === 0 && weeklyTrainingLoads.length === 0) {
		bullets.push(
			'No self-tracked entries this week. Consider logging on the 3D body map after training.'
		);
		return bullets;
	}

	if (weeklyLogs.length > 0) {
		bullets.push(
			`You logged ${weeklyLogs.length} pain ${weeklyLogs.length === 1 ? 'entry' : 'entries'} this week for recovery awareness.`
		);
	}

	if (overview?.highestPainLevel >= 7) {
		bullets.push(
			`Your highest self-tracked pain level this period was ${overview.highestPainLevel}/10. Use this as a reflection point for training load.`
		);
	} else if (overview?.averagePainLevel > 0) {
		bullets.push(
			`Average self-tracked pain this period is ${Number(overview.averagePainLevel).toFixed(1)}/10.`
		);
	}

	if (overview?.recoveringCount > 0) {
		bullets.push(
			`${overview.recoveringCount} ${overview.recoveringCount === 1 ? 'area is' : 'areas are'} marked as recovering — continue monitoring self-tracked progress.`
		);
	}

	if (overview?.mostAffectedBodyPart) {
		bullets.push(
			`Most logged body part: ${formatLabel(overview.mostAffectedBodyPart, BODY_PART_LABELS)}.`
		);
	}

	if (weeklyTrainingLoads.length > 0) {
		const latest = weeklyTrainingLoads[0];
		bullets.push(
			`Training load reflection: ${getLoadLabel(latest?.loadScore)} based on ${weeklyTrainingLoads.length} self-tracked session${weeklyTrainingLoads.length === 1 ? '' : 's'}.`
		);
	}

	if (bullets.length === 0) {
		bullets.push(
			'Continue self-tracking pain and recovery to build a clearer weekly reflection picture.'
		);
	}

	return bullets.slice(0, 4);
}

export default function RecoveryAwarenessCard({
	overview,
	weeklyLogs = [],
	weeklyTrainingLoads = [],
}) {
	const bullets = buildReflectionBullets({
		overview,
		weeklyLogs,
		weeklyTrainingLoads,
	});

	return (
		<section
			className="rounded-2xl border p-6 shadow-sm"
			style={{
				borderColor: '#e2e8f0',
				backgroundColor: '#ffffff',
			}}
		>
			<h2 className="text-lg font-semibold" style={{ color: '#0f172a' }}>
				Recovery Awareness
			</h2>
			<p className="mt-1 text-sm" style={{ color: '#64748b' }}>
				General reflection based on your self-tracked data this week.
			</p>

			<div
				className="mt-4 rounded-xl border px-4 py-3"
				style={{
					borderColor: '#fde68a',
					backgroundColor: '#fef9c3',
				}}
			>
				<p className="text-xs font-medium" style={{ color: '#854d0e' }}>
					Suggestions are based on self-tracked data only and are not medical
					advice.
				</p>
			</div>

			<ul className="mt-4 list-disc space-y-2 pl-5">
				{bullets.map((bullet) => (
					<li key={bullet} className="text-sm leading-relaxed" style={{ color: '#475569' }}>
						{bullet}
					</li>
				))}
			</ul>
		</section>
	);
}
