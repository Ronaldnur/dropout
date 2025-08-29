import os
import google.generativeai as genai
import re
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# --- ATURAN KELULUSAN ---
SKS_MIN = 144
IPK_MIN = 2.00
SEMESTER_MAX = 14

# --- PENGATURAN API ---
# Muat variabel lingkungan dari file .env
load_dotenv()
try:
    genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
except Exception as e:
    print(f"Error: Gagal mengkonfigurasi API Gemini. Pastikan kunci API telah disimpan di file .env. {e}")
    # Kami tidak akan keluar dari program, agar Flask tetap berjalan meski tanpa API
    pass

# --- INSTRUKSI SISTEM UTAMA ---
system_instruction = f"""
Anda adalah asisten AI yang berfungsi sebagai chatbot akademik khusus. Tugas utama Anda adalah memberikan informasi dan berdiskusi hanya terkait dengan topik akademis mahasiswa. Gunakan aturan kelulusan berikut dalam setiap respons:
- **SKS Lulus:** Minimal {SKS_MIN} SKS.
- **IPK Lulus:** Minimal {IPK_MIN}.
- **Maksimal Semester:** {SEMESTER_MAX} semester.

Jika pengguna bertanya tentang status kelulusan mereka dengan data yang spesifik, gunakan data tersebut untuk memberikan analisis yang lugas, informatif, dan langsung ke intinya. Hindari basa-basi. Jika pengguna tidak memenuhi syarat kelulusan, Anda harus menyatakannya secara eksplisit, namun tetap memberikan saran yang membangun jika ada waktu untuk perbaikan.
"""

# Membuat model Gemini dengan instruksi sistem
model_gemini = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction=system_instruction
)

# --- APLIKASI FLASK DI VS CODE ---
app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return "Chatbot API berjalan. Kirim permintaan POST ke /chat untuk memulai."

# --- FUNGSI UNTUK MEMANGGIL GEMINI DENGAN PROMPT ---
# Perubahan ini mengembalikan objek respons utuh
def get_gemini_response(user_input, chat_history):
    chat = model_gemini.start_chat(history=chat_history)
    response = chat.send_message(user_input)
    return response, chat.history
    
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    chat_history = data.get('history', [])

    match_sks = re.search(r'sks\s*([\d\.]+)', user_input, re.IGNORECASE)
    match_ipk = re.search(r'ipk\s*([\d\.]+)', user_input, re.IGNORECASE)
    match_semester = re.search(r'semester\s*(\d+)', user_input, re.IGNORECASE)
    
    response_text = ""
    new_history = []
    is_handled_by_logic = False

    try:
        if match_sks and match_ipk and match_semester:
            sks = int(match_sks.group(1))
            ipk = float(match_ipk.group(1))
            semester = int(match_semester.group(1))

            sisa_sks = SKS_MIN - sks
            sisa_semester = SEMESTER_MAX - semester
            
            # --- LOGIKA BERTAHAP UNTUK BERBAGAI KONDISI ---
            if semester >= SEMESTER_MAX and (ipk < IPK_MIN or sks < SKS_MIN):
                prompt = f"""
                Seorang mahasiswa bertanya tentang kelulusan dengan data: SKS={sks}, IPK={ipk}, Semester={semester}.
                Berdasarkan aturan kelulusan, mahasiswa ini **dipastikan tidak bisa lulus dan berstatus Drop Out (DO)**.
                Tugas Anda adalah menjelaskan hal ini secara lugas dan faktual, menggunakan poin-poin berikut sebagai dasar:
                * **SKS:** Mahasiswa ini memiliki {sks} SKS, masih butuh {sisa_sks} SKS dari syarat minimal {SKS_MIN} SKS.
                * **IPK:** IPK-nya {ipk}, di bawah syarat minimal {IPK_MIN}.
                * **Semester:** Mahasiswa ini sudah di semester {semester}, yang merupakan batas maksimal kelulusan.
                Sebutkan secara eksplisit bahwa karena tidak ada waktu lagi dan syarat tidak terpenuhi, mahasiswa ini berstatus DO.
                """
            elif (ipk < IPK_MIN or sks < SKS_MIN) and semester < SEMESTER_MAX:
                prompt = f"""
                Seorang mahasiswa bertanya tentang kelulusan dengan data: SKS={sks}, IPK={ipk}, Semester={semester}.
                Tugas Anda adalah memberikan respons yang dimulai dengan pernyataan positif atau bersyarat seperti "Masih ada kesempatan..." atau "Berdasarkan perhitungan, Anda masih bisa lulus...".
                Sebutkan secara proaktif dan detail bahwa:
                * **SKS:** Mahasiswa ini memiliki {sks} SKS, masih butuh {sisa_sks} SKS dari syarat minimal {SKS_MIN}.
                * **IPK:** IPK-nya {ipk}, di bawah syarat minimal {IPK_MIN}.
                * **Semester:** Masih ada {sisa_semester} semester tersisa.
                Berikan saran konkret tentang cara meningkatkan IPK dan menyelesaikan SKS dalam sisa waktu yang ada. Dorong dia untuk membuat rencana studi yang matang.
                """
            elif sks >= SKS_MIN and ipk >= IPK_MIN and semester <= SEMESTER_MAX:
                prompt = f"""
                Mahasiswa ini sudah memenuhi semua syarat kelulusan (SKS={sks}, IPK={ipk}, semester={semester}). Berikan respons yang sangat positif dan selamat. Dorong dia untuk segera mendaftar wisuda.
                """
            else:
                prompt = user_input
            
            gemini_response_obj, gemini_history = get_gemini_response(prompt, chat_history)
            response_text = gemini_response_obj.text
            is_handled_by_logic = True

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    if not is_handled_by_logic:
        gemini_response_obj, gemini_history = get_gemini_response(user_input, chat_history)
        response_text = gemini_response_obj.text
    
    # --- BARIS PENTING: MENGAMBIL TEKS DARI RIWAYAT CHAT ---
    for message in gemini_history:
        # Menambahkan peran (role) dan teks dari setiap pesan ke riwayat baru
        new_history.append({'role': message.role, 'parts': message.parts[0].text})

    return jsonify({'response': response_text, 'history': new_history})

if __name__ == '__main__':
    print("API Flask berjalan di http://localhost:5000/")
    app.run(debug=True)