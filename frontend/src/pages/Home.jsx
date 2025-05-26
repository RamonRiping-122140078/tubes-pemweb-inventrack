import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-12 text-center px-4">
        <img
          src="/home.svg"
          alt="Logo Inventrack"
          width="150"
          height="150"
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">Selamat Datang di Inventrack</h1>
        <p className="text-lg text-gray-800 dark:text-gray-300 mb-6">Sistem Manajemen Inventaris Sederhana untuk Toko & Gudang</p>
        <hr className="border-t border-gray-400 my-6 mx-auto w-1/2" />
        <p className="mb-10 text-gray-700 dark:text-gray-400">Gunakan menu navigasi untuk mengelola data barang dan supplier.</p>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
          <div className="bg-blue-700 shadow-lg rounded-lg p-6 flex-1 max-w-md mx-auto text-white">
            <h5 className="text-xl font-semibold mb-3">Kelola Barang</h5>
            <p className="mb-5 text-blue-200">
              Tambah, lihat, ubah, dan hapus data barang inventaris dengan mudah.
            </p>
            <a
              href="/barang"
              className="inline-block bg-white text-blue-700 font-semibold px-5 py-2 rounded shadow hover:bg-gray-100 transition"
            >
              Lihat Daftar Barang
            </a>
          </div>

          <div className="bg-green-700 shadow-lg rounded-lg p-6 flex-1 max-w-md mx-auto text-white">
            <h5 className="text-xl font-semibold mb-3">Kelola Supplier</h5>
            <p className="mb-5 text-green-200">
              Kelola informasi pemasok atau supplier yang bekerja sama dengan Anda.
            </p>
            <a
              href="/supplier"
              className="inline-block bg-white text-green-900 font-semibold px-5 py-2 rounded shadow hover:bg-gray-100 transition"
            >
              Lihat Daftar Supplier
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
