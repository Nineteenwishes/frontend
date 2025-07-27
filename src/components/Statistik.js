"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useRiwayatKunjunganUks } from "@/context/RiwayatKunjunganUksContext";

export default function Statistik() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [yearlyData, setYearlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [todayStats, setTodayStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeChart, setActiveChart] = useState("yearly");

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

    if (user && user.role === "user") {
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
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
        ][index],
        visits: visits,
      }));
      setYearlyData(yearlyChartData);

      // Process weekly data
      const weeklyStats = Array(7).fill(0);
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      riwayatList.forEach((visit) => {
        const visitDate = new Date(visit.tanggal);
        if (visitDate >= startOfWeek && visitDate <= endOfWeek) {
          const dayIndex = visitDate.getDay() === 0 ? 6 : visitDate.getDay() - 1;
          if (dayIndex >= 0 && dayIndex < 7) {
            weeklyStats[dayIndex]++;
          }
        }
      });

      const weeklyChartData = weeklyStats.map((visits, index) => ({
        day: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"][index],
        visits: visits,
      }));
      setWeeklyData(weeklyChartData);

      // Set today's stats
      const todayString = new Date().toISOString().split("T")[0];
      const todayVisitsCount = riwayatList.filter(
        (visit) => visit.tanggal === todayString
      ).length;

      setTodayStats({
        totalVisits: riwayatList.length,
        todayVisits: todayVisitsCount,
      });
    }
  }, [riwayatList]);

  if (loading || !user || user.role !== "user" || riwayatLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading Statistik...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header: Title and Dropdown - Modified for mobile right alignment */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Statistik Kunjungan
            </h1>
            <div className="relative ml-auto sm:ml-0"> {/* Added ml-auto for mobile */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-40 gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {activeChart === "yearly" ? "Tahunan" : "Mingguan"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={() => { setActiveChart("yearly"); setIsDropdownOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm ${ activeChart === "yearly" ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      Tahunan
                    </button>
                    <button
                      onClick={() => { setActiveChart("weekly"); setIsDropdownOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm ${ activeChart === "weekly" ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      Mingguan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Container */}
          <div className="grid grid-cols-1 gap-6">
            {activeChart === "yearly" ? (
              <motion.div
                key="yearly-chart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Statistik Tahunan
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📅</span>
                    <span>{new Date().getFullYear()}</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyData} margin={{ top: 5, right: 0, left: -20, bottom: 40 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#6B7280" }}
                        height={50}
                        interval={0}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#6B7280" }}
                        allowDecimals={false}
                      />
                      <Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}/>
                      <Bar dataKey="visits" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="weekly-chart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Statistik Mingguan
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📅</span>
                    <span>Pekan Ini</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#6B7280" }}
                        allowDecimals={false}
                      />
                      <Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}/>
                      <Bar dataKey="visits" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
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