"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ListSiswa from "@/components/ListSiswa";
import ListObat from "@/components/ListObat";
import Statistik from "@/components/Statistik";

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

  if (loading || !user || user.role === "admin" || user.role === "staff") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto">
          <Header />
          <ListSiswa />
          <ListObat />
          <Statistik />
        </div>
      </main>
    </div>
  );
}

export default page;