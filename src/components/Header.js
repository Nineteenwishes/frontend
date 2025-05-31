import { Users, Calendar } from "lucide-react";
import Image from "next/image";

const Header = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="md:w-2/3 mb-6 md:mb-0">
        <div className="flex items-center mb-4">
          <span className="bg-yellow-400 p-1 rounded-full mr-2">
            <span className="sr-only">Logo</span>
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
          <h1 className="text-xl font-bold text-gray-900">Welcome to MedCheck <span className="text-yellow-400">✨</span></h1>
        </div>
        <p className="text-sm text-gray-600 mb-4">Sistem informasi digital untuk Unit Kesehatan Sekolah</p>
        <div className="flex space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <div className="p-1 bg-red-100 rounded-full mr-2">
              <Users className="w-4 h-4 text-red-500" />
            </div>
            <span>Jumlah Siswa: 1,250</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="p-1 bg-blue-100 rounded-full mr-2">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <span>Kunjungan Hari Ini: 8</span>
          </div>
        </div>
      </div>
      <div className="md:w-1/3">
        <Image src="/pict-1.jpg" alt="Logo" width={200} height={200} />
      </div>
    </div>
  </div>
);

export default Header;