from fastapi import FastAPI, Depends   # ✅ tambahkan Depends di sini
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
from app.models.prediction import MahasiswaRespon  # ✅ import model
from app.routes import prediction



Base.metadata.create_all(bind=engine)
# inisialisasi aplikasi
app = FastAPI(title="Dropout API", version="1.0")

# endpoint GET sederhana
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is running!"}

# endpoint GET dengan parameter
@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Hello, {name}! Welcome to Dropout API."}

@app.get("/ping-db")
def ping_db(db: Session = Depends(get_db)):
    return {"message": "Database connected!"}

# Register routes
app.include_router(prediction.router)