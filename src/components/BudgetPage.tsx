import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { Checkbox } from "./ui/checkbox";
import { Plus, Target, TrendingUp, TrendingDown, Edit, Trash2, AlertTriangle, CheckCircle, Loader2, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Alert, AlertDescription } from "./ui/alert";

interface Budget {
  id: string;
  amount: number;
  startDate: string;
  endDate: string;
  recurring: boolean;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  category: {
    id: string;
    name: string;
    icon: string;
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}

interface BudgetWithSpending extends Budget {
  spent: number;
  color: string;
}

// Skeleton components
const BudgetCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
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

export function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form states
  const [newBudget, setNewBudget] = useState({
    categoryId: '',
    amount: '',
    startDate: '',
    endDate: '',
    recurring: false,
    frequency: '' as 'DAILY' | 'WEEKLY' | 'MONTHLY' | ''
  });
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#4ecdc4");

  const colorOptions = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', 
    '#dda0dd', '#ff7675', '#74b9ff', '#00b894', '#fdcb6e'
  ];
const api = 'http://localhost:3000';
  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    setLoading(true);
    setError("");

    // Fetch budgets
     
    const budgetsResponse = await fetch(`${api}/budgets`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
    });
    if (!budgetsResponse.ok) throw new Error('Failed to fetch budgets');
    const budgetsData = await budgetsResponse.json();

    // Fetch categories
    const categoriesResponse = await fetch(`${api}/categories`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
    });
    if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
    const categoriesData = await categoriesResponse.json();

    // Fetch summary
    const summaryResponse = await fetch(`${api}/budgets/summary`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
    });
    if (!summaryResponse.ok) throw new Error('Failed to fetch summary');
    const summaryData = await summaryResponse.json();

    // Set state
    setBudgets(budgetsData);
    setCategories(categoriesData);
    setSummary(summaryData);

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch data');
  } finally {
    setLoading(false);
  }
};

  const handleCreateBudget = async () => {
    try {
      setCreateLoading(true);
      setError("");

      const response = await fetch(`${api}/budgets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: newBudget.categoryId,
          amount: parseFloat(newBudget.amount),
          startDate: newBudget.startDate,
          endDate: newBudget.endDate,
          recurring: newBudget.recurring,
          frequency: newBudget.recurring ? newBudget.frequency : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create budget');
      }

      // Refresh data
      await fetchData();
      
      // Reset form
      resetForm();
      setIsDialogOpen(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create budget');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudget({
      categoryId: budget.category.id,
      amount: (budget.amount).toString(),
      startDate: budget.startDate.split('T')[0],
      endDate: budget.endDate.split('T')[0],
      recurring: budget.recurring,
      frequency: budget.frequency || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewBudget({
      categoryId: '',
      amount: '',
      startDate: '',
      endDate: '',
      recurring: false,
      frequency: ''
    });
    setEditingBudget(null);
  };

  // Calculate budget data with colors for visualization
  const getBudgetsWithSpending = (): BudgetWithSpending[] => {
    return budgets.map((budget, index) => ({
      ...budget,
      spent: 0, // This would need to be calculated from transactions
      color: colorOptions[index % colorOptions.length]
    }));
  };

  const budgetsWithSpending = getBudgetsWithSpending();
  const totalAllocated = summary?.totalBudget || 0;
  const totalSpent = summary?.totalSpent || 0;
  const totalRemaining = (totalAllocated - (totalSpent)/100) || 0;
  const budgetUtilization = totalAllocated > 0 ? (totalSpent / totalAllocated)  : 0;

  const overBudgetCategories = budgetsWithSpending.filter(budget => budget.spent > budget.amount);
  const underBudgetCategories = budgetsWithSpending.filter(budget => budget.spent < budget.amount * 0.8);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </div>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <BudgetCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Budget Management</h2>
          <p className="text-muted-foreground">Plan and track your spending across categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newBudget.categoryId} 
                    onValueChange={(value) => setNewBudget({...newBudget, categoryId: value})}
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

                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newBudget.startDate}
                    onChange={(e) => setNewBudget({...newBudget, startDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newBudget.endDate}
                    onChange={(e) => setNewBudget({...newBudget, endDate: e.target.value})}
                    min={newBudget.startDate}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={newBudget.recurring}
                    onCheckedChange={(checked) => setNewBudget({...newBudget, recurring: !!checked})}
                  />
                  <Label htmlFor="recurring" className="text-sm font-normal">
                    Make this a recurring budget
                  </Label>
                </div>

                {newBudget.recurring && (
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select 
                      value={newBudget.frequency} 
                      onValueChange={(value) => setNewBudget({...newBudget, frequency: value as 'DAILY' | 'WEEKLY' | 'MONTHLY'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateBudget}
                disabled={
                  createLoading || 
                  !newBudget.categoryId || 
                  !newBudget.amount || 
                  !newBudget.startDate || 
                  !newBudget.endDate ||
                  (newBudget.recurring && !newBudget.frequency)
                }
              >
                {createLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {editingBudget ? 'Update Budget' : 'Create Budget'}
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
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalAllocated).toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">Total allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{(totalSpent/100).toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">{budgetUtilization.toFixed(1)}% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{(totalRemaining).toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">Left to spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
            <Badge variant="secondary">{budgets.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.length}</div>
            <p className="text-xs text-muted-foreground">Budget categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: ₦{(totalSpent / 100).toLocaleString('en-NG')}</span>
              <span>{budgetUtilization.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(budgetUtilization, 100)} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Budget: ₦{(totalAllocated ).toLocaleString('en-NG')}</span>
              <span>Remaining: ₦{(totalRemaining / 100).toLocaleString('en-NG')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="budgets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="budgets">Budget Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Budget Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-6">
          {budgets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No budgets created yet</h3>
                <p className="text-muted-foreground mb-4">Create your first budget to start tracking your spending</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {budgets.map((budget) => {
                const spent = 0; // Would be calculated from actual transaction data
                const percentage = budget.amount > 0 ? (spent / budget.amount)  : 0;
                const isOverBudget = spent > budget.amount;
                const remaining = budget.amount - spent;
                
                return (
                  <Card key={budget.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: colorOptions[0] }}
                          />
                          <div>
                            <h3 className="font-medium">{budget.category.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}</span>
                              {budget.recurring && (
                                <Badge variant="outline" className="text-xs">
                                  {budget.frequency?.toLowerCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {isOverBudget && (
                            <Badge variant="destructive">Over Budget</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spent: ₦{(spent).toLocaleString('en-NG')}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={`w-full ${isOverBudget ? 'bg-red-100' : ''}`}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Budget: ₦{(budget.amount).toLocaleString('en-NG')}</span>
                          <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {remaining >= 0 ? 'Remaining' : 'Over'}: ₦{(Math.abs(remaining)).toLocaleString('en-NG')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Budget Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {budgets.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetsWithSpending}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                          label={({ category, amount }) => `${category.name}: ₦${(amount).toLocaleString('en-NG')}`}
                        >
                          {budgetsWithSpending.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`₦${(value ).toLocaleString('en-NG')}`, 'Budget']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No budget data to display</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgets.slice(0, 5).map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: colorOptions[0] }}
                        />
                        <span className="text-sm font-medium">{budget.category.name}</span>
                      </div>
                      <span className="text-sm">₦{(budget.amount).toLocaleString('en-NG')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Budget Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>All budgets are on track!</p>
                  <p className="text-xs">Budget alerts will appear here when spending exceeds limits</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Budget Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-700">Budget Utilization</p>
                      <p className="text-sm text-green-600">
                        {budgetUtilization.toFixed(1)}% of total budget used
                      </p>
                    </div>
                    <Badge variant="secondary">
                      On Track
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}