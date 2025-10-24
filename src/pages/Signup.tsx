"use client";
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, CreditCard, Building, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import banks from "../components/banks";
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

    localStorage.removeItem("hasSeenOnboardingTour");
  localStorage.removeItem("isNewUser");
  
  // Clear session storage as well
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "bankName") {
      const selectedBank = banks.find((bank) => bank.name === value);
      setFormData((prev) => ({
        ...prev,
        bankName: value,
        bankCode: selectedBank?.code || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
      // 🧹 Clear any existing user data first to prevent conflicts
      clearAllUserData();

      const requestData = {
        ...formData,
        bankName: formData.bankName,
        bankCode: formData.bankCode,
      };

      console.log("📤 Sending signup request...", { email: requestData.email, username: requestData.username });

      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      console.log("📥 Signup response:", data);

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // ✅ Store with consistent key names (using access_token to match login)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.user?.id);
      localStorage.setItem("email", data.user?.email);
      localStorage.setItem("username", data.user?.username);

      console.log("✅ Signup successful - New user data stored:");
      console.log("- User ID:", data.user?.id);
      console.log("- Email:", data.user?.email);
      console.log("- Username:", data.user?.username);

      setSuccess("Account created successfully!");
      setShowSuccess(true);

      if (onAuthSuccess) onAuthSuccess();

      // Force a complete page reload to ensure fresh state
      setTimeout(() => {
        console.log("🔄 Redirecting to wallet with fresh state...");
        window.location.href = "/app/wallet"; // Force reload instead of navigate
      }, 2000);

    } catch (err: any) {
      console.error("❌ Signup error:", err.message);
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

  // ⏳ Fade out success after 4 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Clear any existing data when component mounts
  useEffect(() => {
    console.log("🔄 Signup page loaded - clearing any existing user data");
    clearAllUserData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                <p className="text-sm font-medium text-red-800">Signup Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
            showSuccess ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="bg-white border-l-4 border-green-500 rounded-r-xl shadow-2xl px-6 py-4 max-w-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Welcome, {formData.firstName}!</p>
                <p className="text-sm text-green-600">{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0">
          <img
            src="/image/signup.jpg"
            alt="Mountain lake with moon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/60 to-indigo-900/80"></div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Welcome to<br />
            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Smart Budget
            </span>
          </h1>
          <p className="text-xl max-w-md leading-relaxed opacity-90">
            Take control of your finances and achieve your dreams with our intelligent budgeting platform.
          </p>
          <div className="mt-8 flex items-center space-x-4 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Bank Integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Signup form */}
      <div className="flex items-center justify-center min-h-screen lg:w-1/2 p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join thousands managing their finances</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step >= 1 ? "bg-blue-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
              }`}>
                1
              </div>
              <div className={`flex-1 h-2 mx-3 rounded-full transition-all duration-300 ${
                step >= 2 ? "bg-blue-500" : "bg-gray-200"
              }`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step >= 2 ? "bg-blue-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
              }`}>
                2
              </div>
            </div>
            <span className="ml-4 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono">
              STEP {step}/2
            </span>
          </div>

          {/* Step Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {step === 1 ? "Personal Information" : "Banking Details"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 ? "Tell us about yourself" : "Connect your bank account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900 w-5 h-5" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900 w-5 h-5" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password... must be at least 6 characters"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStep1Valid}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Continue  →
                </button>

                <p className="text-sm text-center text-gray-600 mt-6">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Sign In
                  </a>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Bank Account Number"
                    required
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                  <select
                    name="bankName"
                    required
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select Your Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {formData.bankCode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Bank Code:</span> {formData.bankCode}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !isStep2Valid}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center mt-4 bg-gray-50 rounded-lg p-3">
                  <Lock className="w-4 h-4 inline mr-1 " />
                  Your banking information is encrypted and secure
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}