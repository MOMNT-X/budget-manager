import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CircleAlert as AlertCircle, 
  Repeat, 
  Loader as Loader2, 
  Plus, 
  Trash2, 
  Pause, 
  Play, 
  Calendar, 
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  Clock,
  DollarSign,
  Bell,
  BarChart
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns";
import { getRecurringExpenses, createRecurringExpense, updateRecurringExpense, deleteRecurringExpense, getCategories } from "@/config/api";
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
  lastProcessedDate?: string;
  totalProcessed?: number;
  notes?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface ExpenseFilter {
  status: 'all' | 'active' | 'paused';
  frequency: 'all' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  sortBy: 'amount' | 'date' | 'name' | 'frequency';
  sortDirection: 'asc' | 'desc';
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "paused">("all");
  const [selectedExpense, setSelectedExpense] = useState<RecurringExpense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilter>({
    status: 'all',
    frequency: 'all',
    sortBy: 'date',
    sortDirection: 'desc'
  });

  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    categoryId: '',
    frequency: 'MONTHLY' as RecurringExpense['frequency'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    notes: ''
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
        isActive: newExpense.isActive,
        notes: newExpense.notes || undefined
      });

      toast({
        title: "Success",
        description: "Recurring expense created successfully",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      });
      
      await fetchData();

      setNewExpense({
        amount: '',
        description: '',
        categoryId: '',
        frequency: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
        notes: ''
      });
      setShowAddModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create recurring expense';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditExpense = async () => {
    if (!selectedExpense) return;
    
    try {
      setAddLoading(true);
      setError("");

      await updateRecurringExpense(selectedExpense.id, {
        amount: selectedExpense.amount,
        description: selectedExpense.description,
        categoryId: selectedExpense.categoryId,
        frequency: selectedExpense.frequency,
        startDate: selectedExpense.startDate,
        endDate: selectedExpense.endDate || undefined,
        isActive: selectedExpense.isActive,
        notes: selectedExpense.notes || undefined
      });

      toast({
        title: "Success",
        description: "Recurring expense updated successfully",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      });
      
      await fetchData();
      setShowEditModal(false);
      setSelectedExpense(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update recurring expense';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      });
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

      toast({
        title: expense.isActive ? "Paused" : "Activated",
        description: `Recurring expense ${!expense.isActive ? 'activated' : 'paused'} successfully`,
        icon: !expense.isActive ? 
          <Play className="h-4 w-4 text-green-500" /> : 
          <Pause className="h-4 w-4 text-amber-500" />
      });
      
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update recurring expense';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setToggleLoading(null);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setDeleteLoading(id);
      setError("");
      await deleteRecurringExpense(id);
      
      toast({
        title: "Success",
        description: "Recurring expense deleted successfully",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      });
      
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete recurring expense';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const getFrequencyColor = (frequency: string) => {
    const colors = {
      DAILY: 'bg-red-100 text-red-800 border-red-200',
      WEEKLY: 'bg-blue-100 text-blue-800 border-blue-200',
      MONTHLY: 'bg-green-100 text-green-800 border-green-200',
      YEARLY: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[frequency] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'DAILY':
        return <Clock className="h-4 w-4" />;
      case 'WEEKLY':
        return <Calendar className="h-4 w-4" />;
      case 'MONTHLY':
        return <Calendar className="h-4 w-4" />;
      case 'YEARLY':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const calculateNextOccurrence = (expense: RecurringExpense) => {
    const startDate = new Date(expense.nextDueDate);
    
    switch (expense.frequency) {
      case 'DAILY':
        return addDays(startDate, 1);
      case 'WEEKLY':
        return addWeeks(startDate, 1);
      case 'MONTHLY':
        return addMonths(startDate, 1);
      case 'YEARLY':
        return addYears(startDate, 1);
      default:
        return startDate;
    }
  };

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      // Filter by search query
      const matchesSearch = 
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (expense.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by status tab
      const matchesStatus = 
        activeTab === "all" || 
        (activeTab === "active" && expense.isActive) ||
        (activeTab === "paused" && !expense.isActive);
      
      // Filter by frequency
      const matchesFrequency = 
        filters.frequency === 'all' || 
        expense.frequency === filters.frequency;
      
      return matchesSearch && matchesStatus && matchesFrequency;
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      const direction = filters.sortDirection === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'amount':
          return (a.amount - b.amount) * direction;
        case 'name':
          return a.description.localeCompare(b.description) * direction;
        case 'frequency':
          return a.frequency.localeCompare(b.frequency) * direction;
        case 'date':
        default:
          return (new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()) * direction;
      }
    });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recurring Expenses</h2>
          <p className="text-muted-foreground">
            Automate your regular expenses
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 
          {!isMobile && "Add Recurring Expense"}
          {isMobile && "Add Expense"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-shake">
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
                format(new Date(Math.min(...activeExpenses.map(e => new Date(e.nextDueDate).getTime()))), 'MMM d, yyyy') :
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Upcoming payment</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select 
              value={filters.frequency} 
              onValueChange={(value) => setFilters({...filters, frequency: value as any})}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => setFilters({...filters, sortBy: value as any})}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Due Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="frequency">Frequency</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilters({
                ...filters, 
                sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
              })}
              className="w-10 h-10"
            >
              <ArrowUpDown className={`h-4 w-4 ${filters.sortDirection === 'asc' ? 'rotate-180' : ''} transition-transform`} />
            </Button>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Repeat className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recurring Expenses</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || activeTab !== 'all' || filters.frequency !== 'all' 
                  ? "Try adjusting your search or filters"
                  : "Automate your regular expenses like subscriptions and bills"}
              </p>
              {!searchQuery && activeTab === 'all' && filters.frequency === 'all' && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Recurring Expense
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExpenses.map((expense) => (
              <Card 
                key={expense.id} 
                className={`overflow-hidden hover:shadow-md transition-shadow ${!expense.isActive ? 'opacity-75' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{expense.description}</CardTitle>
                      <CardDescription>{expense.category?.name || "No category"}</CardDescription>
                    </div>
                    <Badge className={`${getFrequencyColor(expense.frequency)} flex items-center gap-1`}>
                      {getFrequencyIcon(expense.frequency)}
                      {expense.frequency}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">₦{expense.amount.toLocaleString('en-NG')}</span>
                      {!expense.isActive && (
                        <Badge variant="outline" className="border-amber-200 text-amber-700">Paused</Badge>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Next: {format(new Date(expense.nextDueDate), 'MMM d, yyyy')}</span>
                      </div>
                      {expense.endDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Ends: {format(new Date(expense.endDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                    
                    {expense.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        {expense.notes.length > 50 ? `${expense.notes.substring(0, 50)}...` : expense.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={expense.isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleActive(expense)}
                      disabled={toggleLoading === expense.id}
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
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this recurring expense?")) {
                        handleDeleteExpense(expense.id);
                      }
                    }}
                    disabled={deleteLoading === expense.id}
                  >
                    {deleteLoading === expense.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Add Recurring Expense
            </DialogTitle>
            <DialogDescription>
              Set up a new recurring expense that will be tracked automatically.
            </DialogDescription>
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
                  onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
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
              <Input
                id="description"
                placeholder="e.g., Netflix Subscription, Gym Membership"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                disabled={addLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional details about this expense"
                value={newExpense.notes || ''}
                onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
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
                  value={newExpense.endDate || ''}
                  onChange={(e) => setNewExpense({...newExpense, endDate: e.target.value})}
                  disabled={addLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={addLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense} disabled={addLoading || !newExpense.description || !newExpense.amount}>
              {addLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Recurring Expense
            </DialogTitle>
            <DialogDescription>
              Update your recurring expense details.
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount (₦)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={selectedExpense.amount}
                    onChange={(e) => setSelectedExpense({
                      ...selectedExpense, 
                      amount: parseFloat(e.target.value) || 0
                    })}
                    disabled={addLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select
                    value={selectedExpense.frequency}
                    onValueChange={(value: RecurringExpense['frequency']) => setSelectedExpense({
                      ...selectedExpense, 
                      frequency: value
                    })}
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
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  placeholder="e.g., Netflix Subscription, Gym Membership"
                  value={selectedExpense.description}
                  onChange={(e) => setSelectedExpense({
                    ...selectedExpense, 
                    description: e.target.value
                  })}
                  disabled={addLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Any additional details about this expense"
                  value={selectedExpense.notes || ''}
                  onChange={(e) => setSelectedExpense({
                    ...selectedExpense, 
                    notes: e.target.value
                  })}
                  disabled={addLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={selectedExpense.categoryId}
                  onValueChange={(value) => setSelectedExpense({
                    ...selectedExpense, 
                    categoryId: value
                  })}
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
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={selectedExpense.startDate}
                    onChange={(e) => setSelectedExpense({
                      ...selectedExpense, 
                      startDate: e.target.value
                    })}
                    disabled={addLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={selectedExpense.endDate || ''}
                    onChange={(e) => setSelectedExpense({
                      ...selectedExpense, 
                      endDate: e.target.value
                    })}
                    disabled={addLoading}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={addLoading}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleEditExpense(selectedExpense!)} 
              disabled={addLoading || !selectedExpense?.description || !selectedExpense?.amount}
            >
              {addLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Expense
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
