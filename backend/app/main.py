"""
app/main.py
-----------
FastAPI application entry point.
- Configures CORS so the React frontend can call the API.
- Loads the LSTM model once at startup (never at request time).
- Registers all route prefixes.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import predict, health, metrics
from app.services.model_loader import load_model


# ── Lifespan: runs once at startup / shutdown ────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load heavy artifacts before the first request arrives."""
    load_model()          # loads lstm_model.h5 + scaler.pkl into memory
    yield
    # Nothing to clean up for a read-only model


# ── App instance ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Smart City Energy Optimizer API",
    description="LSTM-powered energy demand prediction for smart grid management.",
    version="1.0.0",
    lifespan=lifespan,
)


# ── CORS ─────────────────────────────────────────────────────────────────────
# In production replace "*" with your actual Vercel frontend URL, e.g.:
# allow_origins=["https://smart-energy.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routers ──────────────────────────────────────────────────────────────────

app.include_router(health.router,   tags=["Health"])
app.include_router(predict.router,  prefix="/predict",  tags=["Prediction"])
app.include_router(metrics.router,  prefix="/metrics",  tags=["Metrics"])


# ── Root ─────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "Smart City Energy Optimizer",
        "version": "1.0.0",
        "docs": "/docs",
    }
