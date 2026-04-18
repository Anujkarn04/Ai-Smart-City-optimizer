"""
app/services/model_loader.py
-----------------------------
Mock model loader (TensorFlow disabled).

This version avoids TensorFlow dependency conflicts so FastAPI can run.
You can later switch back to real model loading.
"""

# =========================
# Mock Storage (Singletons)
# =========================

_model = None
_scaler = None

# Use your actual trained metrics
_metrics = {
    "mae": 743.78,
    "rmse": 977.31
}


# =========================
# Startup Loader
# =========================

def load_model() -> None:
    """
    Called once during FastAPI startup.
    Currently loads a mock model (no TensorFlow).
    """
    print("[startup] Mock model loaded ✓")


# =========================
# Access Functions
# =========================

def get_model():
    """
    Returns model instance.
    In mock mode → returns None.
    """
    return None


def get_scaler():
    """
    Returns scaler instance.
    In mock mode → returns None.
    """
    return None


def get_metrics() -> dict:
    """
    Returns evaluation metrics (MAE, RMSE).
    """
    return _metrics


def is_model_loaded() -> bool:
    """
    Always True in mock mode.
    """
    return True