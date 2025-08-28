def validate_academic(sks_lulus: int, semester: int, ipk: float):
    """
    Validasi faktor akademik mahasiswa dari semester 1 sampai 14.
    Return: (academic_status, prediction, label)
    prediction: 0 = Tidak DO, 1 = DO, -1 = Perlu ML
    """

    # Cek range semester
    if not (1 <= semester <= 14):
        return "Semester di luar range (1-14)", None, "Tidak Valid"

    # Cek IPK rendah → langsung DO
    if ipk < 2.0:
        return f"IPK < 2.0 → DO", 1, "Langsung Dropout"

    # Cek progres SKS
    # Misal total SKS minimal untuk lulus = 144
    if semester == 14 and sks_lulus < 144:
        return "Semester 14 tapi SKS < 144 → DO", 1, "Langsung Dropout"

    # Rata-rata SKS per semester
    avg_sks = sks_lulus / semester
    min_avg = 144 / 14  # rata-rata minimal per semester
    max_avg = 144 / 1   # rata-rata maksimal per semester

    # Kasus jelas aman
    if sks_lulus >= 144 and ipk >= 2.0 and semester <= 14:
        return "Mahasiswa aman → Tidak DO", 0, "Tidak DO"

    # Progres SKS aneh → peringatan
    if not (min_avg <= avg_sks <= max_avg):
        return f"Rata-rata SKS per semester ({avg_sks:.2f}) di luar range ({min_avg:.2f}-{max_avg:.2f}) → Potensi DO", -1, "Perlu Cek"

    # Default → lanjut ML
    return "Valid → Perlu prediksi ML", -1, "Lanjut ML"
