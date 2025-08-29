import React from 'react';

// --- Helper Icons (SVG) ---
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Kamus untuk label faktor
const factorLabels = {
  ekonomiTunggakan: 'Tunggakan Finansial',
  ekonomiBayar: 'Kemampuan Finansial',
  stressBeban: 'Tingkat Stres Akademik',
  stressMotivasi: 'Tingkat Motivasi Belajar',
  cutiAmbil: 'Riwayat Cuti Akademik',
  cutiAlasan: 'Potensi Pengambilan Cuti',
};

function ResultDisplay({ data, onReset }) {
  if (!data) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Data hasil tidak ditemukan.
      </div>
    );
  }

  // --- Cek kondisi khusus ---
  const isOutOfRange = data.levelRisiko && data.levelRisiko.toLowerCase().includes("luar range");

const isAtRisk =
  !isOutOfRange &&
  (
    ['Sangat Tinggi', 'Tinggi', 'Sedang'].includes(data.levelRisiko) ||
    (data.levelRisiko &&
      data.levelRisiko.toLowerCase().includes("do") &&
      !data.levelRisiko.toLowerCase().includes("tidak do"))
  );


  // --- Konfigurasi UI berdasarkan status ---
  const resultConfig = {
    atRisk: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: <WarningIcon />,
      title: 'Beresiko Dropout',
    },
    safe: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      icon: <CheckCircleIcon />,
      title: 'Tidak Beresiko Dropout',
    },
    outOfRange: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      icon: <WarningIcon />,
      title: 'Analisis Tidak Dapat Dilakukan',
    },
  };

  const config = isOutOfRange
    ? resultConfig.outOfRange
    : (isAtRisk ? resultConfig.atRisk : resultConfig.safe);

  const hasMlFactors = data.faktor && data.faktor.length > 0;

  return (
    <div className="w-full font-poppins animate-fade-in">
      {/* --- Bagian Hasil Utama --- */}
      <div className={`p-6 rounded-lg text-center ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
        <div className="flex justify-center items-center mb-4">
          {config.icon}
        </div>
        <h2 className="text-4xl font-extrabold">{config.title}</h2>
        <p className="mt-2 text-lg">
          Level Risiko: <strong>{data.levelRisiko}</strong>
          {hasMlFactors && (
            <span> (Total Skor: {data.totalSkor})</span>
          )}
        </p>
      </div>

      {/* --- KONDISI TAMPILAN: ML vs NON-ML --- */}
      {hasMlFactors ? (
        // TAMPILAN LENGKAP JIKA ADA FAKTOR (HASIL ML)
        <>
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-800 font-medium">{data.pesan}</p>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Analisis Indikator Risiko</h3>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Indikator Evaluasi</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hasil Analisis</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tindak Lanjut yang Disarankan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.faktor.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{factorLabels[item.name] || item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.value}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.rekomendasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // TAMPILAN RINGKAS JIKA TIDAK ADA FAKTOR (HASIL LOGIKA NON-ML)
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Dasar Pengambilan Keputusan</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-lg text-gray-700 italic">
              "{data.pesan}"
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Keputusan ini didasarkan pada validasi aturan akademik umum tanpa memerlukan analisis faktor tambahan.
            </p>
          </div>
        </div>
      )}

      {/* --- Tombol Aksi --- */}
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md"
        >
          Lakukan Analisis Baru
        </button>
      </div>
    </div>
  );
}

export default ResultDisplay;
