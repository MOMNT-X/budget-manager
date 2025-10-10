import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Star, Zap } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started with basic budgeting',
      price: { monthly: 0, annual: 0 },
      period: 'forever',
      features: [
        'Basic budget tracking',
        'Up to 3 bank accounts',
        'Transaction categorization',
        'Basic spending insights',
        'Mobile app access',
        'Email support'
      ],
      limitations: [
        'Limited to 1 year of history',
        'Basic reporting only',
        'No advanced analytics'
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Pro',
      description: 'Advanced features for serious budgeters',
      price: { monthly: 9.99, annual: 99.99 },
      period: 'month',
      features: [
        'Everything in Free',
        'Unlimited bank accounts',
        'Advanced analytics & insights',
        'Goal tracking & milestones',
        'Bill reminders & alerts',
        'Data export & reports',
        'Priority support',
        'Dark mode',
        'Custom categories',
        'Investment tracking',
        'Tax preparation tools',
        'Family sharing (up to 5 users)'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true,
      color: 'blue'
    },
    {
      name: 'Enterprise',
      description: 'For teams and organizations',
      price: { monthly: 29.99, annual: 299.99 },
      period: 'month',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Advanced reporting & analytics',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Custom branding',
        'API access',
        'Advanced security features',
        'Compliance reporting',
        'Training & onboarding',
        '24/7 phone support'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      color: 'purple'
    }
  ];

  const savings = [
    { feature: 'Bank-grade security', available: true },
    { feature: '256-bit encryption', available: true },
    { feature: 'SOC 2 compliant', available: true },
    { feature: 'GDPR compliant', available: true },
    { feature: 'Regular security audits', available: true },
    { feature: 'Data never sold', available: true }
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. All plans include our core budgeting features and bank-grade security.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isAnnual
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative group hover:shadow-xl transition-all duration-300 ${
                plan.popular 
                  ? 'border-2 border-blue-500 dark:border-blue-400 shadow-lg scale-105' 
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </CardDescription>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    /{plan.period}
                  </span>
                  {isAnnual && plan.price.annual > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Save ${(plan.price.monthly * 12 - plan.price.annual).toFixed(2)}/year
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start space-x-3">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 text-lg font-semibold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : plan.name === 'Free'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                  {plan.popular && <Zap className="ml-2 h-5 w-5" />}
                </Button>

                {/* Additional Info */}
                {plan.name === 'Free' && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    No credit card required
                  </p>
                )}
                {plan.name !== 'Free' && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Cancel anytime • 30-day money-back guarantee
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Features */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your data is always secure
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All plans include enterprise-grade security and privacy protection
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {savings.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Questions about pricing?
          </p>
          <Button variant="outline" className="mr-4">
            View FAQ
          </Button>
          <Button variant="link" className="text-blue-600 dark:text-blue-400">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;