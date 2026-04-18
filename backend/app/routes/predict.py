"""
app/routes/predict.py
----------------------
POST /predict — accepts feature JSON, returns predicted energy demand.
"""

import numpy as np
from fastapi import APIRouter, HTTPException

from app.schemas.predict import PredictRequest, PredictResponse
from app.services.model_loader import get_model, get_scaler
from app.utils.preprocessing import prepare_prediction_input, inverse_scale_prediction

router = APIRouter()


@router.post("", response_model=PredictResponse, summary="Predict energy demand")
async def predict_energy(request: PredictRequest) -> PredictResponse:
    """
    Mock prediction (TensorFlow disabled for now)
    """
    try:
        features = request.model_dump()

        # Simple mock logic (you can make it smarter if you want)
        base = 1000
        variation = features["hour"] * 10 + features["temperature"] * 5

        prediction = base + variation

        return PredictResponse(
            predicted_energy_mwh=round(prediction, 4),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    return PredictResponse(
        predicted_energy_mwh=round(pred_mwh, 4),
    )
