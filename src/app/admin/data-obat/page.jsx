"use client"
import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { Pill, PlusSquare, } from 'lucide-react';
import TambahObat from '@/components/admin/TambahObat';
import DaftarObat from '@/components/admin/DaftarObat';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

function page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('daftar-obat');

  const tabs = [
    {
      id: 'daftar-obat',
      label: 'Daftar Obat',
      icon: <Pill className="w-5 h-5" />
    },
    {
      id: 'tambah-obat',
      label: 'Tambah Obat',
      icon: <PlusSquare className="w-5 h-5" />
    },

  ];

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/");
      } else if (user.role !== "admin") {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="p-4">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'daftar-obat' && (
                <div>
                  {/* Konten Daftar Obat */}
                  <h2 className="text-lg font-semibold">Daftar Obat</h2>
                  {/* Tambahkan tabel atau komponen daftar obat di sini */}
                  <DaftarObat />
                </div>
              )}

              {activeTab === 'tambah-obat' && (
                <div>
                  {/* Konten Tambah Obat */}
                  <h2 className="text-lg font-semibold">Tambah Obat Baru</h2>
                  {/* Tambahkan form tambah obat di sini */}  
                  <TambahObat />
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default page
