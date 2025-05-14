import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditBarang = () => {
	const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

	useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { id } = useParams();
  const [form, setForm] = useState({
    nama_barang: '',
    kategori: '',
    stok: '',
    harga: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/barang/${id}`);
      setForm(res.data);
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
    <div className="container mt-5">
      <h2>Edit Barang</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Barang</label>
          <input name="nama_barang" className="form-control" value={form.nama_barang || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Kategori</label>
          <input name="kategori" className="form-control" value={form.kategori || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Stok</label>
          <input type="number" name="stok" className="form-control" value={form.stok || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Harga</label>
          <input type="number" name="harga" className="form-control" value={form.harga || ''} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default EditBarang;