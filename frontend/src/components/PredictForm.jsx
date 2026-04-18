/**
 * PredictForm.jsx
 * ---------------
 * Input form that collects the 6 features and submits to POST /predict.
 * Uses the usePrediction hook for state management.
 *
 * Props:
 *   hook  — the object returned by usePrediction()
 */

import { Zap, Loader } from "lucide-react";

const FIELDS = [
  { key: "hour", label: "Hour of Day", min: 0, max: 23, step: 1, unit: "0–23" },
  {
    key: "day_of_week",
    label: "Day of Week",
    min: 0,
    max: 6,
    step: 1,
    unit: "Mon=0",
  },
  { key: "month", label: "Month", min: 1, max: 12, step: 1, unit: "1–12" },
  {
    key: "temperature",
    label: "Temperature",
    min: -30,
    max: 60,
    step: 0.1,
    unit: "°C",
  },
  {
    key: "energy_lag_1",
    label: "Consumption t-1",
    min: 0,
    max: 9999,
    step: 1,
    unit: "MW",
  },
  {
    key: "energy_lag_24",
    label: "Consumption t-24",
    min: 0,
    max: 9999,
    step: 1,
    unit: "MW",
  },
];

export default function PredictForm({ hook }) {
  const { form, updateField, predict, reset, loading, error, result } = hook;

  return (
    <div
      className="rounded-xl border border-white/8 bg-base-800/60
                    p-6 flex flex-col gap-5 shadow-card"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display font-600 text-base text-ink-primary">
          Feature Inputs
        </h2>
        <button
          onClick={reset}
          className="text-xs text-ink-muted hover:text-ink-secondary transition-colors"
        >
          Reset defaults
        </button>
      </div>

      {/* Field grid */}
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, min, max, step, unit }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[11px] font-500 text-ink-secondary uppercase tracking-wider">
              {label}
              <span className="ml-1 font-400 normal-case text-ink-muted">
                ({unit})
              </span>
            </label>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={form[key]}
              placeholder={unit}
              onChange={(e) => {
                const value = e.target.value;
                updateField(key, value === "" ? "" : parseFloat(value));
              }}
              className="
                w-full bg-base-900 border border-white/10 rounded-lg
                px-3 py-2 text-sm font-mono text-ink-primary
                focus:outline-none focus:border-accent/50 focus:bg-base-900
                hover:border-white/20 transition-all duration-150
                placeholder-ink-muted
              "
            />
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="rounded-lg bg-danger/8 border border-danger/25
                        px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}

      {/* Result display */}
      {result && !loading && (
        <div
          className="rounded-lg bg-accent/8 border border-accent/25
                        px-4 py-3 flex items-center justify-between"
        >
          <span className="text-sm text-ink-secondary">Predicted demand</span>
          <span className="font-display font-700 text-xl text-accent glow-text-accent">
            {result?.predicted_energy_mwh?.toFixed(2)}
            <span className="text-sm font-400 text-ink-muted ml-1.5">MWh</span>
          </span>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={predict}
        disabled={loading}
        className="
          w-full flex items-center justify-center gap-2
          bg-accent text-base-950 font-display font-600 text-sm
          py-2.5 rounded-xl
          hover:bg-accent-dim active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-150 shadow-accent-sm
        "
      >
        {loading ? (
          <>
            <Loader size={15} className="animate-spin" />
            Running inference…
          </>
        ) : (
          <>
            <Zap size={15} />
            Run Prediction
          </>
        )}
      </button>
    </div>
  );
}
