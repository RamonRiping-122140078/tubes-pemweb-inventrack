// src/pages/SupplierList.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const dummySupplier = [
  { id: 1, nama: "CV Elektronik Jaya", kontak: "08123456789", alamat: "Jl. Raya No. 10, Surabaya" },
  { id: 2, nama: "Toko Mebel Sejahtera", kontak: "08234567890", alamat: "Jl. Kayu Putih No. 5, Malang" },
];

const SupplierList = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Daftar Supplier</h2>
        <table className="table table-striped table-bordered">
          <thead className="table-secondary">
            <tr>
              <th>ID</th>
              <th>Nama Supplier</th>
              <th>Kontak</th>
              <th>Alamat</th>
            </tr>
          </thead>
          <tbody>
            {dummySupplier.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nama}</td>
                <td>{item.kontak}</td>
                <td>{item.alamat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SupplierList;