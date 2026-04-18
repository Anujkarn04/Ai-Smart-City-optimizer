
"""
train_model.py
--------------
Offline LSTM training script for Smart City Energy Optimizer.
Dataset: PJME Hourly Energy Consumption (Kaggle)
         Columns: Datetime, PJME_MW

Run once from inside the backend/ folder:
    python train_model.py

Outputs:
    model/lstm_model.h5   — trained Keras LSTM
    model/scaler.pkl      — fitted MinMaxScaler
    model/metrics.pkl     — MAE + RMSE from test set
"""

# FIX (Bug 4) — suppress noisy TensorFlow C++ startup logs so our
# print() statements are visible immediately in the terminal.
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import pickle
import numpy as np
import pandas as pd
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_absolute_error, mean_squared_error
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import LSTM, Dense, Dropout
# from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# ── Config ────────────────────────────────────────────────────────────────────

# FIX (Bug 1 / path): dataset lives at backend/data/energy_dataset.csv
# Run this script from inside the backend/ folder.
DATA_PATH   = "data/energy_dataset.csv"
MODEL_DIR   = "model"
MODEL_PATH  = os.path.join(MODEL_DIR, "lstm_model.h5")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")

SEQ_LEN    = 24     # look-back window: 24 hours
BATCH_SIZE = 32
EPOCHS     = 15     # FIX (Bug 5): was 50 — 15 is enough; EarlyStopping handles the rest
LSTM_UNITS = 64
DROPOUT    = 0.2

FEATURES = [
    "hour",
    "day_of_week",
    "month",
    "temperature",      # synthetic — added in load_and_engineer()
    "energy_lag_1",     # t-1 hour
    "energy_lag_24",    # t-24 hours (same hour yesterday)
]
# FIX (Bug 2): renamed from "energy_consumption" to match our engineered column name
TARGET = "energy_consumption"


# ── Step 2: Fixed load_and_engineer() ────────────────────────────────────────

def load_and_engineer(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)

    # Rename columns FIRST
    df.rename(columns={
        "Datetime": "timestamp",
        "PJME_MW": "energy_consumption"
    }, inplace=True)

    # Convert timestamp
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    # Add temperature (REQUIRED)
    df["temperature"] = np.random.randint(20, 35, size=len(df))

    # Sort
    df = df.sort_values("timestamp").reset_index(drop=True)

    # Time features
    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["month"] = df["timestamp"].dt.month

    # Lag features
    df["energy_lag_1"] = df[TARGET].shift(1)
    df["energy_lag_24"] = df[TARGET].shift(24)

    # Drop NaN
    df = df.dropna().reset_index(drop=True)

    return df


# ── Sequence builder ──────────────────────────────────────────────────────────

def make_sequences(data: np.ndarray, seq_len: int):
    """
    Convert a 2-D scaled array (samples × [features + target]) into
    LSTM-ready 3-D arrays.

    Returns:
        X : (n_samples, seq_len, n_features)  — input windows
        y : (n_samples,)                       — target at t+seq_len
    """
    X, y = [], []
    for i in range(len(data) - seq_len):
        X.append(data[i : i + seq_len, :-1])   # all columns except last (target)
        y.append(data[i + seq_len,    -1])      # last column = target at next step
    return np.array(X), np.array(y)


# ── Model builder ─────────────────────────────────────────────────────────────

