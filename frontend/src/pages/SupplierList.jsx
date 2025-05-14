// src/pages/SupplierList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Data dummy sebagai fallback
  const dummyData = [
    {
      id: 888,
      nama_supplier: 'CV Elektronik Jaya',
      kontak: '08123456789',
      alamat: 'Jl. Raya No. 10, Surabaya'
    },
    {
      id: 887,
      nama_supplier: 'Toko Mebel Sejahtera',
      kontak: '08234567890',
      alamat: 'Jl. Kayu Putih No. 5, Malang'
    }
  ];

  // Ambil data supplier dari API
  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/supplier');
      if (res.data.length === 0) {
        setSuppliers(dummyData);
      } else {
        setSuppliers(res.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data supplier:', error);
      setSuppliers(dummyData);
    }
  };

  // Hapus supplier
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus supplier ini?')) {
      try {
        await api.delete(`/supplier/${id}`);
        fetchSuppliers(); // Refresh list
      } catch (error) {
        alert('Gagal menghapus supplier.');
        console.error('Error deleting supplier:', error);
      }
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Daftar Supplier</h2>

        {/* Tombol Tambah hanya muncul jika admin login */}
        {isAuthenticated && (
          <button
            className="btn btn-success mb-3"
            onClick={() => navigate('/supplier/tambah')}
          >
            Tambah Supplier
          </button>
        )}

        <table className="table table-striped table-bordered">
          <thead className="table-secondary">
            <tr>
              <th>ID</th>
              <th>Nama Supplier</th>
              <th>Kontak</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nama_supplier}</td>
                <td>{item.kontak}</td>
                <td>{item.alamat}</td>
                <td>
                  {/* Tombol aksi hanya muncul jika admin login */}
                  {isAuthenticated ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/supplier/ubah/${item.id}`)}
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

export default SupplierList;