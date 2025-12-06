"use client";

import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import { Plus, Settings, Menu, Home, Receipt, CreditCard, Banknote, Building, Target, CoinsIcon, Sparkles, Bell, TrendingUp, Users, Flag, RefreshCcw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useNavigate } from "react-router-dom";

export type PageType =
  | 'dashboard'
  | 'expenses'
  | 'transactions'
  | 'pay-bills'
  | 'wallet'
  | 'budget'
  | 'notifications'
  | 'spending-insights'
  | 'beneficiaries'
  | 'goals'
  | 'recurring-expenses';

interface HeaderProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigationItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: Home, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'expenses' as PageType, label: 'Expenses', icon: Receipt, gradient: 'from-red-500 to-pink-500' },
  { id: 'transactions' as PageType, label: 'Transactions', icon: CreditCard, gradient: 'from-green-500 to-emerald-500' },
  { id: 'pay-bills' as PageType, label: 'Bills', icon: Banknote, gradient: 'from-orange-500 to-yellow-500' },
  { id: 'wallet' as PageType, label: 'Wallet', icon: Building, gradient: 'from-purple-500 to-indigo-500' },
  { id: 'budget' as PageType, label: 'Budget', icon: Target, gradient: 'from-teal-500 to-green-500' },
  { id: 'notifications' as PageType, label: 'Notifications', icon: Bell, gradient: 'from-amber-500 to-orange-500' },
  { id: 'spending-insights' as PageType, label: 'Insights', icon: TrendingUp, gradient: 'from-violet-500 to-purple-500' },
];

const secondaryNavigationItems = [
  { id: 'beneficiaries' as PageType, label: 'Beneficiaries', icon: Users, description: 'Manage recipients for quick transfers' },
  { id: 'goals' as PageType, label: 'Goals', icon: Flag, description: 'Track long-term savings goals' },
  { id: 'recurring-expenses' as PageType, label: 'Recurring', icon: RefreshCcw, description: 'Automate fixed monthly bills' },
];

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuSections = useMemo(
    () => [
      { title: "Core pages", items: navigationItems },
      { title: "More tools", items: secondaryNavigationItems },
    ],
    []
  );

  const flatMenu = useMemo(
    () => [...navigationItems, ...secondaryNavigationItems],
    []
  );

  const currentMeta = flatMenu.find((item) => item.id === currentPage);

  const handleNavigate = (page: PageType) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="safe-container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg">
              <CoinsIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-amber-400 to-pink-400 p-1 shadow">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-base font-semibold">Smart Budget</p>
            <p className="text-xs text-muted-foreground">
              {currentMeta?.label ?? "Overview"}
            </p>
          </div>
        </div>

        {/* Center navigation for larger screens */}
        <nav className="hidden md:flex items-center gap-3 mx-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${active ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg scale-100' : 'bg-transparent text-muted-foreground hover:bg-white/5'}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className={`flex items-center justify-center h-8 w-8 rounded-md ${active ? 'bg-white/20' : 'bg-muted'} text-white`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="hidden lg:inline-flex text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            onClick={() => navigate("/profile")}
            aria-label="Profile & settings"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Menu className="h-4 w-4" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[360px] flex-col gap-6 bg-gradient-to-b from-white via-blue-50 to-purple-50 p-6"
            >
              {menuSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </p>
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${active ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow' : 'hover:bg-white/50 bg-transparent'}`}
                        >
                          <span className={`flex items-center justify-center h-9 w-9 rounded-lg ${active ? 'bg-white/20' : 'bg-muted'} text-white`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.label}</span>
                            {"description" in item && item.description && (
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quick actions
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl"
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Profile & Settings
                  </Button>
                  <Button
                    className="w-full justify-start gap-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                    onClick={() => handleNavigate('budget')}
                  >
                    <Plus className="h-4 w-4" />
                    Add Budget
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}