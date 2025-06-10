"use client";

import { useState, useEffect, useRef } from "react";
import { useMedicine } from "@/context/MedicinesContext";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";
import Link from "next/link";
import { ArrowLeft, ImagePlus, X, Check } from "lucide-react";

export default function EditObat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { editMedicine, getMedicineById } = useMedicine();
  const [loading, setLoading] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    nama: "",
    jenis: "",
    stok: "",
    dosis: "",
    deskripsi: "",
    foto: null,
  });

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      loadMedicine(id);
    }
  }, []);

  const loadMedicine = async (id) => {
    try {
      const data = await getMedicineById(id);
      setForm({
        nama: data.nama,
        jenis: data.jenis || "",
        stok: data.stok,
        dosis: data.dosis || "",
        deskripsi: data.deskripsi || "",
      });
      if (data.foto) {
        setFotoPreview(`http://localhost:8000/storage/${data.foto}`);
      }
    } catch (error) {
      console.error("Error loading medicine:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      foto: file,
    }));

    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      foto: null,
    }));
    setFotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.match("image.*/.*")) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Konfirmasi sebelum mengedit
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin mengubah data obat ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const id = searchParams.get("id");
        await editMedicine(id, form);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data obat berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/staff/daftar-obat");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.message || "Terjadi kesalahan saat memperbarui data obat",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-screen-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="border-b p-4 flex items-center">
          <Link href={"/staff/daftar-obat"} className="mr-2">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-sm font-medium">Kembali Ke Daftar Obat</h1>
        </div>

        {/* Form Container */}
        <div className="p-4">
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium border-b pb-3">Data Obat</h2>

            <div className="mt-4">
              <p className="text-sm mb-2">Foto</p>
              <div
                className={`border-2 ${
                  !fotoPreview ? "border-dashed" : "border-solid"
                } rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
                onClick={() => !fotoPreview && fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {fotoPreview ? (
                  <div className="relative w-full">
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-100 p-3 rounded-lg mb-2">
                      <ImagePlus size={32} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Seret gambar ke sini atau <br />
                      <span className="text-red-500 font-medium">
                        klik untuk memilih
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Format: JPG, PNG (Maks. 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm mb-2 block font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  id="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Masukkan nama obat"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block font-medium text-gray-700">
                  Jenis
                </label>
                <input
                  type="text"
                  id="jenis"
                  value={form.jenis}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Masukkan jenis obat"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm mb-2 block font-medium text-gray-700">
                  Stok
                </label>
                <input
                  type="number"
                  id="stok"
                  value={form.stok}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Jumlah stok"
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block font-medium text-gray-700">
                  Dosis
                </label>
                <input
                  type="text"
                  id="dosis"
                  value={form.dosis}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Contoh: 2x sehari"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm mb-2 block font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                id="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 h-24 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="Masukkan deskripsi obat"
              ></textarea>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Link href="/staff/daftar-obat">
                <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg flex items-center hover:bg-gray-50 transition-colors">
                  <X size={16} className="mr-1" /> Batal
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className={`"bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg flex items-center hover:bg-gray-50 transition-colors" ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Check size={16} className="mr-1" /> Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
