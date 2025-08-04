"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { Plus, Settings, Menu, Home, Receipt, CreditCard, Banknote, Building, Target, CoinsIcon, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export type PageType = 'dashboard' | 'expenses' | 'transactions' | 'pay-bills' | 'add-bank' | 'budget';

interface HeaderProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigationItems = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: Home },
  { id: 'expenses' as PageType, label: 'Expenses', icon: Receipt },
  { id: 'transactions' as PageType, label: 'Transactions', icon: CreditCard },
  { id: 'pay-bills' as PageType, label: 'Pay Bills', icon: Banknote },
  { id: 'add-bank' as PageType, label: 'Add Bank', icon: Building },
  { id: 'budget' as PageType, label: 'Budget', icon: Target },
];

export function Header({ currentPage, onPageChange }: HeaderProps) {
   const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <header className="border-b bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground"><CoinsIcon></CoinsIcon> Budget Manager</h1>
            <p className="text-muted-foreground text-sm">
              Track your finances and stay on budget
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        className={`group inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-muted hover:text-foreground"
                        }`}
                        onClick={() => onPageChange(item.id)}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] sm:w-[300px]">
                <div className="mt-4 py-6">
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Button
  key={item.id}
  variant={currentPage === item.id ? "default" : "ghost"}
  className="w-full justify-start"
  onClick={() => {
    onPageChange(item.id);
    setIsSheetOpen(false); // Close the sheet
  }}
>
  <IconComponent className="h-4 w-4 mr-2" />
  {item.label}
</Button>

                      );
                    })}
                  </div>

                  <div className="border-t pt-6 mt-6 space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
