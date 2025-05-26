import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const EditSupplier = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [form, setForm] = useState({
    nama_supplier: '',
    kontak: '',
    alamat: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/supplier/${id}`);
        setForm(res.data);
      } catch (error) {
        alert('Gagal mengambil data supplier.');
        console.error('Error fetching supplier:', error);
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
      await api.put(`/supplier/${id}`, form);
      navigate('/supplier');
    } catch (error) {
      alert('Gagal memperbarui supplier.');
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Edit Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Nama Supplier</label>
          <input
            type="text"
            name="nama_supplier"
            value={form.nama_supplier || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Kontak</label>
          <input
            type="text"
            name="kontak"
            value={form.kontak || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Alamat</label>
          <textarea
            name="alamat"
            rows="3"
            value={form.alamat || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          ></textarea>
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

export default EditSupplier;
