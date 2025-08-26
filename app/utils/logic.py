def validate_academic(sks_lulus: int, semester: int, ipk: float):
    """
    Validasi faktor akademik mahasiswa.
    Return (academic_status, prediction, label)
    """

    # Cek semester
    if not (7 <= semester <= 14):
        return "Semester di luar range (7–14)", None, "Tidak Valid"

    # Cek IPK
    if ipk < 2.0:
        return "IPK < 2.0 → DO", 1, "Langsung Dropout"

    # Cek SKS (kalau sudah semester 14 tapi <144 → DO)
    if semester == 14 and sks_lulus < 144:
        return "Semester 14 tapi SKS < 144 → DO", 1, "Langsung Dropout"

    # Kalau belum 14, cukup cek progress SKS per semester
    avg_sks = sks_lulus / semester
    if not (144/14 <= avg_sks <= 144/7):
        return f"Rata-rata SKS ({avg_sks:.2f}) di luar range (10-20)", None, "Tidak Valid"

    return "Valid", None, "Lanjut ML"
