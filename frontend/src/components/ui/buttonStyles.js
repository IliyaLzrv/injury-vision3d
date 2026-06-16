const base =
	'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:cursor-not-allowed disabled:opacity-50';

export const buttonStyles = {
	base,
	primary: `${base} bg-[#0EA5E9] px-4 py-2 text-white shadow-sm hover:bg-[#38bdf8]`,
	teal: `${base} bg-teal-500 px-4 py-2 text-white shadow-sm hover:bg-teal-400 disabled:opacity-50`,
	secondary: `${base} border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm hover:border-sky-200 hover:bg-sky-50 disabled:opacity-50`,
	ghost: `${base} px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50`,
	danger: `${base} border border-red-200 bg-white px-4 py-2 text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50`,
};

export function cn(...classes) {
	return classes.filter(Boolean).join(' ');
}
