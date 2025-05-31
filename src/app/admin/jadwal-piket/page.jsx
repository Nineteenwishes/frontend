"use client"
import React from 'react'
import Sidebar from '@/components/admin/Sidebar'
import JadwalPiket from '@/components/admin/JadwalPiket';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

function page() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
        <JadwalPiket />
      </main>
    </div>
    </>
  )
}

export default page
