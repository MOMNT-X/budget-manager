import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

// Nigerian Naira formatting utility
const formatNaira = (amount: number) => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

interface DashboardProps {
  balance: number;
  monthlyExpenses: number;
  monthlyBudget: number;
  weeklyChange: number;
}

export function Dashboard({ balance, monthlyExpenses, monthlyBudget, weeklyChange }: DashboardProps) {
  const budgetUsed = (monthlyExpenses / monthlyBudget) * 100;
  const remainingBudget = monthlyBudget - monthlyExpenses;
  const isOverBudget = monthlyExpenses > monthlyBudget;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Current Balance</CardTitle>
          <span className="text-lg">₦</span>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatNaira(balance)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-white/90">
              {weeklyChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {weeklyChange >= 0 ? '+' : ''}{formatNaira(Math.abs(weeklyChange))} from last week
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
              {formatNaira(monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month so far
            </p>
          </CardContent>
        </Card>

        {/* Monthly Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNaira(monthlyBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total allocated
            </p>
          </CardContent>
        </Card>

        {/* Remaining Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </CardTitle>
            <span className={`text-lg ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>₦</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
              {isOverBudget ? '-' : ''}{formatNaira(Math.abs(remainingBudget))}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? 'exceeded by' : 'left to spend'}
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
              <span>Used: {formatNaira(monthlyExpenses)}</span>
              <span>{budgetUsed.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(budgetUsed, 100)} 
              className={`w-full ${isOverBudget ? 'bg-red-100' : ''}`}
            />
            {isOverBudget && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Over budget by: {formatNaira(monthlyExpenses - monthlyBudget)}</span>
                <span>{(budgetUsed - 100).toFixed(1)}% over</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}