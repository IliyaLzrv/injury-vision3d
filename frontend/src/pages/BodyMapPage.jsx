import { useState } from 'react';
import { Link } from 'react-router-dom';
import BodyModel from '../components/body/BodyModel.jsx';
import SelectedBodyPartPanel from '../components/body/SelectedBodyPartPanel.jsx';
import AddInjuryLogModal from '../components/injury/AddInjuryLogModal.jsx';
import { BODY_PART_LABELS } from '../components/body/bodyParts.js';

export default function BodyMapPage() {
	const [selectedBodyPart, setSelectedBodyPart] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);

	function handleAddInjuryLog() {
		setIsModalOpen(true);
	}

	function handleInjuryLogSaved() {
		const label = BODY_PART_LABELS[selectedBodyPart] ?? selectedBodyPart;
		setSuccessMessage(`Injury log saved for ${label}.`);
	}

	return (
		<div className="min-h-dvh bg-slate-950 text-slate-100">
			<div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
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

				<div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start">
					<div>
						<BodyModel
							onBodyPartSelect={setSelectedBodyPart}
							selectedBodyPart={selectedBodyPart}
						/>
						<p className="mt-4 text-center text-xs text-slate-500 lg:text-left">
							Drag to rotate · Scroll to zoom · Click a body part to select
						</p>
					</div>

					<SelectedBodyPartPanel
						selectedBodyPart={selectedBodyPart}
						onAddInjuryLog={handleAddInjuryLog}
					/>
				</div>

				{successMessage && (
					<p
						role="status"
						className="mt-4 rounded-lg border border-emerald-800/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
					>
						{successMessage}
					</p>
				)}

				<p className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
					InjuryVision 3D is a sports self-tracking and recovery awareness tool. It
					does not provide medical diagnosis.
				</p>
			</div>

			<AddInjuryLogModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				selectedBodyPart={selectedBodyPart}
				onSuccess={handleInjuryLogSaved}
			/>
		</div>
	);
}
