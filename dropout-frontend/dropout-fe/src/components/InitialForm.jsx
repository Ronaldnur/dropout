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
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 bg-white shadow-md rounded-xl p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Data Mahasiswa</h2>

      <div>
        <label className="block text-sm font-medium mb-1">NIM</label>
        <input 
          name="nim" 
          value={formData.nim} 
          onChange={handleChange} 
          placeholder="Masukkan NIM" 
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nama</label>
        <input 
          name="nama" 
          value={formData.nama} 
          onChange={handleChange} 
          placeholder="Masukkan Nama" 
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">SKS Lulus</label>
        <input 
          type="number"
          name="sksLulus" 
          value={formData.sksLulus} 
          onChange={handleChange} 
          placeholder="Jumlah SKS Lulus" 
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Semester</label>
        <input 
          type="number"
          name="semester" 
          value={formData.semester} 
          onChange={handleChange} 
          placeholder="Semester saat ini" 
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">IPK</label>
        <input 
          type="number"
          step="0.01"
          name="ipk" 
          value={formData.ipk} 
          onChange={handleChange} 
          placeholder="IPK terakhir" 
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-green-600 text-black py-2 rounded-lg border border-white hover:bg-green-700 transition"
      >
        Next
      </button>
    </form>
  );
}

export default InitialForm;
