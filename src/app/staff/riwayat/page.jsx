"use client";
import { Search, Download, Info, ArrowLeft, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRiwayatKunjunganUks } from "@/context/RiwayatKunjunganUksContext";
import { useMedicine } from "@/context/MedicinesContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function RiwayatKunjungan() {
  // ... (semua state dan fungsi Anda tetap sama)
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

  const getCurrentMonthName = () => {
    const months = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ];
    return months[new Date().getMonth()];
  };
  const getWeekRanges = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks = [];
    let currentWeekStart = 1;
    for (let week = 1; week <= 4; week++) {
      const weekStart = currentWeekStart;
      let weekEnd;
      if (week === 4) { weekEnd = lastDay.getDate(); } else { weekEnd = Math.min(currentWeekStart + 6, lastDay.getDate()); }
      weeks.push({ week, start: weekStart, end: weekEnd });
      currentWeekStart = weekEnd + 1;
      if (weekEnd >= lastDay.getDate()) break;
    }
    return weeks;
  };
  const getWeeksInMonth = () => {
    const currentMonth = getCurrentMonthName();
    const weekRanges = getWeekRanges();
    const weeks = ['Semua Data'];
    weekRanges.forEach(range => { weeks.push(`Pekan ${range.week} ${currentMonth} (${range.start}-${range.end})`); });
    return weeks;
  };
  const getWeekOfMonth = (dateString) => {
    const date = new Date(dateString);
    const dayOfMonth = date.getDate();
    const weekRanges = getWeekRanges();
    for (const range of weekRanges) {
      if (dayOfMonth >= range.start && dayOfMonth <= range.end) { return range.week; }
    }
    return 4;
  };
  const filterByWeek = (data) => {
    if (selectedWeek === 'Semua Data') return data;
    const weekNumber = parseInt(selectedWeek.match(/\d+/)[0]);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return data.filter(visit => {
      const visitDate = new Date(visit.tanggal);
      return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear && getWeekOfMonth(visit.tanggal) === weekNumber;
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
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data riwayat" });
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
    // ... (Komponen Modal tetap sama, tidak ada perubahan di sini)
    const { getMedicineById, fetchMedicines } = useMedicine();
    const [medicineName, setMedicineName] = useState("-");

    useEffect(() => { fetchMedicines(); }, []);
    useEffect(() => {
      const fetchMedicine = async () => {
        if (visitData?.obat) {
          try {
            const medicine = await getMedicineById(visitData.obat);
            setMedicineName(medicine?.nama || "-");
          } catch (error) {
            setMedicineName("-");
          }
        } else {
          setMedicineName("-");
        }
      };
      fetchMedicine();
    }, [visitData?.obat]);

    if (!visitData) { return null; }

    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-y-0 right-0 w-full sm:max-w-md z-50"
      >
        <div className="h-full bg-white shadow-xl overflow-y-auto">
          <button onClick={handleCloseModal} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="relative h-48">
            {visitData.foto ? ( <img src={`http://localhost:8000/storage/${visitData.foto}`} alt="Foto kunjungan" className="w-full h-full object-cover" /> ) : ( <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-400">Tidak ada foto</span></div> )}
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">NIS</label>
                <input type="text" value={visitData.nis || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
                <input type="text" value={visitData.tanggal || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama</label>
                <input type="text" value={visitData.nama || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Kelas</label>
                <input type="text" value={visitData.kelas || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Jam Masuk</label>
                <input type="text" value={visitData.jam_masuk || "-"} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Jam Keluar</label>
                <input type="text" value={visitData.jam_keluar || "-"} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gejala</label>
              <textarea rows={3} value={visitData.gejala || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Obat</label>
              <input type="text" value={medicineName} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Keterangan</label>
              <textarea rows={2} value={visitData.keterangan || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-100" />
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

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-xl font-semibold">Riwayat Kunjungan UKS</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-gray-400" /></div>
              <input type="text" placeholder="Cari Siswa" className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative w-full sm:w-auto">
              <button onClick={() => setShowWeekDropdown(!showWeekDropdown)} className="bg-white text-black border-2 border-solid border-black hover:border-black px-4 py-2 rounded-lg flex items-center text-sm transition-all duration-300 ease-in-out shadow-sm hover:shadow-md w-full">
                <span className="flex items-center gap-2 justify-between w-full"><span className="truncate">{selectedWeek}</span><ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${showWeekDropdown ? 'rotate-180' : ''}`} /></span>
              </button>
              <AnimatePresence>{showWeekDropdown && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"><div className="py-1">{getWeeksInMonth().map((week, index) => (<button key={index} onClick={() => handleWeekSelect(week)} className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedWeek === week ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>{week}</button>))}</div></motion.div>)}</AnimatePresence>
              {showWeekDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowWeekDropdown(false)} />}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Tampilan Tabel (Desktop) */}
          <div className="overflow-x-auto hidden md:block">
            {/* ... (Kode Tabel tidak berubah) ... */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gejala</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keluar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? ( <tr><td colSpan="7" className="text-center p-6"><div className="w-8 h-8 border-4 border-red-200 rounded-full animate-spin border-t-red-500 mx-auto"></div></td></tr> ) : error ? ( <tr><td colSpan="7" className="text-center p-6 text-red-500">{error}</td></tr> ) : filteredRiwayat.length === 0 ? ( <tr><td colSpan="7" className="text-center p-6 text-gray-500">Tidak ada data riwayat yang cocok.</td></tr> ) : (
                  filteredRiwayat.map((visit, index) => (
                    <motion.tr key={visit.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visit.nama || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.kelas || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{visit.gejala || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.tanggal || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.jam_masuk || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.jam_keluar || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button className="text-black hover:text-red-700" onClick={() => handleInfoClick(visit.id)}><Info className="h-5 w-5" /></button></td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CHANGE: Tampilan Kartu (Mobile) dengan desain baru */}
          <div className="md:hidden">
            {loading ? ( <div className="text-center p-6"><div className="w-8 h-8 border-4 border-red-200 rounded-full animate-spin border-t-red-500 mx-auto"></div></div> ) : error ? ( <div className="text-center p-6 text-red-500">{error}</div> ) : filteredRiwayat.length === 0 ? ( <div className="text-center p-6 text-gray-500">Tidak ada data riwayat yang cocok.</div> ) : (
              <div className="divide-y divide-gray-200">
                {filteredRiwayat.map((visit, index) => (
                  <motion.div
                    key={visit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4"
                  >
                    <div className="flex justify-between items-center gap-4">
                      {/* Informasi Utama di Kiri */}
                      <div>
                        <p className="font-bold text-gray-900">{visit.nama}</p>
                        <p className="text-sm text-gray-500">{visit.kelas}</p>
                        <p className="text-sm text-gray-500 mt-1">{visit.tanggal}</p>
                      </div>

                      {/* Tombol Aksi di Kanan */}
                      <div>
                        <button
                          onClick={() => handleInfoClick(visit.id)}
                          className="p-2 text-gray-600 hover:text-red-700 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={`Lihat detail untuk ${visit.nama}`}
                        >
                          <Info className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}