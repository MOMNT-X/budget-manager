import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      company: 'TechCorp',
      avatar: 'SJ',
      rating: 5,
      text: 'Smart Budget completely transformed how I manage my finances. I saved 40% more monthly and finally reached my emergency fund goal. The automated categorization is a game-changer!',
      savings: '$2,400 saved',
      timeframe: 'in 6 months'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      company: 'StartupXYZ',
      avatar: 'MC',
      rating: 5,
      text: 'As a developer, I appreciate the clean interface and powerful analytics. The spending insights helped me identify unnecessary subscriptions and save over $200/month.',
      savings: '$1,200 saved',
      timeframe: 'in 3 months'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Freelance Designer',
      company: 'Self-employed',
      avatar: 'ER',
      rating: 5,
      text: 'Managing irregular income was always a challenge. Smart Budget\'s goal tracking and budget alerts help me stay on track even during lean months. Highly recommended!',
      savings: '$3,100 saved',
      timeframe: 'in 8 months'
    },
    {
      name: 'David Thompson',
      role: 'Sales Director',
      company: 'Enterprise Inc',
      avatar: 'DT',
      rating: 5,
      text: 'The security features gave me confidence to link all my accounts. The real-time notifications prevent overspending, and I\'ve never been more organized with my money.',
      savings: '$4,200 saved',
      timeframe: 'in 1 year'
    },
    {
      name: 'Lisa Wang',
      role: 'Product Manager',
      company: 'Innovation Labs',
      avatar: 'LW',
      rating: 5,
      text: 'Smart Budget made budgeting actually enjoyable! The progress visualization and milestone celebrations keep me motivated. I\'ve achieved 3 financial goals this year.',
      savings: '$5,800 saved',
      timeframe: 'in 1 year'
    },
    {
      name: 'James Wilson',
      role: 'Teacher',
      company: 'City Schools',
      avatar: 'JW',
      rating: 5,
      text: 'As a teacher on a fixed income, every dollar counts. Smart Budget helped me optimize my spending and build a solid emergency fund. The interface is so intuitive!',
      savings: '$1,800 saved',
      timeframe: 'in 5 months'
    }
  ];

  const stats = [
    { number: '4.9/5', label: 'Average Rating', icon: Star },
    { number: '50,000+', label: 'Happy Users', icon: Quote },
    { number: '$2M+', label: 'Saved Monthly', icon: Star },
    { number: '98%', label: 'Would Recommend', icon: Quote }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by thousands of users worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how Smart Budget is helping people take control of their finances and build wealth for the future.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                  <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 hover:-translate-y-2">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Savings Highlight */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-6">
                  <p className="text-green-700 dark:text-green-400 font-semibold text-lg">{testimonial.savings}</p>
                  <p className="text-green-600 dark:text-green-500 text-sm">{testimonial.timeframe}</p>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-8">Trusted by leading companies and featured in:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Forbes</div>
            <div className="text-2xl font-bold text-gray-400">TechCrunch</div>
            <div className="text-2xl font-bold text-gray-400">Wired</div>
            <div className="text-2xl font-bold text-gray-400">The Verge</div>
            <div className="text-2xl font-bold text-gray-400">Fast Company</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;