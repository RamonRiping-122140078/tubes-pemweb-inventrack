// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/inventrack.svg"
            alt="Logo Inventrack"
            className="w-8 h-8"
          />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Inventrack
          </span>
        </Link>

        {/* Hamburger button (mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu items */}
        <div
          className={`flex-col md:flex-row md:flex md:items-center md:space-x-6 ${
            isOpen ? 'flex' : 'hidden'
          } w-full md:w-auto`}
        >
          <Link
            to="/barang"
            className="block px-3 py-2 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Barang
          </Link>
          <Link
            to="/supplier"
            className="block px-3 py-2 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Supplier
          </Link>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="block px-3 py-2 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition mt-2 md:mt-0"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
