import { useEffect, useState } from "react";
import { Zap, BarChart2, AlertTriangle, Leaf, TrendingUp } from "lucide-react";


import MetricCard from "../components/MetricCard.jsx";
import PredictionChart from "../components/PredictionChart.jsx";
import ZonePanel from "../components/ZonePanel.jsx";
import AnomalyPanel from "../components/AnomalyPanel.jsx";

import { fetchMetrics } from "../services/api.js";
import { usePrediction } from "../hooks/usePrediction.js";
import CityMap from "../components/CityMap";


export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [mLoading, setMLoading] = useState(true);
  const hook = usePrediction();

  useEffect(() => {
    fetchMetrics()
      .then(setMetrics)
      .catch(() => setMetrics({ mae: null, rmse: null }))
      .finally(() => setMLoading(false));
  }, []);

  return (
    
      <div className="flex flex-col gap-6 pb-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Smart City Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time energy insights, predictions, and anomaly monitoring
          </p>
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Predicted Demand"
            value={
              hook.result ? hook.result.predicted_energy_mwh.toFixed(1) : "—"
            }
            unit="MW"
            icon={<Zap size={16} />}
            color="blue"
            loading={hook.loading}
          />

          <MetricCard
            label="Model MAE"
            value={
              mLoading ? null : metrics?.mae ? metrics.mae.toFixed(2) : "—"
            }
            unit="MW"
            icon={<BarChart2 size={16} />}
            color="green"
            loading={mLoading}
          />

          <MetricCard
            label="Model RMSE"
            value={
              mLoading ? null : metrics?.rmse ? metrics.rmse.toFixed(2) : "—"
            }
            unit="MW"
            icon={<TrendingUp size={16} />}
            color="yellow"
            loading={mLoading}
          />

          <MetricCard
            label="Active Anomalies"
            value="2"
            unit="zones"
            icon={<AlertTriangle size={16} />}
            color="red"
            trend={12.5}
          />
        </div>

        {/* CHART + RENEWABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CHART */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">
                Actual vs Predicted
              </h2>

              <span className="text-xs text-slate-400">
                last {hook.history.length} predictions
              </span>
            </div>

            <PredictionChart data={hook.history} />

            {hook.history.length === 0 && (
              <p className="text-center text-xs text-slate-400 mt-2">
                Go to <span className="text-blue-400">Prediction</span> tab to
                generate data
              </p>
            )}
          </div>

          {/* RENEWABLES */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={16} className="text-green-400" />
              <h2 className="text-sm font-semibold text-white">Renewables</h2>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Solar",
                  value: 163,
                  max: 200,
                  color: "bg-yellow-400",
                },
                { label: "Wind", value: 52, max: 100, color: "bg-blue-400" },
                { label: "Hydro", value: 22, max: 50, color: "bg-green-400" },
              ].map(({ label, value, max, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-mono">{value} MW</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-700`}
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── MAP SECTION ── */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <h2 className="text-sm font-semibold text-white mb-4">
            Smart City Zones
          </h2>
          <CityMap />
        </div>
        {/* ZONES + ANOMALIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-white mb-4">
              Zone Status
            </h2>
            <ZonePanel />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-white mb-4">
              Recent Anomalies
            </h2>
            <AnomalyPanel />
          </div>
        </div>
      </div>
    
  );
}
