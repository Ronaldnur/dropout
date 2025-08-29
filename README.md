Sistem Prediksi Dropout Mahasiswa

Proyek ini adalah aplikasi web full-stack yang dirancang untuk memprediksi potensi dropout mahasiswa berdasarkan data akademik dan faktor non-akademik. Aplikasi ini dilengkapi dengan dashboard untuk memantau riwayat prediksi dan halaman detail untuk analisis mendalam per mahasiswa.
✨ Fitur Utama

    Prediksi Multi-Langkah: Menggunakan validasi logika awal dan model Machine Learning untuk hasil yang akurat.

    Dashboard Riwayat: Menampilkan semua data prediksi dalam tabel yang interaktif dan mudah dibaca.

    Halaman Detail: Menyajikan analisis lengkap dari semua faktor yang memengaruhi prediksi untuk setiap mahasiswa.

    Chatbot Interaktif: Menyediakan antarmuka percakapan untuk bantuan atau informasi.

🛠️ Tumpukan Teknologi

    Backend: FastAPI, Python, SQLAlchemy

    Frontend: React, Vite, Tailwind CSS

    Machine Learning: Scikit-learn (XGBoost)

    Database: PostgreSQL (atau database lain yang didukung SQLAlchemy)

🚀 Instalasi dan Cara Menjalankan

Proyek ini terdiri dari tiga layanan terpisah: Backend (API), Frontend (Antarmuka Pengguna), dan Chatbot. Ikuti langkah-langkah di bawah ini untuk menjalankan setiap layanan.
1. Backend (Database & API Machine Learning)

Layanan ini menangani semua logika bisnis, interaksi database, dan prediksi ML.

# 1. Arahkan ke direktori backend (sesuaikan nama folder jika berbeda)
cd backend

# 2. (Opsional, tapi direkomendasikan) Buat dan aktifkan virtual environment
python -m venv venv
source venv/bin/activate  # Pada Windows, gunakan `venv\Scripts\activate`

# 3. Instal semua dependensi yang dibutuhkan
pip install -r requirements.txt

# 4. Jalankan server API dengan Uvicorn
uvicorn app.main:app --reload

Server backend sekarang akan berjalan di http://localhost:8000.
2. Frontend (Aplikasi React)

Layanan ini adalah antarmuka pengguna yang Anda lihat di browser.

# 1. Buka terminal baru dan arahkan ke direktori frontend
cd frontend

# 2. Instal semua dependensi Node.js
npm install

# 3. Jalankan server pengembangan Vite
npm run dev

Aplikasi frontend sekarang dapat diakses di http://localhost:5173 (atau port lain yang ditampilkan di terminal).
3. Chatbot

Layanan ini menjalankan aplikasi chatbot secara terpisah.

# 1. Buka terminal baru dan arahkan ke direktori chatbot
cd dropout

# 2. (Jika ada requirements.txt di folder chatbot, instal dependensinya)
# pip install -r requirements.txt

# 3. Jalankan aplikasi chatbot
python app.py

Pastikan untuk memeriksa port tempat chatbot berjalan dari output terminal.
