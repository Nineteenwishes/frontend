import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useJadwalPiket } from "@/context/JadwalPiketContext";

const Header = () => {
  const [currentDay, setCurrentDay] = useState("");
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const { getJadwalPiketByHari } = useJadwalPiket();

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

    const fetchSchedule = async () => {
      const result = await getJadwalPiketByHari(dayName);
      if (result.success) {
        setTodaysSchedule(result.data);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="relative bg-white shadow-lg overflow-hidden">
      {/* Left Content */}
      <div className="relative z-10 p-8 lg:w-1/2">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-black">UKES</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Mari bersama wujudkan lingkungan sekolah yang sehat dan peduli.
          </p>
        </div>

        {/* Date and User Info */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Jadwal Piket Hari {currentDay}
          </div>
          {todaysSchedule.length > 0 ? (
            todaysSchedule.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="w-5 h-5 text-red-600" />
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
            <div className="text-sm text-gray-500">Tidak ada jadwal piket untuk hari ini.</div>
          )}
        </div>
      </div>

      {/* Right Image */}
      <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
        <img
          src="/gambar-1-crop.jpg"
          alt="Medical room with hospital bed and equipment"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
