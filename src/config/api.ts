const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

// Helper to add token
const authHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
console.log("Auth Headers:", authHeaders());


// ===== AUTH =====
export const signup = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
};

export const login = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

// ===== BUDGETS =====
export const getBudgets = async () => {
  const res = await fetch(`${BASE_URL}/budgets`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch budgets");
  return data;
};

export const createBudget = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/budgets`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Budget creation failed");
  return data;
};

export const getBudgetSummary = async () => {
  const res = await fetch(`${BASE_URL}/budgets/summary`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch budget summary");
  return data;
};

// ===== CATEGORIES =====
export const addCategory = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/category`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Add category failed");
  return data;
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/categories`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
  return data;
};

// ===== TRANSACTIONS =====
export const createTransaction = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Transaction failed");
  return data;
};

export const getTransactions = async () => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch transactions");
  return data;
};

// ===== WALLET =====
export const deposit = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/wallet/deposit`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Deposit failed");
  return data;
};
export const confirm = async () => {
  const reference = localStorage.getItem("depositRef");

  if (!reference) {
    throw new Error("No deposit reference found in localStorage.");
  }

  const payload = { reference }; // or whatever key your API expects

  const res = await fetch(`${BASE_URL}/wallet/confirm-deposit`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment Confirmation failed");
  return data;
};

export const getBalance = async () => {
  const res = await fetch(`${BASE_URL}/wallet/balance`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch balance");
  return data;
};
export const WithdrawBalance = async (amount: number) => {
  const res = await fetch(`${BASE_URL}/wallet/withdraw`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch balance");
  return data;
};

// ==== BILL =====
export const payBill = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/bills/pay`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to pay bill");
  return data;
};

// ===== EXPENSES =====
export const createExpense = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Expense creation failed");
  return data;
};

export const getExpenses = async () => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch expenses");
  return data;
};

export const getExpensesSummary = async () => {
  const res = await fetch(`${BASE_URL}/expenses/summary`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch expense summary");
  return data;
};

// ===== DASHBOARD =====
export const getDashboardSummary = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/summary`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch dashboard summary");
  return data;
};

export const getDashboardTransactions = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/transactions`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch dashboard transactions");
  return data;
};

export const getDashboardCategories = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/categories`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load categories");
  return data;
};

// ===== BENEFICIARIES =====
export const getBeneficiaries = async () => {
  const res = await fetch(`${BASE_URL}/beneficiaries`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch beneficiaries");
  return data;
};

export const createBeneficiary = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/beneficiaries`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create beneficiary");
  return data;
};

export const deleteBeneficiary = async (id: string) => {
  const res = await fetch(`${BASE_URL}/beneficiaries/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete beneficiary");
  return data;
};

// ===== FINANCIAL GOALS =====
export const getFinancialGoals = async () => {
  const res = await fetch(`${BASE_URL}/financial-goals`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch financial goals");
  return data;
};

export const createFinancialGoal = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/financial-goals`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create financial goal");
  return data;
};

export const contributeToGoal = async (id: string, amount: number) => {
  const res = await fetch(`${BASE_URL}/financial-goals/${id}/contribute`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to contribute to goal");
  return data;
};

export const deleteFinancialGoal = async (id: string) => {
  const res = await fetch(`${BASE_URL}/financial-goals/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete goal");
  return data;
};

// ===== RECURRING EXPENSES =====
export const getRecurringExpenses = async () => {
  const res = await fetch(`${BASE_URL}/recurring-expenses`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch recurring expenses");
  return data;
};

export const createRecurringExpense = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/recurring-expenses`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create recurring expense");
  return data;
};

export const updateRecurringExpense = async (id: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/recurring-expenses/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update recurring expense");
  return data;
};

export const deleteRecurringExpense = async (id: string) => {
  const res = await fetch(`${BASE_URL}/recurring-expenses/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete recurring expense");
  return data;
};

// ===== INSIGHTS & ANALYTICS =====
export const getSpendingInsights = async (period: 'week' | 'month' | 'year' = 'month') => {
  const res = await fetch(`${BASE_URL}/insights/spending?period=${period}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch spending insights");
  return data;
};

export const getSpendingTrends = async (months: number = 6) => {
  const res = await fetch(`${BASE_URL}/insights/trends?months=${months}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch spending trends");
  return data;
};

export const getBudgetPerformance = async () => {
  const res = await fetch(`${BASE_URL}/insights/budget-performance`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch budget performance");
  return data;
};

export const getRecommendations = async () => {
  const res = await fetch(`${BASE_URL}/insights/recommendations`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch recommendations");
  return data;
};

// ===== BILLS (Enhanced) =====
export const getBills = async () => {
  const res = await fetch(`${BASE_URL}/bills`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch bills");
  return data;
};

export const createBill = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/bills`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create bill");
  return data;
};

export const payBillWithTransfer = async (billId: string, payload?: any) => {
  const res = await fetch(`${BASE_URL}/bills/${billId}/pay-transfer`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to pay bill via transfer");
  return data;
};

export const resolveAccountNumber = async (accountNumber: string, bankCode: string) => {
  const res = await fetch(`${BASE_URL}/paystack/resolve-account`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ accountNumber, bankCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to resolve account number");
  return data;
};

export const getBankList = async () => {
  const res = await fetch(`${BASE_URL}/paystack/banks`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch bank list");
  return data;
};