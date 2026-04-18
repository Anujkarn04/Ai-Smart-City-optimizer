"""
app/utils/preprocessing.py
---------------------------
Transforms raw JSON request data into the exact numpy array shape
the LSTM expects: (1, SEQ_LEN, n_features).

Since the API receives a single prediction point (not a history window),
we build a synthetic sequence by repeating the input SEQ_LEN times.
In a production system you would store a rolling window in Redis/cache
and use real historical values here.
"""

import numpy as np
# from sklearn.preprocessing import MinMaxScaler

SEQ_LEN    = 24      # must match training config
N_FEATURES = 6       # hour, day_of_week, month, temperature, lag_1, lag_24

FEATURE_ORDER = [
    "hour",
    "day_of_week",
    "month",
    "temperature",
    "energy_lag_1",
    "energy_lag_24",
]


def build_input_array(features: dict) -> np.ndarray:
    """
    Turn a flat dict of feature values into shape (1, SEQ_LEN, N_FEATURES).

    Args:
        features: dict with keys matching FEATURE_ORDER

    Returns:
        numpy array of shape (1, 24, 6)
    """
    row = np.array([features[k] for k in FEATURE_ORDER], dtype=np.float32)
    # Repeat the single row to fill the sequence window
    sequence = np.tile(row, (SEQ_LEN, 1))          # (24, 6)
    return sequence[np.newaxis, :, :]              # (1, 24, 6)


def scale_input(raw_array: np.ndarray, scaler: MinMaxScaler) -> np.ndarray:
    """
    Apply the fitted MinMaxScaler to each timestep in the sequence.

    The scaler was fit on [FEATURES + TARGET] columns (7 total).
    We pad a dummy target column (0.0) so inverse_transform works,
    then strip it before feeding to the model.

    Args:
        raw_array : shape (1, SEQ_LEN, N_FEATURES)
        scaler    : the fitted MinMaxScaler from training

    Returns:
        scaled array of shape (1, SEQ_LEN, N_FEATURES)
    """
    seq = raw_array[0]                             # (24, 6)
    # Pad target column with zeros so scaler sees 7 columns
    padded = np.hstack([seq, np.zeros((SEQ_LEN, 1))])   # (24, 7)
    scaled = scaler.transform(padded)              # (24, 7)
    features_only = scaled[:, :N_FEATURES]         # (24, 6)
    return features_only[np.newaxis, :, :]         # (1, 24, 6)


def inverse_scale_prediction(pred_scaled: float, scaler: MinMaxScaler) -> float:
    """
    Convert a single scaled prediction value back to MWh.

    Args:
        pred_scaled : float in [0, 1]
        scaler      : the fitted MinMaxScaler from training

    Returns:
        float — predicted energy demand in MWh
    """
    padded = np.zeros((1, N_FEATURES + 1))
    padded[0, -1] = pred_scaled                    # target is last column
    inversed = scaler.inverse_transform(padded)
    return float(inversed[0, -1])


def prepare_prediction_input(features: dict, scaler: MinMaxScaler) -> np.ndarray:
    """
    Convenience wrapper: dict → scaled (1, SEQ_LEN, N_FEATURES) array.
    """
    raw = build_input_array(features)
    return scale_input(raw, scaler)
