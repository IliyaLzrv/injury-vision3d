function App() {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-dvh max-w-4xl items-center px-6 py-16">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Phase 1 — Project Foundation
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            InjuryVision 3D
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300 sm:text-lg">
            Sports injury tracking and recovery awareness platform
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-sm font-medium text-slate-200">Frontend</p>
              <p className="mt-2 text-sm text-slate-400">
                React + Vite + Tailwind CSS
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-sm font-medium text-slate-200">Backend</p>
              <p className="mt-2 text-sm text-slate-400">
                Spring Boot (Java 21) + Health endpoint
              </p>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-400">
            Disclaimer: This app is for self-tracking and awareness only. It is not a medical
            diagnosis tool.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
