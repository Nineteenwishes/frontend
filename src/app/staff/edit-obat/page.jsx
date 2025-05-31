"use client";

import { useState, useEffect } from "react";
import { useMedicine } from "@/context/MedicinesContext";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Swal from 'sweetalert2';

export default function EditObat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { editMedicine, getMedicineById } = useMedicine();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    nama: "",
    jenis: "",
    stok: "",
    dosis: "",
    deskripsi: "",
    foto: null
  });

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      loadMedicine(id);
    }
  }, []);

  const loadMedicine = async (id) => {
    try {
      const data = await getMedicineById(id);
      setForm({
        nama: data.nama,
        jenis: data.jenis || "",
        stok: data.stok,
        dosis: data.dosis || "",
        deskripsi: data.deskripsi || "",
      });
      if (data.foto) {
        setPreview(`http://localhost:8000/storage/${data.foto}`);
      }
    } catch (error) {
      console.error("Error loading medicine:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        foto: file
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Konfirmasi sebelum mengedit
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin mengubah data obat ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, ubah!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const id = searchParams.get("id");
        await editMedicine(id, form);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data obat berhasil diperbarui',
          timer: 1500,
          showConfirmButton: false
        });
        router.push("/staff/daftar-obat");
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error.message || 'Terjadi kesalahan saat memperbarui data obat'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => router.push('/staff/daftar-obat')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Edit Obat</h1>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Obat</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama Obat
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Jenis
                  </label>
                  <input
                    type="text"
                    name="jenis"
                    value={form.jenis}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={form.stok}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Dosis
                  </label>
                  <input
                    type="text"
                    name="dosis"
                    value={form.dosis}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Foto
                  </label>
                  <input
                    type="file"
                    name="foto"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                  />
                  {preview && (
                    <div className="mt-4 relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-xs h-auto rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 rounded-md text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}