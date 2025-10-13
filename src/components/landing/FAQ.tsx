"use client";

import { useState } from "react";
import { Shield, Zap, TrendingUp, Globe, Bell, CreditCard, Lock, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

type QA = { 
  q: string; 
  a: string;
  icon: React.ReactNode;
  highlight?: string;
  badge?: string;
};

const faqs: QA[] = [
  {
    q: "Is Smart Budget free to use?",
    a: "Absolutely! Start with our robust free tier featuring unlimited budgets, real-time expense tracking, and goal management. No credit card required, no hidden fees. When you're ready to supercharge your financial journey with AI-powered insights, automated savings, and advanced analytics, upgrade seamlessly to unlock premium features.",
    icon: <Sparkles className="w-5 h-5 text-purple-500" />,
    badge: "Free Forever",
    highlight: "No credit card required"
  },
  {
    q: "How do I connect my bank accounts?",
    a: "Connect in seconds using Nigeria's leading payment infrastructure, Paystack. Your account links securely through bank-grade encryption with multi-factor authentication. We never store your banking passwords—only read-only access to transactions. Supports all major Nigerian banks including Access, GTBank, UBA, Zenith, and 20+ more. Disconnect anytime with one tap.",
    icon: <CreditCard className="w-5 h-5 text-blue-500" />,
    highlight: "256-bit encryption",
    badge: "Instant Setup"
  },
  {
    q: "What happens if I exceed my budget?",
    a: "Think of it as your financial coach, not a strict parent. Get instant smart alerts via push notifications and email the moment you're approaching limits. Our AI analyzes your spending patterns and suggests actionable tweaks—like shifting ₦5,000 from dining to transport. You'll see personalized recovery plans, alternative spending strategies, and motivational milestones to get back on track without the guilt.",
    icon: <Bell className="w-5 h-5 text-amber-500" />,
    highlight: "AI-powered insights",
    badge: "Smart Alerts"
  },
  {
    q: "How secure is my financial data?",
    a: "Security isn't just a feature—it's our foundation. Your data is protected by military-grade AES-256 encryption, the same standard used by banks and government agencies. We're PCI-DSS compliant, conduct regular third-party security audits, and employ real-time fraud detection. Your information is never sold, never shared with advertisers, and you maintain complete ownership. Plus, two-factor authentication and biometric login options keep your account locked tight.",
    icon: <Shield className="w-5 h-5 text-green-500" />,
    highlight: "Bank-grade security",
    badge: "Certified Secure"
  },
  {
    q: "Can Smart Budget help me save automatically?",
    a: "Meet your personal savings assistant. Our intelligent algorithm analyzes your spending patterns, income cycles, and financial goals to automatically set aside money you won't even miss. Start with micro-savings—as little as ₦100 daily—or use our 'Round-Up' feature that rounds purchases to the nearest ₦100 and saves the difference. Watch your emergency fund grow from ₦0 to ₦50,000 in 6 months without lifestyle sacrifice. Set it, forget it, and watch your wealth grow.",
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    highlight: "Save while you spend",
    badge: "Auto-Save"
  },
  {
    q: "Does Smart Budget work with multiple currencies?",
    a: "Built for the global Nigerian. Track expenses in Naira (₦), Dollars ($), Euros (€), Pounds (£), and 50+ other currencies simultaneously. Perfect for freelancers earning in USD, students studying abroad, or businesses with international transactions. Real-time exchange rates update every hour, and our smart categorization works across all currencies. See your complete financial picture in your preferred currency with automatic conversions and historical rate tracking.",
    icon: <Globe className="w-5 h-5 text-indigo-500" />,
    highlight: "50+ currencies",
    badge: "Global Ready"
  },
  {
    q: "What makes Smart Budget different from other apps?",
    a: "We're built by Nigerians, for Nigerians. Unlike foreign apps that don't understand sallah savings, owambe budgets, or December madness, we get your financial culture. Combine that with AI-powered insights, automatic bill reminders for NEPA, DStv, and data subscriptions, plus integration with local payment methods like Paystack and Flutterwave. We're not just tracking naira and kobo—we're helping you build generational wealth with tools designed for your reality.",
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    highlight: "Made for Nigeria",
    badge: "Local + Smart"
  },
  {
    q: "Can I share budgets with family or roommates?",
    a: "Financial teamwork made easy. Create shared budgets for rent, groceries, utilities, or vacation funds. Invite family members or roommates, set spending permissions, and track contributions in real-time. Everyone sees the same dashboard, gets the same alerts, and can add expenses. Perfect for couples managing household finances, siblings planning family gifts, or roommates splitting bills. Split expenses fairly with automatic calculation and built-in transparency.",
    icon: <CheckCircle className="w-5 h-5 text-pink-500" />,
    highlight: "Collaborative finance",
    badge: "Coming Soon"
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Got Questions?
          </div>
          <h2 className="text-3xl font-bold md:text-5xl bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
            Everything You Need to Know
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Your questions answered. Your money mastered.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="mx-auto max-w-4xl space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              className={`group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:border-purple-200 ${
                openIndex === index ? "ring-2 ring-purple-500/20 shadow-lg" : ""
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                      openIndex === index 
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110" 
                        : "bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-purple-100 group-hover:to-pink-100"
                    }`}>
                      <div className={openIndex === index ? "text-white" : "text-slate-600 group-hover:text-purple-600"}>
                        {faq.icon}
                      </div>
                    </div>

                    {/* Question */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {faq.q}
                        </h3>
                        {faq.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            {faq.badge}
                          </span>
                        )}
                      </div>
                      {faq.highlight && !openIndex && (
                        <p className="text-sm text-purple-600 font-medium">
                          {faq.highlight}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index 
                      ? "bg-purple-100 rotate-45" 
                      : "bg-slate-100 group-hover:bg-purple-50"
                  }`}>
                    <span className={`text-xl font-light transition-colors ${
                      openIndex === index ? "text-purple-600" : "text-slate-400 group-hover:text-purple-500"
                    }`}>
                      +
                    </span>
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-16 pr-4">
                    <div className="relative">
                      <div className="absolute -left-14 top-0 w-0.5 h-full bg-gradient-to-b from-purple-500 to-transparent" />
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                        {faq.a}
                      </p>
                      {faq.highlight && (
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-600">
                          <CheckCircle className="w-4 h-4" />
                          {faq.highlight}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Hover gradient effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}