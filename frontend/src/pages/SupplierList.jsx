import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/supplier');
      const data = Array.isArray(res.data) ? res.data : res.data.suppliers;

      setSuppliers(data || []);
      setError(null);
    } catch (error) {
      console.error('Gagal mengambil data supplier:', error);
      setError('Gagal memuat data supplier.');
      setSuppliers([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus supplier ini?')) {
      try {
        await api.delete(`/supplier/${id}`);
        fetchSuppliers();
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Daftar Supplier
        </h2>

        {isAuthenticated && user?.role === 'admin' && (
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => navigate('/supplier/tambah')}
          >
            Tambah Supplier
          </button>
        )}

        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}

        <div className="overflow-x-auto">
          {suppliers.length === 0 ? (
            <p className="text-center py-4 text-gray-600">Belum ada data supplier.</p>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200">
                  <th className="py-3 px-4 border-b dark:border-gray-600">ID</th>
                  <th className="py-3 px-4 border-b dark:border-gray-600">Nama Supplier</th>
                  <th className="py-3 px-4 border-b dark:border-gray-600">Kontak</th>
                  <th className="py-3 px-4 border-b dark:border-gray-600">Alamat</th>
                  <th className="py-3 px-4 border-b dark:border-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((item) => (
                  <tr
                    key={item.id_supplier}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-2 px-4 border-b dark:border-gray-600">{item.id_supplier}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{item.nama_supplier}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{item.kontak}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{item.alamat}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      {isAuthenticated && user?.role === 'admin'? (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded"
                            onClick={() => navigate(`/supplier/ubah/${item.id_supplier}`)}
                          >
                            Ubah
                          </button>
                          <button
                            className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded"
                            onClick={() => handleDelete(item.id_supplier)}
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
          )}
        </div>
      </div>
    </>
  );
};

export default SupplierList;
