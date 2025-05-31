"use client"
import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { Users, UserPlus, } from 'lucide-react';
import FormSiswa from '@/components/admin/TambahSiswa';
import DaftarSiswa from '@/components/admin/DaftarSiswa';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

function page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('daftar-siswa');

  const tabs = [
    {
      id: 'daftar-siswa',
      label: 'Daftar Siswa',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'tambah-siswa',
      label: 'Tambah Siswa',
      icon: <UserPlus className="w-5 h-5" />
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
              {activeTab === 'daftar-siswa' && (
                <div>
                  {/* Konten Daftar Siswa */}
                  <h2 className="text-lg font-semibold">Daftar Siswa</h2>
                  {/* Tambahkan tabel atau komponen daftar siswa di sini */}
                  <DaftarSiswa />
                </div>
              )}

              {activeTab === 'tambah-siswa' && (
                <div>
                  {/* Konten Tambah Siswa */}
                  <h2 className="text-lg font-semibold">Tambah Siswa Baru</h2>
                  {/* Tambahkan form tambah siswa di sini */}
                  <FormSiswa />
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
