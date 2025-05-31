"use client"
import React, { useState, useEffect } from 'react';
import { useMedicine } from '@/context/MedicinesContext';
import { useRouter, useSearchParams } from "next/navigation";
import Swal from 'sweetalert2';
import Sidebar from '@/components/admin/Sidebar';

const EditObat = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { getMedicineById, editMedicine } = useMedicine();
    
    const [form, setForm] = useState({
        nama: '',
        jenis: '',
        stok: '',
        dosis: '',
        deskripsi: '',
        foto: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                if (!id) return;

                const medicine = await getMedicineById(id);
                setForm({
                    nama: medicine.nama,
                    jenis: medicine.jenis,
                    stok: medicine.stok,
                    dosis: medicine.dosis,
                    deskripsi: medicine.deskripsi,
                    foto: null,
                });
                if (medicine.foto) {
                    const originalImageUrl = `http://localhost:8000/storage/${medicine.foto}`;
                    setImagePreview(originalImageUrl);
                    setOriginalImage(originalImageUrl);
                }
                setLoading(false);
            } catch (error) {
                console.error('Gagal mengambil data obat:', error);
                setLoading(false);
            }
        };

        fetchMedicine();
    }, [id, getMedicineById]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto' && files && files[0]) {
            setForm((prevForm) => ({
                ...prevForm,
                foto: files[0],
            }));
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value,
            }));
        }
    };

    const handleCancelPhoto = () => {
        setForm((prevForm) => ({
            ...prevForm,
            foto: null,
        }));
        setImagePreview(originalImage);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Konfirmasi Perubahan',
            text: "Apakah Anda yakin ingin menyimpan perubahan ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, simpan!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await editMedicine(id, form);
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data obat berhasil diperbarui!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    router.push('/daftar-obat');
                } catch (error) {
                    console.error('Gagal memperbarui obat:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Terjadi kesalahan saat memperbarui data obat.',
                    });
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Data Obat</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Obat</label>
                                <input
                                    type="text"
                                    id="nama"
                                    name="nama"
                                    value={form.nama}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 mb-1">Jenis Obat</label>
                                <input
                                    type="text"
                                    id="jenis"
                                    name="jenis"
                                    value={form.jenis}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="stok" className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                <input
                                    type="number"
                                    id="stok"
                                    name="stok"
                                    value={form.stok}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                    min="0"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="dosis" className="block text-sm font-medium text-gray-700 mb-1">Dosis</label>
                                <input
                                    type="text"
                                    id="dosis"
                                    name="dosis"
                                    value={form.dosis}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    value={form.deskripsi}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                ></textarea>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">Foto Obat</label>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <input
                                            type="file"
                                            id="foto"
                                            name="foto"
                                            onChange={handleChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                            accept="image/*"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG (Maks. 2MB)</p>
                                    </div>
                                    {imagePreview && (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                                            {imagePreview !== originalImage && (
                                                <button
                                                    type="button"
                                                    onClick={handleCancelPhoto}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    title="Batalkan ganti foto"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/daftar-obat')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditObat;