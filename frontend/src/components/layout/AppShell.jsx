import Sidebar from './Sidebar.jsx';

export default function AppShell({ children }) {
	return (
		<div
			className="flex min-h-dvh flex-col lg:flex-row"
			style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}
		>
			<Sidebar />
			<main className="min-w-0 flex-1 overflow-auto">
				<div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					{children}
				</div>
			</main>
		</div>
	);
}
