import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileCheck, 
  Server, 
  Users,
  Award,
  CheckCircle
} from 'lucide-react';

const SecurityTrust = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Bank-Grade Encryption',
      description: 'All your financial data is protected with 256-bit SSL encryption, the same security used by major banks.',
      details: ['256-bit SSL encryption', 'End-to-end data protection', 'Regular security audits']
    },
    {
      icon: Lock,
      title: 'Secure Data Storage',
      description: 'Your data is stored in secure, encrypted databases with multiple layers of protection and access controls.',
      details: ['Encrypted at rest', 'Multi-layer access controls', 'Regular backups']
    },
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'We never sell your data. Your financial information is yours and yours alone, always.',
      details: ['No data selling', 'Privacy by design', 'GDPR compliant']
    },
    {
      icon: FileCheck,
      title: 'Compliance Certified',
      description: 'We meet the highest industry standards for financial data protection and privacy regulations.',
      details: ['SOC 2 Type II', 'PCI DSS compliant', 'GDPR compliant']
    }
  ];

  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Security, availability, and confidentiality controls',
      icon: Award,
      status: 'Certified'
    },
    {
      name: 'PCI DSS',
      description: 'Payment card industry data security standards',
      icon: Shield,
      status: 'Compliant'
    },
    {
      name: 'GDPR',
      description: 'General data protection regulation compliance',
      icon: FileCheck,
      status: 'Compliant'
    },
    {
      name: 'ISO 27001',
      description: 'Information security management system',
      icon: Server,
      status: 'Certified'
    }
  ];

  const trustIndicators = [
    { number: '50,000+', label: 'Active Users', icon: Users },
    { number: '99.9%', label: 'Uptime SLA', icon: Server },
    { number: '0', label: 'Security Breaches', icon: Shield },
    { number: '24/7', label: 'Security Monitoring', icon: Eye }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your financial data is our top priority
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We use the same security standards as major banks to protect your sensitive financial information. 
            Your trust is everything to us.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Industry Certifications & Compliance
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We maintain the highest standards of security and compliance in the financial technology industry.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{cert.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{cert.description}</p>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">
                    {cert.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{indicator.number}</p>
                <p className="text-gray-600 dark:text-gray-300">{indicator.label}</p>
              </div>
            );
          })}
        </div>

        {/* Security Promise */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-white/90" />
          <h3 className="text-2xl font-bold mb-4">
            Our Security Promise
          </h3>
          <p className="text-lg text-white/90 mb-6 max-w-3xl mx-auto">
            We treat your financial data with the same level of security and care as we would our own. 
            Our team of security experts works around the clock to ensure your information is always protected.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Regular security audits</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>24/7 monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Data never sold</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Transparent practices</span>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Want to learn more about our security practices?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
              Security Whitepaper
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
              Privacy Policy
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
              Contact Security Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrust;