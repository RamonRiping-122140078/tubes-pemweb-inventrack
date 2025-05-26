import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const EditBarang = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nama_barang: '',
    kategori: '',
    stok: '',
    harga: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/barang/${id}`);
        setForm(res.data);
      } catch (error) {
        console.error('Gagal mengambil data barang:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/barang/${id}`, form);
      navigate('/barang');
    } catch (error) {
      alert('Gagal memperbarui barang.');
      console.error('Error updating barang:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Edit Barang</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Nama Barang</label>
          <input
            type="text"
            name="nama_barang"
            value={form.nama_barang || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Kategori</label>
          <input
            type="text"
            name="kategori"
            value={form.kategori || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Stok</label>
          <input
            type="number"
            name="stok"
            value={form.stok || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Harga</label>
          <input
            type="number"
            name="harga"
            value={form.harga || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default EditBarang;
