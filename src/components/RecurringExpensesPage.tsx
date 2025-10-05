import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle, Repeat, Loader2, Plus, Trash2, Pause, Play, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { getRecurringExpenses, createRecurringExpense, updateRecurringExpense, deleteRecurringExpense, getCategories } from "../config/api";
import { toast } from "sonner";

interface RecurringExpense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  nextDueDate: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

const RecurringExpenseCardSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>
);

export function RecurringExpensesPage() {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    categoryId: '',
    frequency: 'MONTHLY' as RecurringExpense['frequency'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [expensesData, categoriesData] = await Promise.all([
        getRecurringExpenses(),
        getCategories()
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recurring expenses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description || !newExpense.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setAddLoading(true);
      setError("");

      await createRecurringExpense({
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        categoryId: newExpense.categoryId,
        frequency: newExpense.frequency,
        startDate: newExpense.startDate,
        endDate: newExpense.endDate || undefined,
        isActive: newExpense.isActive
      });

      toast.success("Recurring expense created successfully");
      await fetchData();

      setNewExpense({
        amount: '',
        description: '',
        categoryId: '',
        frequency: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true
      });
      setShowAddModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create recurring expense';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAddLoading(false);
    }
  };

  const handleToggleActive = async (expense: RecurringExpense) => {
    try {
      setToggleLoading(expense.id);
      setError("");

      await updateRecurringExpense(expense.id, {
        isActive: !expense.isActive
      });

      toast.success(`Recurring expense ${!expense.isActive ? 'activated' : 'paused'}`);
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update recurring expense';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setToggleLoading(null);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recurring expense?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError("");
      await deleteRecurringExpense(id);
      toast.success("Recurring expense deleted successfully");
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete recurring expense';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getFrequencyColor = (frequency: string) => {
    const colors = {
      DAILY: 'bg-red-100 text-red-800',
      WEEKLY: 'bg-blue-100 text-blue-800',
      MONTHLY: 'bg-green-100 text-green-800',
      YEARLY: 'bg-purple-100 text-purple-800'
    };
    return colors[frequency] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <RecurringExpenseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const activeExpenses = expenses.filter(e => e.isActive);
  const pausedExpenses = expenses.filter(e => !e.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Recurring Expenses</h2>
          <p className="text-muted-foreground">Automate your regular expenses</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Repeat className="h-5 w-5" />
                Add Recurring Expense
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    disabled={addLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newExpense.frequency}
                    onValueChange={(value: RecurringExpense['frequency']) => setNewExpense({...newExpense, frequency: value})}
                    disabled={addLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Netflix Subscription, Gym Membership"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  disabled={addLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.categoryId}
                  onValueChange={(value) => setNewExpense({...newExpense, categoryId: value})}
                  disabled={addLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newExpense.startDate}
                    onChange={(e) => setNewExpense({...newExpense, startDate: e.target.value})}
                    disabled={addLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newExpense.endDate}
                    onChange={(e) => setNewExpense({...newExpense, endDate: e.target.value})}
                    min={newExpense.startDate}
                    disabled={addLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <Label htmlFor="isActive">Activate immediately</Label>
                <Switch
                  id="isActive"
                  checked={newExpense.isActive}
                  onCheckedChange={(checked) => setNewExpense({...newExpense, isActive: checked})}
                  disabled={addLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                disabled={addLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddExpense}
                disabled={addLoading || !newExpense.amount || !newExpense.description || !newExpense.categoryId}
              >
                {addLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recurring</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">{activeExpenses.length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{activeExpenses.filter(e => e.frequency === 'MONTHLY').reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-NG')}
            </div>
            <p className="text-xs text-muted-foreground">Monthly expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {activeExpenses.length > 0 ?
                new Date(Math.min(...activeExpenses.map(e => new Date(e.nextDueDate).getTime()))).toLocaleDateString() :
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Upcoming payment</p>
          </CardContent>
        </Card>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Repeat className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recurring Expenses</h3>
            <p className="text-muted-foreground text-center mb-4">
              Automate your regular expenses like subscriptions and bills
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Recurring Expense
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenses.map((expense) => (
            <Card key={expense.id} className={`hover:shadow-md transition-shadow ${!expense.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{expense.description}</h3>
                    <p className="text-sm text-muted-foreground">{expense.category?.name}</p>
                  </div>
                  <Badge className={getFrequencyColor(expense.frequency)}>
                    {expense.frequency}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">₦{expense.amount.toLocaleString('en-NG')}</span>
                    {!expense.isActive && (
                      <Badge variant="outline">Paused</Badge>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Next: {new Date(expense.nextDueDate).toLocaleDateString()}
                    </div>
                    {expense.endDate && (
                      <div>Ends: {new Date(expense.endDate).toLocaleDateString()}</div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(expense)}
                      disabled={toggleLoading === expense.id}
                      className="flex-1"
                    >
                      {toggleLoading === expense.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : expense.isActive ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      disabled={deleteLoading === expense.id}
                    >
                      {deleteLoading === expense.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
