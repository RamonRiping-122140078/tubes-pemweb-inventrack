// src/pages/EditSupplier.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditSupplier = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Proteksi akses
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

  // Ambil data awal dari API
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
    <div className="container mt-5">
      <h2>Edit Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Supplier</label>
          <input name="nama_supplier" className="form-control" value={form.nama_supplier || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Kontak</label>
          <input name="kontak" className="form-control" value={form.kontak || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Alamat</label>
          <textarea name="alamat" className="form-control" rows="3" value={form.alamat || ''} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default EditSupplier;