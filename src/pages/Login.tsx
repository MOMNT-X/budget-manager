"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, CheckCircle } from "lucide-react";
import Lottie from "lottie-react";
import financeGuruAnimation from "@/assets/Finance guru.json";
import { BASE_URL } from "@/config/api";

// Utility function to clear all user data
const clearAllUserData = () => {
  // Clear all possible token variations
  localStorage.removeItem("accessToken");
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  
  // Clear user data
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
  localStorage.removeItem("user");
  
  // Clear any other app-specific data that might exist
  localStorage.removeItem("userProfile");
  localStorage.removeItem("bankData");
  localStorage.removeItem("transactions");
  localStorage.removeItem("budget");
  localStorage.removeItem("accountData");
  
  // Clear session storage as well
  sessionStorage.clear();
  
  console.log("🧹 All user data cleared");
};

export default function LoginPage({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowError(false);
    setSuccess(false);
    setShowSuccess(false);

    try {
      // 🧹 Clear any existing user data first to prevent conflicts
      clearAllUserData();

      console.log("📤 Sending login request for:", formData.email);

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📥 Login response:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Store with consistent key names
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.user?.id);
      localStorage.setItem("email", data.user?.email);
      localStorage.setItem("username", data.user?.username);

      console.log("✅ Login successful - User data stored:");
      console.log("- User ID:", data.user?.id);
      console.log("- Email:", data.user?.email);
      console.log("- Username:", data.user?.username);

      setSuccess(true);
      setShowSuccess(true);

      if (onAuthSuccess) onAuthSuccess();

      // Force a complete page reload to ensure fresh state
      setTimeout(() => {
        console.log("🔄 Redirecting to app with fresh state...");
        window.location.href = "/app"; // Force reload instead of navigate
      }, 2000);

    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      setError(err.message);
      setShowError(true);
      // Clear any partial data on error
      clearAllUserData();
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Fade out error after 4 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // ⏳ Fade out success after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Clear any existing data when component mounts
  useEffect(() => {
    console.log("🔄 Login page loaded - clearing any existing user data");
    clearAllUserData();
  }, []);

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}>
          <div className="bg-white/95 backdrop-blur-xl border border-red-200 rounded-2xl shadow-2xl px-6 py-4 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Login Error</p>
                <p className="text-sm text-gray-600 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {success && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          showSuccess ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}>
          <div className="bg-white/95 backdrop-blur-xl border border-green-200 rounded-2xl shadow-2xl px-6 py-4 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Welcome back! 🎉</p>
                <p className="text-sm text-gray-600 mt-0.5">Login successful. Redirecting...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        {/* Base gradient background layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
        
        {/* Animated blob background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        {/* Blur overlay - creates frosted glass effect */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-blue-600/60 via-indigo-700/60 to-purple-800/60"></div>
        
        {/* Additional blur layer for stronger effect */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-white w-full">
          {/* Animation */}
          <div className="w-full max-w-lg mb-8">
            <Lottie 
              animationData={financeGuruAnimation} 
              loop={true}
              className="w-full h-auto"
            />
          </div>
          
          <div className="w-full max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Shield className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Secure & Trusted</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Welcome Back,<br />
              <span className="bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Smart Spender
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg mx-auto">
              Continue managing your finances with real-time insights and smart budgeting tools.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="relative flex items-center justify-center min-h-screen lg:w-1/2 p-6 z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/50">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Access your financial dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white group-hover:border-gray-300"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white group-hover:border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-sm text-center text-gray-600 pt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Sign Up
              </a>
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 mt-4">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Your data is encrypted with <strong>256-bit SSL</strong></span>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}