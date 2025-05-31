"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/utils/axios';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get('/users');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil data user'
      };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await axios.put(`/users/${id}`, userData);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Data user berhasil diperbarui'
      };
    } catch (error) {
      if (error.response?.status === 422) {
        return {
          success: false,
          errors: error.response.data.errors,
          message: 'Validasi gagal: ' + Object.values(error.response.data.errors).flat().join(', ')
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Terjadi kesalahan saat mengupdate data user'
      };
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`/users/${id}`);
      return {
        success: true,
        message: response.data?.message || 'User berhasil dihapus'
      };
    } catch (error) {
      console.error('Delete error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 
                (error.response?.status === 500 ? 'Server error' : 'Gagal menghapus user'),
        status: error.response?.status
      };
    }
  };
  
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await axios.get('/user'); // Menggunakan endpoint '/user'
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  const login = async (username, password) => {
    try {
      const response = await axios.post('/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      setUser(user);
      return { 
        success: true,
        user: {
          ...user,
          isAdmin: user.role === 'admin',
          isStaff: ['admin', 'staff'].includes(user.role),
          isUser: ['admin', 'staff', 'user'].includes(user.role)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Terjadi kesalahan saat login'
      };
    }
  };
  
  const register = async (userData) => {
    try {
      // Prepare data according to controller expectations
      const data = {
        name: userData.name,
        username: userData.username,
        password: userData.password,
        role: userData.role || 'user' // Default to 'user' if not provided
      };
  
      const response = await axios.post('/register', data);
      
      return { 
        success: true, 
        data: response.data,
        user: response.data.user, // Ensure this matches your controller response
        message: response.data.message || 'Registrasi berhasil'
      };
    } catch (error) {
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        return {
          success: false,
          errors: error.response.data.errors,
          message: 'Validasi gagal: ' + Object.values(error.response.data.errors).flat().join(', ')
        };
      }
      
      // Handle unauthorized access (403)
      if (error.response?.status === 403) {
        return {
          success: false,
          message: error.response.data.message || 'Anda tidak memiliki izin untuk melakukan ini'
        };
      }
  
      // Handle other errors
      return {
        success: false,
        message: error.response?.data?.message || 'Terjadi kesalahan saat registrasi',
        error: error.response?.data?.error || error.message
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    getAllUsers,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}