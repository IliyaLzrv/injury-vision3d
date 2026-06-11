import { useEffect, useState } from 'react';
import { injuryApi } from '../api/injuryApi.js';
import BodyModel from '../components/body/BodyModel.jsx';
import ProductDisclaimer from '../components/common/ProductDisclaimer.jsx';
import SelectedBodyPartPanel from '../components/body/SelectedBodyPartPanel.jsx';
import AddInjuryLogModal from '../components/injury/AddInjuryLogModal.jsx';
import InjuryLogList from '../components/injury/InjuryLogList.jsx';
import InjuryTimeline from '../components/injury/InjuryTimeline.jsx';
import { BODY_PART_LABELS } from '../components/body/bodyParts.js';
import PageHeader from '../components/layout/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';

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
				title="3D Body Map"
				badge="High-Fidelity Prototype"
				description="Click a body part to view status or add a pain log."
				actions={
					<Badge variant="primary" className="max-w-[220px] text-center leading-snug">
						Core MVP: clickable body parts + pain logging
					</Badge>
				}
			/>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] xl:items-start">
				<BodyModel
					onBodyPartSelect={setSelectedBodyPart}
					selectedBodyPart={selectedBodyPart}
					injuryLogs={injuryLogs}
				/>

				<SelectedBodyPartPanel
					selectedBodyPart={selectedBodyPart}
					injuryLogs={injuryLogs}
					onAddInjuryLog={handleAddInjuryLog}
				/>
			</div>

			{successMessage && (
				<p
					role="status"
					className="mt-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"
				>
					{successMessage}
				</p>
			)}

			<div id="injury-history" className="mt-10 scroll-mt-8">
				<InjuryTimeline
					logs={injuryLogs}
					loading={logsLoading}
					errorMessage={logsError}
					onRefresh={refreshInjuryLogs}
				/>

				<InjuryLogList
					logs={injuryLogs}
					loading={logsLoading}
					errorMessage={logsError}
					onRefresh={refreshInjuryLogs}
				/>
			</div>

			<ProductDisclaimer variant="light" className="mt-8" />

			<AddInjuryLogModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				selectedBodyPart={selectedBodyPart}
				onSuccess={handleInjuryLogSaved}
			/>
		</>
	);
}
