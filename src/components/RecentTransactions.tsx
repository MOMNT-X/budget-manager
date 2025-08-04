import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CalendarDays, ShoppingCart, Car, Home, Utensils, Coffee } from "lucide-react";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const categoryIcons = {
  'Food & Dining': Utensils,
  'Shopping': ShoppingCart,
  'Transportation': Car,
  'Bills & Utilities': Home,
  'Entertainment': Coffee,
  'Income': CalendarDays,
};

const categoryColors = {
  'Food & Dining': 'bg-orange-100 text-orange-600',
  'Shopping': 'bg-blue-100 text-blue-600',
  'Transportation': 'bg-green-100 text-green-600',
  'Bills & Utilities': 'bg-purple-100 text-purple-600',
  'Entertainment': 'bg-pink-100 text-pink-600',
  'Income': 'bg-emerald-100 text-emerald-600',
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const IconComponent = categoryIcons[transaction.category as keyof typeof categoryIcons] || CalendarDays;
            const colorClass = categoryColors[transaction.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-600';
            
            return (
              <div key={transaction.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${colorClass}`}>
                      <IconComponent className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₦
                    {Math.abs(transaction.amount).toLocaleString('en-NG')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}