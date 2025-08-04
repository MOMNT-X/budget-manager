import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Target, TrendingUp, TrendingDown, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

const mockBudgetCategories: BudgetCategory[] = [
  { id: '1', name: 'Food & Dining', allocated: 250000, spent: 185750, color: '#ff6b6b' },
  { id: '2', name: 'Shopping', allocated: 150000, spent: 125500, color: '#4ecdc4' },
  { id: '3', name: 'Transportation', allocated: 125000, spent: 108250, color: '#45b7d1' },
  { id: '4', name: 'Bills & Utilities', allocated: 350000, spent: 295000, color: '#96ceb4' },
  { id: '5', name: 'Entertainment', allocated: 80000, spent: 58500, color: '#ffeaa7' },
  { id: '6', name: 'Healthcare', allocated: 120000, spent: 32850, color: '#dda0dd' },
];

const budgetHistory = [
  { month: 'Oct', allocated: 950000, spent: 838000 },
  { month: 'Nov', allocated: 980000, spent: 931000 },
  { month: 'Dec', allocated: 920000, spent: 905200 },
  { month: 'Jan', allocated: 950000, spent: 798000 },
  { month: 'Feb', allocated: 980000, spent: 805850 },
];

export function BudgetPage() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAmount, setNewCategoryAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4ecdc4");
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalAllocated = mockBudgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = mockBudgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const budgetUtilization = (totalSpent / totalAllocated) * 100;

  const overBudgetCategories = mockBudgetCategories.filter(cat => cat.spent > cat.allocated);
  const underBudgetCategories = mockBudgetCategories.filter(cat => cat.spent < cat.allocated * 0.8);

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryAmount) {
      const newCategory: BudgetCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        allocated: parseFloat(newCategoryAmount),
        spent: 0,
        color: selectedColor
      };
      
      // Here you would add the category to your state/database
      console.log('Adding category:', newCategory);
      
      // Reset form
      setNewCategoryName("");
      setNewCategoryAmount("");
      setSelectedColor("#4ecdc4");
      setIsDialogOpen(false);
    }
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryAmount(category.allocated.toString());
    setSelectedColor(category.color);
    setIsDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategoryName && newCategoryAmount) {
      const updatedCategory = {
        ...editingCategory,
        name: newCategoryName,
        allocated: parseFloat(newCategoryAmount),
        color: selectedColor
      };
      
      // Here you would update the category in your state/database
      console.log('Updating category:', updatedCategory);
      
      // Reset form
      setEditingCategory(null);
      setNewCategoryName("");
      setNewCategoryAmount("");
      setSelectedColor("#4ecdc4");
      setIsDialogOpen(false);
    }
  };

  const colorOptions = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', 
    '#dda0dd', '#ff7675', '#74b9ff', '#00b894', '#fdcb6e'
  ];

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
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Budget Category' : 'Add New Budget Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Groceries, Gas, etc."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="category-amount">Monthly Budget</Label>
                <Input
                  id="category-amount"
                  type="number"
                  placeholder="0.00"
                  value={newCategoryAmount}
                  onChange={(e) => setNewCategoryAmount(e.target.value)}
                  step="0.01"
                />
              </div>
              
              <div>
                <Label>Category Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  disabled={!newCategoryName || !newCategoryAmount}
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingCategory(null);
                    setNewCategoryName("");
                    setNewCategoryAmount("");
                    setSelectedColor("#4ecdc4");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalAllocated.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">Monthly allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦{totalSpent.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">{budgetUtilization.toFixed(1)}% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{totalRemaining.toLocaleString('en-NG')}</div>
            <p className="text-xs text-muted-foreground">Left to spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Badge variant="secondary">{mockBudgetCategories.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBudgetCategories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
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
              <span>Used: ₦{totalSpent.toLocaleString('en-NG')}</span>
              <span>{budgetUtilization.toFixed(1)}%</span>
            </div>
            <Progress value={budgetUtilization} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Budget: ₦{totalAllocated.toLocaleString('en-NG')}</span>
              <span>Remaining: ₦{totalRemaining.toLocaleString('en-NG')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Budget Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {/* Category List */}
          <div className="grid gap-4">
            {mockBudgetCategories.map((category) => {
              const percentage = (category.spent / category.allocated) * 100;
              const isOverBudget = category.spent > category.allocated;
              const remaining = category.allocated - category.spent;
              
              return (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="font-medium">{category.name}</h3>
                        {isOverBudget && (
                          <Badge variant="destructive">Over Budget</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ₦{category.spent.toLocaleString('en-NG')}</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className={`w-full ${isOverBudget ? 'bg-red-100' : ''}`}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Budget: ₦{category.allocated.toLocaleString('en-NG')}</span>
                        <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {remaining >= 0 ? 'Remaining' : 'Over'}: ₦{Math.abs(remaining).toLocaleString('en-NG')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Budget Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockBudgetCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="allocated"
                        label={({ name, allocated }) => `${name}: ₦${allocated.toLocaleString('en-NG')}`}
                      >
                        {mockBudgetCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`₦${value.toLocaleString('en-NG')}`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Budget vs Spending History */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Spending History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`₦${value.toLocaleString('en-NG')}`, name]}
                      />
                      <Bar dataKey="allocated" fill="#4ecdc4" name="Budget" />
                      <Bar dataKey="spent" fill="#ff6b6b" name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Budget Alerts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Over Budget Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overBudgetCategories.length > 0 ? (
                    overBudgetCategories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-700">{category.name}</p>
                          <p className="text-sm text-red-600">
                            Over by ₦{(category.spent - category.allocated).toLocaleString('en-NG')}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {(((category.spent - category.allocated) / category.allocated) * 100).toFixed(0)}% over
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p>No categories are over budget!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Under-Utilized Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {underBudgetCategories.length > 0 ? (
                    underBudgetCategories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-700">{category.name}</p>
                          <p className="text-sm text-green-600">
                            ₦{(category.allocated - category.spent).toLocaleString('en-NG')} remaining
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {((category.spent / category.allocated) * 100).toFixed(0)}% used
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p>All categories are well-utilized!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}