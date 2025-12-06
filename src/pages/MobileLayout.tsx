import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header, PageType } from "@/components/Header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Toaster } from "@/components/ui/toaster";

const routeToPage: Record<string, PageType> = {
  '/app/dashboard': 'dashboard',
  '/app/expenses': 'expenses',
  '/app/transactions': 'transactions',
  '/app/pay-bills': 'pay-bills',
  '/app/wallet': 'wallet',
  '/app/budget': 'budget',
  '/app/notifications': 'notifications',
  '/app/insights': 'spending-insights',
  '/app/beneficiaries': 'beneficiaries',
  '/app/goals': 'goals',
  '/app/recurring-expenses': 'recurring-expenses',
};

const pageToRoute: Record<PageType, string> = {
  'dashboard': '/app/dashboard',
  'expenses': '/app/expenses',
  'transactions': '/app/transactions',
  'pay-bills': '/app/pay-bills',
  'wallet': '/app/wallet',
  'budget': '/app/budget',
  'notifications': '/app/notifications',
  'spending-insights': '/app/insights',
  'beneficiaries': '/app/beneficiaries',
  'goals': '/app/goals',
  'recurring-expenses': '/app/recurring-expenses',
};

export default function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = (routeToPage[location.pathname] || 'dashboard') as PageType;
  const username = localStorage.getItem("username");  

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header currentPage={current} onPageChange={(p) => navigate(pageToRoute[p])} />
      <main className="safe-container pb-24 pt-6 space-y-6">
         {/* Optional Welcome Banner */}
        {current === 'dashboard' && (
          <div className="bg-primary text-white p-4 rounded-lg shadow-md">
            <p className="text-sm">
              Welcome back, {username} 👋
            </p>
            <p className="text-lg font-semibold">Here's your financial overview</p>
          </div>
        )}
        <Outlet />
      </main>
      <div className="h-16" />
      <BottomNav current={current} onChange={(p) => navigate(pageToRoute[p])} />
    </div>
  );
}


