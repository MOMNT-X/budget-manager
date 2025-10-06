import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Filter, TrendingDown, TrendingUp, DollarSign, Coins, TrendingUpDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CandlestickChart } from "./CandlestickChart";
import { getExpensesSummary } from "@/config/api";

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
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
      <div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    <div className="text-right">
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

export function ExpensesPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchExpensesSummary = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      
      // Set filters based on selected period
      if (selectedPeriod === "this-month") {
        filters.month = new Date().getMonth() + 1; // Current month (1-12)
      } else if (selectedPeriod === "last-month") {
        const lastMonth = new Date().getMonth(); // Previous month
        filters.month = lastMonth === 0 ? 12 : lastMonth;
      } else if (selectedPeriod === "this-week") {
        filters.week = 1; // Last 7 days
      } else {
        // Handle specific months
        const monthMap: { [key: string]: number } = {
          jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
          jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
        };
        if (monthMap[selectedPeriod]) {
          filters.month = monthMap[selectedPeriod];
        }
      }
      
      if (selectedCategory !== "all") {
        filters.categoryId = selectedCategory;
      }
      
      console.log('Fetching with filters:', filters);
      const res = await getExpensesSummary();
      console.log('API Response:', res);
      setSummary(res);
      setError(null);
    } catch (err) {
      console.error('API Error:', err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesSummary();
  }, [selectedPeriod, selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Summary cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* Category analysis skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
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
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No data available</p>
      </div>
    );
  }

  // Use the actual data structure from your backend
  const {
    totalExpenses = 0,
    avgExpense = 0,
    largestExpense = 0,
    totalTransactions = 0,
    categoryBreakdown = []
  } = summary;

  // Mock data for chart based on actual data
  const mockWeeklyBreakdown = [
    { week: "Week 1", amount: totalExpenses * 0.25 },
    { week: "Week 2", amount: totalExpenses * 0.30 },
    { week: "Week 3", amount: totalExpenses * 0.20 },
    { week: "Week 4", amount: totalExpenses * 0.25 },
  ];

  const mockMonthlyCandlestickData = [
    { month: "Jan", budget: 50000, expenses: totalExpenses * 0.8 },
    { month: "Feb", budget: 50000, expenses: totalExpenses * 1.1 },
    { month: "Mar", budget: 50000, expenses: totalExpenses },
  ];

  const getPeriodLabel = () => {
    if (selectedPeriod === "this-month") return "This month";
    if (selectedPeriod === "last-month") return "Last month";
    if (selectedPeriod === "this-week") return "This week";
    
    const monthNames: { [key: string]: string } = {
      jan: "January", feb: "February", mar: "March", apr: "April",
      may: "May", jun: "June", jul: "July", aug: "August",
      sep: "September", oct: "October", nov: "November", dec: "December"
    };
    
    return monthNames[selectedPeriod] || "Selected period";
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Expenses</h2>
          <p className="text-muted-foreground">Track and analyze your spending patterns</p>
        </div>
        <div className="flex items-center space-x-2 bg-white">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod} disabled={loading}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="jan">January</SelectItem>
              <SelectItem value="feb">February</SelectItem>
              <SelectItem value="mar">March</SelectItem>
              <SelectItem value="apr">April</SelectItem>
              <SelectItem value="may">May</SelectItem>
              <SelectItem value="jun">June</SelectItem>
              <SelectItem value="jul">July</SelectItem>
              <SelectItem value="aug">August</SelectItem>
              <SelectItem value="sep">September</SelectItem>
              <SelectItem value="oct">October</SelectItem>
              <SelectItem value="nov">November</SelectItem>
              <SelectItem value="dec">December</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={loading}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryBreakdown.map((cat: any) => (
                <SelectItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalExpenses/100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <TrendingUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(avgExpense/100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">₦{(largestExpense/100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Single transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Badge variant="secondary">{totalTransactions}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget vs Expenses</CardTitle>
            <p className="text-sm text-muted-foreground">
              Trading-style candlestick chart showing budget performance and expense ranges
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6 mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-6 bg-green-500 rounded-sm"></div>
                <span className="text-sm">Under Budget</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-6 bg-red-500 rounded-sm"></div>
                <span className="text-sm">Over Budget</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-0.5 bg-gray-500"></div>
                <span className="text-sm">High/Low Expenses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-white border border-gray-400"></div>
                <span className="text-sm">Budget Line</span>
              </div>
            </div>
            <div className="h-80">
              {/* Note: You'll need to implement CandlestickChart or use mock data */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Candlestick Chart Coming Soon
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockWeeklyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`₦${value.toLocaleString("en-NG")}`, "Amount"]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((category: any, index: number) => (
                <div key={category.categoryId || index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                    />
                    <div>
                      <p className="font-medium">{category.categoryName}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.percentage?.toFixed(1) || 0}% of total expenses
                      </p>
                    </div>                  </div>
                  <div className="text-right">
                    <p className="font-bold">₦{(category.amount/100).toLocaleString('en-NG', { maximumFractionDigits: 2 })}</p>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No category data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}