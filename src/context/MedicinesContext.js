"use client";
import { createContext, useContext, useState,} from "react";
import axios from "@/utils/axios"

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [allMedicines, setAllMedicines] = useState([]);
  
  const fetchMedicines = async () => {
    try {
      const response = await axios.get("/medicines");
      const medicines = response.data.data || response.data;
      setAllMedicines(medicines);
    } catch (error) {
      console.error("Gagal mengambil data obat", error);
    }
  };


  const getMedicineById = async (id) => {
    try {
      const response = await axios.get(`/medicines/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Gagal mengambil detail obat:", error);
      throw error;
    }
  };

  const tambahMedicine = async (form) => {
    try {
      if (!form.nama || !form.stok) {
        alert("Nama dan stok obat wajib diisi.");
        return;
      }

      const formData = new FormData();
      formData.append("nama", form.nama);
      formData.append("jenis", form.jenis || "");
      formData.append("stok", form.stok);
      formData.append("dosis", form.dosis|| "");
      formData.append("deskripsi", form.deskripsi || "");

      if (form.foto instanceof File) {
        formData.append("foto", form.foto);
      }

      const response = await axios.post("/medicines", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newMedicine = response.data.data || response.data;
      setAllMedicines((prev) => [...prev, newMedicine]);
      

      return newMedicine;
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        alert("Validasi gagal:\n" + Object.values(errors).flat().join("\n"));
      } else if (err.response?.status === 403) {
        alert("Anda tidak memiliki akses untuk menambah obat");
      } else {
        console.error("Gagal tambah obat", err);
        alert("Gagal tambah obat");
      }
      throw err;
    }
  };

  const editMedicine = async (id, form) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT"); 
      formData.append("nama", form.nama);
      formData.append("jenis", form.jenis || "");
      formData.append("stok", form.stok);
      formData.append("dosis", form.dosis || "");
      formData.append("deskripsi", form.deskripsi || "");

      if (form.foto instanceof File) {
        formData.append("foto", form.foto);
      }

      const response = await axios.post(`/medicines/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedMedicine = response.data.data || response.data;
      setAllMedicines((prev) =>
        prev.map((medicine) =>
          medicine.id === id ? updatedMedicine : medicine
        )
      );

      return updatedMedicine;
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        alert("Validasi gagal:\n" + Object.values(errors).flat().join("\n"));
      } else if (err.response?.status === 403) {
        alert("Anda tidak memiliki akses untuk mengubah obat");
      } else {
        console.error("Gagal update obat:", err);
        alert("Gagal update obat");
      }
      throw err;
    }
  };

  const hapusMedicine = async (id) => {
    try {
      await axios.delete(`/medicines/${id}`);
      setAllMedicines((prev) => prev.filter((medicine) => medicine.id !== id));
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Anda tidak memiliki akses untuk menghapus obat");
      } else {
        console.error("Gagal hapus obat", error);
        alert("Gagal hapus obat");
      }
      throw error;
    }
  };

  return (
    <MedicineContext.Provider
      value={{
        allMedicines,
        fetchMedicines,
        getMedicineById,
        tambahMedicine,
        editMedicine,
        hapusMedicine,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicine = () => useContext(MedicineContext);
