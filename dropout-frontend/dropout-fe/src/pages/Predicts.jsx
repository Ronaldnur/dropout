// src/pages/Predicts.jsx
import React, { useState } from "react";
import InitialForm from "../components/InitialForm";
import MLForm from "../components/MLForm";
import ResultDisplay from "../components/ResultDisplay";
import { postPrediction } from "../services/predictService";

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

  // Submit dari InitialForm
  const handleInitialSubmit = async (data) => {
    setIsLoading(true);
    setInitialData(data);

    try {
      const payload = {
        nim: data.nim,
        nama: data.nama,
        sks_lulus: Number(data.sksLulus),
        semester: Number(data.semester),
        ipk: Number(data.ipk),
        ekonomi_tunggakan: 0,
        ekonomi_bayar: 0,
        stress_beban: 0,
        stress_motivasi: 0,
        cuti_ambil: 0,
        cuti_alasan: 0,
      };

      const response = await postPrediction(payload);

      // Kalau backend butuh ML
      if (response?.data?.prediction === -1) {
        setStep("ml");
      } else {
        setPredictionResult(formatResult(response.data));
        setStep("result");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memproses prediksi awal.");
    }

    setIsLoading(false);
  };

  // Submit dari MLForm
  const handleMLSubmit = async (mlData) => {
    setIsLoading(true);

    try {
      const payload = {
        ...initialData,
        sks_lulus: Number(initialData.sksLulus),
        semester: Number(initialData.semester),
        ipk: Number(initialData.ipk),
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

  // format data dari backend supaya kompatibel dengan ResultDisplay
  const formatResult = (data) => ({
    levelRisiko: data.level_risiko,
    totalSkor: data.total_skor,
    faktor: Object.entries(data.faktor_skor || {}).map(([key, val]) => ({
      name: key,
      value: val?.deskripsi || "-",
      rekomendasi: val?.rekomendasi || "-",
    })),
    pesan: data.pesan,
  });

  const handleReset = () => {
    setStep("initial");
    setInitialData(null);
    setPredictionResult(null);
  };

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
    <div className="container p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Drop Out Prediction
      </h1>
      {renderContent()}
    </div>
  );
}

export default Predicts;
