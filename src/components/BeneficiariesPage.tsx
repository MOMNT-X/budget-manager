import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Building2, Loader2, Plus, Trash2, UserPlus, CheckCircle, Search, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import banks from "./banks";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BASE_URL } from "@/config/api";

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  recipientCode?: string;
  createdAt: string;
}

const BeneficiaryCardSkeleton = () => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
);

export function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    accountNumber: "",
    bankCode: "",
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${BASE_URL}/beneficiaries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch beneficiaries');
      }

      const data = await response.json();
      setBeneficiaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch beneficiaries');
      toast({
        title: "Error",
        description: "Failed to fetch beneficiaries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async () => {
    if (!newBeneficiary.accountNumber || !newBeneficiary.bankCode) {
      toast({
        title: "Error",
        description: "Please enter account number and select a bank",
        variant: "destructive",
      });
      return;
    }
    
    setVerifyingAccount(true);
    setAccountVerified(false);
    setAccountName("");
    
    try {
      const response = await fetch(`${BASE_URL}/paystack/verify-account`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_number: newBeneficiary.accountNumber,
          bank_code: newBeneficiary.bankCode
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify account");
      }

      const data = await response.json();
      setAccountName(data.account_name);
      setAccountVerified(true);
      toast({
        title: "Success",
        description: "Account verified successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Account verification failed",
        variant: "destructive",
      });
      setAccountVerified(false);
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleAddBeneficiary = async () => {
    if (!newBeneficiary.name || !newBeneficiary.accountNumber || !newBeneficiary.bankCode) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!accountVerified) {
      toast({
        title: "Error",
        description: "Please verify account before adding",
        variant: "destructive",
      });
      return;
    }

    try {
      setAddLoading(true);
      setError("");

      const response = await fetch('/beneficiaries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBeneficiary.name,
          accountNumber: newBeneficiary.accountNumber,
          bankCode: newBeneficiary.bankCode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add beneficiary');
      }

      // Refresh beneficiaries
      await fetchBeneficiaries();
      
      // Reset form
      setNewBeneficiary({
        name: "",
        accountNumber: "",
        bankCode: "",
      });
      setAccountVerified(false);
      setAccountName("");
      setShowAddModal(false);
      
      toast({
        title: "Success",
        description: "Beneficiary added successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add beneficiary');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add beneficiary",
        variant: "destructive",
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteBeneficiary = async (id: string) => {
    try {
      setDeleteLoading(id);
      setError("");

      const response = await fetch(`${BASE_URL}/beneficiaries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete beneficiary');
      }

      // Refresh beneficiaries
      await fetchBeneficiaries();
      
      toast({
        title: "Success",
        description: "Beneficiary deleted successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete beneficiary');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete beneficiary",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => 
    beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beneficiary.accountNumber.includes(searchQuery) ||
    beneficiary.bankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBankName = (code: string) => {
    const bank = banks.find(bank => bank.code === code);
    return bank ? bank.name : "Unknown Bank";
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Beneficiaries</h2>
          <p className="text-muted-foreground">
            Manage your saved bank accounts for quick transfers
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add Beneficiary
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 animate-shake">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="relative">
          <Input
            placeholder="Search beneficiaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <BeneficiaryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBeneficiaries.length === 0 ? (
            <div className="text-center py-10 border rounded-lg">
              <p className="text-muted-foreground">No beneficiaries found. Add a new beneficiary to get started.</p>
            </div>
          ) : (
            filteredBeneficiaries.map((beneficiary) => (
              <Card key={beneficiary.id} className="hover:bg-accent/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center space-x-3 mb-3 md:mb-0">
                      <Avatar className="h-10 w-10 bg-primary/10">
                        <User className="h-5 w-5" />
                      </Avatar>
                      <div>
                        <p className="font-medium">{beneficiary.name}</p>
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 text-sm text-muted-foreground">
                          <span>{beneficiary.accountNumber}</span>
                          <span className="hidden md:inline">•</span>
                          <span>{beneficiary.bankName || getBankName(beneficiary.bankCode)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                      disabled={deleteLoading === beneficiary.id}
                      className="self-end md:self-auto"
                    >
                      {deleteLoading === beneficiary.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="ml-2">Remove</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Add Beneficiary Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Beneficiary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter 10-digit account number"
                value={newBeneficiary.accountNumber}
                onChange={(e) => {
                  setNewBeneficiary({ ...newBeneficiary, accountNumber: e.target.value });
                  setAccountVerified(false);
                  setAccountName("");
                }}
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankCode">Bank</Label>
              <div className="relative">
                <Input
                  id="bankSearch"
                  placeholder="Search for a bank"
                  value={bankSearchQuery}
                  onChange={(e) => {
                    setBankSearchQuery(e.target.value);
                    setShowBankList(true);
                  }}
                  onFocus={() => setShowBankList(true)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                
                {showBankList && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                    <ScrollArea className="h-[200px]">
                      {banks
                        .filter(bank => 
                          bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase()) && 
                          bank.supports_transfer
                        )
                        .map(bank => (
                          <div
                            key={bank.code}
                            className="p-2 hover:bg-accent/10 cursor-pointer"
                            onClick={() => {
                              setNewBeneficiary({ ...newBeneficiary, bankCode: bank.code });
                              setBankSearchQuery(bank.name);
                              setShowBankList(false);
                              setAccountVerified(false);
                              setAccountName("");
                            }}
                          >
                            {bank.name}
                          </div>
                        ))
                      }
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>

            {newBeneficiary.accountNumber && newBeneficiary.bankCode && (
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={verifyAccount}
                  disabled={verifyingAccount}
                >
                  {verifyingAccount ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  Verify Account
                </Button>
                
                {accountVerified && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> {accountName}
                  </span>
                )}
              </div>
            )}

            {accountVerified && (
              <div className="space-y-2">
                <Label htmlFor="name">Beneficiary Name</Label>
                <Input
                  id="name"
                  placeholder="Enter a name for this beneficiary"
                  value={newBeneficiary.name || accountName}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewBeneficiary({
                  name: "",
                  accountNumber: "",
                  bankCode: "",
                });
                setAccountVerified(false);
                setAccountName("");
                setShowAddModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBeneficiary}
              disabled={addLoading || !accountVerified || !newBeneficiary.name}
            >
              {addLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Beneficiary
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
