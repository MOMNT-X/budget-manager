import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Filter, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Coins, 
  TrendingUpDown, 
  PieChart, 
  BarChart as BarChartIcon, 
  LineChart, 
  AlertCircle,
  Search,
  ArrowUpDown,
  Check,
  Clock,
  Target,
  Plus
} from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, PieChart as RechartsPieChart, Pie, LineChart as RechartsLineChart, Line } from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "@/components/ui/use-toast";

// Define interfaces
interface SpendingInsight {
  totalSpent: number;
  averageTransaction: number;
  largestExpense: number;
  transactionCount: number;
  savingsRate: number;
  monthlyChange: number;
  categoryBreakdown: CategoryBreakdown[];
  dailySpending: DailySpending[];
  monthlyTrend: MonthlyTrend[];
  recurringExpenses: RecurringExpenseSummary[];
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
  color: string;
}

interface DailySpending {
  date: string;
  amount: number;
}

interface MonthlyTrend {
  month: string;
  expenses: number;
  income: number;
}

interface RecurringExpenseSummary {
  name: string;
  amount: number;
  frequency: string;
}

// Skeleton components
const CardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-gray-100 rounded animate-pulse" />
    </CardContent>
  </Card>
);

const CategorySkeleton = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
  </div>
);

export default function SpendingInsightsPage() {
  const [insights, setInsights] = useState<SpendingInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Mock colors for categories
  const categoryColors = [
    "#4f46e5", "#0891b2", "#16a34a", "#ca8a04", "#dc2626", 
    "#9333ea", "#2563eb", "#059669", "#d97706", "#ef4444",
    "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e"
  ];

  // Fetch spending insights data
  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockInsights: SpendingInsight = {
        totalSpent: 245000,
        averageTransaction: 12250,
        largestExpense: 50000,
        transactionCount: 20,
        savingsRate: 15,
        monthlyChange: 8.5,
        categoryBreakdown: [
          { category: "Food & Dining", amount: 75000, percentage: 30.6, transactions: 8, color: categoryColors[0] },
          { category: "Transportation", amount: 45000, percentage: 18.4, transactions: 5, color: categoryColors[1] },
          { category: "Entertainment", amount: 35000, percentage: 14.3, transactions: 3, color: categoryColors[2] },
          { category: "Utilities", amount: 30000, percentage: 12.2, transactions: 2, color: categoryColors[3] },
          { category: "Shopping", amount: 60000, percentage: 24.5, transactions: 2, color: categoryColors[4] }
        ],
        dailySpending: Array.from({ length: 30 }, (_, i) => ({
          date: format(subDays(new Date(), 30 - i), 'MMM dd'),
          amount: Math.floor(Math.random() * 15000) + 2000
        })),
        monthlyTrend: [
          { month: "Jan", expenses: 220000, income: 350000 },
          { month: "Feb", expenses: 235000, income: 350000 },
          { month: "Mar", expenses: 245000, income: 360000 },
          { month: "Apr", expenses: 210000, income: 360000 },
          { month: "May", expenses: 260000, income: 370000 },
          { month: "Jun", expenses: 245000, income: 370000 }
        ],
        recurringExpenses: [
          { name: "Netflix", amount: 4500, frequency: "MONTHLY" },
          { name: "Gym Membership", amount: 15000, frequency: "MONTHLY" },
          { name: "Internet", amount: 12000, frequency: "MONTHLY" },
          { name: "Phone Bill", amount: 8000, frequency: "MONTHLY" }
        ]
      };
      
      setInsights(mockInsights);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Failed to load spending insights. Please try again later.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load spending insights",
        action: <Button onClick={fetchInsights}>Retry</Button>
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "this-week": return "This Week";
      case "this-month": return "This Month";
      case "last-month": return "Last Month";
      case "last-3-months": return "Last 3 Months";
      case "last-6-months": return "Last 6 Months";
      case "this-year": return "This Year";
      default: return "This Month";
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [selectedPeriod, selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={fetchInsights} className="mt-4">Retry</Button>
        </Alert>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
            <p className="text-muted-foreground text-center mb-4">
              We don't have enough data to generate insights yet.
            </p>
            <Button onClick={fetchInsights}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Spending Insights</h2>
          <p className="text-muted-foreground">
            Analyze your spending patterns and financial habits
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(insights.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(insights.averageTransaction)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(insights.largestExpense)}</div>
            <p className="text-xs text-muted-foreground">Single transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
            {insights.monthlyChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${insights.monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {insights.monthlyChange >= 0 ? '+' : ''}{insights.monthlyChange}%
            </div>
            <p className="text-xs text-muted-foreground">From previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>Your spending pattern over the last {selectedPeriod === 'this-week' ? '7' : '30'} days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip formatter={(value) => [`₦${value.toLocaleString('en-NG')}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Spending distribution by category</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.categoryBreakdown.map((category) => (
                  <div key={category.category} className="flex items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" 
                      style={{ backgroundColor: category.color + '20', color: category.color }}>
                      <PieChart className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{category.category}</span>
                        <span className="font-semibold">{formatCurrency(category.amount)}</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: category.color 
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{category.percentage.toFixed(1)}%</span>
                        <span>{category.transactions} transactions</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>How your spending has changed over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip formatter={(value) => [`₦${value.toLocaleString('en-NG')}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                  <Bar dataKey="income" name="Income" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending Patterns</CardTitle>
              <CardDescription>Analysis of your spending habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">Highest Spending Day</p>
                      <p className="text-sm text-muted-foreground">
                        {insights.dailySpending.reduce((max, day) => 
                          day.amount > max.amount ? day : max, insights.dailySpending[0]).date}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(insights.dailySpending.reduce((max, day) => 
                      day.amount > max.amount ? day : max, insights.dailySpending[0]).amount)}
                  </p>
                </div>
                
                <div className="h-px bg-border my-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-500" />
                    <div>
                      <p className="font-medium">Average Daily Spending</p>
                      <p className="text-sm text-muted-foreground">
                        Based on {insights.dailySpending.length} days
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(insights.dailySpending.reduce((sum, day) => 
                      sum + day.amount, 0) / insights.dailySpending.length)}
                  </p>
                </div>
                
                <div className="h-px bg-border my-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <p className="font-medium">Spending Growth</p>
                      <p className="text-sm text-muted-foreground">
                        Compared to previous period
                      </p>
                    </div>
                  </div>
                  <Badge variant={insights.monthlyChange >= 0 ? "outline" : "secondary"} 
                    className={insights.monthlyChange >= 0 ? "text-green-500" : "text-red-500"}>
                    {insights.monthlyChange >= 0 ? '+' : ''}{insights.monthlyChange}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Expenses</CardTitle>
              <CardDescription>Your regular monthly expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.recurringExpenses.map((expense) => (
                  <div key={expense.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-blue-100 text-blue-600">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.name}</p>
                        <p className="text-sm text-muted-foreground">{expense.frequency.toLowerCase()}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                  </div>
                ))}
                
                {insights.recurringExpenses.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recurring Expenses</h3>
                    <p className="text-muted-foreground max-w-sm">
                      You don't have any recurring expenses set up yet. Add some to track your regular payments.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/recurring-expenses'}>
                <Plus className="h-4 w-4 mr-2" />
                Manage Recurring Expenses
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
              <CardDescription>Where most of your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.categoryBreakdown
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((category, index) => (
                    <div key={category.category} className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white"
                        style={{ backgroundColor: category.color }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{category.category}</span>
                          <span className="font-semibold">{formatCurrency(category.amount)}</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${category.percentage}%`,
                              backgroundColor: category.color 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}