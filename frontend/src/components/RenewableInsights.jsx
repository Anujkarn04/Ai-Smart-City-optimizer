/**
 * RenewableInsights.jsx
 * Recharts bar chart showing renewable energy contribution by source and hour.
 */

import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

// Simulated 6-hour renewable snapshot
const DATA = [
  { hour: '09:00', solar: 82,  wind: 34, hydro: 20 },
  { hour: '10:00', solar: 110, wind: 41, hydro: 20 },
  { hour: '11:00', solar: 145, wind: 38, hydro: 21 },
  { hour: '12:00', solar: 163, wind: 45, hydro: 22 },
  { hour: '13:00', solar: 158, wind: 52, hydro: 21 },
  { hour: '14:00', solar: 142, wind: 48, hydro: 20 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + p.value, 0)
  return (
    <div className="bg-base-800 border border-white/10 rounded-xl px-4 py-3 shadow-card">
      <p className="text-[11px] text-ink-muted mb-2 font-mono">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-ink-secondary capitalize">{p.dataKey}:</span>
          <span className="font-mono text-ink-primary font-500">{p.value} MW</span>
        </div>
      ))}
      <div className="border-t border-white/8 mt-2 pt-2 flex justify-between text-xs">
        <span className="text-ink-muted">Total</span>
        <span className="font-mono text-accent font-500">{total} MW</span>
      </div>
    </div>
  )
}

export default function RenewableInsights() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 11, fill: '#8a97b0', fontFamily: 'JetBrains Mono' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8a97b0', fontFamily: 'JetBrains Mono' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#8a97b0', paddingTop: '10px' }} />

        <Bar dataKey="solar" stackId="a" fill="#f0a500" radius={[0, 0, 0, 0]} />
        <Bar dataKey="wind"  stackId="a" fill="#00d4b4" radius={[0, 0, 0, 0]} />
        <Bar dataKey="hydro" stackId="a" fill="#4a90d9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
