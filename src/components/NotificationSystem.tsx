"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent } from "./ui/sheet";
import { BASE_URL } from "@/config/api";

type NotificationKind = "success" | "info" | "warning";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationKind;
  createdAt: string;
  read: boolean;
  resourceType?: string;
  resourceId?: string;
}

const API_BASE_URL = BASE_URL;

function getIcon(kind: NotificationKind) {
  switch (kind) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
}

export default function NotificationSystem() {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useRef(false);

  const authHeaders = useMemo<HeadersInit>(() => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/notifications`, { headers: authHeaders });
      
      if (!res.ok) {
        if (res.status === 401) {
          console.log("Unauthorized - user might need to log in");
          return;
        }
        throw new Error("Failed to load notifications");
      }
      
      const data = await res.json();
      setItems(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Only show fallback if we have no notifications
      if (items.length === 0) {
        setItems([
          { 
            id: "welcome", 
            title: "Welcome", 
            message: "You will see payment and bill alerts here.", 
            type: "info", 
            createdAt: new Date().toISOString(), 
            read: false 
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => { 
      mounted.current = false; 
      clearInterval(intervalId); 
    };
  }, [authHeaders]);

  const markAllRead = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: authHeaders,
      });
      
      if (res.ok) {
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: authHeaders,
      });
      
      if (res.ok) {
        setItems((prev) => 
          prev.map((n) => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      
      if (res.ok) {
        const notification = items.find(n => n.id === id);
        setItems((prev) => prev.filter((n) => n.id !== id));
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Optional: Navigate to resource if resourceType and resourceId exist
    // if (notification.resourceType && notification.resourceId) {
    //   router.push(`/${notification.resourceType}/${notification.resourceId}`);
    // }
  };

  return (
    <div className="relative inline-flex">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <div className="space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSheetOpen(true)}>
                Open
              </Button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading && items.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            items.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} className="p-0">
                <div 
                  className={`w-full flex items-start gap-3 p-3 cursor-pointer hover:bg-accent ${!n.read ? 'bg-accent/50' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  {getIcon(n.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {n.title}
                      </p>
                      <button 
                        className="text-xs text-muted-foreground hover:text-foreground" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation();
                          remove(n.id); 
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
          {items.length > 5 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2 text-center">
                <Button variant="ghost" size="sm" onClick={() => setSheetOpen(true)}>
                  View all ({items.length})
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[380px] sm:w-[420px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">All notifications</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
          </div>
          <div className="space-y-2 max-h-[82vh] overflow-y-auto pr-2">
            {items.map((n) => (
              <div 
                key={n.id} 
                className={`rounded-lg border p-3 flex gap-3 cursor-pointer hover:bg-accent ${!n.read ? 'bg-accent/50 border-primary/20' : 'opacity-80'}`}
                onClick={() => handleNotificationClick(n)}
              >
                {getIcon(n.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{n.title}</p>
                    <button
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(n.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {items.length === 0 && !isLoading && (
              <div className="text-sm text-muted-foreground text-center py-8">
                No notifications
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}