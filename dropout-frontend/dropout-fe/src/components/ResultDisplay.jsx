// src/components/ResultDisplay.jsx

import React from 'react';

function ResultDisplay({ data, onReset }) {
  if (!data) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Data hasil tidak ditemukan.
      </div>
    );
  }

  // Warna badge sesuai level risiko
  const riskColors = {
    "Sangat Tinggi": "bg-red-600",
    "Tinggi": "bg-orange-500",
    "Sedang": "bg-yellow-400 text-black",
    "Rendah": "bg-green-500",
    "Sangat Rendah": "bg-green-700",
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">📊 Hasil Prediksi</h2>

      {/* Ringkasan Utama */}
      <div className="flex flex-col items-center mb-6">
        <span
          className={`px-4 py-2 rounded-full text-white font-semibold ${
            riskColors[data.levelRisiko] || "bg-gray-500"
          }`}
        >
          Level Risiko: {data.levelRisiko}
        </span>
        <p className="mt-2 text-lg">
          <strong>Total Skor:</strong> {data.totalSkor}
        </p>
      </div>

      {/* Faktor Skor */}
      <h3 className="text-lg font-semibold mb-2">🔍 Detail Faktor:</h3>
      <ul className="space-y-3">
        {data.faktor.map((item, index) => (
          <li
            key={index}
            className="border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <p className="font-medium">{item.name}: <span className="text-blue-600">{item.value}</span></p>
            <p className="text-sm text-gray-600 italic">
              💡 Rekomendasi: {item.rekomendasi}
            </p>
          </li>
        ))}
      </ul>

      {/* Pesan akhir */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-blue-700 font-medium">{data.pesan}</p>
      </div>

      {/* Tombol Reset */}
      <div className="mt-6 text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 transition"
        >
          🔄 Prediksi Lagi
        </button>
      </div>
    </div>
  );
}

export default ResultDisplay;
