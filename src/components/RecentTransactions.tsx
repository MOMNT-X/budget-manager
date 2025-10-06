import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CalendarDays, ShoppingCart, Car, Home, Utensils, Coffee, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardTransactions } from "@/config/api";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'DEPOSIT' | 'EXPENSE' | 'INCOME' | 'WITHDRAWAL';
}

// Function to format currency
const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

// Function to map API categories to your predefined categories
const mapCategory = (apiCategory: string): string => {
  const categoryMap: { [key: string]: string } = {
    'food': 'Food & Dining',
    'dining': 'Food & Dining',
    'restaurant': 'Food & Dining',
    'shopping': 'Shopping',
    'retail': 'Shopping',
    'transport': 'Transportation',
    'transportation': 'Transportation',
    'fuel': 'Transportation',
    'bills': 'Bills & Utilities',
    'utilities': 'Bills & Utilities',
    'electricity': 'Bills & Utilities',
    'water': 'Bills & Utilities',
    'entertainment': 'Entertainment',
    'movies': 'Entertainment',
    'games': 'Entertainment',
    'salary': 'Income',
    'income': 'Income',
    'payment': 'Income',
    // Add more mappings based on your API categories
  };

  const lowerCategory = apiCategory.toLowerCase();
  return categoryMap[lowerCategory] || 'Other';
};

// Function to map API response to Transaction interface
const mapApiResponseToTransaction = (apiTransaction: any): Transaction => {
  return {
    id: apiTransaction.id || apiTransaction._id || Math.random().toString(),
    description: apiTransaction.description || apiTransaction.title || apiTransaction.reference || 'Transaction',
    amount: Math.abs(apiTransaction.amount || 0) / 100,
    category: mapCategory(apiTransaction.category || apiTransaction.type || 'Other'),
    date: apiTransaction.date || apiTransaction.createdAt || apiTransaction.timestamp || new Date().toISOString(),
    type: apiTransaction.amount >= 0 ? 'DEPOSIT' : 'EXPENSE',
  };
};

const categoryIcons = {
  'Food & Dining': Utensils,
  'Shopping': ShoppingCart,
  'Transportation': Car,
  'Bills & Utilities': Home,
  'Entertainment': Coffee,
  'Income': CalendarDays,
  'Other': CalendarDays,
};

const categoryColors = {
  'Food & Dining': 'bg-orange-100 text-orange-600',
  'Shopping': 'bg-blue-100 text-blue-600',
  'Transportation': 'bg-green-100 text-green-600',
  'Bills & Utilities': 'bg-purple-100 text-purple-600',
  'Entertainment': 'bg-pink-100 text-pink-600',
  'Income': 'bg-emerald-100 text-emerald-600',
  'Other': 'bg-gray-100 text-gray-600',
};

interface RecentTransactionsProps {
  limit?: number; // Optional prop to limit number of transactions displayed
}

export function RecentTransactions({ limit = 10 }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getDashboardTransactions();
        
        // Map the API response to your Transaction interface
        // Adjust this mapping based on your actual API response structure
        let mappedTransactions: Transaction[];
        
        if (Array.isArray(response)) {
          // If response is directly an array of transactions
          mappedTransactions = response.map(mapApiResponseToTransaction);
        } else if (response.data && Array.isArray(response.data)) {
          // If response has a data property containing the array
          mappedTransactions = response.data.map(mapApiResponseToTransaction);
        } else if (response.transactions && Array.isArray(response.transactions)) {
          // If response has a transactions property containing the array
          mappedTransactions = response.transactions.map(mapApiResponseToTransaction);
        } else {
          throw new Error('Invalid response format');
        }

        // Sort by date (most recent first) and limit results
        const sortedTransactions = mappedTransactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);

        setTransactions(sortedTransactions);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [limit]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Failed to load transactions</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No transactions found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  <p className={`font-bold ${
                    (transaction.type === 'DEPOSIT' || transaction.type === 'INCOME') 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {(transaction.type === 'DEPOSIT' || transaction.type === 'INCOME') ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      {transactions.length === limit && (
        <CardContent className="pt-0">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Showing {limit} most recent transactions
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}