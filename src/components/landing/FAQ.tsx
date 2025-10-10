import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: 'Is Smart Budget free to use?',
      answer: 'Yes! Smart Budget offers a free plan with basic budgeting features, transaction tracking, and up to 3 bank accounts. Our Pro plan ($9.99/month) includes advanced features like unlimited accounts, goal tracking, and priority support.'
    },
    {
      question: 'Can I connect my bank accounts securely?',
      answer: 'Absolutely! We use bank-grade 256-bit SSL encryption and partner with Plaid, a trusted financial data provider used by major banks. Your login credentials are never stored on our servers, and we never have access to your money.'
    },
    {
      question: 'What happens if I go over budget?',
      answer: 'Smart Budget will send you real-time notifications when you\'re approaching or exceeding your budget limits. You can adjust your budget categories anytime, and our Pro plan includes advanced alerts to help prevent overspending.'
    },
    {
      question: 'How secure is my financial data?',
      answer: 'Your data security is our top priority. We use 256-bit SSL encryption, are SOC 2 Type II certified, PCI DSS compliant, and GDPR compliant. We never sell your data and employ multiple layers of security including regular audits and 24/7 monitoring.'
    },
    {
      question: 'Can I use Smart Budget on my phone?',
      answer: 'Yes! Smart Budget is available as a mobile app for both iOS and Android devices. You can access all your budgeting features on the go, receive notifications, and sync your data across all your devices.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! Free users get email support, while Pro users receive priority support with faster response times. Enterprise customers get dedicated account managers and 24/7 phone support. We also have a comprehensive help center and video tutorials.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export your transaction data, budgets, and reports in various formats (CSV, PDF, Excel). This is included in our Pro plan, and you can export your data anytime, even if you decide to cancel your subscription.'
    },
    {
      question: 'What if I want to cancel my subscription?',
      answer: 'You can cancel your subscription anytime from your account settings. We offer a 30-day money-back guarantee, and you can continue using the free plan features after cancellation. Your data will be preserved for 90 days after cancellation.'
    },
    {
      question: 'Does Smart Budget work with international banks?',
      answer: 'Currently, Smart Budget works with banks in the United States, Canada, and the United Kingdom. We\'re continuously expanding our bank coverage and plan to support more countries in the future. Check our supported banks list for the most up-to-date information.'
    },
    {
      question: 'How does the goal tracking feature work?',
      answer: 'Our goal tracking feature helps you set and achieve financial milestones. You can create multiple goals (emergency fund, vacation, down payment, etc.), set target amounts and dates, and track your progress with visual indicators. Pro users get automated savings transfers and milestone celebrations.'
    },
    {
      question: 'Can I share my account with family members?',
      answer: 'Yes! Our Pro plan includes family sharing for up to 5 users. Each family member can have their own login while sharing budgets, goals, and financial insights. This is perfect for couples or families who want to manage their finances together.'
    },
    {
      question: 'What makes Smart Budget different from other budgeting apps?',
      answer: 'Smart Budget combines powerful analytics with an intuitive interface. Our AI-powered categorization, real-time notifications, and comprehensive goal tracking set us apart. We also prioritize security and privacy, never selling your data, and offer both free and premium options to fit different needs.'
    }
  ];

  const categories = [
    { name: 'General', count: 4 },
    { name: 'Security', count: 3 },
    { name: 'Features', count: 3 },
    { name: 'Billing', count: 2 }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
            <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about Smart Budget. Can't find what you're looking for? 
            Contact our support team.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our support team is here to help you get the most out of Smart Budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
              View Help Center
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;