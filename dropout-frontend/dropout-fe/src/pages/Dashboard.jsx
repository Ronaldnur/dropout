import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPredictions } from '../services/predictService';

// Helper baru untuk mengubah angka prediksi menjadi teks dan warna
const predictionStatus = {
  0: { text: 'Tidak Berisiko', className: 'bg-green-100 text-green-800' },
  1: { text: 'Berisiko', className: 'bg-red-100 text-red-800' },
};

export default function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPredictions();
        const predictionData = response.data || [];
        setPredictions(Array.isArray(predictionData) ? predictionData : []);
      } catch (err) {
        setError("Gagal memuat data prediksi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="p-6 text-center">Memuat data... 🚀</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  const totalPredictions = predictions.length;
  // Menghitung mahasiswa berisiko berdasarkan nilai prediksi = 1
  const highRiskCount = predictions.filter(p => p.prediksi === 1).length;

  return (
    <div className="w-full p-6 space-y-6 font-poppins">
      <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
      
      {/* Kartu Metrik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-500">Total Prediksi</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalPredictions}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-500">Mahasiswa Berisiko</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">{highRiskCount}</p>
        </div>
      </div>

      {/* Tabel Riwayat Prediksi */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Riwayat Prediksi Terbaru</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">NIM</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">IPK</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Hasil Prediksi</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {predictions.length > 0 ? (
                  predictions.map((p) => {
                    const status = predictionStatus[p.prediksi] || { text: 'N/A', className: 'bg-gray-100 text-gray-800' };
                    return (
                      <tr key={p.nim} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800"><Link to={`/prediction/${p.nim}`} className="text-blue-600 hover:underline hover:text-blue-800 transition">
                          {p.nim}
                        </Link></td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.nama}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.semester}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.ipk}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Belum ada data prediksi untuk ditampilkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}