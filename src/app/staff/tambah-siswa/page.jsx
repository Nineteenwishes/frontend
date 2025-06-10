"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useKunjunganUks } from "@/context/KunjunganUksContext";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useStudent } from "@/context/StudentContext";
import Swal from "sweetalert2";
import { useMedicine } from "@/context/MedicinesContext";

export default function Page() {
  const router = useRouter();
  const { addKunjungan } = useKunjunganUks();
  const { getStudentByNis } = useStudent();
  const { allMedicines, fetchMedicines } = useMedicine();

  const [form, setForm] = useState({
    nis: "",
    nama: "",
    kelas: "",
    gejala: "",
    keterangan: "",
    medicines_id: "",
    foto: null,
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleNisChange = async (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      nis: value,
      nama: "",
      kelas: "",
    }));

    if (value.length >= 9) {
      try {
        const result = await getStudentByNis(value);
        if (result.success) {
          const student = result.data;
          setForm((prev) => ({
            ...prev,
            nis: value,
            nama: student.nama,
            kelas: student.kelas,
          }));
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        foto: file,
      }));
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({
        ...prev,
        foto: file,
      }));
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setForm((prev) => ({
      ...prev,
      foto: null,
    }));
    setFotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.nis) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "NIS siswa wajib diisi",
        });
        return;
      }

      if (!form.gejala) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gejala wajib diisi",
        });
        return;
      }

      const result = await addKunjungan({
        nis: form.nis,
        gejala: form.gejala,
        keterangan: form.keterangan || "",
        obat: form.medicines_id || "",
        foto: form.foto,
      });

      if (result?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: result.message || "Data kunjungan UKS berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/staff/daftar-siswa");
      } else {
        console.error("Error response:", result);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result?.message || "Gagal menambahkan data kunjungan UKS",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Gagal menambahkan data kunjungan UKS",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/staff/daftar-siswa"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali Ke Daftar Siswa Sakit
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">
                Data Siswa
              </h1>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIS
                      </label>
                      <input
                        type="text"
                        name="nis"
                        value={form.nis}
                        onChange={handleNisChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Masukkan NIS siswa"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={form.nama}
                        readOnly
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        placeholder="Nama akan terisi otomatis"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kelas
                      </label>
                      <input
                        type="text"
                        name="kelas"
                        value={form.kelas}
                        readOnly
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        placeholder="Kelas akan terisi otomatis"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gejala
                      </label>
                      <textarea
                        name="gejala"
                        value={form.gejala}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Deskripsikan gejala yang dialami siswa"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Obat
                      </label>
                      <div className="relative">
                        <select
                          name="medicines_id"
                          value={form.medicines_id}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                        >
                          <option value="">Pilih obat yang diberikan</option>
                          {allMedicines.map((medicine) => (
                            <option key={medicine.id} value={medicine.id}>
                              {medicine.nama}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keterangan
                      </label>
                      <textarea
                        name="keterangan"
                        value={form.keterangan}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Keterangan tambahan (opsional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                          isDragOver
                            ? "border-red-400 bg-red-50"
                            : fotoPreview
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300 bg-gray-50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {fotoPreview ? (
                          <div className="relative">
                            <img
                              src={fotoPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <div className="text-sm text-gray-600 mb-2">
                              Drag your image here, or{" "}
                              <label className="text-red-600 hover:text-red-700 cursor-pointer font-medium">
                                click to browse
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href="/staff/daftar-siswa"
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <span className="mr-2">✓</span>
                    Konfirmasi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
