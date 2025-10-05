import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CircleAlert as AlertCircle, Target, Loader as Loader2, Plus, Trash2, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { getFinancialGoals, createFinancialGoal, contributeToGoal, deleteFinancialGoal, getCategories } from "../config/api";
import { toast } from "sonner";

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
  };
  progress?: number;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [goalsData, categoriesData] = await Promise.all([
        getFinancialGoals(),
        getCategories()
      ]);
      setGoals(goalsData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load financial goals';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setAddLoading(true);
      setError("");

      await createFinancialGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        deadline: newGoal.deadline || undefined,
        categoryId: newGoal.categoryId || undefined
      });

      toast.success("Financial goal created successfully");
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
      toast.error(errorMessage);
    } finally {
      setAddLoading(false);
    }
  };

  const handleContribute = async () => {
    if (!selectedGoal || !contributionAmount) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setContributeLoading(true);
      setError("");

      await contributeToGoal(selectedGoal.id, parseFloat(contributionAmount));

      toast.success(`Successfully contributed ₦${parseFloat(contributionAmount).toLocaleString('en-NG')} to ${selectedGoal.name}`);
      await fetchData();

      setContributionAmount('');
      setSelectedGoal(null);
      setShowContributeModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to contribute to goal';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setContributeLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError("");
      await deleteFinancialGoal(id);
      toast.success("Goal deleted successfully");
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(errorMessage);
      toast.error(errorMessage);
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
    const colors = {
      ACTIVE: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
                  <h4 className="font-medium mb-1">{selectedGoal.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current: ₦{selectedGoal.currentAmount.toLocaleString('en-NG')} of ₦{selectedGoal.targetAmount.toLocaleString('en-NG')}
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
