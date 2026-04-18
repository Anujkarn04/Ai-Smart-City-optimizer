/**
 * PredictionChart.jsx
 * -------------------
 * Recharts ResponsiveContainer line chart showing
 * "Actual" (lag-1) vs "Predicted" energy demand over recent predictions.
 *
 * Props:
 *   data  Array<{ time, predicted, actual }>
 */

import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

// Custom tooltip styled to match the dark theme
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-base-800 border border-white/10 rounded-xl px-4 py-3 shadow-card">
      <p className="text-[11px] text-ink-muted mb-2 font-mono">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-ink-secondary capitalize">{p.dataKey}:</span>
          <span className="font-mono text-ink-primary font-500">
            {Number(p.value).toFixed(1)} MW
          </span>
        </div>
      ))}
    </div>
  )
}

export default function PredictionChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2
                      text-ink-muted border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No predictions yet</p>
        <p className="text-xs">Submit the form to see actual vs predicted</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: '#8a97b0', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8a97b0', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#8a97b0', paddingTop: '12px' }}
        />

        {/* Actual line — amber */}
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#f0a500"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: '#f0a500', strokeWidth: 0 }}
        />

        {/* Predicted line — accent teal */}
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#00d4b4"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 3"
          activeDot={{ r: 5, fill: '#00d4b4', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
