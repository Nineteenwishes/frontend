"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { useRiwayatKunjunganUks } from "@/context/RiwayatKunjunganUksContext";

export default function Statistik() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [yearlyData, setYearlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [todayStats, setTodayStats] = useState({
    totalVisits: 0,
    activeVisits: 0,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeChart, setActiveChart] = useState("yearly"); // New state for active chart

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

  if (loading || !user || user.role !== "staff") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title and Dropdown Container */}
          <div className="flex items-center justify-between mb-8 relative">
            <h1 className="text-2xl font-semibold text-gray-900">Statistik</h1>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {activeChart === "yearly" ? "Tahunan" : "Mingguan"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={() => {
                        setActiveChart("yearly");
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        activeChart === "yearly"
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Tahunan
                    </button>
                    <button
                      onClick={() => {
                        setActiveChart("weekly");
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        activeChart === "weekly"
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Mingguan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Conditional rendering based on activeChart */}
            {activeChart === "yearly" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Tahun
                  </h2>
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
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pekan
                  </h2>
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}