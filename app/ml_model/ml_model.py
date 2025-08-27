import joblib
import numpy as np
import os

# Tentukan path file model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

XGB_PATH = os.path.join(BASE_DIR, "model.pkl")

# Load semua model
xgb_model = joblib.load(XGB_PATH)


# Fungsi prediksi dengan XGBoost langsung
def predict_xgb(features: list[float]) -> int:
    X = np.array([features])
    pred = xgb_model.predict(X)
    return int(pred[0])


# Contoh pemakaian langsung
if __name__ == "__main__":
    sample = [150,6,3.71,3,2, 2, 1,1,2]  # isi sesuai fitur dataset kamu
    
    print("XGB Prediction:", predict_xgb(sample))

