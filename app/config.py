import os
from dotenv import load_dotenv

# Load file .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
