"use client"
import React, { useState } from 'react'
import { useStudent } from '@/context/StudentContext';
import toast, { Toaster } from 'react-hot-toast';

export default function FormSiswa() {
  const { addStudent } = useStudent();
  const [formData, setFormData] = useState({
    nis: '',
    nama: '',
    kelas: ''
  });
  const [showNotif, setShowNotif] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowNotif(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await addStudent(formData);
      console.log('API Response:', result); // Debugging
      
      if (result?.success) {
        toast.success(result.message || 'Data siswa berhasil ditambahkan', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: 'white',
          },
          icon: '👍'
        });
        
        setFormData({
          nis: '',
          nama: '',
          kelas: ''
        });
        setShowNotif(false);
      } else {
        throw new Error(result?.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      toast.error(error.message, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
        },
        icon: '⚠️'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Toaster />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Form Data Siswa</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nis" className="block text-sm font-medium text-gray-700 mb-1">
              NIS
            </label>
            <input
              type="text"
              id="nis"
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
              Kelas
            </label>
            <input
              type="text"
              id="kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Simpan Data
          </button>
        </form>
      </div>

      {/* Notifikasi Konfirmasi */}
      {showNotif && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="card bg-white rounded-lg shadow-xl w-[400px] relative z-10 p-6">
            <div className="header flex items-center gap-4">
              <span className="icon flex-shrink-0 flex items-center justify-center rounded-full bg-red-500 p-2 text-white">
                <svg 
                  className="h-5 w-5"
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    clipRule="evenodd" 
                    d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" 
                    fillRule="evenodd"
                  />
                </svg>
              </span>
              <p className="alert text-lg font-semibold text-gray-700">
                Konfirmasi Tambah Data
              </p>
            </div>

            <p className="message mt-4 text-gray-600">
              Apakah Anda yakin ingin menambahkan data siswa berikut?
              <br />
              <span className="font-semibold">NIS: {formData.nis}</span>
              <br />
              <span className="font-semibold">Nama: {formData.nama}</span>
              <br />
              <span className="font-semibold">Kelas: {formData.kelas}</span>
            </p>

            <div className="actions mt-6 space-y-2">
              <button
                onClick={async () => {
                  await confirmSubmit();
                  if (!isSubmitting) {
                    setShowNotif(false);
                  }
                }}
                disabled={isSubmitting}
                className={`read w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Menambahkan...' : 'Ya, Tambahkan Data'}
              </button>
              <button
                onClick={() => !isSubmitting && setShowNotif(false)}
                disabled={isSubmitting}
                className={`mark-as-read w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}