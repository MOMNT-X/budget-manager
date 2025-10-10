import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Shield, Users, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trusted by 50,000+ users
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Take Control of Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Money
                </span>
                , Spend Smarter
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Track income, budget spending, and make smarter financial decisions—all in one place. 
                Join thousands who've transformed their financial future.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">50,000+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">$2M+ Saved Monthly</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Bank-Grade Security</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Dashboard Mockup */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              {/* Mockup Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">Smart Budget</span>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>

              {/* Mockup Content */}
              <div className="space-y-4">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Total Balance</p>
                  <p className="text-2xl font-bold">$12,450.00</p>
                  <p className="text-sm opacity-90">+12.5% from last month</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300">This Month</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">$3,240</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300">Saved</p>
                    <p className="text-lg font-semibold text-green-600">$1,890</p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Recent Transactions</p>
                  <div className="space-y-2">
                    {[
                      { name: 'Grocery Store', amount: '-$45.20', time: '2h ago' },
                      { name: 'Salary', amount: '+$3,200.00', time: '1d ago' },
                      { name: 'Coffee Shop', amount: '-$4.50', time: '2d ago' },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.time}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white font-bold text-sm">+$500</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;