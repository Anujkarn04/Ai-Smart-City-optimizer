import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Activity, RefreshCw } from 'lucide-react'
import { fetchHealth } from '../services/api'

const PAGE_TITLES = {
  '/dashboard':  'Overview Dashboard',
  '/prediction': 'Energy Prediction',
  '/zones':      'Zone Optimization',
  '/anomalies':  'Anomaly Detection',
  '/renewables': 'Renewable Insights',
}

export default function Header() {
  const { pathname } = useLocation()
  const [time,   setTime]   = useState(new Date())
  const [health, setHealth] = useState(null)   // null | { status, model_loaded }

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Health poll every 30 s
  useEffect(() => {
    const check = () => fetchHealth().then(setHealth).catch(() => setHealth(null))
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  const title = PAGE_TITLES[pathname] ?? 'Dashboard'
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="
      h-14 shrink-0 flex items-center justify-between px-6
      bg-base-900/80 border-b border-white/5
      backdrop-blur-sm z-10
    ">
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <h1 className="font-display font-600 text-base text-ink-primary">
          {title}
        </h1>
      </div>

      {/* Right: clock + health indicator */}
      <div className="flex items-center gap-4">

        {/* Model health badge */}
        {health && (
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
            border transition-all duration-300
            ${health.model_loaded
              ? 'text-success border-success/30 bg-success/8'
              : 'text-amber border-amber/30 bg-amber/8'
            }`}>
            <Activity size={11} />
            <span>{health.model_loaded ? 'Model online' : 'Loading model'}</span>
          </div>
        )}

        {/* Live clock */}
        <div className="text-right">
          <p className="font-mono text-sm text-ink-primary leading-none">{timeStr}</p>
          <p className="text-[10px] text-ink-muted mt-0.5">{dateStr}</p>
        </div>

        {/* Refresh hint */}
        <button
          onClick={() => window.location.reload()}
          className="p-1.5 rounded-lg text-ink-muted hover:text-accent
                     hover:bg-accent/8 transition-all duration-150"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  )
}
