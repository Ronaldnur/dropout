from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from typing import Any, Optional

class AcademicInput(BaseModel):
    nim: str = Field(..., example="20180801041")
    nama: Optional[str] = Field(None, example="Aksa Kanz Daffa")
    sks_lulus: int = Field(..., example=100, description="Total SKS yang sudah lulus")
    semester: int = Field(..., example=7, description="Semester saat ini (7-14)")
    ipk: float = Field(..., example=3.2, description="IPK saat ini")


class AcademicOutput(BaseModel):
    academic_status: str
    prediction: Optional[int]  # None = lanjut ML, 1 = langsung DO
    label: str


class FullInput(AcademicInput):
    # Faktor ekonomi
    ekonomi_tunggakan: Optional[int] = Field(None, example=1, description="Skala 0-3")
    ekonomi_bayar: Optional[int] = Field(None, example=2, description="Skala 0-3")
    # Faktor stress
    stress_beban: Optional[int] = Field(None, example=1, description="Skala 0-3")
    stress_motivasi: Optional[int] = Field(None, example=0, description="Skala 0-3")
    # Faktor cuti
    cuti_ambil: Optional[int] = Field(None, example=0, description="Skala 0-3")
    cuti_alasan: Optional[int] = Field(None, example=0, description="Skala 0-3")


class PredictionOutput(BaseModel):
    nim: str
    nama: Optional[str]
    prediction: int
    label: str
    total_skor: Optional[int] = None
    created_at: datetime


class PredictionDB(BaseModel):
    id: int
    nim: str
    nama: Optional[str]
    sks_lulus: int
    semester: int
    ipk: float
    ekonomi_tunggakan: Optional[int]
    ekonomi_bayar: Optional[int]
    stress_beban: Optional[int]
    stress_motivasi: Optional[int]
    cuti_ambil: Optional[int]
    cuti_alasan: Optional[int]
    total_skor: Optional[int]
    prediksi: int
    created_at: datetime

    class Config:
        orm_mode = True




class ResponseSchema(BaseModel):
    status_code: int
    message: str
    data: Optional[Any] = None
