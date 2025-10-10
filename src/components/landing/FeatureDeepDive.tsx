import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  PieChart, 
  Target, 
  Bell,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Shield
} from 'lucide-react';

const FeatureDeepDive = () => {
  const features = [
    {
      id: 'budget-control',
      title: 'Budget Control Dashboard',
      subtitle: 'Complete Financial Overview',
      description: 'Get a comprehensive view of your financial health with our intuitive dashboard. Track income vs expenses, monitor spending patterns, and identify opportunities to save more.',
      image: 'dashboard',
      features: [
        'Real-time balance tracking',
        'Monthly spending analysis',
        'Income vs expense comparison',
        'Customizable spending categories'
      ],
      stats: [
        { label: 'Users save 23% more', value: 'on average' },
        { label: 'Budget accuracy', value: '95%' }
      ],
      reverse: false
    },
    {
      id: 'expense-categorization',
      title: 'Smart Expense Categorization',
      subtitle: 'AI-Powered Spending Insights',
      description: 'Our intelligent system automatically categorizes your transactions and provides detailed insights into your spending habits. Never wonder where your money went again.',
      image: 'categorization',
      features: [
        'Automatic transaction categorization',
        'Spending trend analysis',
        'Category-based budget alerts',
        'Custom category creation'
      ],
      stats: [
        { label: 'Categorization accuracy', value: '98%' },
        { label: 'Time saved per month', value: '5+ hours' }
      ],
      reverse: true
    },
    {
      id: 'goal-tracking',
      title: 'Goal Tracking & Milestones',
      subtitle: 'Achieve Your Financial Dreams',
      description: 'Set, track, and achieve your financial goals with our comprehensive goal-tracking system. From emergency funds to vacation savings, we help you stay motivated.',
      image: 'goals',
      features: [
        'Multiple goal types supported',
        'Progress visualization',
        'Milestone celebrations',
        'Automated savings transfers'
      ],
      stats: [
        { label: 'Goals achieved', value: '87%' },
        { label: 'Average time to goal', value: '6 months' }
      ],
      reverse: false
    },
    {
      id: 'smart-alerts',
      title: 'Smart Alerts & Notifications',
      subtitle: 'Stay on Top of Your Finances',
      description: 'Never miss important financial moments with our intelligent notification system. Get alerts for overspending, bill due dates, and goal milestones.',
      image: 'alerts',
      features: [
        'Overspending prevention alerts',
        'Bill due date reminders',
        'Goal milestone notifications',
        'Customizable alert preferences'
      ],
      stats: [
        { label: 'Overspending prevented', value: '92%' },
        { label: 'Bills paid on time', value: '98%' }
      ],
      reverse: true
    }
  ];

  const renderFeatureImage = (imageType: string) => {
    switch (imageType) {
      case 'dashboard':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-white">Financial Overview</h4>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Total Income</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">$5,200</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Total Expenses</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">$3,800</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Food & Dining</span>
                  <span className="font-medium text-gray-900 dark:text-white">$450 / $500</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'categorization':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Spending Categories</h4>
              <div className="space-y-3">
                {[
                  { name: 'Food & Dining', amount: '$450', percentage: 35, color: 'bg-blue-500' },
                  { name: 'Transportation', amount: '$200', percentage: 15, color: 'bg-green-500' },
                  { name: 'Entertainment', amount: '$150', percentage: 12, color: 'bg-purple-500' },
                  { name: 'Shopping', amount: '$300', percentage: 23, color: 'bg-orange-500' },
                ].map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{category.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{category.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className={`${category.color} h-2 rounded-full`} style={{ width: `${category.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'goals':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Financial Goals</h4>
              <div className="space-y-3">
                {[
                  { name: 'Emergency Fund', current: 2450, target: 5000, color: 'bg-green-500' },
                  { name: 'Vacation', current: 800, target: 2000, color: 'bg-blue-500' },
                  { name: 'New Car', current: 1200, target: 15000, color: 'bg-purple-500' },
                ].map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{goal.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className={`${goal.color} h-2 rounded-full`} style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round((goal.current / goal.target) * 100)}% Complete</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Recent Alerts</h4>
              <div className="space-y-3">
                {[
                  { type: 'warning', message: 'Approaching food budget limit', time: '2h ago' },
                  { type: 'success', message: 'Emergency fund goal 50% complete!', time: '1d ago' },
                  { type: 'info', message: 'Bill due: Netflix subscription', time: '2d ago' },
                ].map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    alert.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((feature, index) => (
          <div key={feature.id} className={`mb-32 ${index > 0 ? 'pt-16 border-t border-gray-200 dark:border-gray-800' : ''}`}>
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${feature.reverse ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={`space-y-8 ${feature.reverse ? 'lg:col-start-2' : ''}`}>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
                    {feature.subtitle}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Feature List */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                  See it in action
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Visual */}
              <div className={`${feature.reverse ? 'lg:col-start-1' : ''}`}>
                {renderFeatureImage(feature.image)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureDeepDive;