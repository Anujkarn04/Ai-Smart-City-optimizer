import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, MapPin,
  AlertTriangle, Leaf, Zap,
} from 'lucide-react'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Overview'    },
  { to: '/prediction', icon: TrendingUp,       label: 'Prediction'  },
  { to: '/zones',      icon: MapPin,           label: 'Zones'       },
  { to: '/anomalies',  icon: AlertTriangle,    label: 'Anomalies'   },
  { to: '/renewables', icon: Leaf,             label: 'Renewables'  },
]

export default function Sidebar() {
  return (
    <aside className="
      w-56 shrink-0 flex flex-col
      bg-base-900 border-r border-white/5
      z-20
    ">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40
                        flex items-center justify-center shadow-accent-sm">
          <Zap size={15} className="text-accent" />
        </div>
        <div>
          <p className="font-display font-700 text-sm text-ink-primary leading-none">
            GridOS
          </p>
          <p className="text-[10px] text-ink-muted mt-0.5">Energy Optimizer</p>
        </div>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        <p className="text-[10px] font-500 text-ink-muted uppercase tracking-widest
                      px-2 mb-2">
          Navigation
        </p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
               transition-all duration-150 group
               ${isActive
                 ? 'nav-active'
                 : 'text-ink-secondary hover:text-ink-primary hover:bg-white/5'
               }`
            }
          >
            <Icon size={16} className="shrink-0 transition-colors duration-150" />
            <span className="font-400">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer badge ── */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="rounded-lg bg-accent/8 border border-accent/15 px-3 py-2.5">
          <p className="text-[10px] text-accent font-500 uppercase tracking-wider">
            LSTM Model
          </p>
          <p className="text-xs text-ink-secondary mt-0.5">v1.0 · PJME dataset</p>
        </div>
      </div>
    </aside>
  )
}
