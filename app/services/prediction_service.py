from sqlalchemy.orm import Session
from app.models.prediction import MahasiswaRespon
from app.ml_model.ml_model import predict_xgb, predict_svm, predict_hybrid
from app.schemas.prediction import AcademicInput, AcademicOutput, FullInput, PredictionOutput, PredictionDB
from app.utils.logic import validate_academic
from typing import List



# === Step 1: Validasi Akademik ===
def validate_academic_service(data: AcademicInput) -> AcademicOutput:
    status, pred, label = validate_academic(data.sks_lulus, data.semester, data.ipk)
    return AcademicOutput(
        academic_status=status,
        prediction=pred,
        label=label
    )


def predict_and_save_service(
    db: Session,
    data: FullInput,
    model_type: str = "hybrid"
) -> PredictionOutput:
    
    # --- 1) Ambil fitur PHQ sesuai training ---
    phq_features = [
    data.ekonomi_tunggakan or 0,
    data.ekonomi_bayar or 0,
    data.stress_beban or 0,
    data.stress_motivasi or 0,
    data.cuti_ambil or 0,
    data.cuti_alasan or 0
    ]

    # --- 2) Prediksi pakai model ---
    if model_type == "xgb":
        pred = predict_xgb(phq_features)
    elif model_type == "svm":
        pred = predict_svm(phq_features)
    else:  # default → hybrid
        pred = predict_hybrid(phq_features)

    # --- 3) Label hasil ---
    label = "Beresiko Dropout" if pred == 1 else "Tidak Beresiko Dropout"

    # --- 4) Hitung total skor faktor tambahan ---
    total_skor = sum([
        data.ekonomi_tunggakan or 0,
        data.ekonomi_bayar or 0,
        data.stress_beban or 0,
        data.stress_motivasi or 0,
        data.cuti_ambil or 0,
        data.cuti_alasan or 0
    ])

    # --- 5) Simpan ke DB ---
    db_obj = MahasiswaRespon(
        nim=data.nim,
        nama=data.nama,
        sks_lulus=data.sks_lulus,
        semester=data.semester,
        ipk=data.ipk,
        ekonomi_tunggakan=data.ekonomi_tunggakan,
        ekonomi_bayar=data.ekonomi_bayar,
        stress_beban=data.stress_beban,
        stress_motivasi=data.stress_motivasi,
        cuti_ambil=data.cuti_ambil,
        cuti_alasan=data.cuti_alasan,
        total_skor=total_skor,
        prediksi=pred
    )

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    return PredictionOutput(
        nim=db_obj.nim,
        nama=db_obj.nama,
        prediction=db_obj.prediksi,
        label=label,
        total_skor=db_obj.total_skor,
        created_at=db_obj.created_at
    )

def get_all_predictions_service(db: Session) -> List[PredictionDB]:
    records = db.query(MahasiswaRespon).all()
    return records   # FastAPI + Pydantic otomatis konversi pakai orm_mode

def get_prediction_by_nim_service(db: Session, nim: str) -> PredictionDB:
    record = db.query(MahasiswaRespon).filter(MahasiswaRespon.nim == nim).first()
    if not record:
        raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")
    return record   # langsung return object ORM, Pydantic urus konversi
