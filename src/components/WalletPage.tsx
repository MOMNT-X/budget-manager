import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { confirm } from "../config/api";
import { Skeleton } from "./ui/skeleton";
import { Wallet, CreditCard, Plus, Minus, ArrowUpRight, ArrowDownLeft, History, DollarSign, TrendingUp, Eye, EyeOff, Copy, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, RefreshCw, CircleCheck as CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

interface WalletData {
  balance: number;
  subaccountCode: string;
  bankName: string;
  accountNumber: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'EXPENSE' | 'INCOME';
  description: string;
  reference: string;
  status: string;
  timestamp: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface MonthlyStats {
  income: number;
  expenses: number;
  netFlow: number;
}

export function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({ income: 0, expenses: 0, netFlow: 0 });
  
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [loading, setLoading] = useState({
    wallet: true,
    transactions: true,
    categories: true,
    action: false
  });
  
  const email = localStorage.getItem("email");
  // Form states
  const [depositAmount, setDepositAmount] = useState("");
  const [depositEmail, setDepositEmail] = useState(`${email}`);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payDescription, setPayDescription] = useState("");
  const [payCategory, setPayCategory] = useState("");

  // API calls
  const api = 'http://localhost:3000'
  const fetchWalletBalance = async () => {
    setLoading(prev => ({ ...prev, wallet: true }));
    try {
      const response = await fetch(`${api}/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch wallet balance');
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      toast.error("Failed to fetch wallet balance");
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoading(prev => ({ ...prev, wallet: false }));
    }
  };

  const fetchTransactions = async () => {
    setLoading(prev => ({ ...prev, transactions: true }));
    try {
      const response = await fetch(`${api}/transactions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
      calculateMonthlyStats(data);
    } catch (error) {
      toast.error("Failed to fetch transactions");
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const response = await fetch(`${api}/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const calculateMonthlyStats = (transactionData: Transaction[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthTransactions = transactionData.filter(t => {
      const transactionDate = new Date(t.timestamp);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const income = thisMonthTransactions
      .filter(t => t.type === 'DEPOSIT' || t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = thisMonthTransactions
      .filter(t => t.type === 'EXPENSE' || t.type === 'WITHDRAWAL')
      .reduce((sum, t) => sum + t.amount, 0);

    setMonthlyStats({
      income,
      expenses,
      netFlow: income - expenses
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
    fetchCategories();
  }, []);

const [showConfirmationModal, setShowConfirmationModal] = useState(false);

const handleRefresh = async () => {
  const reference = localStorage.getItem("depositRef");

  if (reference) {
    try {
      await confirm(); // confirm uses reference internally
      localStorage.removeItem("depositRef");
      setShowConfirmationModal(true); // ✅ trigger modal
    } catch (error) {
      console.warn("Confirmation failed:", error.message);
      // Optional: show fallback toast or silently ignore
    }
  }

  await Promise.all([
    fetchWalletBalance(),
    fetchTransactions()
  ]);

  toast.success("Data refreshed successfully");
};

  const formatCurrency = (amountInKobo: number) => {
    return `₦${(amountInKobo / 100).toLocaleString('en-NG')}`;
  };

  const handleDeposit = async () => {
    if (!depositAmount || !depositEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

setLoading(prev => ({ ...prev, action: true }));

try {
  const response = await fetch(`${api}/wallet/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    },
    body: JSON.stringify({
      amount: parseFloat(depositAmount),
      email: depositEmail
    })
  });

  if (!response.ok) throw new Error('Failed to initiate deposit');

  const result = await response.json();
  localStorage.setItem("depositRef", result.reference);

  if (result.authorizationUrl) {
    window.open(result.authorizationUrl, "_blank");
  }

} catch (error) {
  toast.error("Failed to initiate deposit");
  console.error('Deposit error:', error);
} finally {
  setLoading(prev => ({ ...prev, action: false }));
}
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      toast.error("Please enter withdrawal amount");
      return;
    }

    const amountInKobo = parseFloat(withdrawAmount) * 100;
    if (walletData && amountInKobo > walletData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(prev => ({ ...prev, action: true }));
    try {
      const response = await fetch(`${api}/wallet/withdraw`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) })
      });

      if (!response.ok) throw new Error('Failed to process withdrawal');
      
      const result = await response.json();
      if (result.message) {
        toast.success(result.message);
        setWithdrawAmount("");
        await fetchWalletBalance();
        await fetchTransactions();
      }
    } catch (error) {
      toast.error("Failed to process withdrawal");
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handlePay = async () => {
    if (!payAmount || !payDescription || !payCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amountInKobo = parseFloat(payAmount) * 100;
    if (walletData && amountInKobo > walletData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(prev => ({ ...prev, action: true }));
    try {
      const response = await fetch(`${api}/wallet/pay`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(payAmount),
          description: payDescription,
          categoryId: payCategory
        })
      });

      if (!response.ok) throw new Error('Failed to process payment');
      
      const result = await response.json();
      if (result.message) {
        toast.success(result.message);
        setPayAmount("");
        setPayDescription("");
        setPayCategory("");
        await fetchWalletBalance();
        await fetchTransactions();
      }
    } catch (error) {
      toast.error("Failed to process payment");
      console.error('Payment error:', error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'INCOME': 
        return ArrowDownLeft;
      case 'WITHDRAWAL': 
        return ArrowUpRight;
      case 'EXPENSE': 
        return Minus;
      default: 
        return DollarSign;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'INCOME': 
        return 'text-green-600';
      case 'WITHDRAWAL': 
        return 'text-blue-600';
      case 'EXPENSE': 
        return 'text-red-600';
      default: 
        return 'text-gray-600';
    }
  };

  // Skeleton components
  const WalletBalanceSkeleton = () => (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </span>
          <Skeleton className="h-8 w-8 bg-white/20" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-10 w-48 bg-white/20" />
            <p className="text-white/80 mt-2">Available Balance</p>
          </div>
          
          <div className="flex items-center justify-between text-sm bg-white/10 rounded-lg p-3">
            <div>
              <p className="text-white/80">Account Details</p>
              <Skeleton className="h-4 w-32 bg-white/20 mt-1" />
              <Skeleton className="h-4 w-24 bg-white/20 mt-1" />
            </div>
            <Skeleton className="h-8 w-8 bg-white/20" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 bg-white/20" />
            <Skeleton className="h-10 flex-1 bg-white/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TransactionsSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-20 mb-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {showConfirmationModal && (
  <div className="modal">
    <div className="modal-content">
      <h3> <CheckCircle2 className="h-5 w-5 text-green-500"/> Transaction Confirmed</h3>
      <p>Your deposit has been successfully verified.</p>
      <Button onClick={() => setShowConfirmationModal(false)}>Close</Button>
    </div>
  </div>
)}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Wallet</h2>
          <p className="text-muted-foreground">Manage your funds, make payments and track transactions</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading.wallet || loading.transactions}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(loading.wallet || loading.transactions) ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Wallet Balance Card */}
      {loading.wallet ? (
        <WalletBalanceSkeleton />
      ) : (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Balance
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              >
                {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold">
                  {isBalanceVisible && walletData ? formatCurrency(walletData.balance) : "••••••"}
                </div>
                <p className="text-white/80">Available Balance</p>
              </div>
              
              {walletData && (
                <div className="flex items-center justify-between text-sm bg-white/10 rounded-lg p-3">
                  <div>
                    <p className="text-white/80">Account Details</p>
                    <p className="font-medium">{walletData.bankName}</p>
                    <p className="text-white/90">{walletData.accountNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => copyToClipboard(walletData.accountNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Money
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Money to Wallet</DialogTitle>
                      <DialogDescription>
                        Fund your wallet to make payments and transfers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deposit-amount">Amount (₦)</Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          placeholder="Enter amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deposit-email">Email</Label>
                        <Input
                          id="deposit-email"
                          type="email"
                          placeholder="Enter your email"
                          value={depositEmail}
                          onChange={(e) => setDepositEmail(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleDeposit} 
                        disabled={loading.action || !depositAmount || !depositEmail}
                        className="w-full"
                      >
                        {loading.action ? "Processing..." : "Continue to Payment"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="flex-1">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Withdraw to Bank</DialogTitle>
                      <DialogDescription>
                        Transfer money from your wallet to your bank account
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="withdraw-amount">Amount (₦)</Label>
                        <Input
                          id="withdraw-amount"
                          type="number"
                          placeholder="Enter amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        {walletData && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Available: {formatCurrency(walletData.balance)}
                          </p>
                        )}
                      </div>
                      <Button 
                        onClick={handleWithdraw} 
                        disabled={loading.action || !withdrawAmount}
                        className="w-full"
                      >
                        {loading.action ? "Processing..." : "Withdraw"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="pay">Make Payment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Quick Stats */}
          {loading.transactions ? (
            <StatsSkeleton />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(monthlyStats.income)}
                  </div>
                  <p className="text-xs text-muted-foreground">Money In</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(monthlyStats.expenses)}
                  </div>
                  <p className="text-xs text-muted-foreground">Money Out</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${monthlyStats.netFlow >= 0 ? 'text-blue-500' : 'text-red-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${monthlyStats.netFlow >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(monthlyStats.netFlow))}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transaction History */}
          {loading.transactions ? (
            <TransactionsSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.slice(0, 10).map((transaction) => {
                      const Icon = getTransactionIcon(transaction.type);
                      const category = categories.find(c => c.id === transaction.categoryId);
                      
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-muted ${getTransactionColor(transaction.type)}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{transaction.reference}</span>
                                <Badge variant={transaction.status === 'success' ? 'default' : 'secondary'}>
                                  {transaction.status}
                                </Badge>
                                {category && (
                                  <span className="flex items-center gap-1">
                                    {category.icon && category.icon} {category.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                              {(transaction.type === 'DEPOSIT' || transaction.type === 'INCOME') ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pay for expenses and track them against your budget
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pay-amount">Amount (₦)</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="pay-description">Description</Label>
                <Input
                  id="pay-description"
                  placeholder="What is this payment for?"
                  value={payDescription}
                  onChange={(e) => setPayDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="pay-category">Category</Label>
                {loading.categories ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={payCategory} onValueChange={setPayCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="flex items-center gap-2">
                            {category.icon && category.icon} {category.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {walletData && payAmount && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Balance after payment: {formatCurrency(walletData.balance - (parseFloat(payAmount) * 100))}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handlePay}
                disabled={loading.action || loading.categories || !payAmount || !payDescription || !payCategory}
                className="w-full"
              >
                {loading.action ? "Processing..." : "Make Payment"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {loading.transactions || loading.categories ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-2 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categories.slice(0, 4).map((category) => {
                      const categoryExpenses = transactions
                        .filter(t => t.categoryId === category.id && (t.type === 'EXPENSE'))
                        .reduce((sum, t) => sum + t.amount, 0);
                      
                      const totalExpenses = monthlyStats.expenses || 1;
                      const percentage = (categoryExpenses / totalExpenses) * 100;
                      
                      return (
                        <div key={category.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{category.icon || '📁'}</span>
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(categoryExpenses)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {loading.transactions ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                    <div className="pt-2">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Total Income</span>
                      <span className="font-bold text-green-600">{formatCurrency(monthlyStats.income)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Total Expenses</span>
                      <span className="font-bold text-red-600">{formatCurrency(monthlyStats.expenses)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Net Savings</span>
                      <span className={`font-bold ${monthlyStats.netFlow >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(monthlyStats.netFlow))}
                      </span>
                    </div>
                    <div className="pt-2">
                      {monthlyStats.income > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {monthlyStats.netFlow >= 0 
                            ? `You saved ${((monthlyStats.netFlow / monthlyStats.income) * 100).toFixed(1)}% of your income this month! 🎉`
                            : `You overspent by ${((Math.abs(monthlyStats.netFlow) / monthlyStats.income) * 100).toFixed(1)}% this month 📉`
                          }
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Start adding transactions to see your monthly summary
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}