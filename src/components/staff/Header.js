import { FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useJadwalPiket } from "@/context/JadwalPiketContext";

const Modal = ({ onClose, student }) => {
  if (!student) return null; // Jangan render jika tidak ada data siswa

  return (
    // Backdrop
    <div className="fixed inset-0  flex justify-center items-center z-50 p-4">
      {/* Kartu Modal Utama */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white hover:text-gray-200 text-3xl z-10"
        >
          ×
        </button>

        <div className="bg-red-600 h-24"></div>

        <div className="px-6 pb-8 pt-4">
          <div className="flex flex-col items-center -mt-20">
            <div className="bg-sky-200 rounded-full w-28 h-28 border-4 border-white flex items-center justify-center">
              <FaUser className="w-12 h-12 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold mt-3 text-gray-800">
              Petugas UKS
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {/* Field NIS */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                NIS
              </label>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-gray-700">
                {student.nis}
              </div>
            </div>

            {/* Field Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Nama
              </label>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-gray-700">
                {student.nama}
              </div>
            </div>

            {/* Field Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Kelas
              </label>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-gray-700">
                {student.kelas}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [currentDay, setCurrentDay] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { getJadwalPiketByHari, getJadwalPiketById } = useJadwalPiket();

  useEffect(() => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const date = new Date();
    const dayName = days[date.getDay()];
    setCurrentDay(dayName);

    const options = { year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(date.toLocaleDateString("id-ID", options));

    const fetchSchedule = async () => {
      if (getJadwalPiketByHari) {
        const result = await getJadwalPiketByHari(dayName);
        if (result && result.success) {
          setTodaysSchedule(result.data);
        }
      }
    };

    fetchSchedule();
  }, [getJadwalPiketByHari]);

  const handleIconClick = async (id) => {
    const result = await getJadwalPiketById(id);
    if (result && result.success) {
      setSelectedStudent(result.data);
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white shadow-lg overflow-hidden">
      {/* Konten Teks */}
      <div className="p-8 lg:w-1/2 order-2 lg:order-1">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 lg:mt-16">
            Welcome to <span className="text-black">UKES</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Mari bersama wujudkan lingkungan sekolah yang sehat dan peduli.
          </p>
        </div>

        {/* Date and User Info */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2 lg:my-6">
            {currentDate}
          </div>

          {todaysSchedule.length > 0 ? (
            todaysSchedule.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 mb-2 cursor-pointer"
                onClick={() => handleIconClick(item.id)}
              >
                <div className="p-2 rounded-lg shadow-xl">
                  <FaUser className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">
                    {item.nama}
                  </div>
                  <div className="text-xs text-gray-400">{item.kelas}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">
              Tidak ada jadwal piket untuk hari ini.
            </div>
          )}
        </div>
      </div>

      {/* Div Gambar */}
      <div className="w-full h-64 lg:w-1/2 lg:h-[400px] order-1 lg:order-2">
        <img
          src="/gambar-1-crop.jpg"
          alt="Ruang UKS dengan tempat tidur dan peralatan"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* --- Pemanggilan Modal yang Baru --- */}
      {showModal && selectedStudent && (
        <Modal onClose={() => setShowModal(false)} student={selectedStudent} />
      )}
    </div>
  );
};

export default Header;
