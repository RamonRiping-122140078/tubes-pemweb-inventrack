// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <img
          src="/images/inventrack_logo.png"
          alt="Logo Inventrack"
          width="150"
          height="150"
          className="mb-4"
        />
        <h1 className="display-4">Selamat Datang di Inventrack</h1>
        <p className="lead">Sistem Manajemen Inventaris Sederhana untuk Toko & Gudang</p>
        <hr className="my-4" />
        <p>Gunakan menu navigasi untuk mengelola data barang dan supplier.</p>

        <div className="row justify-content-center mt-4">
          <div className="col-md-5 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Kelola Barang</h5>
                <p className="card-text">Tambah, lihat, ubah, dan hapus data barang inventaris dengan mudah.</p>
                <a href="/barang" className="btn btn-primary">Lihat Daftar Barang</a>
              </div>
            </div>
          </div>
          <div className="col-md-5 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Kelola Supplier</h5>
                <p className="card-text">Kelola informasi pemasok atau supplier yang bekerja sama dengan Anda.</p>
                <a href="/supplier" className="btn btn-success">Lihat Daftar Supplier</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;