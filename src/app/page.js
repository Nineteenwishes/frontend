"use client";
import React, { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
      setError("Terjadi kesalahan saat login, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="w-full h-64 md:h-auto md:w-[45%] lg:w-1/2 relative">
        <Image
          src="/smk-telkom-makassar.png"
          alt="SMK Telkom Makassar"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full md:w-[55%] lg:w-1/2 flex flex-grow items-center justify-center p-6 sm:p-12 relative">
        <div
          className="absolute inset-0 bg-repeat opacity-40"
          style={{ backgroundImage: "url('/dots-pattern.svg')" }}
        ></div>
        <div className="w-full max-w-sm z-10">
          {/* Logo dan Judul - Mobile: flex, Desktop: block */}
          <div className="md:block flex items-center mb-8 md:mb-12">
            <div className="md:mb-4 mr-4 md:mr-0">
              <Image
                src="/logo-ukes.png"
                alt="UKES Logo"
                width={50}
                height={50}
              />
            </div>
            <h1 className="text-3xl sm:text-4xl text-gray-800">
              Welcome to <span className="font-bold">UKES</span>
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Input Username dengan Ikon di Kanan */}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="text-red-500 text-xs font-semibold"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full mt-1 px-4 py-3 pr-12 bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Input Password dengan Ikon Mata */}
            <div className="mb-8">
              <label
                htmlFor="password"
                className="text-red-500 text-xs font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-3 pr-12 bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 active:bg-red-700 transform hover:scale-105"
              }`}
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/reset-password"
              className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors duration-200"
            >
              Lupa Kata Sandi?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}