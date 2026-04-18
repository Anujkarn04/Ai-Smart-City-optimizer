"""
app/routes/metrics.py
----------------------
GET /metrics — returns MAE and RMSE from the last training run.
These values are saved by train_model.py into model/metrics.pkl.
"""

from fastapi import APIRouter
from app.services.model_loader import get_metrics

router = APIRouter()


@router.get("", summary="Model evaluation metrics")
async def model_metrics():
    """
    Returns MAE and RMSE computed against the held-out test set
    at training time. Displayed as KPI cards in the React dashboard.
    """
    m = get_metrics()
    return {
        "mae":  round(m.get("mae",  0.0), 4),
        "rmse": round(m.get("rmse", 0.0), 4),
        "unit": "MWh",
        "note": "Evaluated on 20% hold-out test set",
    }
