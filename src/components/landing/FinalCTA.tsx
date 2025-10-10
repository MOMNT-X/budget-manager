import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star, Users, Shield } from 'lucide-react';

const FinalCTA = () => {
  const benefits = [
    'Start budgeting in under 2 minutes',
    'No credit card required for free plan',
    'Bank-grade security & encryption',
    'Works on all devices & platforms',
    '30-day money-back guarantee'
  ];

  const socialProof = [
    { icon: Users, text: '50,000+ active users' },
    { icon: Star, text: '4.9/5 average rating' },
    { icon: Shield, text: 'Bank-level security' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Start managing your money the{' '}
            <span className="text-yellow-300">smart way</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            Join thousands who budget with confidence. Take control of your financial future today.
          </p>

          {/* Benefits List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-white font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {socialProof.map((proof, index) => {
              const IconComponent = proof.icon;
              return (
                <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <IconComponent className="h-5 w-5 text-yellow-300" />
                  <span className="text-white font-medium">{proof.text}</span>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-blue-200 text-sm mb-4">
              Trusted by users worldwide • No hidden fees • Cancel anytime
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-blue-200 text-sm">
              <span>✓ 256-bit SSL encryption</span>
              <span>✓ SOC 2 certified</span>
              <span>✓ GDPR compliant</span>
              <span>✓ 30-day guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg animate-bounce">
        <span className="text-blue-600 font-bold text-sm">$500</span>
      </div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-300 rounded-full flex items-center justify-center shadow-lg animate-pulse">
        <CheckCircle className="h-6 w-6 text-white" />
      </div>
    </section>
  );
};

export default FinalCTA;