import { useState } from 'react';
import { Link } from 'react-router-dom';
import BodyModel from '../components/body/BodyModel.jsx';
import { BODY_PART_LABELS } from '../components/body/bodyParts.js';

export default function BodyMapPage() {
	const [selectedBodyPart, setSelectedBodyPart] = useState(null);

	return (
		<div className="min-h-dvh bg-slate-950 text-slate-100">
			<div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
				<Link
					to="/dashboard"
					className="inline-flex text-sm text-slate-400 transition hover:text-emerald-300"
				>
					← Back to dashboard
				</Link>

				<h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
					3D Body Map
				</h1>
				<p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
					This basic 3D body model will be used to visually track pain and injury
					areas.
				</p>

				<div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
					<p className="text-xs uppercase tracking-wide text-slate-500">
						Selected body part
					</p>
					<p className="mt-1 text-base font-medium text-slate-100">
						{selectedBodyPart
							? BODY_PART_LABELS[selectedBodyPart] ?? selectedBodyPart
							: 'None — click a body part on the model'}
					</p>
				</div>

				<div className="mt-4">
					<BodyModel
						onBodyPartSelect={setSelectedBodyPart}
						selectedBodyPart={selectedBodyPart}
					/>
				</div>

				<p className="mt-4 text-center text-xs text-slate-500">
					Drag to rotate · Scroll to zoom · Click a body part to select
				</p>

				<p className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
					InjuryVision 3D is a sports self-tracking and recovery awareness tool. It
					does not provide medical diagnosis.
				</p>
			</div>
		</div>
	);
}
