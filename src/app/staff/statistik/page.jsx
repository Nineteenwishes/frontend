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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

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
  } = useRiwayatKunjunganUks(); // Get exportRiwayat from context

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

      // Transform data for recharts
      const yearlyChartData = yearlyStats.map((visits, index) => ({
        month: [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ][index],
        visits: visits,
      }));
      setYearlyData(yearlyChartData);

      // Process weekly data
      const weeklyStats = Array(7).fill(0);
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(
        today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
      );
      startOfWeek.setHours(0, 0, 0, 0);
      today.setHours(23, 59, 59, 999);

      riwayatList.forEach((visit) => {
        const visitDate = new Date(visit.tanggal);
        visitDate.setHours(0, 0, 0, 0);

        if (visitDate >= startOfWeek && visitDate <= today) {
          const dayIndex =
            visitDate.getDay() === 0 ? 6 : visitDate.getDay() - 1;
          if (dayIndex >= 0 && dayIndex < 7) {
            weeklyStats[dayIndex]++;
          }
        }
      });

      // Transform data for recharts
      const weeklyChartData = weeklyStats.map((visits, index) => ({
        day: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"][
          index
        ],
        visits: visits,
      }));
      setWeeklyData(weeklyChartData);

      // Set today's stats
      const todayString = today.toISOString().split("T")[0];
      const todayVisits = riwayatList.filter(
        (visit) => visit.tanggal === todayString
      ).length;

      setTodayStats({
        totalVisits: riwayatList.length,
        activeVisits: todayVisits,
      });
    }
  }, [riwayatList]);

  // Function to handle yearly export
  const handleYearlyExport = () => {
    const currentYear = new Date().getFullYear();
    exportRiwayat({ year: currentYear });
    setIsDropdownOpen(false); // Close dropdown after action
  };

  // Function to handle weekly export
  const handleWeeklyExport = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
    );
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Format dates to YYYY-MM-DD string for the backend
    const startDateString = startOfWeek.toISOString().split("T")[0];
    const endDateString = endOfWeek.toISOString().split("T")[0];

    exportRiwayat({ start_date: startDateString, end_date: endDateString });
    setIsDropdownOpen(false); // Close dropdown after action
  };

  if (loading || !user || user.role !== "staff") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title and Dropdown Container */}
          <div className="flex items-center justify-between mb-8 relative">
            {" "}
            {/* Added relative positioning */}
            <h1 className="text-2xl font-semibold text-gray-900">Statistik</h1>
            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {isDropdownOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={handleYearlyExport}
                    className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                  >
                    Download Tahunan
                  </button>
                  <button
                    onClick={handleWeeklyExport}
                    className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                  >
                    Download Pekan
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Yearly Chart - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tahun</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📅</span>
                  <span>{new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={yearlyData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      interval={0}
                      height={60}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                    />
                    <Bar
                      dataKey="visits"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Weekly Chart and Stats Card - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Chart - Takes 2/3 width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Pekan</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📅</span>
                    <span>
                      {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyData}
                      margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                        domain={[0, 10]}
                        ticks={[0, 2, 4, 6, 8, 10]}
                      />
                      <Bar
                        dataKey="visits"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Stats Card - Takes 1/3 width */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Hari ini
                  </h3>

                  {/* Total Siswa Sakit Card */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {todayStats.activeVisits}
                      </div>
                      <div className="text-sm text-gray-500">
                        Siswa sakit hari ini
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
