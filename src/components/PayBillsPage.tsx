import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { AlertCircle, CheckCircle, Clock, CreditCard, Building, Zap, Car, Home, Phone, Wifi } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  autoPayEnabled: boolean;
  budgetCategory: string;
  icon: any;
}

const mockBills: Bill[] = [
  {
    id: '1',
    name: 'EKEDC Electric Bill',
    category: 'Bills & Utilities',
    amount: 28500,
    dueDate: '2024-02-15',
    status: 'pending',
    autoPayEnabled: true,
    budgetCategory: 'Bills & Utilities',
    icon: Zap
  },
  {
    id: '2',
    name: 'MTN Internet Service',
    category: 'Bills & Utilities',
    amount: 25000,
    dueDate: '2024-02-18',
    status: 'pending',
    autoPayEnabled: false,
    budgetCategory: 'Bills & Utilities',
    icon: Wifi
  },
  {
    id: '3',
    name: 'Leadway Car Insurance',
    category: 'Transportation',
    amount: 58500,
    dueDate: '2024-02-20',
    status: 'pending',
    autoPayEnabled: true,
    budgetCategory: 'Transportation',
    icon: Car
  },
  {
    id: '4',
    name: 'Apartment Rent - Lagos',
    category: 'Housing',
    amount: 450000,
    dueDate: '2024-02-01',
    status: 'paid',
    autoPayEnabled: false,
    budgetCategory: 'Bills & Utilities',
    icon: Home
  },
  {
    id: '5',
    name: 'Airtel Phone Bill',
    category: 'Bills & Utilities',
    amount: 22000,
    dueDate: '2024-02-10',
    status: 'overdue',
    autoPayEnabled: false,
    budgetCategory: 'Bills & Utilities',
    icon: Phone
  },
  {
    id: '6',
    name: 'DSTV Subscription',
    category: 'Entertainment',
    amount: 15700,
    dueDate: '2024-02-12',
    status: 'pending',
    autoPayEnabled: true,
    budgetCategory: 'Entertainment',
    icon: Wifi
  }
];

const budgetAllocations = {
  'Bills & Utilities': { allocated: 350000, spent: 175500, remaining: 174500 },
  'Transportation': { allocated: 125000, spent: 58500, remaining: 66500 },
  'Housing': { allocated: 450000, spent: 450000, remaining: 0 },
  'Entertainment': { allocated: 50000, spent: 15700, remaining: 34300 }
};

export function PayBillsPage() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const pendingBills = mockBills.filter(bill => bill.status === 'pending');
  const overdueBills = mockBills.filter(bill => bill.status === 'overdue');
  const totalPending = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalOverdue = overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  const handlePayBill = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentAmount(bill.amount.toString());
  };

  const processPayment = () => {
    if (selectedBill) {
      // Here you would process the payment
      console.log(`Processing payment of $${paymentAmount} for ${selectedBill.name}`);
      setSelectedBill(null);
      setPaymentAmount("");
      setPaymentMethod("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pay Bills</h2>
          <p className="text-muted-foreground">Manage and pay your bills securely via Paystack & Interswitch</p>
        </div>
        <Button>
          <Building className="h-4 w-4 mr-2" />
          Add Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalPending.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">{pendingBills.length} bills due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Bills</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{totalOverdue.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">{overdueBills.length} bills overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Pay Enabled</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBills.filter(bill => bill.autoPayEnabled).length}
            </div>
            <p className="text-xs text-muted-foreground">out of {mockBills.length} bills</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Alert */}
      {overdueBills.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {overdueBills.length} overdue bills totaling ₦{totalOverdue.toLocaleString('en-NG')}. 
            Pay them now to avoid late fees.
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Status */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(budgetAllocations).map(([category, budget]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category}</span>
                  <span className="text-sm text-muted-foreground">
                    ₦{budget.spent.toLocaleString('en-NG')} / ₦{budget.allocated.toLocaleString('en-NG')}
                  </span>
                </div>
                <Progress 
                  value={(budget.spent / budget.allocated) * 100} 
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  ₦{budget.remaining.toLocaleString('en-NG')} remaining
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBills.map((bill) => {
                const IconComponent = bill.icon;
                const StatusIcon = getStatusIcon(bill.status);
                
                return (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{bill.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                          <Badge variant="secondary">{bill.category}</Badge>
                          {bill.autoPayEnabled && (
                            <Badge variant="outline">Auto-Pay</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold">₦{bill.amount.toLocaleString('en-NG')}</p>
                        <div className={`flex items-center space-x-1 text-sm ${getStatusColor(bill.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{bill.status}</span>
                        </div>
                      </div>
                      {bill.status !== 'paid' && (
                        <Button size="sm" onClick={() => handlePayBill(bill)}>
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedBill ? `Pay ${selectedBill.name}` : 'Select a Bill to Pay'}
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
                  />
                </div>

                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">GTB Savings Account (****1234)</SelectItem>
                      <SelectItem value="current">First Bank Current Account (****5678)</SelectItem>
                      <SelectItem value="credit">Access Bank Credit Card (****9012)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Bill:</span>
                      <span>{selectedBill.name}</span>
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
                      <span>Budget Category:</span>
                      <span>{selectedBill.budgetCategory}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                    🔒 Payments are processed securely through Paystack or Interswitch payment gateways
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={processPayment} disabled={!paymentMethod || !paymentAmount}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedBill(null)}>
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