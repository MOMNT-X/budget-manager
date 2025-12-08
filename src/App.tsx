import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const SignupPage = lazy(() => import("@/pages/Signup"));
const LoginPage = lazy(() => import("@/pages/Login"));
const Layout = lazy(() => import("@/pages/Layout"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const MobileLayout = lazy(() => import("@/pages/MobileLayout"));
const Dashboard = lazy(() =>
  import("@/components/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const ExpensesPage = lazy(() =>
  import("@/components/ExpensesPage").then((m) => ({ default: m.ExpensesPage }))
);
const TransactionsPage = lazy(() =>
  import("@/components/TransactionsPage").then((m) => ({ default: m.TransactionsPage }))
);
const PayBillsPage = lazy(() =>
  import("@/components/PayBillsPage").then((m) => ({ default: m.PayBillsPage }))
);
const WalletPage = lazy(() =>
  import("@/components/WalletPage").then((m) => ({ default: m.WalletPage }))
);
const BudgetPage = lazy(() =>
  import("@/components/BudgetPage").then((m) => ({ default: m.BudgetPage }))
);
const NotificationSystem = lazy(() => import("@/components/NotificationSystem"));
const SpendingInsightsPage = lazy(() => import("@/components/SpendingInsightsPage"));
const BeneficiariesPage = lazy(() =>
  import("@/components/BeneficiariesPage").then((m) => ({ default: m.BeneficiariesPage }))
);
const FinancialGoalsPage = lazy(() =>
  import("@/components/FinancialGoalsPage").then((m) => ({ default: m.FinancialGoalsPage }))
);
const RecurringExpensesPage = lazy(() =>
  import("@/components/RecurringExpensesPage").then((m) => ({ default: m.RecurringExpensesPage }))
);

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
    Loading experience...
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Default Route - Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Legacy desktop layout */}
          <Route path="/dashboard" element={<Layout />} />

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
      </Suspense>
      <Toaster />
    </Router>
  );
}