import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2, User, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function DaftarUser() {
  const { user, loading, getAllUsers, updateUser, deleteUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    role: 'user'
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data);
      }
    };

    fetchUsers();
  }, [getAllUsers]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      username: user.username,
      role: user.role
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async (id) => {
    const result = await updateUser(id, editForm);
    if (result.success) {
      const fetchResult = await getAllUsers();
      if (fetchResult.success) {
        setUsers(fetchResult.data);
      }
      setEditingId(null);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data pengguna berhasil diperbarui',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Gagal!',
        text: result.message || 'Gagal memperbarui data pengguna',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    return result;
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan dapat mengembalikan data ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
    
    if (result.isConfirmed) {
      const deleteResult = await deleteUser(id);
      if (deleteResult.success) {
        const fetchResult = await getAllUsers();
        if (fetchResult.success) {
          setUsers(fetchResult.data);
          if (currentUsers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
        Swal.fire(
          'Terhapus!',
          'Pengguna telah dihapus.',
          'success'
        );
      } else {
        Swal.fire(
          'Gagal!',
          deleteResult.message || 'Gagal menghapus pengguna',
          'error'
        );
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Memuat data...</div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p>Hanya admin yang dapat mengakses halaman ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Daftar Pengguna</h1>
      
      {/* Tabel Pengguna - Responsive */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {isMobile ? (
          // Mobile view - Card list
          <div className="divide-y divide-gray-200">
            {currentUsers.length > 0 ? (
              currentUsers.map((userItem) => (
                <div key={userItem.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h3 className="font-medium text-gray-900">{userItem.name}</h3>
                        <p className="text-sm text-gray-500">@{userItem.username}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${
                      userItem.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      userItem.role === 'staff' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {userItem.role}
                    </span>
                  </div>
                  
                  {editingId === userItem.id ? (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nama"
                      />
                      <input
                        type="text"
                        name="username"
                        value={editForm.username}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Username"
                      />
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={userItem.role === 'admin'}
                      >
                        <option value="staff">Staff</option>
                        <option value="user">User</option>
                      </select>
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handleUpdateUser(userItem.id)}
                          className="flex items-center justify-center text-green-600 hover:text-green-900 p-2 rounded-md hover:bg-green-50 transition-colors"
                          title="Simpan"
                        >
                          <Save size={18} className="mr-1" />
                          <span>Simpan</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center justify-center text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-50 transition-colors"
                          title="Batal"
                        >
                          <X size={18} className="mr-1" />
                          <span>Batal</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2 mt-3">
                      {userItem.role !== 'admin' && (
                        <button
                          onClick={() => handleEditClick(userItem)}
                          className="flex items-center justify-center text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="mr-1" />
                          <span>Edit</span>
                        </button>
                      )}
                      {userItem.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(userItem.id)}
                          className="flex items-center justify-center text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} className="mr-1" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada data pengguna
              </div>
            )}
          </div>
        ) : (
          // Desktop view - Table
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === userItem.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span>{userItem.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editingId === userItem.id ? (
                          <input
                            type="text"
                            name="username"
                            value={editForm.username}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          userItem.username
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === userItem.id ? (
                          <select
                            name="role"
                            value={editForm.role}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={userItem.role === 'admin'}
                          >
                            <option value="staff">Staff</option>
                            <option value="user">User</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            userItem.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                            userItem.role === 'staff' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {userItem.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === userItem.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateUser(userItem.id)}
                              className="text-green-600 hover:text-green-900 p-2 rounded-md hover:bg-green-50 transition-colors"
                              title="Simpan"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-50 transition-colors"
                              title="Batal"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            {userItem.role !== 'admin' && (
                              <button
                                onClick={() => handleEditClick(userItem)}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                            {userItem.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(userItem.id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      Tidak ada data pengguna
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 md:mt-6 space-y-3 md:space-y-0">
          <div className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">{indexOfFirstItem + 1}</span> -{' '}
            <span className="font-medium">{Math.min(indexOfLastItem, users.length)}</span> dari{' '}
            <span className="font-medium">{users.length}</span> pengguna
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <span className="sr-only">Previous</span>
              &larr;
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-3 md:px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <span className="sr-only">Next</span>
              &rarr;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}