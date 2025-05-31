"use client"
import React, { useState } from 'react';
import { 
  Activity, 
  User, 
  Calendar, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  Users, 
  Heart, 
  TrendingUp, 
  BarChart2, 
  Clipboard
} from 'lucide-react';

function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={18} /> },
    { id: 'patients', label: 'Pasien', icon: <Users size={18} /> },
    { id: 'appointments', label: 'Janji Medis', icon: <Calendar size={18} /> },
    { id: 'health-records', label: 'Rekam Medis', icon: <FileText size={18} /> },
    { id: 'analytics', label: 'Analitik', icon: <BarChart2 size={18} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={18} /> },
  ];

  const dashboardStats = [
    { label: 'Total Pasien', value: '1,248', icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Janji Hari Ini', value: '42', icon: <Calendar size={24} />, color: 'bg-teal-500' },
    { label: 'Penilaian Pasien', value: '4.8/5', icon: <Heart size={24} />, color: 'bg-rose-500' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 86,4jt', icon: <TrendingUp size={24} />, color: 'bg-emerald-500' },
  ];

  const patientAppointments = [
    { name: 'Andi Susanto', time: '09:00', type: 'Pemeriksaan Rutin', doctor: 'dr. Maya Putri', status: 'Selesai' },
    { name: 'Dewi Lestari', time: '10:30', type: 'Konsultasi', doctor: 'dr. Budi Santoso', status: 'Sedang Berlangsung' },
    { name: 'Rudi Hermawan', time: '13:00', type: 'Tes Laboratorium', doctor: 'dr. Siti Aminah', status: 'Menunggu' },
    { name: 'Fitriani Sari', time: '14:15', type: 'Vaksinasi', doctor: 'dr. Maya Putri', status: 'Menunggu' },
    { name: 'Bagus Prakoso', time: '15:45', type: 'Pemeriksaan Gigi', doctor: 'drg. Ahmad Fajar', status: 'Menunggu' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>
            <p className="text-gray-500">Selamat datang kembali, dr. Rini!</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pasien, dokter, atau layanan..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-gray-700 text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Appointments Section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-300 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Janji Medis Hari Ini</h3>
              <button className="text-teal-500 hover:text-teal-600 text-sm font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Pasien</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Waktu</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tipe</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dokter</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientAppointments.map((appointment, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{appointment.name}</td>
                        <td className="py-3 px-4 text-sm">{appointment.time}</td>
                        <td className="py-3 px-4 text-sm">{appointment.type}</td>
                        <td className="py-3 px-4 text-sm">{appointment.doctor}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'Selesai' 
                              ? 'bg-blue-100 text-blue-600' 
                              : appointment.status === 'Sedang Berlangsung' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-amber-100 text-amber-600'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-300 p-4">
                <h3 className="font-semibold text-gray-700">Grafik Kunjungan Pasien</h3>
              </div>
              <div className="p-4 flex items-center justify-center h-64">
                <div className="flex items-end space-x-2 h-48">
                  <div className="w-8 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t h-24"></div>
                  <div className="w-8 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t h-32"></div>
                  <div className="w-8 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t h-40"></div>
                  <div className="w-8 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t h-20"></div>
                  <div className="w-8 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t h-36"></div>
                  <div className="w-8 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t h-28"></div>
                  <div className="w-8 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t h-44"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-300 p-4">
                <h3 className="font-semibold text-gray-700">Tugas Hari Ini</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" />
                    <span className="text-gray-600">Review hasil lab pasien Andi Susanto</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" />
                    <span className="text-gray-600">Persiapan presentasi kasus untuk rapat staff</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" />
                    <span className="text-gray-600">Follow-up dengan dr. Budi tentang rujukan pasien</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" />
                    <span className="text-gray-600">Tanda tangani dokumen BPJS pasien baru</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
    
    </div>
  );
}

export default Dashboard;