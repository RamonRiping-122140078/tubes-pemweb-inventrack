// src/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserManagement = () => {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'admin' });
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
    } catch (error) {
      console.error('Gagal mengambil data user:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUsers();
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/users/${editId}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setFormData({ username: '', password: '', role: 'admin' });
      setEditId(null);
      fetchUsers();
    } catch (error) {
      alert('Gagal menyimpan user');
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id_user);
    setFormData({ username: user.username, password: '', role: user.role });
  };

	const handleCancelEdit = () => {
		setEditId(null);
		setFormData({ username: '', password: '', role: 'admin' });
	};

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Gagal menghapus user');
        console.error(error);
      }
    }
  };

  return (
    <>
      <Navbar />
				<div className="max-w-4xl mx-auto px-4 py-8">
					<h2 className="text-2xl font-bold mb-4">Manajemen User</h2>

					<form onSubmit={handleSubmit} className="mb-6 space-y-4">
						<div>
							<label className="block text-sm font-medium">Username</label>
							<input
								name="username"
								value={formData.username}
								onChange={handleChange}
								required
								className="w-full border px-3 py-2 rounded"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium">Password {editId && <span className="text-xs text-gray-500">(kosongkan jika tidak diubah)</span>}</label>
							<input
								name="password"
								value={formData.password}
								onChange={handleChange}
								type="password"
								className="w-full border px-3 py-2 rounded"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium">Role</label>
							<select
								name="role"
								value={formData.role}
								onChange={handleChange}
								className="w-full border px-3 py-2 rounded"
							>
								<option value="admin">Admin</option>
								<option value="user">User</option>
							</select>
						</div>
						<div className="flex gap-2">
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
								{editId ? 'Perbarui' : 'Tambah'} User
							</button>
							{editId && (
								<button
									type="button"
									onClick={handleCancelEdit}
									className="px-4 py-2 bg-gray-400 text-white rounded"
								>
									Batal
								</button>
							)}
						</div>
					</form>

					<table className="w-full border text-sm">
						<thead>
							<tr className="bg-gray-200">
								<th className="p-2 border">ID</th>
								<th className="p-2 border">Username</th>
								<th className="p-2 border">Role</th>
								<th className="p-2 border">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{users.map((u) => (
								<tr key={u.id}>
									<td className="p-2 border text-center">{u.id_user}</td>
									<td className="p-2 border">{u.username}</td>
									<td className="p-2 border text-center">{u.role}</td>
									<td className="p-2 border text-center">
										<button
											className="px-2 py-1 text-white rounded mr-2"
											onClick={() => handleEdit(u)}
										>
											Edit
										</button>
										<button
											className="px-2 py-1 text-white rounded"
											onClick={() => handleDelete(u.id_user)}
										>
											Hapus
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			<Footer />
    </>
  );
};

export default UserManagement;
