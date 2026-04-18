/**
 * pages/Anomalies.jsx
 * --------------------
 * Anomaly detection page with severity breakdown and event feed.
 */

import AnomalyPanel from "../components/AnomalyPanel.jsx";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";


export default function Anomalies() {
  return (
    
    <div className="page-enter flex flex-col gap-6 pb-6">
      <div>
        <h2 className="font-display font-700 text-lg text-ink-primary">
          Anomaly Detection
        </h2>
        <p className="text-sm text-ink-secondary mt-1">
          Automated detection of abnormal demand patterns, overloads, and
          forecast deviations.
        </p>
      </div>

      {/* Severity summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "High Severity",
            count: 2,
            color: "text-danger",
            bg: "bg-danger/8  border-danger/20",
            icon: AlertTriangle,
          },
          {
            label: "Medium Severity",
            count: 1,
            color: "text-amber",
            bg: "bg-amber/8   border-amber/20",
            icon: Activity,
          },
          {
            label: "Low Severity",
            count: 2,
            color: "text-success",
            bg: "bg-success/8 border-success/20",
            icon: ShieldCheck,
          },
        ].map(({ label, count, color, bg, icon }) => {
          const Icon = icon;
          return (
            <div
              key={label}
              className={`rounded-xl border ${bg} px-4 py-4 shadow-card
                        flex items-center gap-3`}
            >
              <Icon size={20} className={color} />
              <div>
                <p className={`font-display font-700 text-2xl ${color}`}>
                  {count}
                </p>
                <p className="text-[11px] text-ink-muted mt-0.5">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event feed */}
      <div className="rounded-xl border border-white/8 bg-base-800/60 p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-danger" />
            <h3 className="font-display font-600 text-sm text-ink-primary">
              Event Feed
            </h3>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-[10px] text-success font-500">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
            Live
          </div>
        </div>
        <AnomalyPanel />
      </div>

      {/* Detection methodology */}
      <div className="rounded-xl border border-white/6 bg-base-800/40 p-5">
        <h3 className="font-display font-600 text-sm text-ink-primary mb-3">
          Detection Methodology
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-ink-secondary">
          <div className="flex flex-col gap-1">
            <span className="text-accent font-500">Threshold detection</span>
            <span>
              Flags any reading that deviates more than ±2σ from the rolling
              24-hour mean for that zone.
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-amber font-500">Forecast deviation</span>
            <span>
              Compares LSTM-predicted demand against actual consumption.
              Deviations above 15% trigger a medium alert.
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-success font-500">Pattern matching</span>
            <span>
              Historical baseline profiles per zone identify unusual temporal
              patterns regardless of absolute magnitude.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
