import React, { useState} from 'react';
import { useMedicine } from '@/context/MedicinesContext';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function TambahObat() {
  const { tambahMedicine } = useMedicine();
  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    stok: '',
    dosis: '',
    deskripsi: '',
    foto: null,
  });
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto' && files && files[0]) {
      setForm((prevForm) => ({
        ...prevForm,
        foto: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0])); // Create URL for preview
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setForm((prevForm) => ({
      ...prevForm,
      foto: null,
    }));
    setImagePreview(null);
    // Clear the file input value as well, if possible (though direct manipulation is not recommended in React)
    const fileInput = document.getElementById('foto');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tambahMedicine(form);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Obat berhasil ditambahkan!',
        showConfirmButton: false,
        timer: 1500
      });
      // Reset form after successful submission
      setForm({
        nama: '',
        jenis: '',
        stok: '',
        dosis: '',
        deskripsi: '',
        foto: null,
      });
      setImagePreview(null); // Clear image preview
    } catch (error) {
      console.error('Gagal menambahkan obat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menambahkan obat.',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Obat Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Obat</label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="jenis" className="block text-sm font-medium text-gray-700">Jenis Obat</label>
          <input
            type="text"
            id="jenis"
            name="jenis"
            value={form.jenis}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="stok" className="block text-sm font-medium text-gray-700">Stok</label>
          <input
            type="number"
            id="stok"
            name="stok"
            value={form.stok}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="dosis" className="block text-sm font-medium text-gray-700">Dosis</label>
          <input
            type="text"
            id="dosis"
            name="dosis"
            value={form.dosis}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div>
          <label htmlFor="foto" className="block text-sm font-medium text-gray-700">Foto Obat</label>
          <input
            type="file"
            id="foto"
            name="foto"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-2 relative w-fit">
              <img src={imagePreview} alt="Preview" className="max-w-xs h-auto rounded-md" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs leading-none flex items-center justify-center w-6 h-6 -mt-2 -mr-2 cursor-pointer"
                aria-label="Remove image"
              >
                X
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Tambah Obat
        </button>
      </form>
    </div>
  );
}