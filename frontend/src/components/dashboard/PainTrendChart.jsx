import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { injuryApi } from '../../api/injuryApi.js';
import { BODY_PART_LABELS } from '../body/bodyParts.js';
import {
	formatLabel,
	formatLogDate,
	INJURY_TYPE_LABELS,
	RECOVERY_STATUS_LABELS,
} from '../injury/injuryLogUtils.js';

function getLogTimestamp(log) {
	if (log.logDate) {
		const [year, month, day] = log.logDate.split('-').map(Number);
		return new Date(year, month - 1, day).getTime();
	}

	if (log.createdAt) {
		return new Date(log.createdAt).getTime();
	}

	return 0;
}

function buildChartData(logs) {
	return [...logs]
		.sort((a, b) => {
			const timeDiff = getLogTimestamp(a) - getLogTimestamp(b);
			if (timeDiff !== 0) {
				return timeDiff;
			}
			return (a.id ?? 0) - (b.id ?? 0);
		})
		.map((log) => ({
			id: log.id,
			dateLabel: formatLogDate(log),
			painLevel: log.painLevel,
			bodyPart: formatLabel(log.bodyPart, BODY_PART_LABELS),
			injuryType: formatLabel(log.injuryType, INJURY_TYPE_LABELS),
			recoveryStatus: formatLabel(log.recoveryStatus, RECOVERY_STATUS_LABELS),
		}));
}

function PainTrendTooltip({ active, payload }) {
	if (!active || !payload?.length) {
		return null;
	}

	const point = payload[0].payload;

	return (
		<div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md shadow-slate-200/80">
			<p className="font-medium text-slate-900">{point.dateLabel}</p>
			<p className="mt-1 text-slate-600">Body part: {point.bodyPart}</p>
			<p className="text-slate-600">Pain level: {point.painLevel}/10</p>
			<p className="text-slate-600">Injury type: {point.injuryType}</p>
			<p className="text-slate-600">Recovery status: {point.recoveryStatus}</p>
		</div>
	);
}

export default function PainTrendChart() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		let cancelled = false;

		async function loadLogs() {
			setLoading(true);
			setErrorMessage('');

			try {
				const data = await injuryApi.getInjuryLogs();
				if (!cancelled) {
					setLogs(Array.isArray(data) ? data : []);
				}
			} catch (error) {
				if (!cancelled) {
					setLogs([]);
					setErrorMessage(error.message || 'Failed to load pain trend data.');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadLogs();

		return () => {
			cancelled = true;
		};
	}, []);

	const chartData = useMemo(() => buildChartData(logs), [logs]);

	return (
		<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
			<h2 className="text-lg font-semibold text-slate-900">Pain trend</h2>
			<p className="mt-1 text-sm text-slate-500">
				Self-tracked pain data over time for recovery awareness and weekly
				reflection.
			</p>

			{loading && (
				<p className="mt-6 text-sm text-slate-500">Loading pain trend…</p>
			)}

			{!loading && errorMessage && (
				<p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{errorMessage}
				</p>
			)}

			{!loading && !errorMessage && chartData.length === 0 && (
				<div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
					<p className="text-sm text-slate-500">
						No self-tracked pain data yet. Add injury logs on the body map to
						see your trend here.
					</p>
					<Link
						to="/body-map"
						className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
					>
						Open 3D Body Map
					</Link>
				</div>
			)}

			{!loading && !errorMessage && chartData.length > 0 && (
				<div className="mt-6 h-72 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis
								dataKey="dateLabel"
								tick={{ fill: '#64748b', fontSize: 12 }}
								tickLine={false}
								axisLine={{ stroke: '#cbd5e1' }}
							/>
							<YAxis
								domain={[0, 10]}
								allowDecimals={false}
								tick={{ fill: '#64748b', fontSize: 12 }}
								tickLine={false}
								axisLine={{ stroke: '#cbd5e1' }}
								label={{
									value: 'Pain level',
									angle: -90,
									position: 'insideLeft',
									fill: '#64748b',
									fontSize: 12,
								}}
							/>
							<Tooltip content={<PainTrendTooltip />} />
							<Line
								type="monotone"
								dataKey="painLevel"
								stroke="#0d9488"
								strokeWidth={2}
								dot={{ r: 4, fill: '#0d9488', strokeWidth: 0 }}
								activeDot={{ r: 6, fill: '#14b8a6' }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</section>
	);
}
