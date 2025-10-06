import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { getDashboardSummary } from "@/config/api";

// Nigerian Naira formatting utility (safe)
const formatNaira = (amount: number | undefined | null) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "₦0";
  return `₦${amount.toLocaleString("en-NG")}`;
};

/* const formatNaira = (amount: number | undefined | null): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return "₦0";
  const nairaValue = amount / 100;
  return `₦${nairaValue.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}; */

const userName = localStorage.getItem("username");

// Skeleton Loader for Cards
function CardSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Error fetching dashboard:", err);
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Balance Card Skeleton */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/90">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-32 bg-white/40 animate-pulse rounded mb-2" />
            <div className="h-4 w-20 bg-white/30 animate-pulse rounded" />
          </CardContent>
        </Card>

        {/* Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton title="Monthly Expenses" />
          <CardSkeleton title="Monthly Budget" />
          <CardSkeleton title="Remaining" />
        </div>

        {/* Progress Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <p>No dashboard data available.</p>
      </div>
    );
  }

  // Data from backend
  const {
    walletBalance,
    monthlyExpenses,
    monthlyBudget,
    percentageChange,
  } = data;

const walletBalanceNaira = walletBalance / 100;
const monthlyExpensesNaira = monthlyExpenses / 100;
const remainingBudget = monthlyBudget - monthlyExpensesNaira;
const budgetUsed = (monthlyExpensesNaira / monthlyBudget) * 100;
const isOverBudget = monthlyExpensesNaira > monthlyBudget;


  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">
            Current Balance
          </CardTitle>
          <span className="text-lg">₦</span>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{formatNaira(walletBalanceNaira)}</div>
            <div className="flex items-center space-x-1 text-xs text-white/90">
              {percentageChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {percentageChange >= 0 ? "+" : ""}
                {formatNaira(Math.abs(percentageChange))} from last week
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Overview Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNaira(monthlyExpensesNaira)}
            </div>
            <p className="text-xs text-muted-foreground">This month so far</p>
          </CardContent>
        </Card>

        {/* Monthly Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNaira(monthlyBudget)}</div>
            <p className="text-xs text-muted-foreground">Total allocated</p>
          </CardContent>
        </Card>

        {/* Remaining Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isOverBudget ? "Over Budget" : "Remaining"}
            </CardTitle>
            <span
              className={`text-lg ${
                isOverBudget ? "text-red-500" : "text-green-500"
              }`}
            >
              ₦
            </span>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isOverBudget ? "text-red-500" : "text-green-500"
              }`}
            >
              {isOverBudget ? "-" : ""}
              {formatNaira(Math.abs(remainingBudget))}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? "exceeded by" : "left to spend"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: {formatNaira(monthlyExpenses/100)}</span>
              <span>{budgetUsed.toFixed(1)}%</span>
            </div>
            <Progress
              value={Math.min(budgetUsed, 100)}
              className={`w-full ${isOverBudget ? "bg-red-100" : ""}`}
            />
            {isOverBudget && (
              <div className="flex justify-between text-sm text-red-500">
                <span>
                  Over budget by:{" "}
                  {formatNaira(monthlyExpenses - monthlyBudget)}
                </span>
                <span>{(budgetUsed - 100).toFixed(1)}% over</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
