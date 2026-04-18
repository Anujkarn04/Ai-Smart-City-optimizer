/**
 * pages/Renewables.jsx
 * ---------------------
 * Renewable energy insights page with stacked bar chart and source breakdown.
 */

import RenewableInsights from "../components/RenewableInsights.jsx";
import { Leaf, Sun, Wind, Droplets} from "lucide-react";


const SOURCES = [
  {
    icon: Sun,
    label: "Solar",
    value: 163,
    capacity: 200,
    color: "bg-amber-500",
    text: "text-amber-400",
    desc: "Peak generation at 12:00–13:00. Forecast: 155 MW next hour.",
  },
  {
    icon: Wind,
    label: "Wind",
    value: 52,
    capacity: 100,
    color: "bg-accent-500",
    text: "text-accent-400",
    desc: "Moderate output. Wind speed: 18 km/h. Stable over next 3 hrs.",
  },
  {
    icon: Droplets,
    label: "Hydro",
    value: 22,
    capacity: 50,
    color: "bg-blue-500",
    text: "text-blue-400",
    desc: "Steady baseline generation. Reservoir at 74% capacity.",
  },
];

export default function Renewables() {
  const total = SOURCES.reduce((s, x) => s + x.value, 0);
  const gridLoad = 520; // simulated total grid MW

  return (
    <div className="page-enter flex flex-col gap-6 pb-6">
      <div>
        <h2 className="font-display font-700 text-lg text-ink-primary">
          Renewable Insights
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Live generation from solar, wind, and hydro sources and their share of
          total grid load.
        </p>
      </div>

      {/* Green share hero */}
      <div
        className="rounded-xl border border-success/25 bg-success/6 p-5 shadow-card
                      flex items-center gap-6"
      >
        <div>
          <p className="text-[11px] text-ink-muted uppercase tracking-wider mb-1">
            Renewable share
          </p>
          <p className="font-display font-800 text-4xl text-success">
            {((total / gridLoad) * 100).toFixed(1)}
            <span className="text-xl ml-1 font-400 text-ink-secondary">%</span>
          </p>
          <p className="text-xs text-ink-muted mt-1">
            {total} MW of {gridLoad} MW total grid load
          </p>
        </div>

        {/* Mini donut-style bar */}
        <div className="flex-1 max-w-xs">
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {SOURCES.map((s) => (
              <div
                key={s.label}
                className={`${s.color} transition-all duration-700`}
                style={{ width: `${(s.value / gridLoad) * 100}%` }}
              />
            ))}
            <div className="bg-white/10 flex-1 rounded-r-full" />
          </div>
          <div className="flex gap-3 mt-2">
            {SOURCES.map((s) => (
              <div key={s.label} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-[10px] text-ink-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-white/8 bg-base-800/60 p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Leaf size={14} className="text-success" />
          <h3 className="font-display font-600 text-sm text-ink-primary">
            Generation by Hour
          </h3>
        </div>
        <RenewableInsights />
      </div>

      {/* Source cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
       {SOURCES.map((item) => {
  const Icon = item.icon;

  return (
    <div
      key={item.label}
      className="rounded-xl border border-white/8 bg-base-800/60 p-5 shadow-card
                 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={15} className={item.text} />
          <span className="font-display font-600 text-sm text-ink-primary">
            {item.label}
          </span>
        </div>
        <span className={`font-mono text-sm font-500 ${item.text}`}>
          {item.value} MW
        </span>
      </div>

      {/* Capacity bar */}
      <div>
        <div className="flex justify-between text-[10px] text-ink-muted mb-1">
          <span>Utilization</span>
          <span>
            {((item.value / item.capacity) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className={`h-full rounded-full ${item.color} transition-all duration-700`}
            style={{ width: `${(item.value / item.capacity) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-ink-secondary leading-relaxed">
        {item.desc}
      </p>
    </div>
  );
})}
          
      </div>
    </div>
  );
}
