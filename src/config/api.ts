export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Common error extractor (NestJS often returns string | string[])
const extractErrorMessage = (data: any, fallback: string) => {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.message)) return data.message.join(", ");
  if (data.error) return String(data.error);
  return fallback;
};

// Lightweight request helper for new endpoints only (non-breaking)
async function request(
  path: string,
  init?: RequestInit,
  fallbackMessage = "Request failed"
) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(extractErrorMessage(data, fallbackMessage));
  }
  return data;
}

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
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch budget summary");
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

export const getTransactions = async (params?: {
  type?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });
  }
  const url = `${BASE_URL}/transactions${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url, {
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

// ===== WALLET EXTRAS =====
export const walletPay = async (payload: {
  amount: number;
  description: string;
  categoryId: string;
}) => {
  return await request(
    "/wallet/pay",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Failed to process payment"
  );
};

export const walletTransfer = async (payload: {
  accountNumber: string;
  bankCode: string;
  amount: number;
  description?: string;
}) => {
  return await request(
    "/wallet/transfer",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Transfer failed"
  );
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

export const getExpensesSummary = async (filters?: {
  month?: number;
  week?: number; // 1 => last 7 days
  categoryId?: string;
}) => {
  const query = new URLSearchParams();
  if (filters) {
    if (filters.month) query.set('month', String(filters.month));
    if (filters.week) query.set('week', String(filters.week));
    if (filters.categoryId) query.set('categoryId', filters.categoryId);
  }
  const url = `${BASE_URL}/expenses/summary${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch expense summary");
  return data;
};

// ===== DASHBOARD =====
export const getDashboardSummary = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/summary`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch dashboard summary");
  return data;
};

export const getDashboardTransactions = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/transactions`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch dashboard transactions");
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
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch financial goals");
  return data;
};

export const createFinancialGoal = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/financial-goals`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to create financial goal");
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
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch recurring expenses");
  return data;
};

export const createRecurringExpense = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/recurring-expenses`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to create recurring expense");
  return data;
};

export const updateRecurringExpense = async (id: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/recurring-expenses/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to update recurring expense");
  return data;
};

export const deleteRecurringExpense = async (id: string) => {
  const res = await fetch(`${BASE_URL}/recurring-expenses/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to delete recurring expense");
  return data;
};

// ===== INSIGHTS & ANALYTICS =====
export const getSpendingInsights = async (
  period: "week" | "month" | "year" = "month"
) => {
  const res = await fetch(`${BASE_URL}/insights/spending?period=${period}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch spending insights");
  return data;
};

export const getSpendingTrends = async (months: number = 6) => {
  const res = await fetch(`${BASE_URL}/insights/trends?months=${months}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch spending trends");
  return data;
};

export const getBudgetPerformance = async () => {
  const res = await fetch(`${BASE_URL}/insights/budget-performance`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch budget performance");
  return data;
};

export const getRecommendations = async () => {
  const res = await fetch(`${BASE_URL}/insights/recommendations`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch recommendations");
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
  if (!res.ok)
    throw new Error(data.message || "Failed to pay bill via transfer");
  return data;
};

export const resolveAccountNumber = async (
  accountNumber: string,
  bankCode: string
) => {
  const res = await fetch(`${BASE_URL}/paystack/resolve-account`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ accountNumber, bankCode }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to resolve account number");
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

// ===== NOTIFICATIONS =====
export const sendEmailNotification = async (
  to: string,
  subject: string,
  html: string
) => {
  return await request(
    "/notifications/email",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    },
    "Failed to send email"
  );
};

export const sendDiscordNotification = async (
  message: string,
  embed?: any
) => {
  return await request(
    "/notifications/discord",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ message, embed }),
    },
    "Failed to send discord notification"
  );
};

export const sendTransactionNotification = async (transaction: any) => {
  return await request(
    "/notifications/transaction",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ transaction }),
    },
    "Failed to send transaction notification"
  );
};

export const sendBudgetCreatedNotification = async (budget: any) => {
  return await request(
    "/notifications/budget-created",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ budget }),
    },
    "Failed to send budget created notification"
  );
};

export const sendBudgetThresholdAlert = async (budget: any, percentUsed: number) => {
  return await request(
    "/notifications/budget-threshold",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ budget, percentUsed }),
    },
    "Failed to send budget threshold alert"
  );
};

export const sendBillPaidNotification = async (bill: any) => {
  return await request(
    "/notifications/bill-paid",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ bill }),
    },
    "Failed to send bill paid notification"
  );
};

export const sendBillReminderNotification = async (bill: any) => {
  return await request(
    "/notifications/bill-reminder",
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ bill }),
    },
    "Failed to send bill reminder notification"
  );
};
