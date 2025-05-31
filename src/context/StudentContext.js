"use client";
import { createContext, useContext, useState } from 'react';
import axios from '@/utils/axios';

const StudentContext = createContext();

export function StudentProvider({ children }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mengambil semua data siswa
    const getAllStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/students');
            setStudents(response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data siswa');
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil data siswa'
            };
        } finally {
            setLoading(false);
        }
    };

    // Menambah data siswa baru
    const addStudent = async (studentData) => {
        setLoading(true);
        try {
            const response = await axios.post('/students', studentData);
            setStudents([...students, response.data.data]);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                let errorMessage = 'Validasi gagal:';
                Object.keys(validationErrors).forEach(key => {
                    errorMessage += `\n- ${key}: ${validationErrors[key].join(', ')}`;
                });
                setError(errorMessage);
                return {
                    success: false,
                    message: errorMessage
                };
            }
            setError(error.response?.data?.message || 'Terjadi kesalahan saat menambah data siswa');
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat menambah data siswa'
            };
        } finally {
            setLoading(false);
        }
    };

    // Mengupdate data siswa
    const updateStudent = async (id, studentData) => {
        setLoading(true);
        try {
            const response = await axios.post(`/students/${id}`, studentData);
            setStudents(students.map(student => 
                student.id === id ? response.data.data : student
            ));
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                let errorMessage = 'Validasi gagal:';
                Object.keys(validationErrors).forEach(key => {
                    errorMessage += `\n- ${key}: ${validationErrors[key].join(', ')}`;
                });
                setError(errorMessage);
                return {
                    success: false,
                    message: errorMessage
                };
            }
            setError(error.response?.data?.message || 'Terjadi kesalahan saat mengupdate data siswa');
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengupdate data siswa'
            };
        } finally {
            setLoading(false);
        }
    };

    // Menghapus data siswa
    const deleteStudent = async (id) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/students/${id}`);
            setStudents(students.filter(student => student.id !== id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat menghapus data siswa');
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat menghapus data siswa'
            };
        } finally {
            setLoading(false);
        }
    };

    // Mendapatkan detail siswa
    const getStudentById = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`/students/${id}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail siswa');
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail siswa'
            };
        } finally {
            setLoading(false);
        }
    };

    // Mendapatkan detail siswa berdasarkan NIS
    const getStudentByNis = async (nis) => {
        setLoading(true);
        try {
            const response = await axios.get(`/students/nis/${nis}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail siswa');
            return {
                success: false,
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail siswa'
            };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        students,
        loading,
        error,
        getAllStudents,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        getStudentByNis // Tambahkan fungsi ini ke dalam value
    };

    return (
        <StudentContext.Provider value={value}>
            {children}
        </StudentContext.Provider>
    );
}

export function useStudent() {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error('useStudent must be used within a StudentProvider');
    }
    return context;
}