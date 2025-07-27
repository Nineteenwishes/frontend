"use client";
import React, { useEffect, useState } from "react";
import { useKunjunganUks } from "@/context/KunjunganUksContext";
import { useMedicine } from "@/context/MedicinesContext";
import { useRiwayatKunjunganUks } from "@/context/RiwayatKunjunganUksContext";
import { motion } from "framer-motion";
import { Pill, Stethoscope, History } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Komponen Kartu Statistik (tidak ada perubahan di sini)
const StatCard = ({ icon, title, value, color, gradientFrom, gradientTo }) => {
  const IconComponent = icon;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      className={`relative overflow-hidden rounded-xl shadow-lg p-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} border border-gray-100`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className={`text-sm font-medium ${color}-700`}>{title}</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-white/50`}>
          <IconComponent className={`w-7 h-7 ${color}-600`} />
        </div>
      </div>
    </motion.div>
  );
};

// Custom Tooltip untuk Recharts (tidak ada perubahan di sini)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <p className="label font-bold text-gray-800">{`${label}`}</p>
        <p className="intro text-sm text-gray-600">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


export default function Dashboard() {
  const { kunjunganList, getAllKunjungan } = useKunjunganUks();
  const { allMedicines, fetchMedicines } = useMedicine();
  const { riwayatList, getAllRiwayat } = useRiwayatKunjunganUks();

  const [yearlyVisitsData, setYearlyVisitsData] = useState([]);
  const [medicineStockData, setMedicineStockData] = useState([]);

  useEffect(() => {
    getAllKunjungan();
    fetchMedicines();
    getAllRiwayat();
  }, []);

  useEffect(() => {
    if (riwayatList.length > 0) {
      const currentYear = new Date().getFullYear();
      const monthlyVisits = Array(12).fill(0);

      riwayatList.forEach(visit => {
        const visitDate = new Date(visit.tanggal);
        if (visitDate.getFullYear() === currentYear) {
          monthlyVisits[visitDate.getMonth()]++;
        }
      });

      const chartData = monthlyVisits.map((visits, index) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][index],
        "Jumlah Kunjungan": visits,
      }));
      setYearlyVisitsData(chartData);
    }

    if (allMedicines.length > 0) {
      const sortedMedicines = [...allMedicines].sort((a, b) => b.stok - a.stok).slice(0, 10);
      const stockData = sortedMedicines.map(medicine => ({
        name: medicine.nama.length > 10 ? `${medicine.nama.substring(0, 10)}...` : medicine.nama,
        "Stok Tersedia": medicine.stok,
      }));
      setMedicineStockData(stockData);
    }
  }, [riwayatList, allMedicines]);
  
  const totalKunjungan = kunjunganList.length;
  const totalMedicines = allMedicines.length;
  const totalRiwayat = riwayatList.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali! Berikut adalah ringkasan aktivitas UKS.</p>
        </div>

        {/* Grid diubah menjadi 3 kolom untuk desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Stethoscope} title="Kunjungan Masuk Hari Ini" value={totalKunjungan} color="text-red" gradientFrom="from-red-100" gradientTo="to-red-50" />
          <StatCard icon={Pill} title="Total Jenis Obat" value={totalMedicines} color="text-rose" gradientFrom="from-rose-100" gradientTo="to-rose-50" />
          <StatCard icon={History} title="Total Riwayat Kunjungan" value={totalRiwayat} color="text-pink" gradientFrom="from-pink-100" gradientTo="to-pink-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Chart Kunjungan Tahunan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-3"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Grafik Kunjungan UKS ({new Date().getFullYear()})</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyVisitsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    {/* Gradien diubah ke tema merah */}
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FCA5A5" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} />
                  {/* Warna kursor hover diubah ke merah transparan */}
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(254, 226, 226, 0.6)' }} />
                  <Bar dataKey="Jumlah Kunjungan" fill="url(#colorVisits)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart Stok Obat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-2"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stok Obat (Top 10)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medicineStockData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                   <defs>
                    {/* Gradien diubah ke tema merah/rose */}
                    <linearGradient id="colorStock" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F472B6" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  {/* Warna kursor hover diubah ke merah transparan */}
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(254, 226, 226, 0.6)' }} />
                  <Bar dataKey="Stok Tersedia" fill="url(#colorStock)" radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}