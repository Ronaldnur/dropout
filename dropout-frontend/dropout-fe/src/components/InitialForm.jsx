import React, { useState } from 'react';

function InitialForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    sksLulus: '',
    semester: '',
    ipk: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Kirim data ke komponen induk (Predicts.jsx)
  };

  return (
    // Hapus kelas 'items-center justify-center min-h-screen p-4'
    <div className="flex flex-col flex-1 bg-gray-100">
      {/* Hapus max-w-lg dan mx-auto, tambahkan p-8 */}
      <div className="bg-white text-black shadow-2xl p-8 w-full rounded-none">
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-800">Drop Out Prediction</h2>
        <h3 className="text-xl font-semibold mb-3 text-center text-gray-700">Data Mahasiswa</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="nim" className="block text-sm font-medium mb-2 text-gray-600">NIM</label>
            <input 
              id="nim"
              name="nim" 
              type="text"
              value={formData.nim} 
              onChange={handleChange} 
              placeholder="Masukkan NIM" 
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="nama" className="block text-sm font-medium mb-2 text-gray-600">Nama</label>
            <input 
              id="nama"
              name="nama" 
              type="text"
              value={formData.nama} 
              onChange={handleChange} 
              placeholder="Masukkan Nama" 
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="sksLulus" className="block text-sm font-medium mb-2 text-gray-600">SKS Lulus</label>
            <input 
              id="sksLulus"
              type="number"
              name="sksLulus" 
              value={formData.sksLulus} 
              onChange={handleChange} 
              placeholder="Jumlah SKS Lulus" 
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="semester" className="block text-sm font-medium mb-2 text-gray-600">Semester</label>
            <input 
              id="semester"
              type="number"
              name="semester" 
              value={formData.semester} 
              onChange={handleChange} 
              placeholder="Semester saat ini" 
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="ipk" className="block text-sm font-medium mb-2 text-gray-600">IPK</label>
            <input 
              id="ipk"
              type="number"
              step="0.01"
              name="ipk" 
              value={formData.ipk} 
              onChange={handleChange} 
              placeholder="IPK terakhir" 
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 text-gray-800"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 mt-4 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default InitialForm;
