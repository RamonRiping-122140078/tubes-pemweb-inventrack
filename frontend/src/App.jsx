import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import HomePage from './pages/Home';
import BarangList from './pages/BarangList';
import SupplierList from './pages/SupplierList';
import LoginPage from './pages/Login';
import TambahBarang from './pages/TambahBarang';
import EditBarang from './pages/EditBarang';
import TambahSupplier from './pages/TambahSupplier';
import EditSupplier from './pages/EditSupplier';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/barang" element={<BarangList />} />
          <Route path="/barang/tambah" element={<TambahBarang />} />
          <Route path="/barang/ubah/:id" element={<EditBarang />} />

          <Route path="/supplier" element={<SupplierList />} />
          <Route path="/supplier/tambah" element={<TambahSupplier />} />
          <Route path="/supplier/ubah/:id" element={<EditSupplier />} />

          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;