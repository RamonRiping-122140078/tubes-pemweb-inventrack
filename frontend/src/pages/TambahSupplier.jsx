// src/pages/TambahSupplier.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TambahSupplier = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Proteksi akses: hanya admin yang bisa tambah supplier
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [form, setForm] = React.useState({
    nama_supplier: '',
    kontak: '',
    alamat: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/supplier', form);
      navigate('/supplier'); // Redirect ke daftar supplier
    } catch (error) {
      alert('Gagal menambahkan supplier.');
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Tambah Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Supplier</label>
          <input name="nama_supplier" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Kontak</label>
          <input name="kontak" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Alamat</label>
          <textarea name="alamat" className="form-control" rows="3" onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="btn btn-success">Simpan</button>
      </form>
    </div>
  );
};

export default TambahSupplier;