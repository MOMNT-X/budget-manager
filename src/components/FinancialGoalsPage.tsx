import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Target, Loader2, Plus, Trash2, TrendingUp, DollarSign, Calendar, ChevronRight, Award, CheckCircle, PiggyBank, Clock, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { format } from "date-fns";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
  progress?: number;
  createdAt: string;
  recentContributions?: Contribution[];
}

interface Contribution {
  id: string;
  amount: number;
  date: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface GoalFilter {
  status: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  sortBy: 'progress' | 'deadline' | 'amount' | 'recent';
}

const GoalCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-24" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-20" />
      </div>
    </CardContent>
  </Card>
);

export function FinancialGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [contributeLoading, setContributeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filters, setFilters] = useState<GoalFilter>({
    status: 'ALL',
    sortBy: 'progress'
  });
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    categoryId: ''
  });

  const [contributionAmount, setContributionAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch data from API
      const response = await fetch(`${api}/financial-goals`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch financial goals');
      }
      
      const goalsData = await response.json();
      
      // Calculate progress for each goal
      const goalsWithProgress = goalsData.map((goal: Goal) => ({
        ...goal,
        progress: Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
      }));
      
      setGoals(goalsWithProgress);
      
      // Fetch categories
      const categoriesResponse = await fetch('http://localhost:3000/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load financial goals';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setAddLoading(true);
      setError("");

      const response = await fetch('http://localhost:3000/financial-goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGoal.name,
          targetAmount: parseFloat(newGoal.targetAmount),
          deadline: newGoal.deadline || undefined,
          categoryId: newGoal.categoryId || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create goal');
      }

      toast({
        title: "Success",
        description: "Financial goal created successfully",
      });
      await fetchData();

      setNewGoal({
        name: '',
        targetAmount: '',
        deadline: '',
        categoryId: ''
      });
      setShowAddModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleContribute = async () => {
    if (!selectedGoal || !contributionAmount) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setContributeLoading(true);
      setError("");

      const response = await fetch(`http://localhost:3000/financial-goals/${selectedGoal.id}/contribute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(contributionAmount)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to contribute to goal');
      }

      toast({
        title: "Success",
        description: `Successfully contributed ₦${parseFloat(contributionAmount).toLocaleString('en-NG')} to ${selectedGoal.name}`,
      });
      await fetchData();

      setContributionAmount('');
      setSelectedGoal(null);
      setShowContributeModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to contribute to goal';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setContributeLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      setDeleteLoading(id);
      setError("");
      
      const response = await fetch(`http://localhost:3000/financial-goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete goal');
      }
      
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const resetForm = () => {
    setNewGoal({
      name: '',
      targetAmount: '',
      deadline: '',
      categoryId: ''
    });
    setError("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Target className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PAUSED':
        return <Clock className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  // Filter and sort goals
  const filteredGoals = goals
    .filter(goal => {
      // Filter by search query
      const matchesSearch = 
        goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (goal.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by status tab
      const matchesStatus = 
        activeTab === "all" || 
        activeTab === goal.status.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      switch (filters.sortBy) {
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'deadline':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'amount':
          return b.targetAmount - a.targetAmount;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Goals</h2>
          <p className="text-muted-foreground">
            Track and manage your savings goals
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create New Goal
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 animate-shake">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => setFilters({...filters, sortBy: value as any})}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <GoalCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {filteredGoals.length === 0 ? (
            <div className="text-center py-16 border rounded-lg">
              <PiggyBank className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No goals found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? "Try adjusting your search or filters" : "Create your first financial goal to get started"}
              </p>
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Goal
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGoals.map((goal) => (
                <Card key={goal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {goal.category?.name || "No category"}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(goal.status)} flex items-center gap-1`}>
                        {getStatusIcon(goal.status)}
                        {goal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress 
                          value={goal.progress} 
                          className="h-2" 
                          indicatorClassName={getProgressColor(goal.progress || 0)}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Target</p>
                          <p className="text-lg font-semibold">₦{goal.targetAmount.toLocaleString('en-NG')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Current</p>
                          <p className="text-lg font-semibold">₦{goal.currentAmount.toLocaleString('en-NG')}</p>
                        </div>
                      </div>
                      
                      {goal.deadline && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowContributeModal(true);
                      }}
                      disabled={goal.status !== 'ACTIVE'}
                    >
                      <DollarSign className="h-4 w-4 mr-1" /> Contribute
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                      disabled={deleteLoading === goal.id}
                    >
                      {deleteLoading === goal.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Goal Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Financial Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., New Car, Emergency Fund"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount (₦)</Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="0.00"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select
                value={newGoal.categoryId}
                onValueChange={(value) => setNewGoal({ ...newGoal, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
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
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowAddModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGoal}
              disabled={addLoading}
            >
              {addLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribute Modal */}
      <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contribute to Goal</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-1">
                <p className="font-medium">{selectedGoal.name}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Current: ₦{selectedGoal.currentAmount.toLocaleString('en-NG')}</span>
                  <span>Target: ₦{selectedGoal.targetAmount.toLocaleString('en-NG')}</span>
                </div>
                <Progress 
                  value={selectedGoal.progress} 
                  className="h-2 mt-2" 
                  indicatorClassName={getProgressColor(selectedGoal.progress || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributionAmount">Contribution Amount (₦)</Label>
                <Input
                  id="contributionAmount"
                  type="number"
                  placeholder="0.00"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                />
              </div>

              <Alert>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    This will increase your progress by approximately{" "}
                    {contributionAmount
                      ? Math.round((parseFloat(contributionAmount) / selectedGoal.targetAmount) * 100)
                      : 0}
                    %.
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setContributionAmount('');
                setSelectedGoal(null);
                setShowContributeModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContribute}
              disabled={contributeLoading || !contributionAmount}
            >
              {contributeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              Contribute
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <GoalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'ACTIVE');
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');
  const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial Goals</h2>
          <p className="text-muted-foreground">Track your savings goals and progress</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Create New Financial Goal
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  disabled={addLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount (₦)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    disabled={addLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={addLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select
                  value={newGoal.categoryId}
                  onValueChange={(value) => setNewGoal({...newGoal, categoryId: value})}
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
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={addLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddGoal}
                disabled={addLoading || !newGoal.name || !newGoal.targetAmount}
              >
                {addLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              ₦{totalCurrentAmount.toLocaleString('en-NG')} of ₦{totalTargetAmount.toLocaleString('en-NG')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Financial Goals Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Set savings goals and track your progress toward financial milestones
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysRemaining = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      {goal.category && (
                        <p className="text-sm text-muted-foreground">{goal.category.name}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        ₦{goal.currentAmount.toLocaleString('en-NG')}
                      </span>
                      <span className="text-muted-foreground">
                        ₦{goal.targetAmount.toLocaleString('en-NG')}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} />
                    <p className="text-xs text-muted-foreground">
                      {progress.toFixed(1)}% complete
                      {remaining > 0 && ` • ₦${remaining.toLocaleString('en-NG')} remaining`}
                    </p>
                  </div>

                  {goal.deadline && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {daysRemaining !== null && daysRemaining > 0 ? (
                        <span>{daysRemaining} days remaining</span>
                      ) : daysRemaining !== null && daysRemaining === 0 ? (
                        <span className="text-orange-600">Due today</span>
                      ) : (
                        <span className="text-red-600">Overdue</span>
                      )}
                    </div>
                  )}

                  {goal.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setContributionAmount('');
                          setShowContributeModal(true);
                        }}
                        className="flex-1"
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Contribute
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        disabled={deleteLoading === goal.id}
                      >
                        {deleteLoading === goal.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Contribute to Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedGoal && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-1">{selectedGoal?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current: ₦{selectedGoal?.currentAmount.toLocaleString('en-NG')} of ₦{selectedGoal?.targetAmount.toLocaleString('en-NG')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contributionAmount">Contribution Amount (₦)</Label>
                  <Input
                    id="contributionAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    disabled={contributeLoading}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowContributeModal(false);
                setSelectedGoal(null);
                setContributionAmount('');
              }}
              disabled={contributeLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContribute}
              disabled={contributeLoading || !contributionAmount || parseFloat(contributionAmount) <= 0}
            >
              {contributeLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Contributing...
                </>
              ) : (
                "Contribute"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
