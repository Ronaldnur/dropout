import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPredictionByNim } from '../services/predictService';

// Kamus untuk menerjemahkan skor mentah (0-3) menjadi teks
const scoreTranslator = {
  ekonomi_tunggakan: ['Tidak Pernah', 'Pernah 1 Kali', 'Pernah 2 Kali', 'Lebih dari 2 Kali'],
  ekonomi_bayar: ['Tidak Sulit', 'Sedikit Sulit', 'Cukup Sulit', 'Sangat Sulit'],
  stress_beban: ['Sangat Jarang', 'Jarang', 'Cukup Sering', 'Sangat Sering'],
  stress_motivasi: ['Tidak Kehilangan', 'Sedikit Kehilangan', 'Cukup Kehilangan', 'Sangat Kehilangan'],
  cuti_ambil: ['Belum Pernah', 'Pernah 1 Kali', 'Pernah 2 Kali', 'Lebih dari 2 Kali'],
  cuti_alasan: ['Tidak Perlu', 'Mungkin Perlu', 'Sangat Mungkin Perlu', 'Pasti Perlu'],
};

// Komponen kecil untuk menampilkan setiap item data
// Menambahkan prop 'className' untuk pewarnaan kondisional
const DetailItem = ({ label, value, className = '' }) => (
  <div className="flex flex-col">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className={`mt-1 text-base font-semibold text-gray-900 ${className}`}>{value || '-'}</dd>
  </div>
);

export default function PredictionDetail() {
  const { nim } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nim) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPredictionByNim(nim);
        setPrediction(response.data);
      } catch (err) {
        setError('Gagal mengambil detail prediksi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [nim]);

  if (isLoading) return <div className="p-6 text-center">Memuat detail mahasiswa...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!prediction) return <div className="p-6 text-center">Data tidak ditemukan.</div>;
  
  // Menerjemahkan skor menjadi teks (tanpa menampilkan skornya)
  const translatedFactors = {};
  for (const key in scoreTranslator) {
    const score = prediction[key];
    translatedFactors[key] = (score !== null && score >= 0 && score < scoreTranslator[key].length)
      ? scoreTranslator[key][score]
      : 'N/A';
  }

  // Menghapus (Nilai: X) dari teks hasil prediksi
  const predictionResultText = prediction.prediksi === 0 ? 'Berisiko Dropout' : 'Tidak Beresiko Dropout';

  return (
    <div className="w-full p-6 space-y-8 font-poppins">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Detail Prediksi Mahasiswa</h1>
            <p className="text-gray-500 mt-1">Analisis lengkap berdasarkan data yang tersimpan.</p>
        </div>
        <Link to="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Kembali ke Dashboard
        </Link>
      </div>

      {/* --- Section Wrapper --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        {/* Informasi Utama */}
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Informasi Utama</h2>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <DetailItem label="NIM" value={prediction.nim} />
            <DetailItem label="Nama Mahasiswa" value={prediction.nama} />
            <DetailItem label="Tanggal Prediksi" value={new Date(prediction.created_at).toLocaleDateString('id-ID')} />
          </dl>
        </div>

        {/* Analisis Faktor */}
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Analisis Faktor</h2>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <DetailItem label="SKS Lulus" value={prediction.sks_lulus} />
            <DetailItem label="Semester" value={prediction.semester} />
            <DetailItem label="IPK" value={prediction.ipk} />
            <DetailItem label="Tunggakan Finansial" value={translatedFactors.ekonomi_tunggakan} />
            <DetailItem label="Kesulitan Finansial" value={translatedFactors.ekonomi_bayar} />
            <DetailItem label="Stres Akademik" value={translatedFactors.stress_beban} />
            <DetailItem label="Motivasi Belajar" value={translatedFactors.stress_motivasi} />
            <DetailItem label="Riwayat Cuti" value={translatedFactors.cuti_ambil} />
            <DetailItem label="Kebutuhan Cuti" value={translatedFactors.cuti_alasan} />
          </dl>
        </div>

        {/* Hasil Akhir Prediksi */}
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Hasil Akhir Prediksi</h2>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <DetailItem label="Total Skor Faktor" value={prediction.total_skor} />
            
            <DetailItem 
              label="Hasil Prediksi" 
              value={predictionResultText}
              className={prediction.prediksi === 1 ? 'text-red-600' : 'text-green-600'}
            />
          </dl>
        </div>
      </div>
    </div>
  );
}