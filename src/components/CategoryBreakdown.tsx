import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const formatTooltip = (value: number, name: string) => [
    `₦${value.toLocaleString('en-NG')}`,
    name
  ];

  const formatLabel = (label: string) => label;

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
                <Tooltip formatter={formatTooltip} labelFormatter={formatLabel} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text for total */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="font-bold">₦{total.toLocaleString('en-NG')}</div>
              </div>
            </div>
          </div>
          
          {/* Category List */}
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">
                    ₦{item.amount.toLocaleString('en-NG')}
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