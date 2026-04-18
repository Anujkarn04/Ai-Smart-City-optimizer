/**
 * src/hooks/usePrediction.js
 * --------------------------
 * Uses GLOBAL context instead of local state for history
 */

import { useState, useCallback } from "react";
import { postPredict } from "../services/api";
import { usePredictionContext } from "../context/PredictionContext";
import { useEffect } from "react";

const MAX_HISTORY = 24;

const DEFAULT_FORM = {
  hour: new Date().getHours(),
  day_of_week: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
  month: new Date().getMonth() + 1,
  temperature: 22.0,
  energy_lag_1: 310.0,
  energy_lag_24: 295.0,
};

export function usePrediction() {
  const { history, setHistory } = usePredictionContext(); // ✅ GLOBAL

  const [form, setForm] = useState(DEFAULT_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const predict = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // validation
      if (Object.values(form).some((v) => v === "" || isNaN(v))) {
        setError("Please fill all fields correctly");
        setLoading(false);
        return;
      }

      const data = await postPredict(form);
      setResult(data);

      // ✅ GLOBAL history update
      setHistory((prev) => {
        const entry = {
          time: `${String(form.hour || 0).padStart(2, "0")}:00`,
          predicted: data.predicted_energy_mwh,
          actual: form.energy_lag_1,
        };

        const next = [...prev, entry];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    } catch (err) {
      setError(err?.message || "Prediction request failed.");
    } finally {
      setLoading(false);
    }
  }, [form, setHistory]);

  const reset = useCallback(() => {
    setForm({ ...DEFAULT_FORM });
    setResult(null);
    setError(null);
  }, []);
  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const interval = setInterval(() => {
      predict();
    }, 5000);

    return () => clearInterval(interval);
  }, [predict]);

  return {
    form,
    updateField,
    predict,
    reset,
    result,
    history, // ✅ now shared everywhere
    loading,
    error,
  };
}
