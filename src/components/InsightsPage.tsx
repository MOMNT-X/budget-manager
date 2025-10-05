import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle, TrendingUp, TrendingDown, Lightbulb, Award, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getSpendingInsights, getSpendingTrends, getBudgetPerformance, getRecommendations } from "../config/api";
import { toast } from "sonner";

export function InsightsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [insights, setInsights] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [budgetPerformance, setBudgetPerformance] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [insightsData, trendsData, budgetData, recsData] = await Promise.all([
        getSpendingInsights(period),
        getSpendingTrends(6),
        getBudgetPerformance(),
        getRecommendations()
      ]);

      setInsights(insightsData);
      setTrends(trendsData);
      setBudgetPerformance(budgetData);
      setRecommendations(recsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load insights';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'HIGH_SPENDING':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'BUDGET_EXCEEDED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'BUDGET_WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'SPENDING_INCREASE':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-green-500" />;
    }
  };

  const getRecommendationBadgeColor = (type: string) => {
    switch (type) {
      case 'BUDGET_EXCEEDED':
        return 'bg-red-100 text-red-800';
      case 'HIGH_SPENDING':
      case 'BUDGET_WARNING':
        return 'bg-orange-100 text-orange-800';
      case 'SPENDING_INCREASE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Insights & Analytics</h2>
          <p className="text-muted-foreground">Understand your spending patterns and get personalized recommendations</p>
        </div>
        <Select value={period} onValueChange={(value: typeof period) => setPeriod(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {insights && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{(insights.totalSpent / 100).toLocaleString('en-NG')}</div>
                <p className="text-xs text-muted-foreground capitalize">{period}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{(insights.avgTransaction / 100).toLocaleString('en-NG')}</div>
                <p className="text-xs text-muted-foreground">{insights.transactionCount} transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                <Award className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate">
                  {insights.topCategories && insights.topCategories[0] ?
                    insights.topCategories[0].categoryName : 'N/A'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {insights.topCategories && insights.topCategories[0] ?
                    `₦${(insights.topCategories[0].amount / 100).toLocaleString('en-NG')}` : 'No data'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                <Lightbulb className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recommendations.length}</div>
                <p className="text-xs text-muted-foreground">Active suggestions</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                {trends && trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [`₦${(value / 100).toLocaleString('en-NG')}`, "Amount"]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Line type="monotone" dataKey="totalSpent" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Spent" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    No trend data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {insights.topCategories && insights.topCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={insights.topCategories.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="categoryName" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [`₦${(value / 100).toLocaleString('en-NG')}`, "Amount"]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    No category data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {budgetPerformance && budgetPerformance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Budget Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetPerformance.map((budget: any, index: number) => {
                    const percentUsed = budget.budgetLimit > 0 ? (budget.spent / budget.budgetLimit) * 100 : 0;
                    const isOverBudget = percentUsed > 100;
                    const isNearLimit = percentUsed > 80 && percentUsed <= 100;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{budget.categoryName}</p>
                            <p className="text-sm text-muted-foreground">
                              ₦{(budget.spent / 100).toLocaleString('en-NG')} of ₦{(budget.budgetLimit / 100).toLocaleString('en-NG')}
                            </p>
                          </div>
                          <Badge className={
                            isOverBudget ? 'bg-red-100 text-red-800' :
                            isNearLimit ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {percentUsed.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              isOverBudget ? 'bg-red-500' :
                              isNearLimit ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-500" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  {getRecommendationIcon(rec.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge className={getRecommendationBadgeColor(rec.type)}>
                        {rec.type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!recommendations || recommendations.length === 0) && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Good!</h3>
            <p className="text-muted-foreground text-center">
              You're managing your finances well. Keep up the good work!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
