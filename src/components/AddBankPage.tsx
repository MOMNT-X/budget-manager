import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Building, CreditCard, Plus, Shield, CheckCircle, AlertTriangle, Trash2, Edit } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  status: 'connected' | 'pending' | 'error';
  lastSync: string;
}

const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'First Bank of Nigeria',
    accountType: 'Savings',
    accountNumber: '****1234',
    routingNumber: '011151003',
    balance: 6250000,
    status: 'connected',
    lastSync: '2024-02-01T10:30:00Z'
  },
  {
    id: '2',
    bankName: 'Guaranty Trust Bank',
    accountType: 'Current',
    accountNumber: '****5678',
    routingNumber: '058152036',
    balance: 2850000,
    status: 'connected',
    lastSync: '2024-02-01T10:25:00Z'
  },
  {
    id: '3',
    bankName: 'Access Bank',
    accountType: 'Credit Card',
    accountNumber: '****9012',
    routingNumber: '044150149',
    balance: -485750,
    status: 'pending',
    lastSync: '2024-01-31T15:20:00Z'
  }
];

const popularBanks = [
  { name: 'First Bank of Nigeria', logo: '🏦' },
  { name: 'Guaranty Trust Bank (GTB)', logo: '🏦' },
  { name: 'Access Bank', logo: '🏦' },
  { name: 'Zenith Bank', logo: '🏦' },
  { name: 'United Bank for Africa (UBA)', logo: '🏦' },
  { name: 'Fidelity Bank', logo: '🏦' },
  { name: 'Sterling Bank', logo: '🏦' },
  { name: 'Stanbic IBTC Bank', logo: '🏦' },
  { name: 'Union Bank of Nigeria', logo: '🏦' },
  { name: 'Ecobank Nigeria', logo: '🏦' },
  { name: 'FCMB (First City Monument Bank)', logo: '🏦' },
  { name: 'Wema Bank', logo: '🏦' }
];

export function AddBankPage() {
  const [selectedBank, setSelectedBank] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const handleConnectBank = () => {
    // Here you would integrate with a service like Plaid or manually add the account
    console.log('Connecting bank account:', {
      selectedBank,
      accountType,
      accountNumber,
      routingNumber,
      accountName
    });
    
    // Reset form
    setSelectedBank("");
    setAccountType("");
    setAccountNumber("");
    setRoutingNumber("");
    setAccountName("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'error': return AlertTriangle;
      default: return Building;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Bank Accounts</h2>
          <p className="text-muted-foreground">Connect your bank accounts to automatically sync transactions</p>
        </div>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your banking information is encrypted and secure. We use bank-level security to protect your data.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          <TabsTrigger value="add-bank">Add Bank Account</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          {/* Connected Accounts Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockBankAccounts.length}</div>
                <p className="text-xs text-muted-foreground">Active connections</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₦{mockBankAccounts.reduce((sum, account) => sum + account.balance, 0).toLocaleString('en-NG')}
                </div>
                <p className="text-xs text-muted-foreground">Across all accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Today</div>
                <p className="text-xs text-muted-foreground">All accounts synced</p>
              </CardContent>
            </Card>
          </div>

          {/* Account List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBankAccounts.map((account) => {
                  const StatusIcon = getStatusIcon(account.status);
                  
                  return (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Building className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{account.bankName}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{account.accountType} {account.accountNumber}</span>
                            <Badge variant="secondary">{account.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last synced: {new Date(account.lastSync).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className={`font-bold ${account.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₦{Math.abs(account.balance).toLocaleString('en-NG')}
                          </p>
                          <div className={`flex items-center space-x-1 text-sm ${getStatusColor(account.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="capitalize">{account.status}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-bank" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick Connect */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Connect</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect to popular banks instantly with secure login
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {popularBanks.map((bank) => (
                    <Button
                      key={bank.name}
                      variant="outline"
                      className="justify-start h-12"
                      onClick={() => setSelectedBank(bank.name)}
                    >
                      <span className="text-lg mr-3">{bank.logo}</span>
                      {bank.name}
                    </Button>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect with Bank Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add your account details manually
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    placeholder="Enter bank name"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    placeholder="My Checking Account"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="account-type">Account Type</Label>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="domiciliary">Domiciliary</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    type="password"
                  />
                </div>

                <div>
                  <Label htmlFor="routing-number">Routing Number</Label>
                  <Input
                    id="routing-number"
                    placeholder="Enter routing number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleConnectBank}
                  className="w-full"
                  disabled={!selectedBank || !accountType || !accountNumber}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Information */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Bank-Level Security</h4>
                    <p className="text-sm text-muted-foreground">
                      We use 256-bit SSL encryption and never store your banking credentials.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Read-Only Access</h4>
                    <p className="text-sm text-muted-foreground">
                      We can only view your transactions and balances, never move money.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}