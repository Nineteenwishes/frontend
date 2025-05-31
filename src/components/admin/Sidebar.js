"use client";
import React, { useState } from 'react';
import { 
  Home, User, Pill, Calendar, 
  Settings, LogOut, 
  Users, ChartBar, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const menuItems = [
    { icon: <Home />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users />, label: 'Data Siswa', path: '/admin/data-siswa' },
    { icon: <Pill />, label: 'Daftar Obat', path: '/admin/data-obat' },
    { icon: <ChartBar />, label: 'Statistik UKS', path: '/admin/statistik' },
    { icon: <User />, label: 'User Management', path: '/admin/user-management' },
  
  ]

  return (
    <div className="flex min-h-screen">
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-t from-red-600 to-red-500 text-white shadow-lg 
        transition-all duration-500 ease-in-out relative flex flex-col`}>
       
        {/* Profile Section */}
        <div className="p-4 border-b border-red-400">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden transition-all duration-300">
                <h3 className="font-medium text-white truncate">dr. Rini Susanti</h3>
                <p className="text-sm text-red-100 truncate">Dokter UKS</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transform transition-all duration-300 ease-in-out
                ${pathname === item.path 
                  ? 'bg-white/20 scale-105' 
                  : 'hover:bg-white/10 hover:translate-x-2'
                } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className={`transition-all duration-300 ${pathname === item.path ? 'text-white transform scale-110' : 'text-red-100'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className={`font-medium transition-all duration-300
                  ${pathname === item.path ? 'text-white' : 'text-red-100'}`}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Tombol Logout di bagian bawah */}
        <div className="p-4 border-t border-red-400">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-lg transform transition-all duration-300
              hover:bg-white/10 hover:scale-105 active:scale-95
              ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
          >
            <LogOut className="text-red-100 transition-transform duration-300 group-hover:rotate-12" />
            {!isCollapsed && (
              <span className="font-medium text-red-100">Keluar</span>
            )}
          </button>
        </div>

        {/* Improved Toggle Button */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-white text-red-500 rounded-full shadow-md 
              hover:bg-red-50 hover:scale-110 active:scale-95
              transition-all duration-300 ease-in-out
              border border-red-200 flex items-center justify-center"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5" />
            ) : (
              <ChevronLeft className="h-4 w-4 transition-transform duration-300 hover:-translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        {/* Konten utama akan ditempatkan di sini */}
      </div>
    </div>
  );
}