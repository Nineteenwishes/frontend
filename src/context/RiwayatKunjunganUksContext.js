"use client";
import { createContext, useContext, useState } from "react";
import axios from "@/utils/axios";

const RiwayatKunjunganUksContext = createContext();

export function RiwayatKunjunganUksProvider({ children }) {
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllRiwayat = async () => {
    if (riwayatList.length > 0) return; // ✅ Cegah request ganda

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`/riwayat-kunjungan-uks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.status === "success") {
        setRiwayatList(response.data.data);
      } else {
        throw new Error(
          response.data?.message || "Gagal mengambil data riwayat"
        );
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Terjadi kesalahan saat mengambil data"
      );
      console.error("Error fetching riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  

  const storeRiwayat = async (kunjunganId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/riwayat-kunjungan-uks/store`,
        { kunjungan_id: kunjunganId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === "success") {
        return {
          status: "success",
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        throw new Error(
          response.data?.message || "Gagal menyimpan data ke riwayat"
        );
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan data";
      setError(errorMessage);
      console.error("Error storing riwayat:", err);
      return {
        status: "error",
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi baru untuk mengambil data riwayat berdasarkan ID
  const getRiwayatById = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`/riwayat-kunjungan-uks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data };
      } else {
        throw new Error(
          response.data?.message || "Gagal mengambil data riwayat"
        );
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat mengambil data riwayat";
      setError(errorMessage);
      console.error(`Error fetching riwayat with ID ${id}:`, err);
      return { status: "error", message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi baru untuk memperbarui data riwayat
  const updateRiwayat = async (id, data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(`/riwayat-kunjungan-uks/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.status === "success") {
        return { status: "success", message: response.data.message };
      } else {
        throw new Error(
          response.data?.message || "Gagal memperbarui data riwayat"
        );
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat memperbarui data riwayat";
      setError(errorMessage);
      console.error(`Error updating riwayat with ID ${id}:`, err);
      return { status: "error", message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi baru untuk menghapus data riwayat
  const deleteRiwayat = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete(`/riwayat-kunjungan-uks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.status === "success") {
        return { status: "success", message: response.data.message };
      } else {
        throw new Error(
          response.data?.message || "Gagal menghapus data riwayat"
        );
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menghapus data riwayat";
      setError(errorMessage);
      console.error(`Error deleting riwayat with ID ${id}:`, err);
      return { status: "error", message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const exportRiwayat = async (params = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`/riwayat-kunjungan-uks/export`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: params, // Pass the filtering parameters here
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      // You might want to dynamically set the filename based on the params
      link.setAttribute("download", "riwayat_kunjungan_uks.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Terjadi kesalahan saat mengekspor data"
      );
      console.error("Error exporting riwayat:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <RiwayatKunjunganUksContext.Provider
      value={{
        riwayatList,
        loading,
        error,
        getAllRiwayat,
        exportRiwayat,
        storeRiwayat,
        getRiwayatById, 
        updateRiwayat, 
        deleteRiwayat, 

      }}
    >
      {children}
    </RiwayatKunjunganUksContext.Provider>
  );
}

export function useRiwayatKunjunganUks() {
  const context = useContext(RiwayatKunjunganUksContext);
  if (!context) {
    throw new Error(
      "useRiwayatKunjunganUks must be used within a RiwayatKunjunganUksProvider"
    );
  }
  return context;
}
