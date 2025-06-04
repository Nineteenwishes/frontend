"use client";
import React, { useEffect, useState } from 'react';
import { useRiwayatKunjunganUks } from '@/context/RiwayatKunjunganUksContext';
import Sidebar from '@/components/admin/Sidebar';
import { Eye, Trash2, Calendar, User, BookOpen, Stethoscope, X } from 'lucide-react';

const RiwayatKunjunganPage = () => {
  const {
    riwayatList,
    loading,
    error,
    getAllRiwayat,
    deleteRiwayat,
    getRiwayatById,
  } = useRiwayatKunjunganUks();

  const [selectedRiwayat, setSelectedRiwayat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'detail', 'delete'

  useEffect(() => {
    getAllRiwayat();
  }, []);

  // Format date to Indonesian format (e.g., "3 Juni 2023")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await getRiwayatById(id);
      if (response.status === 'success') {
        setSelectedRiwayat(response.data);
        setModalType('detail');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRiwayat(selectedRiwayat.id);
      setIsModalOpen(false);
      getAllRiwayat();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const getStatusBadge = (status) => {
    return status === 'keluar uks' 
      ? 'bg-red-100 text-red-800 border border-red-200'
      : 'bg-amber-100 text-amber-800 border border-amber-200';
  };

  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      
      <div className="flex-1 p-4 lg:p-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm mb-8 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black bg-clip-text ">
                Riwayat Kunjungan UKS
              </h1>
              <p className="text-gray-600 mt-2">Kelola data kunjungan siswa ke Unit Kesehatan Sekolah</p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 absolute top-0"></div>
              </div>
              <p className="text-gray-500 font-medium">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Tanggal
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        NIS
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nama
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {riwayatList.map((riwayat, index) => (
                    <tr key={riwayat.id} className={`hover:bg-gradient-to-r hover:from-red-50 hover:to-indigo-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {formatDate(riwayat.tanggal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{riwayat.nis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{riwayat.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{riwayat.kelas}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(riwayat.status)}`}>
                          {riwayat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleViewDetail(riwayat.id)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            title="Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedRiwayat(riwayat);
                              setModalType('delete');
                              setIsModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {riwayatList.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <Stethoscope className="h-full w-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data</h3>
                  <p className="text-gray-500">Tidak ada riwayat kunjungan yang tersedia</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className={`relative bg-white rounded-2xl shadow-2xl border border-white/20 w-full transition-all duration-300 transform ${
            modalType === 'delete' ? 'max-w-md' : 'max-w-4xl'
          } max-h-[90vh] overflow-hidden`}>
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-50 to-indigo-50 border-b border-gray-200 px-6 py-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {modalType === 'detail' && 'Detail Riwayat Kunjungan'}
                  {modalType === 'delete' && 'Konfirmasi Hapus'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {modalType === 'detail' && 'Informasi lengkap kunjungan siswa'}
                  {modalType === 'delete' && 'Tindakan ini tidak dapat dibatalkan'}
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {modalType === 'detail' && selectedRiwayat && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">NIS</label>
                      <p className="text-lg font-bold text-gray-900">{selectedRiwayat.nis}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama</label>
                      <p className="text-lg font-bold text-gray-900">{selectedRiwayat.nama}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kelas</label>
                      <p className="text-lg font-bold text-gray-900">{selectedRiwayat.kelas}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal</label>
                      <p className="text-lg font-bold text-gray-900">{formatDate(selectedRiwayat.tanggal)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Masuk</label>
                      <p className="text-lg font-bold text-gray-900">{selectedRiwayat.jam_masuk}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Keluar</label>
                      <p className="text-lg font-bold text-gray-900">{selectedRiwayat.jam_keluar}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gejala</label>
                      <p className="text-gray-800 leading-relaxed">{selectedRiwayat.gejala}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Keterangan</label>
                      <p className="text-gray-800 leading-relaxed">{selectedRiwayat.keterangan || 'Tidak ada keterangan tambahan'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Obat</label>
                      <p className="text-gray-800 leading-relaxed">{selectedRiwayat.obat || 'Tidak ada obat yang diberikan'}</p>
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'delete' && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">Apakah Anda yakin ingin menghapus riwayat ini?</p>
                    {selectedRiwayat && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="font-bold text-gray-900">{selectedRiwayat.nama}</p>
                        <p className="text-gray-600">{selectedRiwayat.kelas} • NIS: {selectedRiwayat.nis}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-all duration-200"
              >
                Batal
              </button>
              
              {modalType === 'delete' && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Hapus Data
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatKunjunganPage;