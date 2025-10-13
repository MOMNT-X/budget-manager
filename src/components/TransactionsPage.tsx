import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, Filter, Download, Plus, Calendar, ArrowUpDown, Loader2 } from "lucide-react";
import { getTransactions } from "@/config/api";

// Skeleton components
const CardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
    </CardContent>
  </Card>
);

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-6 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-6 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
  </TableRow>
);

interface Transaction {
  id: string;
  description: string;
  category: string;
  type: string;
  originalType: string;
  amount: number;
  timestamp: string;
  status: string;
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Fetch transactions with filters
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        sortBy,
        sortOrder,
      };
      if (filterType !== "all") params.type = filterType.toUpperCase();
      if (filterCategory !== "all") params.category = filterCategory;
      if (searchTerm) params.search = searchTerm;

      const res = await getTransactions(params);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : res?.items || [];
      setTransactions(list);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategory, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction: Transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const t = asOriginalType(transaction);
      const matchesType = filterType === "all" || (filterType === 'deposit' ? t === 'DEPOSIT' : t === 'EXPENSE');
      const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a: Transaction, b: Transaction) => {
      let aValue: any = a[sortBy as keyof Transaction];
      let bValue: any = b[sortBy as keyof Transaction];
      if (sortBy === 'timestamp') {
        aValue = new Date(a.timestamp).getTime();
        bValue = new Date(b.timestamp).getTime();
      } else if (sortBy === 'amount') {
        aValue = Number(a.amount);
        bValue = Number(b.amount);
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? result : -result;
    });

  // Calculate totals
  // Normalize type and amounts (server returns kobo)
  const asOriginalType = (t: Transaction) => {
    const raw = (t.originalType || t.type || '').toString().toUpperCase();
    if (raw.includes('DEPOSIT') || raw.includes('INCOME') || raw.includes('CREDIT')) return 'DEPOSIT';
    if (raw.includes('EXPENSE') || raw.includes('WITHDRAWAL') || raw.includes('DEBIT')) return 'EXPENSE';
    return 'EXPENSE';
  };

  const totalIncome = transactions
    .filter((t: Transaction) => asOriginalType(t) === 'DEPOSIT')
    .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
  const totalExpenses = transactions
    .filter((t: Transaction) => asOriginalType(t) === 'EXPENSE')
    .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

  // Get unique categories
  const categories = [...new Set(transactions.map((t: Transaction) => t.category))];

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getTransactionTypeLabel = (transaction: Transaction) => {
    const t = asOriginalType(transaction);
    return t === 'DEPOSIT' ? 'Income' : 'Expense';
  };

  const getTransactionColor = (transaction: Transaction) => {
    const t = asOriginalType(transaction);
    return t === 'DEPOSIT' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionPrefix = (transaction: Transaction) => {
    const t = asOriginalType(transaction);
    return t === 'DEPOSIT' ? '+' : '-';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchTransactions}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="text-muted-foreground">Complete history of all your financial transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +₦{totalIncome.toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  -₦{totalExpenses.toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalIncome - totalExpenses >= 0 ? '+' : ''}₦{Math.abs(totalIncome - totalExpenses).toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType} disabled={loading}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Income</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory} disabled={loading}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transaction History ({loading ? '...' : filteredTransactions.length} transactions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('date')} disabled={loading}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('description')} disabled={loading}>
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} disabled={loading}>
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Show skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.timestamp).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.originalType === 'DEPOSIT' ? 'success' :
                        transaction.originalType === 'EXPENSE' ? 'default' : 'destructive'}>
                        {getTransactionTypeLabel(transaction)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.status === 'success' ? 'success' : 
                                transaction.status === 'pending' ? 'warning' : 'destructive'}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${getTransactionColor(transaction)}`}>
                        {getTransactionPrefix(transaction)}₦{(Number(transaction.amount)/100).toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}