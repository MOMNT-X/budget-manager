import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { AlertCircle, CheckCircle, Clock, CreditCard, Building, Zap, Car, Home, Phone, Wifi, Loader2, Plus, Calendar, X, Send, Users } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";

interface Category {
  id: string;
  name: string;
  icon: string;
  budgetLimit?: number;
  spent?: number;
}

interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  billStatus: 'PENDING' | 'PAID';
  autoPay: boolean;
  currency: string;
  category: {
    id: string;
    name: string;
    icon: string;
  };
}

interface BillsSummary {
  pending: { count: number; total: number };
  overdue: { count: number; total: number };
  autoPayEnabled: number;
}

// Icon mapping for categories
const getIconForCategory = (categoryName: string, iconName?: string) => {
  const iconMap: { [key: string]: any } = {
    'Bills & Utilities': Zap,
    'Transportation': Car,
    'Housing': Home,
    'Entertainment': Wifi,
    'Communication': Phone,
    'Internet': Wifi,
    'Electric': Zap,
    'Insurance': Car,
    'Rent': Calendar,
    'Phone': Phone,
    'default': Building
  };

  return iconMap[categoryName] || iconMap[iconName || 'default'] || Building;
};

// Skeleton components
const BillCardSkeleton = () => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex space-x-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="text-right space-y-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

const SummaryCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-28 mb-1" />
      <Skeleton className="h-3 w-16" />
    </CardContent>
  </Card>
);

