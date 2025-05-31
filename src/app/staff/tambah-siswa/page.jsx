"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useKunjunganUks } from '@/context/KunjunganUksContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import Swal from 'sweetalert2';

export default function Page() {
  const router = useRouter();
  const { addKunjungan } = useKunjunganUks();
  const { getStudentByNis } = useStudent();

  const [form, setForm] = useState({
    nis: '',
    nama: '',
    kelas: '',
    gejala: '',
    keterangan: '',
    medicine_id: '',
    foto: null
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleNisChange = async (e) => {
    const { value } = e.target;
    setForm(prev => ({
      ...prev,
      nis: value,
      nama: '',
      kelas: ''
    }));

    if (value.length >= 9) {
      try {
        const result = await getStudentByNis(value);
        if (result.success) {
          const student = result.data;
          setForm(prev => ({
            ...prev,
            nis: value,
            nama: student.nama,
            kelas: student.kelas
          }));
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        foto: file
      }));
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!form.nis) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'NIS siswa wajib diisi'
        });
        return;
      }

      if (!form.gejala) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gejala wajib diisi'
        });
        return;
      }

      // Gunakan addKunjungan dari context
      const result = await addKunjungan({
        nis: form.nis,
        gejala: form.gejala,
        keterangan: form.keterangan || '',
        obat: form.medicine_id || '',
        foto: form.foto
      });

      if (result?.status === 'success') {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: result.message || 'Data kunjungan UKS berhasil ditambahkan',
          timer: 1500,
          showConfirmButton: false
        });
        router.push('/staff/daftar-siswa');
      } else {
        console.error('Error response:', result);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result?.message || 'Gagal menambahkan data kunjungan UKS'
        });
      }
    } catch (err) {
      console.error('Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Gagal menambahkan data kunjungan UKS'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <Link href="/staff/daftar-siswa" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Daftar Siswa
            </Link>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tambah Kunjungan UKS</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nis" className="block text-sm font-medium text-gray-700 mb-1">
                  NIS Siswa
                </label>
                <input
                  type="text"
                  id="nis"
                  name="nis"
                  value={form.nis}
                  onChange={handleNisChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Siswa
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={form.nama}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
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
                  value={form.kelas}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="gejala" className="block text-sm font-medium text-gray-700 mb-1">
                  Gejala
                </label>
                <textarea
                  id="gejala"
                  name="gejala"
                  value={form.gejala}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan
                </label>
                <textarea
                  id="keterangan"
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="medicine_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Obat yang Diberikan
                </label>
                <select
                  id="medicine_id"
                  name="medicine_id"
                  value={form.medicine_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Obat</option>
                  {/* Opsi obat akan diisi dari MedicineContext */}
                </select>
              </div>

              <div>
                <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Siswa
                </label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fotoPreview && (
                  <img src={fotoPreview} alt="Foto Preview" className="mt-2 w-full h-auto rounded-md" />
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/staff/daftar-siswa"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}