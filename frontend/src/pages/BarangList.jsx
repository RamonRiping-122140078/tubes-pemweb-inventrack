// src/pages/BarangList.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const dummyBarang = [
  { id: 1, nama: "Laptop", kategori: "Elektronik", stok: 5, harga: 12000000 },
  { id: 2, nama: "Meja Kayu", kategori: "Furniture", stok: 10, harga: 850000 },
];

const BarangList = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Daftar Barang</h2>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nama Barang</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            {dummyBarang.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nama}</td>
                <td>{item.kategori}</td>
                <td>{item.stok}</td>
                <td>Rp{item.harga.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BarangList;