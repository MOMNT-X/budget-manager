import { useState } from "react";
import { Dashboard } from "../components/Dashboard";
import { RecentTransactions } from "../components/RecentTransactions";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { Header } from "../components/Header";
import { ExpensesPage } from "../components/ExpensesPage";
import { TransactionsPage } from "../components/TransactionsPage";
import { PayBillsPage } from "../components/PayBillsPage";
import { WalletPage } from "../components/WalletPage";
import { BudgetPage } from "../components/BudgetPage";
import NotificationSystem from "../components/NotificationSystem";
import SpendingInsightsPage from "../components/SpendingInsightsPage";
import { AppProvider, useApp } from "../contexts/AppContext";
import { mockTransactions, mockCategoryData } from "../data/mockData";

export type PageType = 'dashboard' | 'expenses' | 'transactions' | 'pay-bills' | 'wallet' | 'budget' | 'notifications' | 'spending-insights';

function LayoutContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const username = localStorage.getItem("username");

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <Dashboard />
              
              <RecentTransactions transactions={mockTransactions.slice(0, 5)} />
            </div>
            
            <div className="space-y-6">
              <CategoryBreakdown data={mockCategoryData} />
            </div>
          </div>
        );
      case 'expenses':
        return <ExpensesPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'pay-bills':
        return <PayBillsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'budget':
        return <BudgetPage />;
      case 'notifications':
        return <NotificationSystem />;
      case 'spending-insights':
        return <SpendingInsightsPage />;
      default:
        return <div className="text-center text-muted-foreground">Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="w-full px-6 py-6 space-y-6">
        {/* Optional Welcome Banner */}
        {currentPage === 'dashboard' && (
          <div className="bg-primary text-white p-4 rounded-lg shadow-md">
            <p className="text-sm">
              Welcome back, {username} 👋
            </p>
            <p className="text-lg font-semibold">Here's your financial overview</p>
          </div>
        )}

        {/* Page Content */}
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-4">
        &copy; {new Date().getFullYear()} Budget Manager by Emmanuel
      </footer>
    </div>
  );
}

export default function Layout() {
  return (
    <AppProvider>
      <LayoutContent />
    </AppProvider>
  );
}