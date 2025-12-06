import { apiClient } from "@/utils/apiClient";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DEFAULT_CACHE_TTL = 2 * 60 * 1000;

const apiPath = (path: string) => (path.startsWith("http") ? path.replace(BASE_URL, "") : path);

const cachedGet = <T>(path: string, cacheTTL = DEFAULT_CACHE_TTL) =>
  apiClient<T>(apiPath(path), { cache: true, cacheTTL });

const authedRequest = <T>(path: string, options?: RequestInit & { cache?: boolean; cacheTTL?: number }) =>
  apiClient<T>(apiPath(path), options);

// Common error extractor (NestJS often returns string | string[])
export const extractErrorMessage = (data: any, fallback: string) => {
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
  try {
    return await authedRequest(path, init);
  } catch (error: any) {
    throw new Error(error?.message || fallbackMessage);
  }
}

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
export const getBudgets = async () => cachedGet('/budgets');

export const createBudget = async (payload: any) =>
  authedRequest('/budgets', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getBudgetSummary = async () => cachedGet('/budgets/summary');

// ===== CATEGORIES =====
export const addCategory = async (payload: any) =>
  authedRequest('/category', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getCategories = async () => cachedGet('/dashboard/categories');

// ===== TRANSACTIONS =====
export const createTransaction = async (payload: any) =>
  authedRequest('/transactions', {
    method: "POST",
    body: JSON.stringify(payload),
  });

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
  const path = `/transactions${query.toString() ? `?${query.toString()}` : ''}`;
  return cachedGet(path, 60 * 1000);
};

// ===== WALLET =====
export const deposit = async (payload: any) =>
  authedRequest('/wallet/deposit', {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const confirm = async () => {
  const reference = localStorage.getItem("depositRef");

  if (!reference) {
    throw new Error("No deposit reference found in localStorage.");
  }

  const payload = { reference }; // or whatever key your API expects

  return authedRequest('/wallet/confirm-deposit', {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getBalance = async () => cachedGet('/wallet/balance', 60 * 1000);
export const WithdrawBalance = async (amount: number) =>
  authedRequest('/wallet/withdraw', {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

// ===== WALLET EXTRAS =====
export const walletPay = async (payload: {
  amount: number;
  description: string;
  categoryId: string;
}) =>
  authedRequest('/wallet/pay', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const walletTransfer = async (payload: {
  accountNumber: string;
  bankCode: string;
  amount: number;
  description?: string;
}) =>
  authedRequest('/wallet/transfer', {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ==== BILL =====
export const payBill = async (payload: any) =>
  authedRequest('/bills/pay', {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ===== EXPENSES =====
export const createExpense = async (payload: any) =>
  authedRequest('/expenses', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getExpenses = async () => cachedGet('/expenses');

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
  const path = `/expenses/summary${query.toString() ? `?${query.toString()}` : ''}`;
  return cachedGet(path, 60 * 1000);
};

// ===== DASHBOARD =====
export const getDashboardSummary = async () => cachedGet('/dashboard/summary');

export const getDashboardTransactions = async () => cachedGet('/dashboard/transactions', 60 * 1000);

export const getDashboardCategories = async () => cachedGet('/dashboard/categories');

// ===== BENEFICIARIES =====
export const getBeneficiaries = async () => cachedGet('/beneficiaries');

export const createBeneficiary = async (payload: any) =>
  authedRequest('/beneficiaries', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteBeneficiary = async (id: string) =>
  authedRequest(`/beneficiaries/${id}`, {
    method: "DELETE",
  });

// ===== FINANCIAL GOALS =====
export const getFinancialGoals = async () => cachedGet('/financial-goals');

export const createFinancialGoal = async (payload: any) =>
  authedRequest('/financial-goals', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const contributeToGoal = async (id: string, amount: number) =>
  authedRequest(`/financial-goals/${id}/contribute`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const deleteFinancialGoal = async (id: string) =>
  authedRequest(`/financial-goals/${id}`, {
    method: "DELETE",
  });

// ===== RECURRING EXPENSES =====
export const getRecurringExpenses = async () => cachedGet('/recurring-expenses');

export const createRecurringExpense = async (payload: any) =>
  authedRequest('/recurring-expenses', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateRecurringExpense = async (id: string, payload: any) =>
  authedRequest(`/recurring-expenses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteRecurringExpense = async (id: string) =>
  authedRequest(`/recurring-expenses/${id}`, {
    method: "DELETE",
  });

// ===== INSIGHTS & ANALYTICS =====
export const getSpendingInsights = async (
  period: "week" | "month" | "year" = "month"
) => {
  return cachedGet(`/insights/spending?period=${period}`, 60 * 1000);
};

export const getSpendingTrends = async (months: number = 6) => {
  return cachedGet(`/insights/trends?months=${months}`, 60 * 1000);
};

export const getBudgetPerformance = async () => {
  return cachedGet('/insights/budget-performance', 60 * 1000);
};

export const getRecommendations = async () => {
  return cachedGet('/insights/recommendations', 60 * 1000);
};

// ===== BILLS (Enhanced) =====
export const getBills = async () => cachedGet('/bills');

export const createBill = async (payload: any) =>
  authedRequest('/bills', {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const payBillWithTransfer = async (billId: string, payload?: any) =>
  authedRequest(`/bills/${billId}/pay-transfer`, {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });

export const resolveAccountNumber = async (accountNumber: string, bankCode: string) =>
  authedRequest("/paystack/resolve-account", {
    method: "POST",
    body: JSON.stringify({ accountNumber, bankCode }),
  });

export const getBankList = async () => cachedGet('/paystack/banks', 24 * 60 * 60 * 1000);

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
      body: JSON.stringify({ bill }),
    },
    "Failed to send bill reminder notification"
  );
};
