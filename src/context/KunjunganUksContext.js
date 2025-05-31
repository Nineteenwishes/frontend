"use client";
import { createContext, useContext, useState } from 'react';
import axios from '@/utils/axios';

const KunjunganUksContext = createContext();

export function KunjunganUksProvider({ children }) {
    const [kunjunganList, setKunjunganList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mengambil semua data kunjungan UKS
    const getAllKunjungan = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/kunjungan-uks');
            setKunjunganList(response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data kunjungan UKS');
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil data kunjungan UKS'
            };
        } finally {
            setLoading(false);
        }
    };

    // Menambah data kunjungan UKS baru
    const addKunjungan = async (form) => {
        try {
            // Validasi input sesuai controller
            if (!form.nis || !form.gejala) {
                throw new Error("NIS dan gejala wajib diisi");
            }

            const formData = new FormData();
            
            // Append data sesuai validasi controller
            formData.append("nis", form.nis);
            formData.append("gejala", form.gejala);
            formData.append("keterangan", form.keterangan || "");
            formData.append("obat", form.obat || "");
            formData.append("status", "masuk uks");

            // Handle upload foto jika ada
            if (form.foto instanceof File) {
                formData.append("foto", form.foto);
            }

            const response = await axios.post("/kunjungan-uks", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Update state sesuai response
            const newKunjungan = response.data.data;
            setKunjunganList((prev) => [...prev, newKunjungan]);

            return {
                status: 'success',
                message: 'Data kunjungan UKS berhasil ditambahkan',
                data: newKunjungan
            };

        } catch (err) {
            // Handle error sesuai response controller
            if (err.response?.status === 404) {
                throw new Error('Data siswa tidak ditemukan');
            } else if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                throw new Error(Object.values(errors).flat().join('\n'));
            } else {
                throw new Error(err.response?.data?.message || 'Terjadi kesalahan saat menambahkan data');
            }
        }
    };

    const updateKunjungan = async (id, form) => {
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            
            // Validasi input sesuai controller
            if (!form.nis || !form.gejala) {
                throw new Error("NIS dan gejala wajib diisi");
            }

            // Append data sesuai validasi controller
            formData.append("nis", form.nis);
            formData.append("gejala", form.gejala);
            formData.append("keterangan", form.keterangan || "");
            formData.append("obat", form.obat || "");

            // Handle upload foto jika ada
            if (form.foto instanceof File) {
                formData.append("foto", form.foto);
            }

            const response = await axios.post(`/kunjungan-uks/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Update state sesuai response
            const updatedKunjungan = response.data.data;
            setKunjunganList((prev) =>
                prev.map((kunjungan) =>
                    kunjungan.id === id ? updatedKunjungan : kunjungan
                )
            );

            return {
                status: 'success',
                message: 'Data kunjungan UKS berhasil diperbarui',
                data: updatedKunjungan
            };

        } catch (err) {
            // Handle error sesuai response controller
            if (err.response?.status === 404) {
                throw new Error('Data siswa atau kunjungan tidak ditemukan');
            } else if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                throw new Error(Object.values(errors).flat().join('\n'));
            } else {
                throw new Error(err.response?.data?.message || 'Terjadi kesalahan saat memperbarui data');
            }
        }
    };   

    // Mendapatkan detail kunjungan UKS
    const getKunjunganById = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`/kunjungan-uks/${id}`);
            return {
                success: true,
                status: 'success',
                data: response.data.data // Access nested data property
            };
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail kunjungan UKS');
            return {
                success: false,
                status: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail kunjungan UKS'
            };
        } finally {
            setLoading(false);
        }
    };


    // Mengubah status kunjungan dari masuk ke keluar UKS
    const keluarUks = async (id, jamKeluar) => {
        setLoading(true);
        try {
            const response = await axios.put(`/kunjungan-uks/${id}/keluar`, { jam_keluar: jamKeluar });
            setKunjunganList(kunjunganList.map(kunjungan => 
                kunjungan.id === id ? {
                    ...kunjungan,
                    status: 'keluar uks',
                    jam_keluar: jamKeluar
                } : kunjungan
            ));
            return {
                success: true,
                status: 'success',
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat mengubah status kunjungan UKS');
            return {
                success: false,
                status: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengubah status kunjungan UKS'
            };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        kunjunganList,
        loading,
        error,
        getAllKunjungan,
        addKunjungan,
        updateKunjungan,
        getKunjunganById,
        keluarUks
    };

    return (
        <KunjunganUksContext.Provider value={value}>
            {children}
        </KunjunganUksContext.Provider>
    );
}

export function useKunjunganUks() {
    const context = useContext(KunjunganUksContext);
    if (!context) {
        throw new Error('useKunjunganUks must be used within a KunjunganUksProvider');
    }
    return context;
}