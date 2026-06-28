import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-slate-300 shadow-lg shadow-slate-950/10">
      <h2 className="text-3xl font-semibold text-white">Page not found</h2>
      <p className="mt-4 text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
        Return home
      </Link>
    </div>
  )
}

export default NotFound
