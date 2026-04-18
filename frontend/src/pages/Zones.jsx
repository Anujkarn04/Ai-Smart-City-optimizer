/**
 * pages/Zones.jsx
 * ----------------
 * Full zone optimization page with load table and summary stats.
 */

import ZonePanel from "../components/ZonePanel.jsx";
import { MapPin, Zap, TrendingDown } from "lucide-react";
import { usePredictionContext } from "../context/PredictionContext";

const SUMMARY = [
  { label: "Total Zones", value: "6", unit: "", color: "text-accent" },
  { label: "Critical Zones", value: "2", unit: "", color: "text-danger" },
  { label: "Total Savings", value: "37.4", unit: "MW", color: "text-success" },
  { label: "Avg Load", value: "62.8", unit: "%", color: "text-amber" },
];

export default function Zones() {
  const { history } = usePredictionContext();

  const latest = history?.[history.length - 1];
  const demand = latest ? latest.predicted_energy_mwh : 500;
  return (
    <div className="page-enter flex flex-col gap-6 pb-6">
      <div>
        <h2 className="font-display font-700 text-lg text-ink-primary">
          Zone Optimization
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Real-time load distribution and optimization status across all city
          zones.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUMMARY.map(({ label, value, unit, color }) => (
          <div
            key={label}
            className="rounded-xl border border-white/8 bg-base-800/60
                       px-4 py-3 shadow-card"
          >
            <p className="text-[11px] text-ink-muted uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className={`font-display font-700 text-xl ${color}`}>
              {value}
              {unit && (
                <span className="text-xs text-ink-muted font-400 ml-1">
                  {unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Zone table */}
      <div className="rounded-xl border border-white/8 bg-base-800/60 p-5 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={14} className="text-accent" />
          <h3 className="font-display font-600 text-sm text-ink-primary">
            Zone Load Status
          </h3>
        </div>
        <ZonePanel />
      </div>

      {/* Optimization tips */}
      <div className="rounded-xl border border-white/6 bg-base-800/40 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown size={14} className="text-success" />
          <h3 className="font-display font-600 text-sm text-ink-primary">
            Optimization Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              zone: "Downtown Core",
              tip: "Shift 12 MW of non-critical loads to off-peak hours (22:00–06:00).",
            },
            {
              zone: "Airport Zone",
              tip: "Activate demand response protocol — reduce HVAC load by 15%.",
            },
            {
              zone: "Industrial West",
              tip: "Optimization in progress. Estimated completion: 14 min.",
            },
            {
              zone: "Tech Park East",
              tip: "Consider load balancing with Residential North sector.",
            },
          ].map(({ zone, tip }) => (
            <div
              key={zone}
              className="flex flex-col gap-1.5 p-3 rounded-lg
                         border border-white/6 bg-base-900/50"
            >
              <div className="flex items-center gap-1.5">
                <Zap size={11} className="text-accent" />
                <span className="text-xs font-500 text-ink-primary">
                  {zone}
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
