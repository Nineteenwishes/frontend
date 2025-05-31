import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, UserPlus, Lock, User, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function TambahUser() {
  const { user, register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'user'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2>
          <p className="text-gray-600">Hanya admin yang dapat menambahkan pengguna baru</p>
        </div>
      </div>
    );
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await register({
        ...formData,
        password_confirmation: formData.password
      });
      
      if (result.success) {
        await Swal.fire({
          title: 'Berhasil!',
          text: 'Pengguna baru berhasil didaftarkan',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3B82F6',
          timer: 3000,
          timerProgressBar: true
        });
        
        setFormData({
          name: '',
          username: '',
          password: '',
          role: 'user'
        });
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        
        await Swal.fire({
          title: 'Gagal!',
          text: result.message || 'Gagal mendaftarkan pengguna',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat registrasi',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444'
      });
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tambah Pengguna Baru</h1>
          <p className="text-gray-600">Lengkapi form berikut untuk menambahkan pengguna baru ke sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className={`block w-full pl-10 pr-3 py-2.5 border-b ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-red-500'} focus:outline-none focus:ring-0 bg-transparent`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className={`block w-full pl-10 pr-3 py-2.5 border-b ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-red-500'} focus:outline-none focus:ring-0 bg-transparent`}
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  className={`block w-full pl-10 pr-10 py-2.5 border-b ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-red-500'} focus:outline-none focus:ring-0 bg-transparent`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Peran (Role)
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full py-2.5 border-b border-gray-300 focus:border-red-500 focus:outline-none focus:ring-0 bg-transparent"
              >
                <option value="staff">Staff</option>
                <option value="user">User</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role[0]}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : 'Daftarkan Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}