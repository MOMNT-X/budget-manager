"use client";

import { Home, Receipt, CreditCard, Banknote, Building, Target, Bell, TrendingUp, Wallet, PercentDiamond, PencilRulerIcon, PenIcon } from "lucide-react";

type PageType = 'dashboard' | 'expenses' | 'transactions' | 'pay-bills' | 'wallet' | 'budget' | 'notifications' | 'spending-insights';

interface BottomNavProps {
  current: PageType;
  onChange: (page: PageType) => void;
}

const items: { id: PageType; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  // { id: 'expenses', label: 'Expenses', icon: Receipt },
  // { id: 'transactions', label: 'Txns', icon: CreditCard },
  { id: 'pay-bills', label: 'Bills', icon: Banknote },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'budget', label: 'Budget', icon: PenIcon },
  // { id: 'notifications', label: 'Alerts', icon: Bell },
  // { id: 'spending-insights', label: 'Insights', icon: TrendingUp },
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-md grid grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          const active = current === it.id;
          return (
            <button
              key={it.id}
              className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs md:text-sm transition-colors ${
                active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => onChange(it.id)}
            >
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${active ? 'scale-110' : ''}`} />
              <span className="mt-0.5 sm:mt-1 md:mt-2">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


