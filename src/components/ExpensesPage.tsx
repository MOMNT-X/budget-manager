import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Filter, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CandlestickChart } from "./CandlestickChart";
import { mockTransactions, mockCategoryData } from "../data/mockData";

// Candlestick data: Budget vs Actual with High/Low expenses (Nigerian Naira)
const monthlyCandlestickData = [
  { 
    month: 'Jan', 
    budget: 950000,    // Monthly budget allocation
    actual: 465000,    // Actual expenses spent
    high: 125000,      // Highest single expense 
    low: 3500          // Lowest single expense
  },
  { 
    month: 'Feb', 
    budget: 950000, 
    actual: 562500, 
    high: 148750, 
    low: 4850 
  },
  { 
    month: 'Mar', 
    budget: 920000, 
    actual: 512000, 
    high: 115000, 
    low: 2850 
  },
  { 
    month: 'Apr', 
    budget: 980000, 
    actual: 652000, 
    high: 162500, 
    low: 6125 
  },
  { 
    month: 'May', 
    budget: 950000, 
    actual: 515850, 
    high: 110750, 
    low: 3875 
  },
];

const weeklyExpenses = [
  { week: 'Week 1', amount: 124000 },
  { week: 'Week 2', amount: 106750 },
  { week: 'Week 3', amount: 158900 },
  { week: 'Week 4', amount: 130500 },
];

export function ExpensesPage() {
  const expenses = mockTransactions.filter(t => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const avgExpense = totalExpenses / expenses.length;
  const largestExpense = Math.max(...expenses.map(t => t.amount));

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Expenses</h2>
          <p className="text-muted-foreground">Track and analyze your spending patterns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food & Dining</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="transport">Transportation</SelectItem>
              <SelectItem value="bills">Bills & Utilities</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalExpenses.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{avgExpense.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">₦{largestExpense.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">Single transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Badge variant="secondary">{expenses.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
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
            {/* Legend */}
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
              <CandlestickChart data={monthlyCandlestickData} />
            </div>
            
            {/* Chart explanation */}
            <div className="mt-4 text-xs text-muted-foreground">
              <p>• Each candlestick shows budget allocation vs actual spending</p>
              <p>• Vertical lines show highest and lowest individual expenses for the month</p>
              <p>• Green bars indicate spending under budget, red bars indicate over budget</p>
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
                <BarChart data={weeklyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `₦${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₦${value.toLocaleString('en-NG')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
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
            {mockCategoryData.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((category.amount / totalExpenses) * 100)}% of total expenses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₦{category.amount.toLocaleString('en-NG')}</p>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}