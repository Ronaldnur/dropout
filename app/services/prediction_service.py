from sqlalchemy.orm import Session
from app.models.prediction import MahasiswaRespon
from app.ml_model.ml_model import predict_xgb
from app.schemas.prediction import AcademicInput, AcademicOutput, FullInput, PredictionOutput, PredictionDB, FactorDetail
from app.utils.logic import validate_academic
from typing import List
from datetime import datetime
from fastapi import HTTPException


def validate_academic_service(db: Session, data: AcademicInput) -> AcademicOutput:
    status, pred, label = validate_academic(data.sks_lulus, data.semester, data.ipk)

    # --- Cek apakah mahasiswa sudah ada ---
    db_obj = db.query(MahasiswaRespon).filter(MahasiswaRespon.nim == data.nim).first()
    if db_obj:
        # Update record lama
        db_obj.nama = data.nama
        db_obj.sks_lulus = data.sks_lulus
        db_obj.semester = data.semester
        db_obj.ipk = data.ipk
        db_obj.total_skor = 0
        db_obj.prediksi = pred
        db_obj.updated_at = datetime.now()
    else:
        # Buat record baru
        db_obj = MahasiswaRespon(
            nim=data.nim,
            nama=data.nama,
            sks_lulus=data.sks_lulus,
            semester=data.semester,
            ipk=data.ipk,
            total_skor=0,
            prediksi=pred,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.add(db_obj)

    db.commit()
    db.refresh(db_obj)

    return AcademicOutput(
        academic_status=status,
        prediction=pred,
        label=label,
    )


def predict_and_save_service(db: Session, data: FullInput) -> PredictionOutput:
    # --- Ambil fitur untuk ML ---
    features = [
        data.sks_lulus or 0,
        data.semester or 0,
        data.ipk or 0.0,
        data.ekonomi_tunggakan or 0,
        data.ekonomi_bayar or 0,
        data.stress_beban or 0,
        data.stress_motivasi or 0,
        data.cuti_ambil or 0,
        data.cuti_alasan or 0
    ]

    # --- Prediksi ML ---
    pred = predict_xgb(features)
    label = "DO" if pred == 1 else "Tidak DO"

    # --- Hitung faktor ---
    faktor_skor = {
        "ekonomi_tunggakan": data.ekonomi_tunggakan or 0,
        "ekonomi_bayar": data.ekonomi_bayar or 0,
        "stress_beban": data.stress_beban or 0,
        "stress_motivasi": data.stress_motivasi or 0,
        "cuti_ambil": data.cuti_ambil or 0,
        "cuti_alasan": data.cuti_alasan or 0
    }

    rekomendasi_map = {
        "ekonomi_tunggakan": [
            "Tidak ada tunggakan",
            "Perlu evaluasi ringan",
            "Perlu perhatian",
            "Segera intervensi finansial"
        ],
        "ekonomi_bayar": [
            "Bayar tepat waktu",
            "Perlu monitoring",
            "Perlu perhatian",
            "Segera intervensi finansial"
        ],
        "stress_beban": ["Tenang", "Sedikit stress", "Perlu relaksasi", "Perlu konseling"],
        "stress_motivasi": [
            "Termotivasi",
            "Motivasi rendah",
            "Motivasi perlu dorongan",
            "Perlu konseling dan mentoring"
        ],
        "cuti_ambil": [
            "Tidak cuti",
            "Cuti minor",
            "Cuti cukup banyak",
            "Cuti berlebihan, evaluasi segera"
        ],
        "cuti_alasan": [
            "Tidak ada alasan signifikan",
            "Alasan minor",
            "Alasan cukup penting",
            "Alasan kritis, perlu perhatian"
        ]
    }

    faktor_detail = {}
    for k, v in faktor_skor.items():
        deskripsi = ["Sangat Rendah", "Rendah", "Sedang", "Tinggi"][v] if v in [0, 1, 2, 3] else "Tidak diketahui"
        rekomendasi = rekomendasi_map.get(k, [""] * 4)[v]
        faktor_detail[k] = FactorDetail(skor=v, deskripsi=deskripsi, rekomendasi=rekomendasi)

    total_skor = sum(faktor_skor.values())

    # --- Tentukan level risiko ---
    if total_skor <= 2:
        level_risiko, level_emoji, pesan = (
            "Rendah",
            "🟢",
            "Mahasiswa cenderung aman, tetap pertahankan performa akademik."
        )
    elif total_skor <= 5:
        level_risiko, level_emoji, pesan = (
            "Sedang",
            "🟡",
            "Perlu perhatian, evaluasi faktor ekonomi, stress, atau cuti."
        )
    else:
        level_risiko, level_emoji, pesan = (
            "Tinggi",
            "🔴",
            "Risiko drop out tinggi, segera lakukan intervensi akademik dan pendampingan."
        )

    # --- Update record yang sudah ada ---
    db_obj = db.query(MahasiswaRespon).filter(MahasiswaRespon.nim == data.nim).first()
    if db_obj:
        db_obj.nama = data.nama
        db_obj.sks_lulus = data.sks_lulus
        db_obj.semester = data.semester
        db_obj.ipk = data.ipk
        db_obj.ekonomi_tunggakan = data.ekonomi_tunggakan
        db_obj.ekonomi_bayar = data.ekonomi_bayar
        db_obj.stress_beban = data.stress_beban
        db_obj.stress_motivasi = data.stress_motivasi
        db_obj.cuti_ambil = data.cuti_ambil
        db_obj.cuti_alasan = data.cuti_alasan
        db_obj.total_skor = total_skor
        db_obj.prediksi = pred
        db_obj.updated_at = datetime.now()
    else:
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
            prediksi=pred,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.add(db_obj)

    db.commit()
    db.refresh(db_obj)

    return PredictionOutput(
        nim=db_obj.nim,
        nama=db_obj.nama,
        prediction=db_obj.prediksi,
        label=label,
        total_skor=total_skor,
        level_risiko=level_risiko,
        level_emoji=level_emoji,
        faktor_skor=faktor_detail,
        pesan=pesan,
        created_at=db_obj.created_at,
        updated_at=db_obj.updated_at
    )


def get_all_predictions_service(db: Session) -> List[PredictionDB]:
    records = db.query(MahasiswaRespon).all()
    return records   # FastAPI + Pydantic otomatis konversi pakai orm_mode


def get_prediction_by_nim_service(db: Session, nim: str) -> PredictionDB:
    record = db.query(MahasiswaRespon).filter(MahasiswaRespon.nim == nim).first()
    if not record:
        raise HTTPException(status_code=404, detail="Mahasiswa tidak ditemukan")
    return record
