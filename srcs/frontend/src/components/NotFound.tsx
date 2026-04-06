import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-7rem)] w-full flex items-center justify-center px-4 py-10">
      <section className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-sky-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_32%)]" />
        <div className="relative flex flex-col gap-8">
          <div className="flex items-center gap-3 text-sky-600 dark:text-sky-400">
            <AlertTriangle className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-[0.35em]">Page not found</span>
          </div>

          <div className="space-y-4">
            <p className="text-7xl font-black tracking-tight text-slate-900 dark:text-white sm:text-8xl">404</p>
            <h1 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              The route you requested does not exist.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              The page may have moved, been renamed, or never existed. Use the navigation below to get back to a valid screen.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}