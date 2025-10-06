"use client";

import { Home, Receipt, CreditCard, Banknote, Building, Target, Bell, TrendingUp } from "lucide-react";

type PageType = 'dashboard' | 'expenses' | 'transactions' | 'pay-bills' | 'wallet' | 'budget' | 'notifications' | 'spending-insights';

interface BottomNavProps {
  current: PageType;
  onChange: (page: PageType) => void;
}

const items: { id: PageType; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'transactions', label: 'Txns', icon: CreditCard },
  { id: 'pay-bills', label: 'Bills', icon: Banknote },
  { id: 'wallet', label: 'Wallet', icon: Building },
  { id: 'budget', label: 'Budget', icon: Target },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'spending-insights', label: 'Insights', icon: TrendingUp },
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-md grid grid-cols-4 sm:grid-cols-8">
        {items.map((it) => {
          const Icon = it.icon;
          const active = current === it.id;
          return (
            <button
              key={it.id}
              className={`flex flex-col items-center justify-center py-2 text-xs transition-colors ${active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => onChange(it.id)}
            >
              <Icon className={`h-5 w-5 ${active ? 'scale-110' : ''}`} />
              <span className="mt-1">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


