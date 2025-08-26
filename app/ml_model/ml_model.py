import joblib
import numpy as np
import os

# Tentukan path file model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

XGB_PATH = os.path.join(BASE_DIR, "xgb_model.pkl")
SVM_PATH = os.path.join(BASE_DIR, "svm_model.pkl")
SVM_META_PATH = os.path.join(BASE_DIR, "svm_meta.pkl")

# Load semua model
xgb_model = joblib.load(XGB_PATH)
svm_model = joblib.load(SVM_PATH)
svm_meta = joblib.load(SVM_META_PATH)

# Fungsi prediksi dengan XGBoost langsung
def predict_xgb(features: list[float]) -> int:
    X = np.array([features])
    pred = xgb_model.predict(X)
    return int(pred[0])

# Fungsi prediksi dengan SVM standalone
def predict_svm(features: list[float]) -> int:
    X = np.array([features])
    pred = svm_model.predict(X)
    return int(pred[0])

# Fungsi prediksi dengan Hybrid (XGB -> proba -> SVM meta)
def predict_hybrid(features: list[float]) -> int:
    X = np.array([features])
    xgb_proba = xgb_model.predict_proba(X)[:, 1].reshape(-1, 1)
    pred = svm_meta.predict(xgb_proba)
    return int(pred[0])

# Contoh pemakaian langsung
if __name__ == "__main__":
    sample = [3.5, 2, 8, 1, 0, 1,2]  # isi sesuai fitur dataset kamu
    
    print("XGB Prediction:", predict_xgb(sample))
    print("SVM Prediction:", predict_svm(sample))
    print("Hybrid Prediction:", predict_hybrid(sample))
