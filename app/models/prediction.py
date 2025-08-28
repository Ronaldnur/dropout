from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP, func, SmallInteger,DateTime
from app.database import Base 
from datetime import datetime  # <--- ini yang p

class MahasiswaRespon(Base):
    __tablename__ = "mahasiswa_respon"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nim = Column(String(20), nullable=False)
    nama = Column(String(100), nullable=True)

    # Faktor akademik
    sks_lulus = Column(Integer, nullable=True)
    semester = Column(Integer, nullable=True)
    ipk = Column(DECIMAL(3, 2), nullable=True)

    # Faktor ekonomi
    ekonomi_tunggakan = Column(SmallInteger, nullable=True)
    ekonomi_bayar = Column(SmallInteger, nullable=True)

    # Faktor stress
    stress_beban = Column(SmallInteger, nullable=True)
    stress_motivasi = Column(SmallInteger, nullable=True)

    # Faktor cuti
    cuti_ambil = Column(SmallInteger, nullable=True)
    cuti_alasan = Column(SmallInteger, nullable=True)

    # Hasil & metadata
    total_skor = Column(Integer, nullable=True)
    prediksi = Column(SmallInteger, nullable=True)  
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
