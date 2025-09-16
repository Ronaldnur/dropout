import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getAllPredictions,
  postBulkPrediction,
} from "../services/predictService.js";

// Helper untuk mengubah angka prediksi menjadi teks dan warna
const predictionStatus = {
  0: { text: "Tidak Berisiko", className: "bg-green-100 text-green-800" },
  1: { text: "Berisiko", className: "bg-red-100 text-red-800" },
};

// Komponen row untuk tabel
function PredictionRow({ data }) {
  const status =
    predictionStatus[data.prediksi] || {
      text: "N/A",
      className: "bg-gray-100 text-gray-800",
    };

  return (
    <tr key={data.id || data.nim} className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-800">
        <Link
          to={`/prediction/${data.nim}`}
          className="text-blue-600 hover:underline hover:text-blue-800 transition"
        >
          {data.nim}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{data.nama}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{data.semester}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{data.ipk}</td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}
        >
          {status.text}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {data.created_at
          ? new Date(data.created_at).toLocaleDateString("id-ID")
          : "-"}
      </td>
    </tr>
  );
}

export default function Dashboard() {
  // State untuk tabel prediksi
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State baru untuk fitur unggah file
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle | uploading | success | error
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null); // Untuk mereset input file

  // Mengubah logika fetch menjadi fungsi agar bisa dipanggil ulang
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPredictions();
      const predictionData = response.data || [];
      setPredictions(Array.isArray(predictionData) ? predictionData : []);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data prediksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus("idle");
      setUploadMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Silakan pilih file terlebih dahulu.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setUploadMessage("Mengunggah dan memproses file...");

    try {
      const result = await postBulkPrediction(selectedFile);
      setUploadStatus("success");
      setUploadMessage(result.message || "File berhasil diproses!");

      // Reset input file setelah berhasil
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Muat ulang data di tabel setelah jeda singkat
      setTimeout(() => {
        fetchData();
        setUploadMessage("");
        setUploadStatus("idle");
      }, 2000);
    } catch (err) {
      setUploadStatus("error");
      setUploadMessage(
        err.response?.data?.message ||
          "Gagal mengunggah file. Pastikan format file benar."
      );
    }
  };

  if (isLoading && predictions.length === 0)
    return <div className="p-6 text-center">Memuat data... 🚀</div>;
  if (error && predictions.length === 0)
    return <div className="p-6 text-center text-red-600">{error}</div>;

  const totalPredictions = predictions.length;
  const highRiskCount = predictions.filter((p) => p.prediksi === 1).length;

  return (
    <div className="w-full p-6 space-y-6 font-poppins">
      <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>

      {/* Kartu Metrik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-500">Total Prediksi</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {totalPredictions}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-500">
            Mahasiswa Berisiko
          </h3>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {highRiskCount}
          </p>
        </div>
      </div>

      {/* --- BAGIAN UNGGAH FILE --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Prediksi Massal via File
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <label className="flex-1 block">
            <span className="sr-only">Pilih file</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv, .xlsx, .xls"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === "uploading"}
            className="mt-4 sm:mt-0 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {uploadStatus === "uploading" ? "Memproses..." : "Unggah File"}
          </button>
        </div>
        {uploadMessage && (
          <div
            className={`mt-4 text-sm font-medium ${
              uploadStatus === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {uploadMessage}
          </div>
        )}
      </div>

      {/* Tabel Riwayat Prediksi */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Riwayat Prediksi Terbaru
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    NIM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    IPK
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Hasil Prediksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {predictions.length > 0 ? (
                  predictions.map((p) => <PredictionRow key={p.id || p.nim} data={p} />)
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
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
