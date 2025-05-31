"use client"
import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { UserSearch, UserPlus2, } from 'lucide-react';
import TambahUser from '@/components/admin/TambahUser';
import DaftarUser from '@/components/admin/DaftarUser';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

function page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('daftar-user');

  const tabs = [
    {
      id: 'daftar-user',
      label: 'Daftar User',
      icon: <UserSearch className="w-5 h-5" />
    },
    {
      id: 'tambah-user',
      label: 'Tambah User',
      icon: <UserPlus2 className="w-5 h-5" />
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
              {activeTab === 'daftar-user' && (
                <div>
                  {/* Konten Daftar User */}
                  <h2 className="text-lg font-semibold">Daftar User</h2>
                  {/* Tambahkan tabel atau komponen daftar user di sini */}
                  <DaftarUser />
                </div>
              )}

              {activeTab === 'tambah-user' && (
                <div>
                  {/* Konten Tambah User */}
                  <h2 className="text-lg font-semibold">Tambah User</h2>
                  {/* Tambahkan form tambah user di sini */}
                  <TambahUser />
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
