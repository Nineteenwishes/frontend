"use client";
import {
  LogOut,
  Info,
  Edit,
  Undo2,
  Download,
  Maximize,
  Search, // Added for the search input
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useKunjunganUks } from "@/context/KunjunganUksContext";
import { useMedicine } from "@/context/MedicinesContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function ListSiswa() {
  const { kunjunganList, getAllKunjungan, keluarUks, getKunjunganById } =
    useKunjunganUks();
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [visitData, setVisitData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

 
  useEffect(() => {
    getAllKunjungan();
  }, []);

  const handleMarkOut = async (visitId) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Konfirmasi",
        text: "Tandai siswa ini keluar dan simpan ke riwayat?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Ya, Tandai",
        cancelButtonText: "Batal",
      });

      if (confirmResult.isConfirmed) {
        const result = await keluarUks(visitId);
        if (result?.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: result.message || "Data berhasil ditandai keluar",
            timer: 1500,
            showConfirmButton: false,
          });
          getAllKunjungan();
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: result?.message || "Gagal menandai siswa keluar",
          });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Terjadi kesalahan saat proses keluar UKS",
      });
    }
  };

  const handleInfoClick = async (visitId) => {
    setSelectedVisitId(visitId);
    try {
      const visitResult = await getKunjunganById(visitId);
      if (visitResult.success) {
        setVisitData(visitResult.data);
        setShowInfoModal(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data siswa",
      });
    }
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
    setSelectedVisitId(null);
    setVisitData(null);
  };
  // --- End of unchanged functions ---

  const filteredKunjunganList = kunjunganList.filter((visit) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      visit.nama?.toLowerCase().includes(searchLower) ||
      visit.kelas?.toLowerCase().includes(searchLower)
    );
  });

  // --- InfoCardModal with backdrop enhancement ---
  const InfoCardModal = () => {
    const { getMedicineById, fetchMedicines } = useMedicine();
    const [medicineName, setMedicineName] = useState("-");

    useEffect(() => {
      fetchMedicines();
    }, [fetchMedicines]);

    useEffect(() => {
      const fetchMedicine = async () => {
        if (visitData?.obat) {
          const medicine = await getMedicineById(visitData.obat);
          setMedicineName(medicine?.nama || "-");
        } else {
          setMedicineName("-");
        }
      };
      if (getMedicineById) fetchMedicine();
    }, [visitData?.obat, getMedicineById]);

    return (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 b z-40"
          onClick={handleCloseModal}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 150 }}
          className="fixed inset-y-0 right-0 w-full max-w-md z-50 bg-white"
        >
          {/* Loading state and content are inside a scrollable div */}
          <div className="h-full shadow-xl overflow-y-auto">
            {!visitData ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-red-200 rounded-full animate-spin border-t-red-500"></div>
              </div>
            ) : (
              <>
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                >
                  <Undo2 size={20} className="text-gray-700" />
                </button>
                {/* Rest of the modal content... (No changes needed here) */}
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
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                      <Download size={20} className="text-gray-700" />
                    </button>
                    <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                      <Maximize size={20} className="text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-5">
                    {/* NIS and Time */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">NIS</label>
                        <input type="text" value={visitData.nis || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"/>
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-sm text-gray-600 mb-1 invisible">Waktu</label>
                        <div className="flex gap-2 h-full items-end">
                          <div className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-300 text-center">{visitData.jam_masuk || "-"}</div>
                          <div className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-300 text-center">{visitData.jam_keluar || "-"}</div>
                        </div>
                      </div>
                    </div>
                    {/* Name & Class */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nama</label>
                        <input type="text" value={visitData?.nama || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"/>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Kelas</label>
                        <input type="text" value={visitData?.kelas || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"/>
                      </div>
                    </div>
                    {/* Symptoms & Notes */}
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="block text-sm text-gray-600 mb-1">Gejala</label>
                        <textarea rows={4} value={visitData.gejala || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-100"/>
                      </div>
                       <div>
                        <label className="block text-sm text-gray-600 mb-1">Keterangan</label>
                        <textarea rows={4} value={visitData.keterangan || ""} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-100"/>
                      </div>
                    </div>
                     {/* Obat yang Diberikan */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Obat yang Diberikan</label>
                      <input type="text" value={medicineName} readOnly className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100"/>
                    </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <AnimatePresence>{showInfoModal && <InfoCardModal />}</AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Daftar Siswa di UKS
        </h1>
        
      </div>

      {/* --- MOBILE CARD LAYOUT --- */}
      <div className="lg:hidden space-y-4">
        {filteredKunjunganList.length > 0 ? (
          filteredKunjunganList.map((visit, index) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              {/* Top section: Name, Class, and Status */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{visit.nama}</p>
                  <p className="text-sm text-gray-500">{visit.kelas}</p>
                </div>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    visit.status.toLowerCase() === "masuk uks"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {visit.status}
                </span>
              </div>

              {/* Middle section: Timestamps */}
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Masuk</p>
                  <p className="font-medium text-gray-800">
                    {visit.jam_masuk || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Keluar</p>
                  <p className="font-medium text-gray-800">
                    {visit.jam_keluar || "-"}
                  </p>
                </div>
              </div>

              {/* Bottom section: Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
                <button onClick={() => handleInfoClick(visit.id)} className="text-black hover:text-gray-800">
                  <Info className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleMarkOut(visit.id)}
                  disabled={visit.status.toLowerCase() === "keluar uks"}
                  className={`${
                    visit.status.toLowerCase() === "keluar uks"
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-600 hover:text-red-800"
                  }`}
                >
                  <LogOut className="h-5 w-5" />
                </button>
                <Link href={`/staff/edit-siswa?id=${visit.id}`} className="text-black hover:text-gray-800">
                  <Edit className="h-5 w-5" />
                </Link>
               
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>{searchTerm ? "Siswa tidak ditemukan." : "Tidak ada siswa di UKS saat ini."}</p>
          </div>
        )}
      </div>

      {/* --- DESKTOP TABLE LAYOUT --- */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Head remains the same */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masuk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keluar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            {/* Table Body remains the same */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKunjunganList.length > 0 ? (
                filteredKunjunganList.map((visit, index) => (
                  <motion.tr
                    key={visit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visit.nama || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.kelas || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          visit.status.toLowerCase() === "masuk uks" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>{visit.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.jam_masuk || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.jam_keluar || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleInfoClick(visit.id)} className="text-black hover:text-gray-800"><Info className="h-5 w-5" /></button>
                        <button
                          onClick={() => handleMarkOut(visit.id)}
                          disabled={visit.status.toLowerCase() === "keluar uks"}
                          className={`${
                            visit.status.toLowerCase() === "keluar uks" ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-800"
                          }`}
                        ><LogOut className="h-5 w-5" /></button>
                        <Link href={`/staff/edit-siswa?id=${visit.id}`} className="text-black hover:text-gray-800"><Edit className="h-5 w-5" /></Link>
                       
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? "Tidak ditemukan data yang sesuai" : "Tidak ada data"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}