"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DaftarSiswa from '@/components/staff/DaftarSiswa';


export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
        if (user && user.role === "admin") {
          router.replace("/admin/dashboard");
        }
        if (user && user.role === "user") {
          router.replace("/dashboard");
        }
        if (!user) {
          router.replace("/");
        }
      }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "staff") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    {/* Main Content */}
    <main className="flex-1">
      <div className="container mx-auto">
        <DaftarSiswa />
      
        
      </div>
    </main>
  </div>
  );
}
