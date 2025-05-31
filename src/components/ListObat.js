import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Undo2 } from "lucide-react";
import { useMedicine } from "@/context/MedicinesContext";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

function ListObat() {
  const { allMedicines, fetchMedicines, hapusMedicine, getMedicineById } =
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
                  ? "border-blue-500 ring-2 ring-blue-200"
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
                      medicine.stok > 5
                        ? "green"
                        : medicine.stok > 0
                        ? "yellow"
                        : "red"
                    }-100 text-${
                      medicine.stok > 5
                        ? "green"
                        : medicine.stok > 0
                        ? "yellow"
                        : "red"
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
                    {medicine.stok > 5
                      ? "AVAILABLE"
                      : medicine.stok > 0
                      ? "LOW STOCK"
                      : "NOT AVAILABLE"}
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
                  <div className="flex items-center text-sm font-medium">
                    <svg
                      className="h-5 w-5 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                    <span
                      className={`text-${
                        medicine.stok > 0 ? "green" : "red"
                      }-600`}
                    >
                      {medicine.stok} tersisa
                    </span>
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
