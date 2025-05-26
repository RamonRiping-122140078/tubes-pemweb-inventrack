// pages/BarangList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const BarangList = () => {
  const [barangList, setBarangList] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchBarang = async () => {
    try {
      const res = await api.get('/barang');
      const data = Array.isArray(res.data) ? res.data : res.data.barangs;

      if (!data || data.length === 0) {
        setBarangList([]); // kosongkan saja kalau data kosong
      } else {
        setBarangList(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data barang:', error);
      setBarangList([]); // kosongkan list jika error
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        await api.delete(`/barang/${id}`);
        fetchBarang();
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Daftar Barang
        </h2>

        {isAuthenticated && (
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => navigate('/barang/tambah')}
          >
            Tambah Barang
          </button>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200">
                <th className="py-3 px-4 border-b dark:border-gray-600">ID</th>
                <th className="py-3 px-4 border-b dark:border-gray-600">Nama Barang</th>
                <th className="py-3 px-4 border-b dark:border-gray-600">Kategori</th>
                <th className="py-3 px-4 border-b dark:border-gray-600">Stok</th>
                <th className="py-3 px-4 border-b dark:border-gray-600">Harga</th>
                <th className="py-3 px-4 border-b dark:border-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barangList.map((item) => (
                <tr
                  key={item.id_barang}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <td className="py-2 px-4 border-b dark:border-gray-600">{item.id_barang}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{item.nama_barang}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{item.kategori}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{item.stok}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    Rp{parseInt(item.harga).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    {isAuthenticated ? (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded"
                          onClick={() => navigate(`/barang/ubah/${item.id_barang}`)}
                        >
                          Ubah
                        </button>
                        <button
                          className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded"
                          onClick={() => handleDelete(item.id_barang)}
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BarangList;
