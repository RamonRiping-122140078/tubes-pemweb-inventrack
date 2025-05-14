// src/pages/BarangList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BarangList = () => {
  const [barangList, setBarangList] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Data dummy sebagai fallback
  const dummyData = [
    {
      id: 999,
      nama_barang: 'Laptop',
      kategori: 'Elektronik',
      stok: 5,
      harga: 12000000
    },
    {
      id: 998,
      nama_barang: 'Meja Kayu',
      kategori: 'Furniture',
      stok: 10,
      harga: 850000
    }
  ];

  // Mengambil data barang dari API
  const fetchBarang = async () => {
    try {
      const res = await api.get('/barang');
      if (res.data.length === 0) {
        setBarangList(dummyData); // Gunakan dummy jika API kosong
      } else {
        setBarangList(res.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data barang:', error);
      setBarangList(dummyData); // Fallback ke dummy jika gagal
    }
  };

  // Menghapus barang
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        await api.delete(`/barang/${id}`);
        fetchBarang(); // Refresh list
      } catch (error) {
        alert('Gagal menghapus barang.');
        console.error('Error deleting barang:', error);
      }
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Daftar Barang</h2>

        {/* Tombol Tambah hanya muncul jika admin login */}
        {isAuthenticated && (
          <button
            className="btn btn-success mb-3"
            onClick={() => navigate('/barang/tambah')}
          >
            Tambah Barang
          </button>
        )}

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama Barang</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {barangList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nama_barang}</td>
                <td>{item.kategori}</td>
                <td>{item.stok}</td>
                <td>Rp{parseInt(item.harga).toLocaleString()}</td>
                <td>
                  {/* Tombol aksi hanya muncul jika admin login */}
                  {isAuthenticated ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/barang/ubah/${item.id}`)}
                      >
                        Ubah
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BarangList;