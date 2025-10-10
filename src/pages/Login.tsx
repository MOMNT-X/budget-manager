"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 relative px-4">
      {/* Error Modal */}
      {error && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
            showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="bg-white border-l-4 border-red-500 rounded-r-xl shadow-2xl px-6 py-4 max-w-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Login Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div
          className={`absolute top-6 w-full max-w-md mx-auto z-10 transition-opacity duration-700 ${
            showSuccess ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md">
            <strong className="font-semibold">Welcome!</strong> Login successful. Redirecting...
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in...
              </div>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-sm text-center text-gray-600 mt-6">
                  Don't have an account yet?{" "}
                  <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Sign Up
                  </a>
                </p>
        </form>
      </div>
    </div>
  );
}