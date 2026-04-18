import PredictForm from "../components/PredictForm";
import PredictionChart from "../components/PredictionChart";
import { usePrediction } from "../hooks/usePrediction";

export default function Prediction() {
  const hook = usePrediction();

  return (
    <div className="space-y-6">
      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold">Energy Demand Prediction</h1>

        <p className="text-slate-400">
          Input current conditions and run the model for real-time demand
          forecast.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {/* FORM CARD */}
          <div className="col-span-1 bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-800">
            <PredictForm hook={hook} />
          </div>

          {/* CHART CARD */}
          <div className="col-span-2 bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-800">
            <h2 className="mb-4 text-lg font-semibold">Actual vs Predicted</h2>

            {hook.history.length === 0 ? (
              <div className="text-slate-400 text-sm">
                No predictions yet. Run the model to see results.
              </div>
            ) : (
              <PredictionChart data={hook.history} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
