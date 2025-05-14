import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      await api.post('/barang', form);
      navigate('/barang');
    } catch (error) {
      alert('Gagal menambahkan barang.');
      console.error('Error adding barang:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Tambah Barang</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Barang</label>
          <input name="nama_barang" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Kategori</label>
          <input name="kategori" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Stok</label>
          <input type="number" name="stok" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Harga</label>
          <input type="number" name="harga" className="form-control" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Simpan</button>
      </form>
    </div>
  );
};

export default TambahBarang;