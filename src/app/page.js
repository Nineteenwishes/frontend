"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function HealthcareLoginPage() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    <>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Log In</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Username"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
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
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Password"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Login button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-red-500 text-white py-2 px-4 rounded 
                ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-600"
                } 
                transition duration-300 mb-4 flex items-center justify-center`}
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
                  Memproses...
                </>
              ) : (
                "MASUK"
              )}
            </button>
          </div>
        </div>

        {/* Right side - Image/Logo */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-red-500 to-red-600 p-8 lg:flex items-center justify-center">
          <div className="w-full max-w-md flex flex-col items-center justify-center">
            <div className="bg-white/10 rounded-lg p-16 mb-8">
              <svg
                className="w-24 h-24 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22L3 17V7L12 2L21 7V17L12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22L12 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12L3 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12L21 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">MedCare</h1>
              <p className="text-red-100 mt-2">
                Sistem Informasi Kesehatan Terpadu
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Version Logo - Only visible on mobile */}
        <div className="md:hidden absolute top-4 left-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-lg mr-2">
              <Activity size={24} className="text-white" />
            </div>
            <span className="font-bold text-gray-800">MedCare</span>
          </div>
        </div>
      </div>
    </>
  );
}
