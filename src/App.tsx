import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import SignupPage from "@/pages/Signup";
import LoginPage from "@/pages/Login";
import Layout from "@/pages/Layout";
import ProfilePage from "@/pages/Profile";
import MobileLayout from "@/pages/MobileLayout";
import { Dashboard } from "@/components/Dashboard";
import { ExpensesPage } from "@/components/ExpensesPage";
import { TransactionsPage } from "@/components/TransactionsPage";
import { PayBillsPage } from "@/components/PayBillsPage";
import { WalletPage } from "@/components/WalletPage";
import { BudgetPage } from "@/components/BudgetPage";
import NotificationSystem from "@/components/NotificationSystem";
import SpendingInsightsPage from "@/components/SpendingInsightsPage";
import { BeneficiariesPage } from "@/components/BeneficiariesPage";
import { FinancialGoalsPage } from "@/components/FinancialGoalsPage";
import { RecurringExpensesPage } from "@/components/RecurringExpensesPage";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Mobile App: nested routes with bottom nav */}
        <Route path="/app" element={<MobileLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="pay-bills" element={<PayBillsPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="notifications" element={<NotificationSystem />} />
          <Route path="insights" element={<SpendingInsightsPage />} />
          <Route path="beneficiaries" element={<BeneficiariesPage />} />
          <Route path="goals" element={<FinancialGoalsPage />} />
          <Route path="recurring-expenses" element={<RecurringExpensesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}