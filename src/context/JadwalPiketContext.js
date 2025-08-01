"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "@/utils/axios";

const JadwalPiketContext = createContext();

export const JadwalPiketProvider = ({ children }) => {
  const [jadwalPiket, setJadwalPiket] = useState([]);
  const [petugasTerpilih, setPetugasTerpilih] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cachedJadwalPiketByHari, setCachedJadwalPiketByHari] = useState({}); // New state for caching

  useEffect(() => {
    fetchJadwalPiket();
  }, []);

  const fetchJadwalPiket = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/jadwal-piket");
      setJadwalPiket(response.data.data);
      setError(null);
      return {
        success: true,
        status: "success",
        data: response.data.data,
      };
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data jadwal piket."
      );
      return {
        success: false,
        status: "error",
        message:
          err.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data jadwal piket.",
      };
    } finally {
      setLoading(false);
    }
  };

  const getJadwalPiketByHari = async (hari) => {
    if (!hari) {
      return {
        success: false,
        status: "error",
        message: "Hari tidak boleh kosong.",
      };
    }

    // Check if data is already cached
    if (cachedJadwalPiketByHari[hari]) {
      setJadwalPiket(cachedJadwalPiketByHari[hari]); // Update current jadwalPiket state
      return {
        success: true,
        status: "success",
        data: cachedJadwalPiketByHari[hari],
      };
    }

    setLoading(true);
    try {
      const response = await axios.get(`/jadwal-piket/hari/${hari}`);
      const data = response.data.data;
      setJadwalPiket(data);
      setCachedJadwalPiketByHari((prev) => ({ ...prev, [hari]: data })); // Cache the data
      setError(null);
      return {
        success: true,
        status: "success",
        data: data,
      };
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data jadwal piket berdasarkan hari."
      );
      return {
        success: false,
        status: "error",
        message:
          err.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data jadwal piket berdasarkan hari.",
      };
    } finally {
      setLoading(false);
    }
  };

  const addJadwalPiket = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/jadwal-piket", data);
      const newJadwal = response.data.data;
      setJadwalPiket((prev) => [...prev, newJadwal]);
      setError(null);
      return {
        success: true,
        status: "success",
        message: response.data.message || "Jadwal piket berhasil ditambahkan",
        data: newJadwal,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat menambahkan jadwal piket.";
      setError(errorMessage);
      return {
        success: false,
        status: "error",
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateJadwalPiket = async (id, data) => {
    setLoading(true);
    try {
      const response = await axios.put(`/jadwal-piket/${id}`, data);
      const updatedJadwal = response.data.data;
      setJadwalPiket((prev) =>
        prev.map((item) => (item.id === id ? updatedJadwal : item))
      );
      setError(null);
      return {
        success: true,
        status: "success",
        message: response.data.message || "Jadwal piket berhasil diperbarui",
        data: updatedJadwal,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat memperbarui jadwal piket.";
      setError(errorMessage);
      return {
        success: false,
        status: "error",
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteJadwalPiket = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/jadwal-piket/${id}`);
      setJadwalPiket((prev) => prev.filter((item) => item.id !== id));
      setError(null);
      return {
        success: true,
        status: "success",
        message: response.data.message || "Jadwal piket berhasil dihapus",
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat menghapus jadwal piket.";
      setError(errorMessage);
      return {
        success: false,
        status: "error",
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const getJadwalPiketById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/jadwal-piket/${id}`);
      setError(null);
      return {
        success: true,
        status: "success",
        data: response.data.data,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Jadwal piket tidak ditemukan.";
      setError(errorMessage);
      return {
        success: false,
        status: "error",
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <JadwalPiketContext.Provider
      value={{
        jadwalPiket,
        loading,
        error,
        petugasTerpilih,
        setPetugasTerpilih,
        fetchJadwalPiket,
        getJadwalPiketByHari,
        addJadwalPiket,
        updateJadwalPiket,
        deleteJadwalPiket,
        getJadwalPiketById,
      }}
    >
      {children}
    </JadwalPiketContext.Provider>
  );
};

export const useJadwalPiket = () => {
  const context = useContext(JadwalPiketContext);
  if (!context) {
    throw new Error("useJadwalPiket must be used within a JadwalPiketProvider");
  }
  return context;
};
