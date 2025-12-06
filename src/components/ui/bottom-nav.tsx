"use client";

import { Home, Receipt, CreditCard, Banknote, Building, Target, Bell, TrendingUp, Wallet, PenIcon, Users, Flag, RefreshCcw } from "lucide-react";
import type { PageType } from "@/components/Header";

interface BottomNavProps {
  current: PageType;
  onChange: (page: PageType) => void;
}

const items: { id: PageType; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'transactions', label: 'Txns', icon: CreditCard },
  { id: 'pay-bills', label: 'Bills', icon: Banknote },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'budget', label: 'Budget', icon: PenIcon },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'spending-insights', label: 'Insights', icon: TrendingUp },
  { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
  { id: 'goals', label: 'Goals', icon: Flag },
  { id: 'recurring-expenses', label: 'Recurring', icon: RefreshCcw },
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/90 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/70"
      role="navigation"
      aria-label="Primary app navigation"
    >
      <div className="mx-auto max-w-5xl">
        <div className="scroll-x-padded pb-1 pt-2">
          {items.map((it) => {
            const Icon = it.icon;
            const active = current === it.id;
            return (
              <button
                key={it.id}
                className={`flex min-w-[72px] flex-col items-center justify-center rounded-xl px-2 py-1 text-[11px] transition ${
                  active
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => onChange(it.id)}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={`h-5 w-5 ${active ? 'scale-110' : ''}`} />
                <span className="mt-1">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


