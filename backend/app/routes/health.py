"""
app/routes/health.py
---------------------
GET /health — liveness check used by Render / Railway and the React dashboard.
"""

from fastapi import APIRouter
from app.services.model_loader import is_model_loaded

router = APIRouter()


@router.get("/health", summary="Server health check")
async def health_check():
    """
    Returns 200 with model status.
    The frontend polls this on mount to confirm the backend is reachable.
    """
    return {
        "status": "ok",
        "model_loaded": is_model_loaded(),
    }
