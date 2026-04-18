"""
app/schemas/predict.py
-----------------------
Pydantic models for request validation and response serialization.
FastAPI uses these for automatic OpenAPI docs and input checking.
"""

from pydantic import BaseModel, Field, field_validator


class PredictRequest(BaseModel):
    """
    Input features required for a single energy demand prediction.
    All values are validated and constrained to realistic ranges.
    """

    hour: int = Field(
        ..., ge=0, le=23,
        description="Hour of day (0–23)",
        example=14
    )
    day_of_week: int = Field(
        ..., ge=0, le=6,
        description="Day of week — Monday=0, Sunday=6",
        example=2
    )
    month: int = Field(
        ..., ge=1, le=12,
        description="Month of year (1–12)",
        example=7
    )
    temperature: float = Field(
        ..., ge=-30.0, le=60.0,
        description="Ambient temperature in Celsius",
        example=28.5
    )
    energy_lag_1: float = Field(
        ..., ge=0.0,
        description="Energy consumption 1 hour ago (MWh)",
        example=312.4
    )
    energy_lag_24: float = Field(
        ..., ge=0.0,
        description="Energy consumption 24 hours ago (MWh)",
        example=298.7
    )

    @field_validator("temperature")
    @classmethod
    def temperature_not_nan(cls, v: float) -> float:
        import math
        if math.isnan(v) or math.isinf(v):
            raise ValueError("temperature must be a finite number")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "hour": 14,
                "day_of_week": 2,
                "month": 7,
                "temperature": 28.5,
                "energy_lag_1": 312.4,
                "energy_lag_24": 298.7,
            }
        }
    }


class PredictResponse(BaseModel):
    """Prediction result returned to the frontend."""

    predicted_energy_mwh: float = Field(
        ...,
        description="Predicted energy demand in MWh",
        example=327.8
    )
    unit: str = Field(default="MWh")
    model: str = Field(default="LSTM")
    status: str = Field(default="ok")
