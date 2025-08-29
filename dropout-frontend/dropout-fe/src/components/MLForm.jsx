import React from 'react';
import { useState } from 'react';

// Sekarang, setiap pertanyaan punya 'options' sendiri yang spesifik.
// 'value' -> untuk sistem | 'label' -> untuk pengguna
const questions = [
  {
    category: 'Faktor Ekonomi',
    name: 'ekonomiTunggakan',
    label: 'Apakah Anda pernah mengalami tunggakan pembayaran kuliah selama 1 semester terakhir?',
    options: [
      { value: 'Sangat Rendah', label: 'Tidak Pernah' },
      { value: 'Rendah',         label: 'Pernah 1 Kali' },
      { value: 'Sedang',         label: 'Pernah 2 Kali' },
      { value: 'Tinggi',         label: 'Lebih dari 2 Kali' },
    ],
  },
  {
    category: 'Faktor Ekonomi',
    name: 'ekonomiBayar',
    label: 'Seberapa besar kesulitan Anda dalam membayar biaya kuliah?',
    options: [
      { value: 'Sangat Rendah', label: 'Tidak Sulit' },
      { value: 'Rendah',         label: 'Sedikit Sulit' },
      { value: 'Sedang',         label: 'Cukup Sulit' },
      { value: 'Tinggi',         label: 'Sangat Sulit' },
    ],
  },
  {
    category: 'Faktor Stres',
    name: 'stressBeban',
    label: 'Apakah Anda sering merasa terbebani oleh tugas kuliah atau jadwal akademik?',
    options: [
      { value: 'Sangat Rendah', label: 'Sangat Jarang / Tidak Sama Sekali' },
      { value: 'Rendah',         label: 'Jarang' },
      { value: 'Sedang',         label: 'Cukup Sering' },
      { value: 'Tinggi',         label: 'Sangat Sering' },
    ],
  },
  {
    category: 'Faktor Stres',
    name: 'stressMotivasi',
    label: 'Apakah Anda merasa kehilangan motivasi atau semangat untuk melanjutkan kuliah?',
    options: [
      { value: 'Sangat Rendah', label: 'Tidak Kehilangan Motivasi' },
      { value: 'Rendah',         label: 'Sedikit Kehilangan Motivasi' },
      { value: 'Sedang',         label: 'Cukup Kehilangan Motivasi' },
      { value: 'Tinggi',         label: 'Sangat Kehilangan Motivasi' },
    ],
  },
  {
    category: 'Faktor Cuti',
    name: 'cutiAmbil',
    label: 'Apakah Anda pernah mengambil cuti kuliah sebelumnya?',
    options: [
      { value: 'Sangat Rendah', label: 'Belum Pernah' },
      { value: 'Rendah',         label: 'Pernah 1 Kali' },
      { value: 'Sedang',         label: 'Pernah 2 Kali' },
      { value: 'Tinggi',         label: 'Lebih dari 2 Kali' },
    ],
  },
  {
    category: 'Faktor Cuti',
    name: 'cutiAlasan',
    label: 'Apakah Anda merasa perlu mengambil cuti lagi karena alasan pribadi/akademik?',
    options: [
      { value: 'Sangat Rendah', label: 'Tidak Perlu' },
      { value: 'Rendah',         label: 'Mungkin Perlu' },
      { value: 'Sedang',         label: 'Sangat Mungkin Perlu' },
      { value: 'Tinggi',         label: 'Pasti Perlu / Mendesak' },
    ],
  },
];

const getInitialState = () => {
  const initialState = {};
  questions.forEach(q => {
    initialState[q.name] = q.options[0].value; // Default ke value dari opsi pertama
  });
  return initialState;
};

function MLForm({ onSubmit }) {
  const [mlData, setMlData] = useState(getInitialState());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMlData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(mlData);
  };

   return (
    // 1. Hapus div pembungkus yang menengahkan form
    // 2. Hapus class untuk shadow, border, rounded, padding, dan max-width dari form
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pb-14 w-full font-poppins bg-white" // Class yang tersisa
    >
      <h2 className="text-3xl font-extrabold mb-2 text-center text-[#0046FF]">
        Kuesioner Prediksi Risiko   <span className="text-[#FF8040]">Dropout</span>
      </h2>
      
      <p className="text-center text-gray-500 mb-6">
        Pilih jawaban yang paling sesuai dengan kondisi Anda.
      </p>

      {/* Tidak ada perubahan pada bagian mapping pertanyaan */}
      {questions.map((q, index) => (
        <div key={q.name}>
          {(index === 0 || questions[index - 1].category !== q.category) && (
            <h3 className="text-lg font-bold text-gray-800 pt-4 pb-2 border-b-2 border-gray-100 mb-4">
              {q.category}
            </h3>
          )}
          
          <label htmlFor={q.name} className="block text-sm font-semibold mb-2 text-gray-700">
            {q.label}
          </label>
          <select
            id={q.name}
            name={q.name}
            value={mlData[q.name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50"
          >
            {q.options.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-[#0046FF] text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md mt-8"
      >
        Lihat Hasil Prediksi
      </button>
    </form>
  );
}

export default MLForm;