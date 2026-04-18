/**
 * src/services/api.js
 * -------------------
 * All HTTP calls to the FastAPI backend live here.
 * Components never call fetch/axios directly — always import from this file.
 *
 * Base URL reads from the Vite env variable VITE_API_BASE_URL.
 * Local dev: http://localhost:8000  (or proxied via /api in vite.config.js)
 * Production: your Render / Railway URL
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach timing mark ─────────────────────────────────
client.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() }
  return config
})

// ── Response interceptor — log latency in dev ────────────────────────────────
client.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const ms = Date.now() - response.config.metadata.startTime
      console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status} (${ms}ms)`)
    }
    return response
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ── API methods ───────────────────────────────────────────────────────────────

/**
 * GET /health
 * Returns { status: "ok", model_loaded: true }
 */
export const fetchHealth = () => client.get('/health').then((r) => r.data)

/**
 * GET /metrics
 * Returns { mae, rmse, unit, note }
 */
export const fetchMetrics = () => client.get('/metrics').then((r) => r.data)

/**
 * POST /predict
 * @param {Object} features — { hour, day_of_week, month, temperature, energy_lag_1, energy_lag_24 }
 * Returns { predicted_energy_mwh, unit, model, status }
 */
export const postPredict = (features) =>
  client.post('/predict', features).then((r) => r.data)

export default client
