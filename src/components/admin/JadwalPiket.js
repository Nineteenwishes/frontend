import React, { useState } from "react";
import { useJadwalPiket } from "@/context/JadwalPiketContext";
import Swal from "sweetalert2"; // Import SweetAlert2

const JadwalPiket = () => {
  const {
    jadwalPiket,
    loading,
    error,
    addJadwalPiket,
    updateJadwalPiket,
    deleteJadwalPiket,
  } = useJadwalPiket();

  // State untuk form
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    nis: "",
    nama: "",
    kelas: "",
    hari: "", // Initialize hari with an empty string
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SweetAlert confirmation for add/edit
    const result = await Swal.fire({
      title: editMode ? "Konfirmasi Edit" : "Konfirmasi Tambah",
      text: editMode
        ? "Apakah Anda yakin ingin menyimpan perubahan ini?"
        : "Apakah Anda yakin ingin menambahkan jadwal ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: editMode ? "Ya, Simpan!" : "Ya, Tambahkan!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        if (editMode) {
          const updateResult = await updateJadwalPiket(currentId, formData);
          if (updateResult.success) {
            Swal.fire(
              "Berhasil!",
              "Jadwal piket berhasil diperbarui",
              "success"
            );
          }
        } else {
          const addResult = await addJadwalPiket(formData);
          if (addResult.success) {
            Swal.fire(
              "Berhasil!",
              "Jadwal piket berhasil ditambahkan",
              "success"
            );
          }
        }
        closeModal();
      } catch (err) {
        Swal.fire(
          "Error!",
          err.message || "Terjadi kesalahan saat memproses data",
          "error"
        );
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nis: item.nis,
      nama: item.nama,
      kelas: item.kelas,
      hari: item.hari, // Populate hari when editing
    });
    setCurrentId(item.id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    // SweetAlert confirmation for delete
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteJadwalPiket(id);
        if (deleteResult.success) {
          Swal.fire("Dihapus!", "Jadwal piket berhasil dihapus.", "success");
        }
      } catch (err) {
        Swal.fire(
          "Error!",
          err.message || "Terjadi kesalahan saat menghapus data",
          "error"
        );
      }
    }
  };

  const openModalHandler = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      nis: "",
      nama: "",
      kelas: "",
      hari: "", // Clear hari with an empty string when closing modal
    });
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-red-500 rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
            Jadwal Piket Siswa
          </h1>
          <p className="text-red-100 text-center mt-1 md:mt-2 text-sm md:text-base">
            Kelola jadwal piket siswa dengan mudah
          </p>
        </div>

        {/* Add Button */}
        <div className="flex justify-end mb-4 md:mb-6">
          <button
            onClick={openModalHandler}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow hover:shadow-md transition-all text-sm md:text-base"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Tambah Jadwal Piket
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          /* Jadwal Piket Table - Responsive */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Hari
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-white uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jadwalPiket.length > 0 ? (
                    jadwalPiket.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-red-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.nis}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.kelas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.hari}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-red-500 hover:text-red-600"
                              title="Edit"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-gray-500 hover:text-red-600"
                              title="Hapus"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5" // Update colspan to 5
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-16 h-16 text-red-200 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                          <p className="text-lg">Tidak ada data jadwal piket</p>
                          <p className="text-sm mt-2 text-center">
                            Klik tombol "Tambah Jadwal Piket" untuk menambahkan
                            data baru
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              {jadwalPiket.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {jadwalPiket.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">
                          {item.nama}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-red-500 hover:text-red-600 p-1"
                            title="Edit"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-gray-500 hover:text-red-600 p-1"
                            title="Hapus"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        NIS: {item.nis}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        Kelas: {item.kelas}
                      </div>
                      <div className="text-sm text-gray-500">
                        Hari: {item.hari}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-red-200 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    <p className="text-base">Tidak ada data jadwal piket</p>
                    <p className="text-xs mt-1 text-center">
                      Klik tombol "Tambah Jadwal Piket" untuk menambahkan data
                      baru
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Form */}
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center p-2 md:p-4 z-50 ">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 md:mx-0 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="bg-red-500 p-3 md:p-4">
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {editMode ? "Edit Jadwal Piket" : "Tambah Jadwal Piket"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-4 md:p-6">
                <div className="mb-3 md:mb-4">
                  <label
                    className="block text-gray-700 mb-1 md:mb-2 text-sm md:font-medium"
                    htmlFor="nis"
                  >
                    NIS
                  </label>
                  <input
                    type="text"
                    id="nis"
                    name="nis"
                    value={formData.nis}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm md:text-base"
                    required
                  />
                </div>
                <div className="mb-3 md:mb-4">
                  <label
                    className="block text-gray-700 mb-1 md:mb-2 text-sm md:font-medium"
                    htmlFor="nama"
                  >
                    Nama Siswa
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm md:text-base"
                    required
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label
                    className="block text-gray-700 mb-1 md:mb-2 text-sm md:font-medium"
                    htmlFor="kelas"
                  >
                    Kelas
                  </label>
                  <input
                    type="text"
                    id="kelas"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm md:text-base"
                    required
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label
                    className="block text-gray-700 mb-1 md:mb-2 text-sm md:font-medium"
                    htmlFor="hari"
                  >
                    Hari
                  </label>
                  <select
                    id="hari"
                    name="hari"
                    value={formData.hari} // Ensure value is not null
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    required
                  >
                    <option value="">Pilih Hari</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 md:space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm md:text-base"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 text-sm md:text-base"
                  >
                    {editMode ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JadwalPiket;
