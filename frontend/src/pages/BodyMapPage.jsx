import { useEffect, useState } from 'react';
import { injuryApi } from '../api/injuryApi.js';
import BodyModel from '../components/body/BodyModel.jsx';
import ProductDisclaimer from '../components/common/ProductDisclaimer.jsx';
import { BODY_PAIN_LEGEND } from '../components/body/bodyPainColors.js';
import SelectedBodyPartPanel from '../components/body/SelectedBodyPartPanel.jsx';
import AddInjuryLogModal from '../components/injury/AddInjuryLogModal.jsx';
import InjuryLogList from '../components/injury/InjuryLogList.jsx';
import InjuryTimeline from '../components/injury/InjuryTimeline.jsx';
import { BODY_PART_LABELS } from '../components/body/bodyParts.js';
import PageHeader from '../components/layout/PageHeader.jsx';

export default function BodyMapPage() {
	const [selectedBodyPart, setSelectedBodyPart] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);
	const [injuryLogs, setInjuryLogs] = useState([]);
	const [logsLoading, setLogsLoading] = useState(true);
	const [logsError, setLogsError] = useState('');
	const [logsRefreshKey, setLogsRefreshKey] = useState(0);

	useEffect(() => {
		let cancelled = false;

		async function loadInjuryLogs() {
			setLogsLoading(true);
			setLogsError('');

			try {
				const data = await injuryApi.getInjuryLogs();
				if (!cancelled) {
					setInjuryLogs(Array.isArray(data) ? data : []);
				}
			} catch (error) {
				if (!cancelled) {
					setInjuryLogs([]);
					setLogsError(error.message || 'Failed to load injury logs.');
				}
			} finally {
				if (!cancelled) {
					setLogsLoading(false);
				}
			}
		}

		loadInjuryLogs();

		return () => {
			cancelled = true;
		};
	}, [logsRefreshKey]);

	function refreshInjuryLogs() {
		setLogsRefreshKey((key) => key + 1);
	}

	function handleAddInjuryLog() {
		setIsModalOpen(true);
	}

	function handleInjuryLogSaved() {
		const label = BODY_PART_LABELS[selectedBodyPart] ?? selectedBodyPart;
		setSuccessMessage(`Injury log saved for ${label}.`);
		refreshInjuryLogs();
	}

	return (
		<>
			<PageHeader
				eyebrow="Recovery awareness"
				title="3D Body Map"
				description="Visually track self-tracked pain and recovery areas on the interactive body model."
				badge="Interactive"
			/>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start">
				<div>
					<BodyModel
						onBodyPartSelect={setSelectedBodyPart}
						selectedBodyPart={selectedBodyPart}
						injuryLogs={injuryLogs}
					/>
					<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
						{BODY_PAIN_LEGEND.map((item) => (
							<div key={item.key} className="flex items-center gap-1.5 text-xs text-slate-500">
								<span
									className="h-2.5 w-2.5 rounded-full border border-slate-300"
									style={{ backgroundColor: item.color }}
									aria-hidden="true"
								/>
								<span>{item.label}</span>
							</div>
						))}
					</div>
					<p className="mt-3 text-center text-xs text-slate-500 lg:text-left">
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
					className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"
				>
					{successMessage}
				</p>
			)}

			<InjuryTimeline
				logs={injuryLogs}
				loading={logsLoading}
				errorMessage={logsError}
			/>

			<InjuryLogList
				logs={injuryLogs}
				loading={logsLoading}
				errorMessage={logsError}
				onRefresh={refreshInjuryLogs}
			/>

			<ProductDisclaimer className="mt-8" />

			<AddInjuryLogModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				selectedBodyPart={selectedBodyPart}
				onSuccess={handleInjuryLogSaved}
			/>
		</>
	);
}
