import { useEffect, useState } from "react";
import { getDashboardSummary } from "../Config/api";
import { Dashboard } from "./Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DashboardContainer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Error fetching dashboard summary:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading Dashboard...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2" />
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return <p className="px-4">No dashboard data available.</p>;

  return (
    <Dashboard
      userName={data.userName}
      walletBalance={data.walletBalance}
      monthlyExpenses={data.monthlyExpenses}
      monthlyBudget={data.monthlyBudget}
      percentageChange={data.percentageChange}
    />
  );
}