def build_model(input_shape: tuple) -> Sequential:
    """Two-layer stacked LSTM for time-series regression."""
    model = Sequential([
        LSTM(LSTM_UNITS, return_sequences=True, input_shape=input_shape),
        Dropout(DROPOUT),
        LSTM(LSTM_UNITS // 2, return_sequences=False),
        Dropout(DROPOUT),
        Dense(32, activation="relu"),
        Dense(1),   # single continuous output — predicted MWh
    ])
    model.compile(optimizer="adam", loss="mse", metrics=["mae"])
    return model


# ── Step 3 + Step 5 + Step 6: main() ─────────────────────────────────────────

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # ── 1. Load & engineer features ──────────────────────────────────────────
    print("\n[1/6] Loading data …")
    df = load_and_engineer(DATA_PATH)
    print(f"  Total rows after engineering : {len(df):,}")

    # ── 2. Scale features + target together ──────────────────────────────────
    print("\n[2/6] Scaling features …")
    cols   = FEATURES + [TARGET]        # 7 columns: 6 features + 1 target
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(df[cols].values)
    print(f"  Scaled array shape : {scaled.shape}")

    # ── 3. Save scaler (must match what inference uses) ───────────────────────
    with open(SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)
    print(f"  Scaler saved → {SCALER_PATH}")

    # ── 4. Build sequences ────────────────────────────────────────────────────
    print("\n[3/6] Building LSTM sequences …")
    X, y = make_sequences(scaled, SEQ_LEN)
    # Step 6 debug print: confirm shapes before training
    print(f"  X shape : {X.shape}   ← (samples, timesteps, features)")
    print(f"  y shape : {y.shape}   ← (samples,)")

    # ── 5. Train / test split (NO shuffle — time series order matters) ────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )
    print(f"  Train : {X_train.shape[0]:,} samples")
    print(f"  Test  : {X_test.shape[0]:,} samples")

    # ── 6. Build model ────────────────────────────────────────────────────────
    print("\n[4/6] Building model …")
    model = build_model(input_shape=(SEQ_LEN, len(FEATURES)))
    model.summary()

    # FIX (Bug 6): add save_format='h5' so Keras writes a .h5 file, not a
    # SavedModel folder (default in TF 2.16+).
    callbacks = [
        EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        ),
        ModelCheckpoint(
            MODEL_PATH,
            monitor="val_loss",
            save_best_only=True,
            save_format="h5",   # FIX (Bug 6)
            verbose=1,
        ),
    ]

    # ── 7. Train ──────────────────────────────────────────────────────────────
    print("\n[5/6] Training …")
    model.fit(
        X_train, y_train,
        validation_split=0.1,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
        verbose=1,          # shows epoch-by-epoch loss in terminal
    )

    # ── 8. Evaluate on held-out test set ─────────────────────────────────────
    print("\n[6/6] Evaluating …")
    y_pred = model.predict(X_test, verbose=0).flatten()

    n_features = len(FEATURES)

    def inverse_target(arr: np.ndarray) -> np.ndarray:
        """
        Inverse-transform the target column back to MWh.
        The scaler was fit on 7 columns, so we pad with zeros
        to match that width, run inverse_transform, then extract
        only the last column (the target).
        """
        padded = np.zeros((len(arr), n_features + 1))
        padded[:, -1] = arr
        return scaler.inverse_transform(padded)[:, -1]

    y_test_real = inverse_target(y_test)
    y_pred_real = inverse_target(y_pred)

    mae  = mean_absolute_error(y_test_real, y_pred_real)
    rmse = float(np.sqrt(mean_squared_error(y_test_real, y_pred_real)))

    print(f"\n── Evaluation on test set ──────────────────────")
    print(f"  MAE  : {mae:.2f} MW")
    print(f"  RMSE : {rmse:.2f} MW")
    print(f"────────────────────────────────────────────────")

    # ── 9. Save metrics so GET /metrics can read them ─────────────────────────
    metrics_path = os.path.join(MODEL_DIR, "metrics.pkl")
    with open(metrics_path, "wb") as f:
        pickle.dump({"mae": float(mae), "rmse": float(rmse)}, f)

    print(f"\nAll outputs saved:")
    print(f"  {MODEL_PATH}")
    print(f"  {SCALER_PATH}")
    print(f"  {metrics_path}")
    print("\nDone. You can now start the FastAPI server.")


# ── Step 3: guard ensures main() runs when called directly ───────────────────
if __name__ == "__main__":
    print("CALLING MAIN NOW 🔥")
    main()