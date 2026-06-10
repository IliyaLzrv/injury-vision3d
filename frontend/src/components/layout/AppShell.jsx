import Sidebar from './Sidebar.jsx';

export default function AppShell({ children }) {
	return (
		<div className="flex min-h-dvh bg-slate-50 text-slate-900">
			<Sidebar />
			<main className="min-w-0 flex-1 overflow-auto">
				<div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
					{children}
				</div>
			</main>
		</div>
	);
}
