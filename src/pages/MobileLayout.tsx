import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/ui/bottom-nav";

type PageType = 'dashboard' | 'expenses' | 'transactions' | 'pay-bills' | 'wallet' | 'budget' | 'notifications' | 'spending-insights';

const routeToPage: Record<string, PageType> = {
  '/app/dashboard': 'dashboard',
  '/app/expenses': 'expenses',
  '/app/transactions': 'transactions',
  '/app/pay-bills': 'pay-bills',
  '/app/wallet': 'wallet',
  '/app/budget': 'budget',
  '/app/notifications': 'notifications',
  '/app/insights': 'spending-insights',
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
};

export default function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = (routeToPage[location.pathname] || 'dashboard') as PageType;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header currentPage={current} onPageChange={(p) => navigate(pageToRoute[p])} />
      <main className="w-full px-6 pb-24 pt-6 space-y-6">
        <Outlet />
      </main>
      <div className="h-16" />
      <BottomNav current={current} onChange={(p) => navigate(pageToRoute[p])} />
    </div>
  );
}


