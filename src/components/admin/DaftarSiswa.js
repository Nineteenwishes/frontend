"use client"
import React, { useState, useEffect } from 'react'
import { useStudent } from '@/context/StudentContext';
import toast, { Toaster } from 'react-hot-toast';

export default function DaftarSiswa() {
  const {loading, error, getAllStudents, deleteStudent, updateStudent } = useStudent();
  const [dataSiswa, setDataSiswa] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    nis: '',
    nama: '',
    kelas: ''
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    studentId: null,
    studentName: ''
  });

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Reduced items per page for better mobile experience

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getAllStudents();
    if (result.success) {
      setDataSiswa(result.data || []); 
    } else {
      setDataSiswa([]); 
    }
  };

  // Menghitung data untuk pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataSiswa.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataSiswa.length / itemsPerPage);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi untuk menangani edit data
  const handleEdit = (siswa) => {
    setEditMode(true);
    setEditData({
      id: siswa.id,
      nis: siswa.nis,
      nama: siswa.nama,
      kelas: siswa.kelas
    });
  };

  // Fungsi untuk menyimpan hasil edit
  const handleSaveEdit = async () => {
    // Validasi input
    if (!editData.nis || !editData.nama || !editData.kelas) {
      toast.error('Semua field harus diisi', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
        },
        icon: '⚠️'
      });
      return;
    }

    try {
      const result = await updateStudent(editData.id, editData);
      if (result.success) {
        toast.success(result.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: 'white',
          },
          icon: '👍'
        });
        setEditMode(false);
        setEditData({ id: null, nis: '', nama: '', kelas: '' });
        await fetchData(); // Refresh data setelah update
      } else {
        toast.error(result.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: 'white',
          },
          icon: '❌'
        });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupdate data', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
        },
        icon: '⚠️'
      });
    }
  };

  // Fungsi untuk konfirmasi hapus
  const confirmDelete = async () => {
    try {
      const result = await deleteStudent(deleteModal.studentId);
      if (result.success) {
        toast.success(result.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: 'white',
          },
          icon: '🗑️'
        });
        setDeleteModal({ isOpen: false, studentId: null, studentName: '' });
        await fetchData(); // Refresh data setelah delete
        setCurrentPage(1); // Reset ke halaman pertama setelah menghapus
      } else {
        toast.error(result.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: 'white',
          },
          icon: '❌'
        });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus data', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
        },
        icon: '⚠️'
      });
    }
  };

  // Fungsi untuk membatalkan edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData({ id: null, nis: '', nama: '', kelas: '' });
  };

  // Fungsi untuk menangani hapus data
  const handleDelete = (siswa) => {
    setDeleteModal({ 
      isOpen: true, 
      studentId: siswa.id,
      studentName: siswa.nama 
    });
  };

  if (loading) {
    return <div className="text-center py-4">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster />
      
      {/* Form Edit */}
      {editMode && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Edit Data Siswa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">NIS</label>
              <input
                type="text"
                value={editData.nis}
                onChange={(e) => setEditData({...editData, nis: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                value={editData.nama}
                onChange={(e) => setEditData({...editData, nama: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kelas</label>
              <input
                type="text"
                value={editData.kelas}
                onChange={(e) => setEditData({...editData, kelas: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSaveEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm md:text-base"
            >
              Simpan
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm md:text-base"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {currentItems.map((siswa, index) => (
          <div key={siswa.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{siswa.nama}</h3>
                <p className="text-sm text-gray-500">NIS: {siswa.nis}</p>
                <p className="text-sm text-gray-500">Kelas: {siswa.kelas}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(siswa)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(siswa)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">NIS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Kelas</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((siswa, index) => (
              <tr key={siswa.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-500">{indexOfFirstItem + index + 1}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{siswa.nis}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{siswa.nama}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{siswa.kelas}</td>
                <td className="px-4 py-4 text-sm">
                  <button 
                    className="text-blue-500 hover:text-blue-700 mr-3"
                    onClick={() => handleEdit(siswa)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(siswa)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!dataSiswa || dataSiswa.length === 0) && (
        <div className="text-center py-4 text-gray-500">
          Belum ada data siswa
        </div>
      )}

      {/* Pagination */}
      {dataSiswa.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-500">
            Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, dataSiswa.length)} dari {dataSiswa.length} siswa
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              &lt;
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              // Show limited page numbers on mobile
              if (window.innerWidth < 768 && 
                  (index > 2 && index < totalPages - 3) && 
                  Math.abs(currentPage - (index + 1)) > 1) {
                return null;
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === index + 1
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
      
      {/* Modal Konfirmasi Hapus */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0" onClick={() => setDeleteModal({ isOpen: false, studentId: null, studentName: '' })}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 p-6">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 text-red-500"
                  aria-hidden="true"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Konfirmasi Hapus Data
                </h3>
                <p className="text-gray-600">
                  Apakah Anda yakin ingin menghapus data siswa <span className="font-semibold">{deleteModal.studentName}</span>? 
                  Data yang dihapus tidak dapat dikembalikan.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm md:text-base"
                >
                  Hapus
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: false, studentId: null, studentName: '' })}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm md:text-base"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}