// src/components/MLForm.jsx

import React, { useState } from 'react';

function MLForm({ onSubmit }) {
  const [mlData, setMlData] = useState({
    ekonomiTunggakan: 'Sangat Rendah',
    ekonomiBayar: 'Sangat Rendah',
    stressBeban: 'Sangat Rendah',
    stressMotivasi: 'Sangat Rendah',
    cutiAmbil: 'Sangat Rendah',
    cutiAlasan: 'Sangat Rendah',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMlData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(mlData); // Kirim data ke komponen induk (Predicts.jsx)
  };

  const options = ['Sangat Rendah', 'Rendah', 'Sedang', 'Tinggi',];

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 bg-white shadow-md rounded-xl p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Faktor Tambahan</h2>

      {Object.keys(mlData).map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-1">
            {key
              .replace(/([A-Z])/g, ' $1') // pisahin camelCase
              .replace(/^./, (str) => str.toUpperCase())} {/* kapital awal */}
          </label>
          <select
            name={key}
            value={mlData[key]}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        type="submit"
          className="w-full bg-green-600 text-black py-2 rounded-lg border border-white hover:bg-green-700 transition"
      >
        Prediksi
      </button>
    </form>
  );
}

export default MLForm;
