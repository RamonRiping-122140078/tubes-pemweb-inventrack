import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Cek token saat pertama kali aplikasi dijalankan
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Kalau ingin, kamu bisa fetch user profile dari backend dengan token:
      // fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } })
      setUser(null); // sementara null, atau isi dengan user yang disimpan
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:6543/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user || null);
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