export function PayBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<BillsSummary | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Add Bill Modal States
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [addBillLoading, setAddBillLoading] = useState(false);
  const [newBill, setNewBill] = useState({
    categoryId: '',
    amount: '',
    description: '',
    dueDate: '',
    autoPay: false
  });

  useEffect(() => {
    fetchBills();
    fetchCategories();
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await fetch('http://localhost:3000/beneficiaries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch beneficiaries');
      }

      const beneficiariesData = await response.json();
      setBeneficiaries(beneficiariesData);
    } catch (err) {
      console.error('Failed to fetch beneficiaries:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch all bills
      const response = await fetch('http://localhost:3000/bills', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }

      const billsData = await response.json();
      setBills(billsData);

      // Calculate summary
      const now = new Date();
      const pending = billsData.filter((bill: Bill) => 
        bill.billStatus === 'PENDING' && new Date(bill.dueDate) >= now
      );
      const overdue = billsData.filter((bill: Bill) => 
        bill.billStatus === 'PENDING' && new Date(bill.dueDate) < now
      );
      const autoPayEnabled = billsData.filter((bill: Bill) => bill.autoPay).length;

      setSummary({
        pending: {
          count: pending.length,
          total: pending.reduce((sum: number, bill: Bill) => sum + bill.amount, 0)
        },
        overdue: {
          count: overdue.length,
          total: overdue.reduce((sum: number, bill: Bill) => sum + bill.amount, 0)
        },
        autoPayEnabled
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentAmount((bill.amount / 100).toString()); // Convert from kobo to naira
  };

  const processPayment = async () => {
    if (!selectedBill) return;

    try {
      setPaymentLoading(true);
      setError("");

      let response;

      if (paymentMethod === 'transfer' && selectedBeneficiary) {
        const beneficiary = beneficiaries.find(b => b.id === selectedBeneficiary);
        if (!beneficiary) {
          throw new Error('Beneficiary not found');
        }

        response = await fetch(`http://localhost:3000/bills/${selectedBill.id}/pay-transfer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountNumber: beneficiary.accountNumber,
            accountName: beneficiary.name,
            bankCode: beneficiary.bankCode,
            bankName: beneficiary.bankName
          }),
        });
      } else {
        response = await fetch(`http://localhost:3000/bills/${selectedBill.id}/pay`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      // Refresh bills after successful payment
      await fetchBills();

      // Reset form
      setSelectedBill(null);
      setPaymentAmount("");
      setPaymentMethod("wallet");
      setSelectedBeneficiary("");

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleAddBill = async () => {
    try {
      setAddBillLoading(true);
      setError("");

      const response = await fetch('http://localhost:3000/bills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: newBill.categoryId,
          amount: parseFloat(newBill.amount),
          description: newBill.description,
          dueDate: newBill.dueDate,
          autoPay: newBill.autoPay
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create bill');
      }

      // Refresh bills after successful creation
      await fetchBills();
      
      // Reset form and close modal
      setNewBill({
        categoryId: '',
        amount: '',
        description: '',
        dueDate: '',
        autoPay: false
      });
      setShowAddBillModal(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bill');
    } finally {
      setAddBillLoading(false);
    }
  };

  const resetAddBillForm = () => {
    setNewBill({
      categoryId: '',
      amount: '',
      description: '',
      dueDate: '',
      autoPay: false
    });
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'PAID') return 'text-green-600';
    if (status === 'PENDING' && new Date(dueDate) < new Date()) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    if (status === 'PAID') return CheckCircle;
    if (status === 'PENDING' && new Date(dueDate) < new Date()) return AlertCircle;
    return Clock;
  };

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'PAID') return 'paid';
    if (status === 'PENDING' && new Date(dueDate) < new Date()) return 'overdue';
    return 'pending';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>

        {/* Bills List */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <BillCardSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Skeleton className="h-12 w-12 mx-auto mb-4" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const overdueBills = bills.filter(bill => 
    bill.billStatus === 'PENDING' && new Date(bill.dueDate) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pay Bills</h2>
          <p className="text-muted-foreground">Manage and pay your bills securely</p>
        </div>
        <Dialog open={showAddBillModal} onOpenChange={setShowAddBillModal}>
          <DialogTrigger asChild>
            <Button>
              <Building className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Bill
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newBill.categoryId} 
                    onValueChange={(value) => setNewBill({...newBill, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const IconComponent = getIconForCategory(category.name, category.icon);
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {category.name}
                              {category.budgetLimit && (
                                <span className="text-xs text-muted-foreground">
                                  (₦{(category.budgetLimit / 100).toLocaleString('en-NG')} budget)
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newBill.amount}
                    onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Bill Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., EKEDC Electric Bill, MTN Internet Service"
                  value={newBill.description}
                  onChange={(e) => setNewBill({...newBill, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoPay"
                  checked={newBill.autoPay}
                  onCheckedChange={(checked) => setNewBill({...newBill, autoPay: !!checked})}
                />
                <Label htmlFor="autoPay" className="text-sm font-normal">
                  Enable Auto-Pay (automatically pay when due)
                </Label>
              </div>

              {/* Budget Warning */}
              {newBill.categoryId && newBill.amount && (
                (() => {
                  const category = categories.find(c => c.id === newBill.categoryId);
                  const billAmount = parseFloat(newBill.amount) * 100; // Convert to kobo
                  const currentSpent = category?.spent || 0;
                  const budgetLimit = category?.budgetLimit || 0;
                  const newTotal = currentSpent + billAmount;
                  
                  if (budgetLimit > 0 && newTotal > budgetLimit) {
                    return (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This bill will exceed your budget limit by ₦{((newTotal - budgetLimit) / 100).toLocaleString('en-NG')}
                        </AlertDescription>
                      </Alert>
                    );
                  }
                  
                  if (budgetLimit > 0 && newTotal > budgetLimit * 0.8) {
                    return (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This bill will use {Math.round((newTotal / budgetLimit) * 100)}% of your budget for {category?.name}
                        </AlertDescription>
                      </Alert>
                    );
                  }
                  
                  return null;
                })()
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddBillModal(false);
                  resetAddBillForm();
                }}
                disabled={addBillLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddBill}
                disabled={
                  addBillLoading || 
                  !newBill.categoryId || 
                  !newBill.amount || 
                  !newBill.description || 
                  !newBill.dueDate
                }
              >
                {addBillLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Bill
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(summary.pending.total / 100).toLocaleString('en-NG')}</div>
              <p className="text-xs text-muted-foreground">{summary.pending.count} bills due</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Bills</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₦{(summary.overdue.total / 100).toLocaleString('en-NG')}</div>
              <p className="text-xs text-muted-foreground">{summary.overdue.count} bills overdue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Pay Enabled</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.autoPayEnabled}</div>
              <p className="text-xs text-muted-foreground">out of {bills.length} bills</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overdue Alert */}
      {overdueBills.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {overdueBills.length} overdue bills totaling ₦{(overdueBills.reduce((sum, bill) => sum + bill.amount, 0) / 100).toLocaleString('en-NG')}. 
            Pay them now to avoid late fees.
          </AlertDescription>
        </Alert>
      )}

      {/* Bills List */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {bills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bills found. Create your first bill to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bills.map((bill) => {
                  const IconComponent = getIconForCategory(bill.category.name, bill.category.icon);
                  const StatusIcon = getStatusIcon(bill.billStatus, bill.dueDate);
                  const statusText = getStatusText(bill.billStatus, bill.dueDate);
                  
                  return (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{bill.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                            <Badge variant="secondary">{bill.category.name}</Badge>
                            {bill.autoPay && (
                              <Badge variant="outline">Auto-Pay</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-bold">₦{(bill.amount / 100).toLocaleString('en-NG')}</p>
                          <div className={`flex items-center space-x-1 text-sm ${getStatusColor(bill.billStatus, bill.dueDate)}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="capitalize">{statusText}</span>
                          </div>
                        </div>
                        {bill.billStatus !== 'PAID' && (
                          <Button size="sm" onClick={() => handlePayBill(bill)}>
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedBill ? `Pay ${selectedBill.description}` : 'Select a Bill to Pay'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBill ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Payment Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    step="0.01"
                    disabled={paymentLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={paymentLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallet">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Wallet Balance
                        </div>
                      </SelectItem>
                      <SelectItem value="transfer">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'transfer' && (
                  <div>
                    <Label htmlFor="beneficiary">Select Beneficiary</Label>
                    <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary} disabled={paymentLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose beneficiary" />
                      </SelectTrigger>
                      <SelectContent>
                        {beneficiaries.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            No beneficiaries found. Add one first.
                          </div>
                        ) : (
                          beneficiaries.map((beneficiary) => (
                            <SelectItem key={beneficiary.id} value={beneficiary.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{beneficiary.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {beneficiary.bankName} - {beneficiary.accountNumber}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {beneficiaries.length === 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        Go to Beneficiaries page to add payment recipients
                      </p>
                    )}
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Bill:</span>
                      <span>{selectedBill.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>₦{parseFloat(paymentAmount || '0').toLocaleString('en-NG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>{new Date(selectedBill.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{selectedBill.category.name}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                    🔒 Payments are processed securely through your wallet balance
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={processPayment}
                      disabled={
                        !paymentMethod ||
                        !paymentAmount ||
                        paymentLoading ||
                        (paymentMethod === 'transfer' && !selectedBeneficiary)
                      }
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'transfer' ? (
                            <Send className="h-4 w-4 mr-2" />
                          ) : (
                            <CreditCard className="h-4 w-4 mr-2" />
                          )}
                          {paymentMethod === 'transfer' ? 'Transfer Payment' : 'Process Payment'}
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedBill(null)}
                      disabled={paymentLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a bill from the list to make a payment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}