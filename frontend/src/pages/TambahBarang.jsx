import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const TambahBarang = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [form, setForm] = useState({
    nama_barang: '',
    kategori: '',
    stok: '',
    harga: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/barang', form);
      if (response.status === 201 || response.status === 200) {
        alert('Barang berhasil ditambahkan!');
        navigate('/barang');
      } else {
        alert('Gagal menambahkan barang.');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      alert('Gagal menambahkan barang.');
      console.error('Error adding barang:', error);
    }
  };


  return (
    <div className="container mx-auto mt-10 max-w-md px-4">
      <h2 className="text-2xl font-semibold mb-6">Tambah Barang</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium" htmlFor="nama_barang">
            Nama Barang
          </label>
          <input
            id="nama_barang"
            name="nama_barang"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" htmlFor="kategori">
            Kategori
          </label>
          <input
            id="kategori"
            name="kategori"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" htmlFor="stok">
            Stok
          </label>
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium" htmlFor="harga">
            Harga
          </label>
          <input
            id="harga"
            name="harga"
            type="number"
            min="0"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 transition"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default TambahBarang;
