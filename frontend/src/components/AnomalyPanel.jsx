/**
 * AnomalyPanel.jsx
 * Shows a feed of recent anomaly events with severity badges.
 * In production these would come from a real-time backend stream.
 */

import { AlertTriangle, Zap, Thermometer, Activity } from 'lucide-react'

const ANOMALIES = [
  {
    id: 1, time: '14:32', zone: 'Downtown Core',
    message: 'Demand spike +34% above forecast',
    severity: 'high', icon: Zap,
  },
  {
    id: 2, time: '13:58', zone: 'Airport Zone',
    message: 'Sustained overload for 18 min',
    severity: 'high', icon: AlertTriangle,
  },
  {
    id: 3, time: '13:11', zone: 'Industrial West',
    message: 'Unusual load pattern detected',
    severity: 'medium', icon: Activity,
  },
  {
    id: 4, time: '12:44', zone: 'Tech Park East',
    message: 'Temperature-demand mismatch',
    severity: 'low', icon: Thermometer,
  },
  {
    id: 5, time: '11:22', zone: 'Residential North',
    message: 'Minor demand deviation −8%',
    severity: 'low', icon: Activity,
  },
]

const SEV = {
  high:   'text-danger  bg-danger/10  border-danger/25',
  medium: 'text-amber   bg-amber/10   border-amber/25',
  low:    'text-success bg-success/10 border-success/20',
}

export default function AnomalyPanel() {
  return (
    <div className="flex flex-col gap-2">
      {ANOMALIES.map((a) => {
        const Icon = a.icon
        return (
          <div
            key={a.id}
            className="flex items-start gap-3 px-4 py-3
                       rounded-xl border border-white/6 bg-base-800/40
                       hover:border-white/12 transition-all duration-150"
          >
            <div className={`mt-0.5 w-7 h-7 rounded-lg shrink-0
                             flex items-center justify-center border ${SEV[a.severity]}`}>
              <Icon size={12} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-primary truncate">{a.message}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-ink-muted">{a.zone}</span>
                <span className="text-ink-muted">·</span>
                <span className="font-mono text-[11px] text-ink-muted">{a.time}</span>
              </div>
            </div>

            <span className={`text-[10px] font-500 px-2 py-0.5 rounded-full
                              border self-center shrink-0 ${SEV[a.severity]}`}>
              {a.severity}
            </span>
          </div>
        )
      })}
    </div>
  )
}
