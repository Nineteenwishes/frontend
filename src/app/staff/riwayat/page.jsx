"use client";
import { Search, Download, Info, ArrowLeft, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRiwayatKunjunganUks } from "@/context/RiwayatKunjunganUksContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function RiwayatKunjungan() {
  const { riwayatList, loading, error, getAllRiwayat, exportRiwayat, getRiwayatById } =
    useRiwayatKunjunganUks();
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [visitData, setVisitData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('Semua Data');

  useEffect(() => {
    getAllRiwayat();
  }, []);

  // Function to get current month name in Indonesian
  const getCurrentMonthName = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  };

  // Function to get weeks for current month with date ranges
  const getWeeksInMonth = () => {
    const currentMonth = getCurrentMonthName();
    const weekRanges = getWeekRanges();
    
    const weeks = ['Semua Data'];
    
    weekRanges.forEach(range => {
      weeks.push(`Pekan ${range.week} ${currentMonth} (${range.start}-${range.end})`);
    });
    
    return weeks;
  };

  // Function to get date ranges for each week in current month
  const getWeekRanges = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const weeks = [];
    let currentWeekStart = 1;
    
    for (let week = 1; week <= 4; week++) {
      const weekStart = currentWeekStart;
      let weekEnd;
      
      if (week === 4) {
        // Week 4 includes all remaining days of the month
        weekEnd = lastDay.getDate();
      } else {
        weekEnd = Math.min(currentWeekStart + 6, lastDay.getDate());
      }
      
      weeks.push({
        week: week,
        start: weekStart,
        end: weekEnd
      });
      
      currentWeekStart = weekEnd + 1;
      
      // If we've covered all days in month, break
      if (weekEnd >= lastDay.getDate()) break;
    }
    
    return weeks;
  };

  // Function to get week number from date
  const getWeekOfMonth = (dateString) => {
    const date = new Date(dateString);
    const dayOfMonth = date.getDate();
    const weekRanges = getWeekRanges();
    
    for (const range of weekRanges) {
      if (dayOfMonth >= range.start && dayOfMonth <= range.end) {
        return range.week;
      }
    }
    
    return 4; // Default to week 4 if not found
  };

  // Function to filter data by selected week
  const filterByWeek = (data) => {
    if (selectedWeek === 'Semua Data') {
      return data;
    }
    
    const weekNumber = parseInt(selectedWeek.match(/\d+/)[0]);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return data.filter(visit => {
      const visitDate = new Date(visit.tanggal);
      const visitMonth = visitDate.getMonth();
      const visitYear = visitDate.getFullYear();
      const visitWeek = getWeekOfMonth(visit.tanggal);
      
      return visitMonth === currentMonth && 
             visitYear === currentYear && 
             visitWeek === weekNumber;
    });
  };

  const filteredRiwayat = filterByWeek(riwayatList).filter(
    (visit) =>
      visit.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.nis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInfoClick = async (visitId) => {
    setSelectedVisitId(visitId);
    try {
      const visitResult = await getRiwayatById(visitId);
      if (visitResult.status === "success") {
        setVisitData(visitResult.data);
        setShowInfoModal(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data riwayat",
      });
    }
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
    setSelectedVisitId(null);
    setVisitData(null);
  };

  const handleWeekSelect = (week) => {
    setSelectedWeek(week);
    setShowWeekDropdown(false);
  };

  const InfoCardModal = () => {
    if (!visitData) {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-red-200 rounded-full animate-spin border-t-red-500"></div>
                <div className="mt-4 text-center text-gray-600 animate-pulse">
                  Loading...
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-y-0 right-0 w-full max-w-md z-50"
      >
        <div className="h-full bg-white shadow-xl overflow-y-auto">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>

          <div className="relative">
            <div className="h-48">
              {visitData.foto ? (
                <img
                  src={`http://localhost:8000/storage/${visitData.foto}`}
                  alt="Foto kunjungan siswa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Tidak ada foto</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">NIS</label>
                <input
                  type="text"
                  value={visitData.nis || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Tanggal
                </label>
                <input
                  type="text"
                  value={visitData.tanggal || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama</label>
                <input
                  type="text"
                  value={visitData.nama || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Kelas
                </label>
                <input
                  type="text"
                  value={visitData.kelas || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Jam Masuk
                </label>
                <input
                  type="text"
                  value={visitData.jam_masuk || "-"}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Jam Keluar
                </label>
                <input
                  type="text"
                  value={visitData.jam_keluar || "-"}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Gejala</label>
              <textarea
                rows={3}
                value={visitData.gejala || ""}
                readOnly
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Obat</label>
              <textarea
                rows={2}
                value={visitData.obat || ""}
                readOnly
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Keterangan
              </label>
              <textarea
                rows={2}
                value={visitData.keterangan || ""}
                readOnly
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-100"
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative"
      >
        <AnimatePresence>{showInfoModal && <InfoCardModal />}</AnimatePresence>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Riwayat Kunjungan UKS</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari Siswa"
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Week Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowWeekDropdown(!showWeekDropdown)}
                className="bg-white text-black border-2 border-solid border-black hover:border-black px-4 py-2 rounded-lg flex items-center text-sm transition-all duration-300 ease-in-out shadow-sm hover:shadow-md min-w-[140px]"
              >
                <span className="flex items-center gap-2 justify-between w-full">
                  <span className="truncate">{selectedWeek}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${showWeekDropdown ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showWeekDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <div className="py-1">
                      {getWeeksInMonth().map((week, index) => (
                        <button
                          key={index}
                          onClick={() => handleWeekSelect(week)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            selectedWeek === week 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {week}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Overlay to close dropdown when clicking outside */}
              {showWeekDropdown && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowWeekDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gejala
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keluar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-red-200 rounded-full animate-spin border-t-red-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : filteredRiwayat.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data riwayat
                    </td>
                  </tr>
                ) : (
                  filteredRiwayat.map((visit, index) => (
                    <motion.tr
                      key={visit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {visit.nama || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visit.kelas || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visit.gejala || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            visit.status.toLowerCase() === "masuk uks"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {visit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visit.jam_masuk || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visit.jam_keluar || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-black hover:text-red-700"
                          onClick={() => handleInfoClick(visit.id)}
                        >
                          <Info className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}