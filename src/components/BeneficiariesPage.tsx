import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle, Building2, Loader2, Plus, Trash2, UserPlus, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";
import { getBeneficiaries, createBeneficiary, deleteBeneficiary, getBankList, resolveAccountNumber } from "../config/api";
import { toast } from "sonner";

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  paystackRecipientCode?: string;
  createdAt: string;
}

interface Bank {
  name: string;
  code: string;
  active: boolean;
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
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    accountNumber: '',
    bankCode: '',
    bankName: ''
  });

  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [beneficiariesData, banksData] = await Promise.all([
        getBeneficiaries(),
        getBankList()
      ]);
      setBeneficiaries(beneficiariesData);
      setBanks(banksData.filter((bank: Bank) => bank.active));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load beneficiaries';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!newBeneficiary.accountNumber || !newBeneficiary.bankCode) {
      toast.error("Please provide account number and select a bank");
      return;
    }

    try {
      setVerifyLoading(true);
      setError("");
      const result = await resolveAccountNumber(
        newBeneficiary.accountNumber,
        newBeneficiary.bankCode
      );

      setVerifiedName(result.account_name);
      setNewBeneficiary({
        ...newBeneficiary,
        name: result.account_name
      });
      toast.success(`Account verified: ${result.account_name}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify account';
      setError(errorMessage);
      toast.error(errorMessage);
      setVerifiedName(null);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleAddBeneficiary = async () => {
    if (!verifiedName) {
      toast.error("Please verify the account first");
      return;
    }

    try {
      setAddLoading(true);
      setError("");

      const selectedBank = banks.find(b => b.code === newBeneficiary.bankCode);

      await createBeneficiary({
        name: newBeneficiary.name,
        accountNumber: newBeneficiary.accountNumber,
        bankCode: newBeneficiary.bankCode,
        bankName: selectedBank?.name || newBeneficiary.bankName
      });

      toast.success("Beneficiary added successfully");
      await fetchData();

      setNewBeneficiary({
        name: '',
        accountNumber: '',
        bankCode: '',
        bankName: ''
      });
      setVerifiedName(null);
      setShowAddModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add beneficiary';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteBeneficiary = async (id: string) => {
    if (!confirm("Are you sure you want to delete this beneficiary?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError("");
      await deleteBeneficiary(id);
      toast.success("Beneficiary deleted successfully");
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete beneficiary';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  const resetForm = () => {
    setNewBeneficiary({
      name: '',
      accountNumber: '',
      bankCode: '',
      bankName: ''
    });
    setVerifiedName(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BeneficiaryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Beneficiaries</h2>
          <p className="text-muted-foreground">Manage your saved payment recipients</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Beneficiary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Beneficiary
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bankCode">Bank</Label>
                <Select
                  value={newBeneficiary.bankCode}
                  onValueChange={(value) => {
                    const selectedBank = banks.find(b => b.code === value);
                    setNewBeneficiary({
                      ...newBeneficiary,
                      bankCode: value,
                      bankName: selectedBank?.name || ''
                    });
                    setVerifiedName(null);
                  }}
                  disabled={addLoading || verifyLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="0123456789"
                    maxLength={10}
                    value={newBeneficiary.accountNumber}
                    onChange={(e) => {
                      setNewBeneficiary({...newBeneficiary, accountNumber: e.target.value});
                      setVerifiedName(null);
                    }}
                    disabled={addLoading || verifyLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyAccount}
                    disabled={
                      !newBeneficiary.accountNumber ||
                      !newBeneficiary.bankCode ||
                      newBeneficiary.accountNumber.length !== 10 ||
                      verifyLoading ||
                      addLoading
                    }
                  >
                    {verifyLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </div>

              {verifiedName && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Account Name: <strong>{verifiedName}</strong>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                Enter the account number and click "Verify" to confirm the account details before adding.
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={addLoading || verifyLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBeneficiary}
                disabled={
                  addLoading ||
                  verifyLoading ||
                  !verifiedName
                }
              >
                {addLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Beneficiary
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && !showAddModal && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {beneficiaries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Beneficiaries Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add beneficiaries to make payments faster and easier
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Beneficiary
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {beneficiaries.map((beneficiary) => (
            <Card key={beneficiary.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{beneficiary.name}</h3>
                      <p className="text-sm text-muted-foreground">{beneficiary.bankName}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {beneficiary.accountNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added {new Date(beneficiary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                    disabled={deleteLoading === beneficiary.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleteLoading === beneficiary.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
