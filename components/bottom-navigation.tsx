"use client";

import { motion } from "framer-motion";
import {
  Home,
  Search,
  Heart,
  ShoppingBag,
  LayoutDashboard,
  Package,
  BarChart3,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useAppState, type AppScreen } from "@/lib/app-state";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  icon: typeof Home;
  labelKey: string;
  screen: AppScreen;
};

const consumerNavItems: NavItem[] = [
  { id: "home", icon: Home, labelKey: "home", screen: "consumer-home" },
  { id: "search", icon: Search, labelKey: "search", screen: "consumer-home" },
  { id: "map", icon: MapPin, labelKey: "nearYou", screen: "consumer-home" },
  { id: "favorites", icon: Heart, labelKey: "favorites", screen: "consumer-home" },
  { id: "orders", icon: ShoppingBag, labelKey: "orders", screen: "consumer-home" },
];

const sellerNavItems: NavItem[] = [
  { id: "dashboard", icon: LayoutDashboard, labelKey: "dashboard", screen: "seller-dashboard" },
  { id: "inventory", icon: Package, labelKey: "inventory", screen: "seller-dashboard" },
  { id: "analytics", icon: BarChart3, labelKey: "analytics", screen: "seller-dashboard" },
];

export function BottomNavigation() {
  const { t } = useLanguage();
  const { user, currentScreen, speak, accessibilityMode } = useAppState();

  const navItems = user?.role === "seller" ? sellerNavItems : consumerNavItems;
  
  // Determine active tab based on current screen
  const getActiveTab = () => {
    if (currentScreen === "settings") return "settings";
    if (currentScreen === "consumer-home") return "home";
    if (currentScreen === "seller-dashboard") return "dashboard";
    return "home";
  };

  const activeTab = getActiveTab();

  const handleNavClick = (item: NavItem) => {
    if (accessibilityMode) {
      speak(t(item.labelKey));
    }
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      {/* Glassmorphism background */}
      <div className="mx-3 mb-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl shadow-foreground/5">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="relative flex flex-col items-center px-2 py-2 min-w-0 flex-1"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span
                  className={cn(
                    "mt-1 text-[9px] font-medium transition-colors truncate max-w-full",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t(item.labelKey)}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-0.5 h-0.5 w-5 rounded-full bg-primary"
                    transition={{ type: "spring", damping: 20 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
