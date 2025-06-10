"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        // Cek role user dan arahkan ke halaman yang sesuai
        if (result.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (result.user.role === "staff") {
          router.push("/staff/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(result.message || "Username atau password salah");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header dengan Logo - Visible hanya di mobile/tablet */}
      <div className="md:hidden bg-white shadow-sm relative z-10">
        <div className="flex items-center justify-center py-4 px-4">
          <Image
            src="/Logo ukes.png"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="font-bold text-gray-800 text-xl">Ukes</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row-reverse min-h-screen md:min-h-screen">
        {/* Login Form Section - Kanan di desktop, atas di mobile */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md">
            {/* Logo untuk Desktop - Hidden di mobile */}
            <div className="hidden md:flex items-center justify-center mb-8">
              <Image
                src="/Logo ukes.png"
                alt="Logo"
                width={48}
                height={48}
                className="mr-3"
              />
              <span className="font-bold text-gray-800 text-2xl">Ukes</span>
            </div>

            {/* Header Text */}
            <div className="text-center md:text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                LogIn
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Silakan masuk ke akun Anda
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div className="mb-5">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                placeholder="Masukkan username Anda"
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                  placeholder="Masukkan password Anda"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-300 text-sm sm:text-base mb-4
                ${
                  loading
                    ? "opacity-70 cursor-not-allowed bg-red-500"
                    : "bg-red-500 hover:bg-red-600 active:bg-red-700 transform hover:scale-[1.02] active:scale-[0.98]"
                } 
                flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memproses...
                </>
              ) : (
                "MASUK"
              )}
            </button>

            {/* Additional Links */}
            <div className="text-center text-sm">
              <a href="/reset-password" className="text-red-600 hover:underline">
                Lupa Kata Sandi?
              </a>
            </div>
          </div>
        </div>

        {/* Image Section - Kiri di desktop, hidden di mobile */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <Image
            src="/login.png"
            alt="Login Image"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
          {/* Optional: Overlay gradient untuk readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}