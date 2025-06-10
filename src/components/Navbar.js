"use client"
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, X, User, ChevronDown } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import Image from "next/image";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navItems = [
    {
      name: "Dashboard",
      path: user?.role === "staff" ? "/staff/dashboard" : "/dashboard",
    },
    {
      name: "Siswa Sakit",
      path: user?.role === "staff" ? "/staff/daftar-siswa" : "/daftar-siswa",
    },
    {
      name: "Daftar Obat",
      path: user?.role === "staff" ? "/staff/daftar-obat" : "/daftar-obat",
    },
    {
      name: "Statistik",
      path: user?.role === "staff" ? "/staff/statistik" : "/statistik",

    },
    {
      name: "Riwayat",
      path: user?.role === "staff" ? "/staff/riwayat" : "/riwayat",
    },
  ];

  return (
    <div>
      <nav className="bg-white text-black shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button - Sejajar dengan logo */}
            <div className="md:hidden flex items-center">
              <button
                className="text-[#ef4444] focus:outline-none p-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Logo dan Menu Desktop */}
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0 flex items-center mr-12">
               <Image src="/logo Ukes.png" alt="Logo" width={45} height={45} />

                <span className="ml-2 text-xl font-bold">Ukes</span>
              </div>
              
              {/* Menu Navigasi Desktop - Sekarang di samping logo */}
              <div className="hidden md:flex items-center ml-6 space-x-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={index}
                      href={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out relative ${isActive ? "text-[#ef4444]" : "text-black/80 hover:text-[#ef4444]"}`}
                    >
                      <div className="mr-2">{item.icon}</div>
                      {item.name}
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-[#ef4444] rounded-full transition-all duration-500 ease-in-out ${isActive ? 'w-full' : 'w-0'}`}></div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Avatar pengguna */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => document.getElementById("userDropdown").classList.toggle("hidden")}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.role === "staff" ? "Petugas Uks" : "Guru"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </div>
              </button>
              <div
                id="userDropdown"
                className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#ef4444] hover:text-white cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-6">
            {/* Header dengan logo dan tombol tutup yang sejajar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Activity className="w-6 h-6 text-[#ef4444]" />
                <span className="ml-2 text-xl font-bold text-[#ef4444]">HealthCare</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-[#ef4444] focus:outline-none p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {navItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={index}
                    href={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? "bg-[#ef4444] text-white" : "text-gray-600 hover:bg-red-50 hover:text-[#ef4444]"}`}
                  >
                    <div className="mr-3">{item.icon}</div>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay untuk mobile sidebar */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0  z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Spacer untuk fixed navbar */}
      <div className="h-16"></div>
    </div>
  );
}

export default Navbar;