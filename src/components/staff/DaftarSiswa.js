"use client";
import {
  Search,
  LogOut,
  Info,
  Plus,
  Edit,
  Undo2,
  Download,
  Maximize,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useKunjunganUks } from "@/context/KunjunganUksContext";
import { useMedicine } from "@/context/MedicinesContext"; // Import useMedicine
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function DaftarSiswa() {
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
          await Swal.fire({
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
      console.error("Error fetching data:", error);
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

  // Filter kunjunganList based on search term (nama or kelas)
  const filteredKunjunganList = kunjunganList.filter((visit) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      visit.nama?.toLowerCase().includes(searchLower) ||
      visit.kelas?.toLowerCase().includes(searchLower)
    );
  });

  const InfoCardModal = () => {
    const { getMedicineById, fetchMedicines } = useMedicine(); // Use useMedicine hook
    const [medicineName, setMedicineName] = useState("-");

    useEffect(() => {
      fetchMedicines(); // Fetch medicines when component mounts
    }, []);

    useEffect(() => {
      const fetchMedicine = async () => {
        if (visitData?.obat) {
          try {
            const medicine = await getMedicineById(visitData.obat);
            setMedicineName(medicine?.nama || "-");
          } catch (error) {
            console.error("Error fetching medicine details:", error);
            setMedicineName("-");
          }
        } else {
          setMedicineName("-");
        }
      };
      fetchMedicine();
    }, [visitData?.obat, fetchMedicines]); // Add fetchMedicines to dependency array

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
          {/* Close button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
          >
            <Undo2 size={20} className="text-gray-700" />
          </button>

          {/* Header with Image */}
          <div className="relative">
            {/* Hero Image */}
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

            {/* Action buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                <Download size={20} className="text-gray-700" />
              </button>
              <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                <Maximize size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-5">
            {/* NIS and Time Selection - Combined in one row */}
            <div className="grid grid-cols-3 gap-4">
              {/* NIS */}
              <div className="col-span-2">
                <label
                  htmlFor="nis"
                  className="block text-sm text-gray-600 mb-1"
                >
                  NIS
                </label>
                <input
                  type="text"
                  id="nis"
                  value={visitData.nis || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                />
              </div>

              {/* Time Selection */}
              <div className="flex flex-col">
                <label className="block text-sm text-gray-600 mb-1 invisible">
                  Waktu
                </label>
                <div className="flex gap-2 h-full items-end">
                  <div className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-300 text-center">
                    {visitData.jam_masuk || "-"}
                  </div>
                  <div className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-300 text-center">
                    {visitData.jam_keluar || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Name & Class */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  value={visitData?.nama || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="class"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Kelas
                </label>
                <input
                  type="text"
                  id="class"
                  value={visitData?.kelas || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                />
              </div>
            </div>

            {/* Symptoms & Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="symptoms"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Gejala
                </label>
                <textarea
                  id="symptoms"
                  rows={4}
                  value={visitData.gejala || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Keterangan
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={visitData.keterangan || ""}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-100"
                />
              </div>
            </div>

            {/* Obat yang Diberikan */}
            <div>
              <label
                htmlFor="medicine"
                className="block text-sm text-gray-600 mb-1"
              >
                Obat yang Diberikan
              </label>
              <input
                type="text"
                id="medicine"
                value={medicineName}
                readOnly
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative"
    >
      {/* Modal Info Card */}
      <AnimatePresence>{showInfoModal && <InfoCardModal />}</AnimatePresence>

      {/* Konten utama daftar siswa */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Daftar Siswa Sakit</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau kelas..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href={"/staff/tambah-siswa"}>
            <button className="bg-white text-black border-2 border-solid border-black hover:border-black px-4 py-2 rounded-lg flex items-center text-sm transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Tambah Siswa
              </span>
            </button>
          </Link>
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
              {filteredKunjunganList.length > 0 ? (
                filteredKunjunganList.map((visit, index) => (
                  <motion.tr
                    key={visit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`hover:bg-gray-50 transition-colors ${
                      visit.status.toLowerCase() === "masuk uks" ? "bg-white" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {visit.nama || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.kelas || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                      <div className="flex space-x-2">
                        <button
                          className="text-black hover:text-slate-700"
                          onClick={() => handleInfoClick(visit.id)}
                        >
                          <Info className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleMarkOut(visit.id)}
                          className={`${
                            visit.status.toLowerCase() === "keluar uks"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900"
                          }`}
                          disabled={visit.status.toLowerCase() === "keluar uks"}
                        >
                          <LogOut className="h-5 w-5" />
                        </button>
                        <Link
                          href={`/staff/edit-siswa?id=${visit.id}`}
                          className="text-black hover:text-slate-700"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
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