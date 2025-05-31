'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useKunjunganUks } from '@/context/KunjunganUksContext';
import { useStudent } from '@/context/StudentContext';
import Swal from 'sweetalert2';
import Navbar from '@/components/Navbar';

export default function Page() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { updateKunjungan, getKunjunganById } = useKunjunganUks();
    const { getStudentByNis } = useStudent();

    const [form, setForm] = useState({
        nis: '',
        nama: '',
        kelas: '',
        gejala: '',
        keterangan: '',
        medicine_id: '',
        foto: null,
        status: 'masuk' // default masuk
    });
    

    const [fotoPreview, setFotoPreview] = useState(null);
    const [formFetched, setFormFetched] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (user && user.role === 'admin') {
                router.replace('/admin/dashboard');
            }
            if (user && user.role === 'user') {
                router.replace('/dashboard');
            }
            if (!user) {
                router.replace('/');
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchVisitData = async () => {
            const id = searchParams.get('id');
            if (id && !formFetched) {
                try {
                    const kunjungan = await getKunjunganById(id);
                    if (kunjungan.success) {
                        const data = kunjungan.data;
                        setForm(prev => ({
                            ...prev,
                            nis: data.nis || '',
                            nama: data.nama || '',
                            kelas: data.kelas || '',
                            gejala: data.gejala || '',
                            keterangan: data.keterangan || '',
                            medicine_id: data.medicine_id || '',
                            status: data.status || 'masuk' // Tambahkan status
                        }));
                        if (data.foto) {
                            setFotoPreview(`http://localhost:8000/storage/${data.foto}`);
                        }
                        setFormFetched(true);
                    }
                } catch (err) {
                    console.error('Error fetching visit data:', err);
                }
            }
        };

        fetchVisitData();
    }, [searchParams, getKunjunganById]);

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
            const id = searchParams.get('id');
            if (!id) return;

            const updatedData = {};
            if (form.nis) updatedData.nis = form.nis;
            if (form.gejala) updatedData.gejala = form.gejala;
            if (form.keterangan) updatedData.keterangan = form.keterangan;
            if (form.medicine_id) updatedData.obat = form.medicine_id;
            if (form.foto instanceof File) updatedData.foto = form.foto;

            console.log('Sending update data:', updatedData); // Tambahkan logging data yang dikirim

            const result = await updateKunjungan(id, updatedData);
            console.log('Update response:', result); // Tambahkan logging response

            // Periksa berbagai kemungkinan format response sukses
            if (result?.data?.status === 'success' || 
                result?.status === 'success' || 
                result?.success === true || 
                (result?.data && !result?.data?.error)) { // Tambahkan pengecekan tidak ada error
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data kunjungan berhasil diupdate',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                setTimeout(() => {
                    router.push('/staff/daftar-siswa');
                }, 1500);
            } else {
                // Tampilkan pesan error yang lebih spesifik
                const errorMessage = result?.data?.message || result?.message || 'Update gagal';
                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error('Error detail:', err);
            console.error('Error response:', err.response); // Tambahkan logging response error

            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                Swal.fire({
                    icon: 'error',
                    title: 'Validasi Gagal',
                    text: Object.values(errors).flat().join('\n')
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: err.message || 'Gagal mengupdate data kunjungan'
                });
            }
        }
    };

    if (loading || !user || user.role !== 'staff') {
        return null;
    }

    return (
        <>

            <Navbar />
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            
            <h1 className="text-2xl font-bold mb-6">Edit Data Kunjungan UKS</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nis" className="block text-sm font-medium text-gray-700 mb-1">NIS Siswa</label>
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
                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Siswa</label>
                    <input
                        type="text"
                        id="nama"
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
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
                    <label htmlFor="gejala" className="block text-sm font-medium text-gray-700 mb-1">Gejala</label>
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
                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
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
                    <label htmlFor="medicine_id" className="block text-sm font-medium text-gray-700 mb-1">Obat yang Diberikan</label>
                    <select
                        id="medicine_id"
                        name="medicine_id"
                        value={form.medicine_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Pilih Obat</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                    <input
                        type="file"
                        id="foto"
                        name="foto"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {fotoPreview && (
                        <div className="mt-4">
                            <img src={fotoPreview} alt="Preview Foto" className="max-w-full h-auto rounded-md" />
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/staff/daftar-siswa')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
        </>
    );
}
