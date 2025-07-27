"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Target, Menu, X } from "lucide-react";
import { useRiwayatKunjunganUks } from "@/context/RiwayatKunjunganUksContext";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [yearlyData, setYearlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [todayStats, setTodayStats] = useState({
    totalVisits: 0,
    activeVisits: 0,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  
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

  const {
    riwayatList,
    loading: riwayatLoading,
    error,
    getAllRiwayat,
    exportRiwayat,
  } = useRiwayatKunjunganUks();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllRiwayat();
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    if (user && user.role === "staff") {
      fetchData();
    }
  }, [user, getAllRiwayat]);

  useEffect(() => {
    if (riwayatList) {
      // Process yearly data
      const yearlyStats = Array(12).fill(0);
      const currentYear = new Date().getFullYear();

      riwayatList.forEach((visit) => {
        const visitDate = new Date(visit.tanggal);
        if (visitDate.getFullYear() === currentYear) {
          yearlyStats[visitDate.getMonth()]++;
        }
      });

      const yearlyChartData = yearlyStats.map((visits, index) => ({
        month: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des" ][index],
        visits: visits,
      }));
      setYearlyData(yearlyChartData);

      // Process weekly data
      const weeklyStats = Array(7).fill(0);
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      startOfWeek.setHours(0, 0, 0, 0);
      today.setHours(23, 59, 59, 999);

      riwayatList.forEach((visit) => {
        const visitDate = new Date(visit.tanggal);
        visitDate.setHours(0, 0, 0, 0);

        if (visitDate >= startOfWeek && visitDate <= today) {
          const dayIndex = visitDate.getDay() === 0 ? 6 : visitDate.getDay() - 1;
          if (dayIndex >= 0 && dayIndex < 7) {
            weeklyStats[dayIndex]++;
          }
        }
      });

      const weeklyChartData = weeklyStats.map((visits, index) => ({
        day: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][index],
        visits: visits,
      }));
      setWeeklyData(weeklyChartData);

      // Set today's stats
      const todayString = today.toISOString().split("T")[0];
      const todayVisits = riwayatList.filter((visit) => visit.tanggal === todayString).length;

      setTodayStats({
        totalVisits: riwayatList.length,
        activeVisits: todayVisits,
      });
    }
  }, [riwayatList]);

  const handleYearlyExport = () => {
    const currentYear = new Date().getFullYear();
    exportRiwayat({ year: currentYear });
    setIsDropdownOpen(false);
  };

  const handleWeeklyExport = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startDateString = startOfWeek.toISOString().split("T")[0];
    const endDateString = endOfWeek.toISOString().split("T")[0];

    exportRiwayat({ start_date: startDateString, end_date: endDateString });
    setIsDropdownOpen(false);
  };
  

  if (loading || !user || user.role !== "staff") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 relative">
            <h1 className="text-2xl font-semibold text-gray-900">Statistik</h1>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                {isDropdownOpen ? ( <X className="w-6 h-6 text-gray-600" /> ) : ( <Menu className="w-6 h-6 text-gray-600" /> )}
              </button>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5 origin-top-right"
                  role="menu"
                >
                  <div className="py-1" role="none">
                    <button onClick={handleYearlyExport} className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">
                      Download Tahunan
                    </button>
                    <button onClick={handleWeeklyExport} className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">
                      Download Pekan Ini
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* --- Stats Card (Hari Ini) --- */}
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:order-3 lg:col-span-1 bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hari Ini
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {riwayatLoading ? '...' : todayStats.activeVisits}
                  </div>
                  <div className="text-sm text-gray-500">
                    Siswa sakit
                  </div>
                </div>
              </div>
            </motion.div>

            {/* --- Yearly Chart --- */}
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:order-1 lg:col-span-3 bg-white rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tahunan</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📅</span>
                  <span>{new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData} margin={{ top: 5, right: 0, left: -20, bottom: 20 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} interval={0} textAnchor="end" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} domain={[0, 'dataMax + 2']} allowDecimals={false} />
                    <Bar dataKey="visits" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* --- Weekly Chart --- */}
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:order-2 lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Pekan Ini</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>🗓️</span>
                  <span>Minggu Ini</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} domain={[0, 'dataMax + 2']} allowDecimals={false} />
                    <Bar dataKey="visits" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}