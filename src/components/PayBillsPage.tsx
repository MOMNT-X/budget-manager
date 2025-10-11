import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock, CreditCard, Building, Zap, Car, Home, Phone, Wifi, Loader2, Plus, Calendar, X, Building2 as Bank, User, Search, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import banks  from "@/components/banks";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationModal, EnhancedToast } from "@/components/notification-modal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BASE_URL } from "@/config/api";

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
  billStatus: 'PENDING' | 'PAID' | 'OVERDUE' | 'FAILED';
  autoPay: boolean;
  currency: string;
  category: {
    id: string;
    name: string;
    icon: string;
  };
}

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  recipientCode?: string;
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
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pay-bills");
  const isMobile = useMediaQuery("(max-width: 768px)");
  
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

    const [showPaymentTransferModal, setShowPaymentTransferModal] = useState(false);
  const [paymentTransferData, setPaymentTransferData] = useState({
    beneficiaryId: "",
    recipientAccountNumber: "",
    recipientAccountName: "",
    recipientBankCode: "",
    recipientBankName: "",
  });
  const [verifyingPaymentAccount, setVerifyingPaymentAccount] = useState(false);
  const [paymentAccountVerified, setPaymentAccountVerified] = useState(false);
  const [showPaymentBankList, setShowPaymentBankList] = useState(false);
  const [paymentBankSearchQuery, setPaymentBankSearchQuery] = useState("");

  // ADD NOTIFICATION STATE
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // HELPER FUNCTION TO SHOW NOTIFICATIONS
  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };
  
  // Bank Transfer States
  const [bankTransfer, setBankTransfer] = useState({
    accountNumber: "",
    bankCode: "",
    amount: "",
    description: "",
    saveBeneficiary: false,
    beneficiaryName: ""
  });
  const [isBankTransferLoading, setIsBankTransferLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);

  useEffect(() => {
    fetchBills();
    fetchCategories();
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/beneficiaries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const beneficiariesData = await response.json();
      if (!response.ok) throw new Error(beneficiariesData?.message || 'Failed to fetch beneficiaries');
      setBeneficiaries(beneficiariesData);
    } catch (err) {
      console.error('Failed to fetch beneficiaries:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const categoriesData = await response.json();
      if (!response.ok) throw new Error(categoriesData?.message || 'Failed to fetch categories');
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
      const response = await fetch(`${BASE_URL}/bills`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const billsData = await response.json();
      if (!response.ok) throw new Error(billsData?.message || 'Failed to fetch bills');
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
    setPaymentAmount((bill.amount / 100).toString());
    setPaymentMethod("wallet"); // Auto-select wallet
    
    // Open the transfer modal for bank details
    setShowPaymentTransferModal(true);
    
    // Reset transfer data
    setPaymentTransferData({
      beneficiaryId: "",
      recipientAccountNumber: "",
      recipientAccountName: "",
      recipientBankCode: "",
      recipientBankName: "",
    });
    setPaymentAccountVerified(false);
  };

  // VERIFY ACCOUNT FOR BILL PAYMENT
  const verifyPaymentAccount = async () => {
    if (!paymentTransferData.recipientAccountNumber || !paymentTransferData.recipientBankCode) {
      showNotification('error', 'Validation Error', 'Please enter account number and select a bank');
      return;
    }
    
    setVerifyingPaymentAccount(true);
    
    try {
      const response = await fetch(`${BASE_URL}/paystack/verify-account`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber: paymentTransferData.recipientAccountNumber,
          bankCode: paymentTransferData.recipientBankCode
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to verify account");
      
      setPaymentTransferData(prev => ({
        ...prev,
        recipientAccountName: data.account_name
      }));
      setPaymentAccountVerified(true);
      
      showNotification('success', 'Account Verified', `Account belongs to ${data.account_name}`);
      
    } catch (err) {
      showNotification('error', 'Verification Failed', err instanceof Error ? err.message : "Account verification failed");
      setPaymentAccountVerified(false);
    } finally {
      setVerifyingPaymentAccount(false);
    }
  };

  // SELECT BENEFICIARY FOR BILL PAYMENT
  const selectBeneficiaryForPayment = (beneficiary: Beneficiary) => {
    setPaymentTransferData({
      beneficiaryId: beneficiary.id,
      recipientAccountNumber: beneficiary.accountNumber,
      recipientAccountName: beneficiary.name,
      recipientBankCode: beneficiary.bankCode,
      recipientBankName: beneficiary.bankName,
    });
    setPaymentAccountVerified(true); // Beneficiaries are pre-verified
  };

  // PROCESS BILL PAYMENT WITH TRANSFER
  const processPaymentWithTransfer = async () => {
    if (!selectedBill) return;

    // Validate
    if (!paymentAccountVerified && !paymentTransferData.beneficiaryId) {
      showNotification('error', 'Verification Required', 'Please verify the account before proceeding');
      return;
    }

    if (!paymentTransferData.recipientAccountNumber || !paymentTransferData.recipientBankCode) {
      showNotification('error', 'Missing Information', 'Please provide complete bank account details');
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      // Prepare the request body
      const requestBody: any = {};
      
      if (paymentTransferData.beneficiaryId) {
        requestBody.beneficiaryId = paymentTransferData.beneficiaryId;
      } else {
        requestBody.recipientAccountNumber = paymentTransferData.recipientAccountNumber;
        requestBody.recipientBankCode = paymentTransferData.recipientBankCode;
        requestBody.recipientBankName = paymentTransferData.recipientBankName;
      }

      const response = await fetch(`${BASE_URL}/bills/${selectedBill.id}/pay-transfer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || 'Failed to process payment');

      // SUCCESS
      showNotification(
        'success',
        'Payment Successful!',
        `Your bill payment of ₦${(selectedBill.amount / 100).toLocaleString('en-NG')} for ${selectedBill.description} has been initiated. Transfer to ${paymentTransferData.recipientAccountName} is being processed.`
      );

      // Refresh bills
      await fetchBills();
      
      // Reset form and close modals
      setSelectedBill(null);
      setPaymentAmount("");
      setPaymentMethod("");
      setShowPaymentTransferModal(false);
      setPaymentTransferData({
        beneficiaryId: "",
        recipientAccountNumber: "",
        recipientAccountName: "",
        recipientBankCode: "",
        recipientBankName: "",
      });
      setPaymentAccountVerified(false);

    } catch (err) {
      showNotification(
        'error',
        'Payment Failed',
        err instanceof Error ? err.message : 'Unable to process payment. Please check your wallet balance and try again.'
      );
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Filter banks for payment
  const filteredPaymentBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(paymentBankSearchQuery.toLowerCase()) ||
    bank.code.toLowerCase().includes(paymentBankSearchQuery.toLowerCase())
  );

  const handleAddBill = async () => {
    try {
      setAddBillLoading(true);
      setError("");

      const response = await fetch(`${BASE_URL}/bills`, {
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
      s

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create bill');
      }
      
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
      showNotification('error', 'Error', err instanceof Error ? err.message : 'Failed to create bill');
    } finally {
      setAddBillLoading(false);
      setShowAddBillModal(false);
      showNotification('success', 'Bill Added', 'New bill has been added successfully');
      resetAddBillForm();
      // Refresh bills after successful creation
      await fetchBills();
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
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wallet">Wallet Balance (Transfer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You'll need to provide bank account details to complete this payment
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowPaymentTransferModal(true)}
                  disabled={!paymentMethod || !paymentAmount}
                  className="flex-1"
                >
                  <Bank className="h-4 w-4 mr-2" />
                  Enter Bank Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedBill(null)}
                >
                  Cancel
                </Button>
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

      {/* BANK TRANSFER MODAL FOR BILL PAYMENT */}
      <Dialog open={showPaymentTransferModal} onOpenChange={setShowPaymentTransferModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bank className="h-5 w-5" />
              Bill Payment - Bank Transfer
            </DialogTitle>
            <DialogDescription>
              Enter the bank account details where this bill payment should be sent
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Beneficiaries Section */}
            {beneficiaries.length > 0 && (
              <div className="space-y-2">
                <Label>Saved Beneficiaries (Optional)</Label>
                <ScrollArea className="h-32 border rounded-lg p-2">
                  <div className="space-y-2">
                    {beneficiaries.map((beneficiary) => (
                      <div
                        key={beneficiary.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                          paymentTransferData.beneficiaryId === beneficiary.id ? 'bg-primary/10 border-primary' : ''
                        }`}
                        onClick={() => selectBeneficiaryForPayment(beneficiary)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{beneficiary.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {beneficiary.accountNumber} • {beneficiary.bankName}
                            </p>
                          </div>
                          {paymentTransferData.beneficiaryId === beneficiary.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or enter new account details
                </span>
              </div>
            </div>

            {/* Bank Selection */}
            <div className="space-y-2">
              <Label>Bank</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowPaymentBankList(!showPaymentBankList)}
                  disabled={!!paymentTransferData.beneficiaryId}
                >
                  {paymentTransferData.recipientBankName || "Select Bank"}
                  <Search className="h-4 w-4 ml-2" />
                </Button>

                {showPaymentBankList && !paymentTransferData.beneficiaryId && (
                  <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg">
                    <div className="p-2">
                      <Input
                        placeholder="Search banks..."
                        value={paymentBankSearchQuery}
                        onChange={(e) => setPaymentBankSearchQuery(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <ScrollArea className="h-64">
                      {filteredPaymentBanks.map((bank) => (
                        <div
                          key={bank.code}
                          className="px-4 py-2 hover:bg-muted cursor-pointer"
                          onClick={() => {
                            setPaymentTransferData(prev => ({
                              ...prev,
                              recipientBankCode: bank.code,
                              recipientBankName: bank.name,
                            }));
                            setShowPaymentBankList(false);
                            setPaymentBankSearchQuery("");
                            setPaymentAccountVerified(false);
                          }}
                        >
                          <p className="font-medium">{bank.name}</p>
                          <p className="text-sm text-muted-foreground">{bank.code}</p>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="recipient-account">Account Number</Label>
              <div className="flex gap-2">
                <Input
                  id="recipient-account"
                  placeholder="0123456789"
                  value={paymentTransferData.recipientAccountNumber}
                  onChange={(e) => {
                    setPaymentTransferData(prev => ({
                      ...prev,
                      recipientAccountNumber: e.target.value,
                      recipientAccountName: "",
                    }));
                    setPaymentAccountVerified(false);
                  }}
                  disabled={!!paymentTransferData.beneficiaryId}
                  maxLength={10}
                />
                <Button
                  onClick={verifyPaymentAccount}
                  disabled={
                    verifyingPaymentAccount || 
                    paymentAccountVerified || 
                    !paymentTransferData.recipientAccountNumber || 
                    !paymentTransferData.recipientBankCode ||
                    !!paymentTransferData.beneficiaryId
                  }
                >
                  {verifyingPaymentAccount ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : paymentAccountVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verified
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </div>

            {/* Account Name Display */}
            {paymentTransferData.recipientAccountName && (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Account Name:</strong> {paymentTransferData.recipientAccountName}
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Summary */}
            {selectedBill && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold">Payment Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Bill:</span>
                  <span className="font-medium">{selectedBill.description}</span>
                  
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">₦{(selectedBill.amount / 100).toLocaleString('en-NG')}</span>
                  
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="font-medium">
                    {paymentTransferData.recipientAccountName || 'Not verified'}
                  </span>
                  
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-medium">
                    {paymentTransferData.recipientBankName || 'Not selected'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentTransferModal(false);
                setPaymentTransferData({
                  beneficiaryId: "",
                  recipientAccountNumber: "",
                  recipientAccountName: "",
                  recipientBankCode: "",
                  recipientBankName: "",
                });
                setPaymentAccountVerified(false);
              }}
              disabled={paymentLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={processPaymentWithTransfer}
              disabled={
                paymentLoading ||
                (!paymentAccountVerified && !paymentTransferData.beneficiaryId) ||
                !paymentTransferData.recipientAccountNumber ||
                !paymentTransferData.recipientBankCode
              }
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Payment
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* NOTIFICATION MODAL */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* <EnhancedToast
        isOpen={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      /> */}
      </div>
    </div>
  );
}