"use client";
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, CreditCard, Building, CheckCircle, Sparkles, Shield, TrendingUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import manageMoneyAnimation from "@/assets/Manage Money.json";
import banks from "../components/banks";
import { BASE_URL } from "@/config/api";

// Utility function to clear all user data
const clearAllUserData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
  localStorage.removeItem("user");
  localStorage.removeItem("userProfile");
  localStorage.removeItem("bankData");
  localStorage.removeItem("transactions");
  localStorage.removeItem("budget");
  localStorage.removeItem("accountData");
  localStorage.removeItem("hasSeenOnboardingTour");
  localStorage.removeItem("isNewUser");
  sessionStorage.clear();
  console.log("🧹 All user data cleared");
};

export default function SignupPage({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "bankName") {
      const selectedBank = banks.find((bank) => bank.name === value);
      setFormData((prev) => ({
        ...prev,
        bankName: value,
        bankCode: selectedBank?.code || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.username && formData.email && formData.password;
  const isStep2Valid = formData.accountNumber && formData.bankName && formData.bankCode;

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowError(false);
    setShowSuccess(false);

    try {
      clearAllUserData();
      const requestData = { ...formData, bankName: formData.bankName, bankCode: formData.bankCode };
      console.log("📤 Sending signup request...", { email: requestData.email, username: requestData.username });

      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      console.log("📥 Signup response:", data);
      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.user?.id);
      localStorage.setItem("email", data.user?.email);
      localStorage.setItem("username", data.user?.username);

      console.log("✅ Signup successful - New user data stored");
      setSuccess("Account created successfully!");
      setShowSuccess(true);
      if (onAuthSuccess) onAuthSuccess();

      setTimeout(() => {
        console.log("🔄 Redirecting to wallet with fresh state...");
        window.location.href = "/app/wallet";
      }, 2000);
    } catch (err: any) {
      console.error("❌ Signup error:", err.message);
      setError(err.message);
      setShowError(true);
      clearAllUserData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    console.log("🔄 Signup page loaded - clearing any existing user data");
    clearAllUserData();
  }, []);

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
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
                <p className="text-sm font-bold text-gray-900">Oops! Something went wrong</p>
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
                <p className="text-sm font-bold text-gray-900">Welcome aboard, {formData.firstName}! 🎉</p>
                <p className="text-sm text-gray-600 mt-0.5">{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Base gradient background layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        
        {/* Animated blob background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        {/* Blur overlay - creates frosted glass effect */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-pink-900/60"></div>
        
        {/* Additional blur layer for stronger effect */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-white w-full">
          {/* Animation */}
          <div className="w-full max-w-lg mb-8">
            <Lottie 
              animationData={manageMoneyAnimation} 
              loop={true}
              className="w-full h-auto"
            />
          </div>
          
          <div className="w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Trusted by 50,000+ users</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Your Money,<br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Smarter Decisions
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-lg">
            Take complete control of your finances with AI-powered insights, automated budgeting, and real-time tracking.
          </p>

          {/* <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Bank-Level Security</h3>
                <p className="text-sm text-white/75">256-bit encryption protects your data</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Smart Analytics</h3>
                <p className="text-sm text-white/75">AI-powered spending insights</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Instant Sync</h3>
                <p className="text-sm text-white/75">Real-time bank account integration</p>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="relative flex items-center justify-center min-h-screen lg:w-1/2 p-6 z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/50">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Join Smart Budget</h1>
            <p className="text-gray-600">Start your journey to financial freedom</p>
          </div>

          {/* Enhanced Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center flex-1">
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  step >= 1 ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-110" : "bg-gray-200 text-gray-500"
                }`}>
                  {step > 1 ? <CheckCircle className="w-6 h-6" /> : "1"}
                  {step === 1 && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50 animate-ping"></div>
                  )}
                </div>
                <div className="relative flex-1 h-2 mx-4">
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ${
                    step >= 2 ? "w-full" : "w-0"
                  }`}></div>
                </div>
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  step >= 2 ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-110" : "bg-gray-200 text-gray-500"
                }`}>
                  2
                  {step === 2 && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50 animate-ping"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className={step >= 1 ? "text-indigo-600" : "text-gray-400"}>Personal Info</span>
              <span className={step >= 2 ? "text-indigo-600" : "text-gray-400"}>Bank Details</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white group-hover:border-gray-300"
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white group-hover:border-gray-300"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white group-hover:border-gray-300"
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white group-hover:border-gray-300"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white group-hover:border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        formData.password.length >= i * 3 
                          ? formData.password.length >= 12 
                            ? "bg-green-500" 
                            : formData.password.length >= 8 
                              ? "bg-yellow-500" 
                              : "bg-red-500"
                          : "bg-gray-200"
                      }`}></div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStep1Valid}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue to Banking →
                </button>

                <p className="text-sm text-center text-gray-600 pt-4">
                  Already have an account?{" "}
                  <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                    Sign In
                  </a>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Bank Account Number"
                    required
                    value={formData.accountNumber}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white group-hover:border-gray-300"
                  />
                </div>

                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <select
                    name="bankName"
                    required
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white appearance-none cursor-pointer group-hover:border-gray-300"
                  >
                    <option value="">Select Your Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.name}>{bank.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {formData.bankCode && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 animate-in fade-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Bank Code</p>
                        <p className="text-lg font-bold text-gray-900">{formData.bankCode}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700 font-bold hover:border-gray-300"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !isStep2Valid}
                    className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white py-4 rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      "Create My Account 🚀"
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 mt-4">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Your data is encrypted with <strong>256-bit SSL</strong></span>
                </div>
              </div>
            )}
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
        
        /* Blur overlay effect for left hero section */
        .blur-overlay {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4));
        }
      `}</style>
    </div>
  );
}