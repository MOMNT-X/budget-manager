"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { Plus, Settings, Menu, Chrome as Home, Receipt, CreditCard, Banknote, Building, Target, Coins as CoinsIcon, X, User, Sparkles, Users, TrendingUp, Repeat, Lightbulb } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useNavigate } from "react-router-dom";

export type PageType = 'dashboard' | 'expenses' | 'transactions' | 'pay-bills' | 'wallet' | 'budget' | 'profile' | 'beneficiaries' | 'financial-goals' | 'recurring-expenses' | 'insights';

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
  { id: 'beneficiaries' as PageType, label: 'Beneficiaries', icon: Users, gradient: 'from-pink-500 to-rose-500' },
  { id: 'financial-goals' as PageType, label: 'Goals', icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
  { id: 'recurring-expenses' as PageType, label: 'Recurring', icon: Repeat, gradient: 'from-amber-500 to-orange-500' },
  { id: 'insights' as PageType, label: 'Insights', icon: Lightbulb, gradient: 'from-violet-500 to-purple-500' },
];

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <header className="relative border-b bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 backdrop-blur-xl shadow-lg border-white/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <CoinsIcon className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-1.5 h-1.5 md:w-2 md:h-2 text-white" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Smart Budget
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Smart financial management made easy
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        className={`group relative inline-flex items-center px-3 py-2 md:px-5 md:py-3 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer overflow-hidden ${
                          isActive
                            ? "text-white shadow-xl transform scale-105"
                            : "text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-lg hover:scale-105"
                        }`}
                        onClick={() => onPageChange(item.id)}
                      >
                        {isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl`}></div>
                        )}
                        <div className="relative flex items-center">
                          <IconComponent className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                          <span className="hidden lg:block">{item.label}</span>
                        </div>
                        {isActive && (
                          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                        )}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Action Buttons */}
            <div className="hidden xl:flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative bg-white/70 backdrop-blur-sm border-white/50 hover:bg-white/90 hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 group"
                onClick={() => onPageChange('profile')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-blue-100 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Profile
                </div>
              </Button>
              
              <Button 
                size="sm" 
                className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-5 py-2 group overflow-hidden"
                onClick={() => onPageChange('budget')}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <div className="relative flex items-center">
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add Budget
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white/70 backdrop-blur-sm border-white/50 hover:bg-white/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] bg-gradient-to-br from-white via-blue-50 to-purple-50 backdrop-blur-xl border-white/30"
              >
                <div className="mt-6 py-6">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center space-x-3 pb-6 border-b border-white/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <CoinsIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">Smart Budget</h2>
                      <p className="text-xs text-gray-600">Navigation Menu</p>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <div className="space-y-2 py-4">
                    {navigationItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <Button
                          key={item.id}
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start rounded-xl transition-all duration-300 ${
                            isActive 
                              ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl` 
                              : "hover:bg-white/60 hover:shadow-md"
                          }`}
                          onClick={() => {
                            onPageChange(item.id);
                            setIsSheetOpen(false);
                          }}
                        >
                          <IconComponent className="h-5 w-5 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Mobile Actions */}
                  <div className="border-t border-white/30 pt-6 mt-6 space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start bg-white/50 hover:bg-white/80 rounded-xl transition-all duration-300"
                      onClick={() => {
                        navigate('/profile');
                        setIsSheetOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile & Settings
                    </Button>
                    
                    <Button 
                      size="sm" 
                      className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => {
                        onPageChange('budget');
                        setIsSheetOpen(false);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Add Budget
                    </Button>
                  </div>

                  {/* Mobile Menu Footer */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-center text-xs text-gray-500 bg-white/30 rounded-lg py-2 backdrop-blur-sm">
                      <p>Stay on top of your finances</p>
                    </div>
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