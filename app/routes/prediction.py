from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.prediction import AcademicInput, AcademicOutput, FullInput, PredictionOutput,PredictionDB
from app.services import prediction_service
from app.database import get_db
from typing import List
from app.schemas.common import ResponseSchema

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

@router.post("/validate", response_model=ResponseSchema[AcademicOutput])
def validate_academic_route(data: AcademicInput):
    result = prediction_service.validate_academic_service(data)
    return ResponseSchema(
        status_code=200,
        message="Validation successful",
        data=result
    )

@router.post("/", response_model=ResponseSchema[PredictionOutput])
def predict_route(data: FullInput, db: Session = Depends(get_db)):
    result = prediction_service.predict_and_save_service(db, data)
    return ResponseSchema(
        status_code=200,
        message="Prediction successful",
        data=result
    )


@router.get("/", response_model=ResponseSchema[List[PredictionDB]])
def get_all_predictions(db: Session = Depends(get_db)):
    result = prediction_service.get_all_predictions_service(db)
    return ResponseSchema(
        status_code=200,
        message="List of predictions",
        data=result
    )


@router.get("/{nim}", response_model=ResponseSchema[PredictionDB])
def get_prediction_by_nim(nim: str, db: Session = Depends(get_db)):
    result = prediction_service.get_prediction_by_nim_service(db, nim)
    return ResponseSchema(
        status_code=200,
        message="Prediction detail",
        data=result
    )
