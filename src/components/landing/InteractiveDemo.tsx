import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';

const InteractiveDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: 'Connect Your Accounts',
      description: 'Securely link your bank accounts and credit cards in seconds',
      mockup: 'account-connection',
    },
    {
      title: 'Set Your Budget',
      description: 'Create personalized budgets for different spending categories',
      mockup: 'budget-setup',
    },
    {
      title: 'Track Spending',
      description: 'Monitor your expenses in real-time with smart categorization',
      mockup: 'spending-tracking',
    },
    {
      title: 'Achieve Goals',
      description: 'Watch your savings grow and reach your financial milestones',
      mockup: 'goal-achievement',
    },
  ];

  const toggleDemo = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate demo progression
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= demoSteps.length - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    }
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Demo Controls */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                See Smart Budget in Action
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Watch how easy it is to take control of your finances with our intuitive interface and powerful features.
              </p>
            </div>

            {/* Demo Steps */}
            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    index === currentStep
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index === currentStep
                          ? 'bg-blue-500 text-white'
                          : index < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Controls */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleDemo}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
              >
                {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                {isPlaying ? 'Pause Demo' : 'Play Demo'}
              </Button>
              <Button
                variant="outline"
                onClick={resetDemo}
                className="px-6 py-3"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>

            <div className="pt-4">
              <Button
                variant="link"
                className="text-blue-600 dark:text-blue-400 p-0 h-auto font-semibold"
              >
                Try the full app in your browser
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column - Demo Visual */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              {/* Demo Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">Smart Budget</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Demo Content based on current step */}
              <div className="space-y-4">
                {currentStep === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect Your Bank</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Securely link your accounts</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Connecting...</p>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Set Your Budget</h3>
                    <div className="space-y-3">
                      {['Food & Dining', 'Transportation', 'Entertainment', 'Shopping'].map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">$500</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Track Spending</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Grocery Store', amount: '$45.20', category: 'Food' },
                        { name: 'Gas Station', amount: '$32.50', category: 'Transport' },
                        { name: 'Netflix', amount: '$15.99', category: 'Entertainment' },
                      ].map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                          </div>
                          <span className="text-sm font-semibold text-red-600">{transaction.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achieve Goals</h3>
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
                      <p className="text-sm opacity-90">Emergency Fund</p>
                  <p className="text-2xl font-bold">$2,450 / $5,000</p>
                      <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-1/2"></div>
                      </div>
                      <p className="text-sm opacity-90 mt-1">49% Complete</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Success Message */}
            {currentStep > 0 && (
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                ✓ Connected!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;