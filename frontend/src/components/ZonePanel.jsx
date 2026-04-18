/**
 * ZonePanel.jsx
 * Displays a table of city zones with simulated load and optimization status.
 */

import { MapPin, CheckCircle, AlertCircle, Clock } from "lucide-react";


const ZONES = [
  { name: "Downtown Core", load: 87, status: "critical", saving: 0 },
  { name: "Industrial West", load: 72, status: "optimizing", saving: 12.4 },
  { name: "Residential North", load: 45, status: "optimal", saving: 8.1 },
  { name: "Tech Park East", load: 61, status: "optimizing", saving: 5.7 },
  { name: "Suburb South", load: 34, status: "optimal", saving: 11.2 },
  { name: "Airport Zone", load: 78, status: "critical", saving: 0 },
];

const STATUS_STYLES = {
  optimal: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10 border-success/25",
  },
  optimizing: {
    icon: Clock,
    color: "text-amber",
    bg: "bg-amber/10  border-amber/25",
  },
  critical: {
    icon: AlertCircle,
    color: "text-danger",
    bg: "bg-danger/10 border-danger/25",
  },
};

export default function ZonePanel() {
  
  return (
    <div className="flex flex-col gap-2">
      {ZONES.map((z) => {
        const s = STATUS_STYLES[z.status];
        const Icon = s.icon;
        return (
          <div
            key={z.name}
            className="flex items-center gap-3 px-4 py-3
                       rounded-xl border border-white/6 bg-base-800/40
                       hover:border-white/12 transition-all duration-150"
          >
            <MapPin size={14} className="text-ink-muted shrink-0" />

            <span className="flex-1 text-sm text-ink-primary">{z.name}</span>

            {/* Load bar */}
            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500
                  ${z.load > 75 ? "bg-danger" : z.load > 55 ? "bg-amber" : "bg-success"}`}
                style={{ width: `${z.load}%` }}
              />
            </div>
            <span className="font-mono text-xs text-ink-secondary w-8 text-right">
              {z.load}%
            </span>

            {/* Saving badge */}
            {z.saving > 0 && (
              <span
                className="text-[10px] text-success font-500
                               bg-success/10 border border-success/20
                               px-2 py-0.5 rounded-full"
              >
                −{z.saving} MW
              </span>
            )}

            {/* Status pill */}
            <span
              className={`flex items-center gap-1 text-[10px] font-500
                               px-2 py-0.5 rounded-full border
                               ${s.bg} ${s.color}`}
            >
              <Icon size={10} />
              {z.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
