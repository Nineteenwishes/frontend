import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Undo2, Package, Pill } from "lucide-react";
import { useMedicine } from "@/context/MedicinesContext";
import Link from "next/link";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

function ListObat() {
  const { allMedicines, fetchMedicines, getMedicineById } =
    useMedicine();
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleCardClick = async (medicine) => {
    try {
      const detail = await getMedicineById(medicine.id);
      setSelectedMedicine(detail);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching medicine details:", error);
      Swal.fire("Error!", "Gagal mengambil detail obat.", "error");
    }
  };


  const filteredMedicines = allMedicines.filter((medicine) =>
    medicine.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.0 }}
      className="max-w-6xl mx-auto p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Daftar Obat</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {filteredMedicines.map((medicine) => (
            <motion.div
              key={medicine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                selectedMedicineId === medicine.id
                  ? "border-red-500 ring-2 ring-red-200"
                  : "border-gray-200"
              }`}
              onClick={() => handleCardClick(medicine)}
            >
              <div className="relative group">
                <div className="relative w-full h-48 sm:h-56">
                  <Image
                    src={
                      medicine.foto
                        ? `http://localhost:8000/storage/${medicine.foto}`
                        : "/images/default-obat.png"
                    }
                    alt={medicine.nama}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <div
                    className={`bg-${
                      medicine.stok > 0 ? "green" : "red"
                    }-100 text-${
                      medicine.stok > 0 ? "green" : "red"
                    }-800 text-xs px-2 py-1 rounded-full inline-flex items-center`}
                  >
                    <svg
                      className="h-3 w-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {medicine.stok > 0 ? "AVAILABLE" : "NOT AVAILABLE"}
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                  {medicine.nama}
                </h2>
                <p className="text-gray-600 text-sm mb-1">
                  Jenis: {medicine.jenis}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Dosis: {medicine.dosis}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-sm font-medium gap-1">
                    <svg
                      className="h-5 w-5 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <Pill />
                    </svg>
                    <span>{medicine.dosis}</span>

                    <div
                      className={`flex items-center px-2 py-1 rounded-full ${
                        medicine.stok === 0
                          ? "bg-gray-100 text-gray-800"
                          : medicine.stok <= 5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <svg
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <Package />
                      </svg>
                      <span>{medicine.stok} tersisa</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Medicine Detail Modal */}
      <AnimatePresence>
        {showModal && selectedMedicine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Undo2 className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <div className="w-full h-64 mb-4">
                      <Image
                        src={
                          selectedMedicine.foto
                            ? `http://localhost:8000/storage/${selectedMedicine.foto}`
                            : "/images/default-obat.png"
                        }
                        alt={selectedMedicine.nama}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Link
                        href={`/staff/edit-obat?id=${selectedMedicine.id}`}
                        className="bg-white border border-gray-300 text-black px-3 py-2 rounded-lg flex items-center hover:bg-gray-50 transition-colors shadow-md"
                      >
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama
                      </label>
                      <input
                        type="text"
                        value={selectedMedicine.nama}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jenis
                      </label>
                      <input
                        type="text"
                        value={selectedMedicine.jenis}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stok
                      </label>
                      <input
                        type="text"
                        value={selectedMedicine.stok}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosis
                      </label>
                      <input
                        type="text"
                        value={selectedMedicine.dosis}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={selectedMedicine.deskripsi}
                      readOnly
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ListObat;
