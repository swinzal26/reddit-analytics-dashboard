import { ArrowRight, BarChart3, MessageCircle, Home } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/posts', label: 'Posts', icon: MessageCircle },
]

function Sidebar() {
  return (
    <aside className="w-full max-w-[280px] border-r border-slate-800 bg-slate-950 px-6 py-8 lg:sticky lg:top-0 lg:h-screen">
      <div className="mb-10 flex items-center gap-3 text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-xl font-bold">
          A
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">AppDev Insights</p>
          <h1 className="mt-1 text-xl font-semibold">Analytics Studio</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-950/10'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-500" />
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-slate-300 shadow-lg shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pro tip</p>
        <p className="mt-3 text-sm leading-6">
          Use the Posts view to manage community content and surface top stories across the dashboard.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
