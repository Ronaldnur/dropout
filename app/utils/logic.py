def validate_academic(sks_lulus: int, semester: int, ipk: float):
    """
    Validasi faktor akademik mahasiswa dari semester 1 sampai 14.
    Return: (academic_status, prediction, label)
    prediction: 0 = Tidak DO, 1 = DO, -1 = Perlu ML
    """

    # Cek range semester
    if not (7 <= semester <= 14):
        return "Semester di luar range (7-14)", None, "Tidak Valid"

    # Cek IPK rendah → langsung DO
    if ipk < 2.0:
        return f"IPK < 2.0 → DO", 1, "Langsung Dropout"

    # Cek progres SKS semester 13
    if semester == 13 and sks_lulus < 120:
        return "Semester 13 tapi SKS < 120 → DO", 1, "Langsung Dropout"

    # Cek progres SKS semester 14
    if semester == 14 and sks_lulus < 144:
        return "Semester 14 tapi SKS < 144 → DO", 1, "Langsung Dropout"

    # Kasus jelas aman
    if sks_lulus >= 144 and ipk >= 2.0 and semester <= 14:
        return "Mahasiswa aman → Tidak DO", 0, "Tidak DO"

    # Default → lanjut ML
    return "Valid → Perlu prediksi ML", -1, "Lanjut ML"
