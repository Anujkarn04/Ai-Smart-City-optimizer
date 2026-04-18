/**
 * MetricCard.jsx
 * Displays a single KPI tile with label, value, unit, trend badge, and icon.
 *
 * Props:
 *   label      string   — card title
 *   value      string | number
 *   unit       string   — e.g. "MWh", "%"
 *   icon       React element
 *   trend      number   — optional ± percentage
 *   color      'accent' | 'amber' | 'danger' | 'success'   default: 'accent'
 *   loading    bool
 */

export default function MetricCard({
  label, value, unit, icon,
  trend, color = 'accent', loading = false,
}) {
  const palette = {
    accent:  { bg: 'bg-accent/8',   border: 'border-accent/20',  text: 'text-accent',  glow: 'shadow-accent-sm' },
    amber:   { bg: 'bg-amber/8',    border: 'border-amber/20',   text: 'text-amber',   glow: 'shadow-amber-sm'  },
    danger:  { bg: 'bg-danger/8',   border: 'border-danger/20',  text: 'text-danger',  glow: 'shadow-danger-sm' },
    success: { bg: 'bg-success/8',  border: 'border-success/20', text: 'text-success', glow: ''                 },
  }
  const c = palette[color] ?? palette.accent

  return (
    <div className={`
      relative rounded-xl border ${c.border} ${c.bg}
      p-5 flex flex-col gap-3
      shadow-card hover:${c.glow}
      transition-all duration-200
      animate-slide-up
    `}>
      {/* Icon + label row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-500 text-ink-secondary uppercase tracking-wider">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border}
                          flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-8 w-24 rounded-md bg-white/5 animate-pulse" />
      ) : (
        <div className="flex items-end gap-1.5">
          <span className={`font-display font-700 text-2xl ${c.text} glow-text-accent`}>
            {value ?? '—'}
          </span>
          {unit && (
            <span className="text-xs text-ink-muted mb-1">{unit}</span>
          )}
        </div>
      )}

      {/* Trend badge */}
      {trend != null && !loading && (
        <div className={`
          self-start text-[10px] font-500 px-2 py-0.5 rounded-full
          ${trend >= 0
            ? 'text-danger bg-danger/10 border border-danger/20'
            : 'text-success bg-success/10 border border-success/20'
          }
        `}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  )
}
