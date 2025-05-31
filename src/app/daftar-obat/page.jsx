"use client"
import React from 'react'
import Navbar from '@/components/Navbar'
import DaftarObat from '@/components/DaftarObat'
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

function page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && user.role === "admin") {
        router.replace("/admin/dashboard");
      }
      if (user && user.role === "staff") {
        router.replace("/staff/dashboard");
      }
      if (!user) {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "user") {
    return null;
  }
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto">
          <DaftarObat />
        </div>
      </main>
    </div>
      
    </>
  )
}

export default page
