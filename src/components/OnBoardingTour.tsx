"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Wallet, TrendingUp, Bell, Target, Sparkles } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Wallet! 🎉",
    description: "This is your financial command center. Here you can view your balance, add funds, and track all your transactions in real-time.",
    icon: <Wallet className="w-8 h-8 text-blue-500" />,
  },
  {
    id: "add-money",
    title: "Fund Your Wallet",
    description: "Click the 'Add Money' button to deposit funds into your wallet. You can use your linked bank account or card for instant transfers.",
    icon: <TrendingUp className="w-8 h-8 text-green-500" />,
    action: "Try adding your first deposit!",
  },
  {
    id: "budgets",
    title: "Create Budgets",
    description: "Set spending limits for different categories like Food, Transport, and Entertainment. We'll help you stay on track with smart alerts.",
    icon: <Target className="w-8 h-8 text-purple-500" />,
    action: "Navigate to 'Budgets' to get started",
  },
  {
    id: 'pay-bills',
    title: "Pay Bills Easily",
    description: "Use the 'Pay Bills' tab to manage and pay your daily, weekly and monthly bills directly from your wallet. Set up auto-pay to never miss a due date.",
    icon: <ArrowRight className="w-8 h-8 text-pink-500" />,
    action: "Go to 'Bills' to set up your first payment",
  },
  {
    id: "notifications",
    title: "Stay Informed",
    description: "Click the bell icon in the top right to view transaction alerts, budget warnings, and bill reminders. Never miss an important update!",
    icon: <Bell className="w-8 h-8 text-amber-500" />,
  },
];

export default function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has seen the onboarding tour
    const hasSeenTour = localStorage.getItem("hasSeenOnboardingTour");
    const isNewUser = localStorage.getItem("isNewUser");

    // Show tour only for new users who haven't seen it
    if (isNewUser === "true" && !hasSeenTour) {
      // Small delay for page transition to complete
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    // Mark tour as seen
    localStorage.setItem("hasSeenOnboardingTour", "true");
    localStorage.removeItem("isNewUser");
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenOnboardingTour", "true");
    localStorage.removeItem("isNewUser");
  };

  if (!isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Onboarding card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg px-4">
        <div
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
          }`}
        >
          {/* Header with close button */}
          <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              aria-label="Close onboarding"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                {currentStepData.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Quick Start Guide
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {currentStepData.description}
            </p>

            {currentStepData.action && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  {currentStepData.action}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                        : index < currentStep
                        ? "w-2 bg-green-500"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {currentStep < onboardingSteps.length - 1 ? (
                  <>
                    <button
                      onClick={handleSkip}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                      Skip Tour
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Get Started
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Step counter */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Step {currentStep + 1} of {onboardingSteps.length}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}