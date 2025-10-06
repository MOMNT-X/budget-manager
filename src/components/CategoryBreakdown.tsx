import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "./ui/skeleton";
import { getDashboardCategories } from "@/config/api";

// Shape after transforming API response
export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A569BD", "#F1948A", "#52BE80", "#5DADE2",
];

export function CategoryBreakdown() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getDashboardCategories();

        // ✅ transform API response into chart data
        const transformed = response.map((item: any, index: number) => ({
          category: item.categoryName,
          amount: item.total / 100, // convert kobo → naira
          color: COLORS[index % COLORS.length], // cycle colors
        }));

        setData(transformed);
      } catch (err) {
        console.error(err);
        setError("Failed to load category breakdown");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const formatTooltip = (value: number, name: string) => [
    `₦${value.toLocaleString("en-NG")}`,
    name,
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="text-red-500">{error}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltip} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center total */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="font-bold">₦{total.toLocaleString("en-NG")}</div>
              </div>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">
                    ₦{item.amount.toLocaleString("en-NG")}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({((item.amount / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
