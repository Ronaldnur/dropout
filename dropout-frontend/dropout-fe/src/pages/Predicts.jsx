// src/pages/Predicts.jsx
import React, { useState } from "react";
import InitialForm from "../components/InitialForm";
import MLForm from "../components/MLForm";
import ResultDisplay from "../components/ResultDisplay";
// Impor kedua fungsi dari service
import { postPrediction, validatePrediction } from "../services/predictService";

function Predicts() {
  const [step, setStep] = useState("initial"); // initial | ml | result
  const [initialData, setInitialData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // helper untuk convert teks ML → angka
  const convertToScore = (value) => {
    switch (value) {
      case "Sangat Rendah": return 0;
      case "Rendah": return 1;
      case "Sedang": return 2;
      case "Tinggi": return 3;
      default: return 0;
    }
  };

  // Submit dari InitialForm (INI BAGIAN UTAMA YANG DIUBAH)
  const handleInitialSubmit = async (data) => {
    setIsLoading(true);
    // Simpan data awal untuk jaga-jaga jika butuh ke step ML
    setInitialData(data); 

    try {
      // 1. Buat payload khusus untuk validasi
      const validationPayload = {
        nim: data.nim,
        nama: data.nama,
        sks_lulus: Number(data.sksLulus),
        semester: Number(data.semester),
        ipk: Number(data.ipk),
      };

      // 2. Panggil API validasi, bukan prediksi
      const response = await validatePrediction(validationPayload);

      // 3. Cek respons dari backend (sesuai contoh Anda)
      if (response.data?.label === "Lanjut ML") {
        // Jika backend meminta data ML, lanjut ke step "ml"
        setStep("ml");
      } else {
        // Jika backend langsung memberi hasil, format dan tampilkan
        setPredictionResult(formatResult(response.data));
        setStep("result");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memproses validasi awal.");
    }

    setIsLoading(false);
  };

  // Submit dari MLForm (TIDAK PERLU DIUBAH)
  const handleMLSubmit = async (mlData) => {
    setIsLoading(true);

    try {
      const payload = {
        // Menggunakan data dari state initialData
        nim: initialData.nim,
        nama: initialData.nama,
        sks_lulus: Number(initialData.sksLulus),
        semester: Number(initialData.semester),
        ipk: Number(initialData.ipk),
        // Menambahkan data dari MLForm
        ekonomi_tunggakan: convertToScore(mlData.ekonomiTunggakan),
        ekonomi_bayar: convertToScore(mlData.ekonomiBayar),
        stress_beban: convertToScore(mlData.stressBeban),
        stress_motivasi: convertToScore(mlData.stressMotivasi),
        cuti_ambil: convertToScore(mlData.cutiAmbil),
        cuti_alasan: convertToScore(mlData.cutiAlasan),
      };

      const response = await postPrediction(payload);

      setPredictionResult(formatResult(response.data));
      setStep("result");
    } catch (error) {
      console.error(error);
      alert("Gagal memproses prediksi final.");
    }

    setIsLoading(false);
  };

  // format data dari backend supaya kompatibel dengan ResultDisplay (TIDAK PERLU DIUBAH)
  const formatResult = (data) => ({
    levelRisiko: data.level_risiko || data.academic_status, // Fallback untuk hasil validasi
    totalSkor: data.total_skor,
    faktor: Object.entries(data.faktor_skor || {}).map(([key, val]) => ({
      name: key,
      value: val?.deskripsi || "-",
      rekomendasi: val?.rekomendasi || "-",
    })),
    pesan: data.pesan,
  });

  // Fungsi reset (TIDAK PERLU DIUBAH)
  const handleReset = () => {
    setStep("initial");
    setInitialData(null);
    setPredictionResult(null);
  };

  // Fungsi render (TIDAK PERLU DIUBAH)
  const renderContent = () => {
    if (isLoading) return <div className="text-center mt-6">Loading...</div>;

    switch (step) {
      case "ml":
        return <MLForm onSubmit={handleMLSubmit} />;
      case "result":
        return <ResultDisplay data={predictionResult} onReset={handleReset} />;
      default:
        return <InitialForm onSubmit={handleInitialSubmit} />;
    }
  };

  return (
    <div className="container">
      {renderContent()}
    </div>
  );
}

export default Predicts;