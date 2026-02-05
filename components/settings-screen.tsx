"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  Globe,
  Bell,
  Leaf,
  User,
  LogOut,
  ChevronRight,
  Check,
  Accessibility,
  Volume2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage, type Language } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export function SettingsScreen() {
  const { t, language, setLanguage } = useLanguage();
  const { user, setUser, setCurrentScreen, accessibilityMode, setAccessibilityMode, speak } = useAppState();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [notifications, setNotifications] = useState({
    newOffers: true,
    orderUpdates: true,
    promotions: false,
  });

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen("splash");
  };

  const handleBack = () => {
    setCurrentScreen(user?.role === "seller" ? "seller-dashboard" : "consumer-home");
  };

  const handleAccessibilityToggle = (checked: boolean) => {
    setAccessibilityMode(checked);
    if (checked) {
      document.documentElement.classList.add("high-contrast");
      speak("Accessibility mode enabled");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  // Impact stats (mock data)
  const impactStats = {
    mealsSaved: 47,
    co2Saved: 28.5,
    moneySaved: 12400,
  };

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t("settings")}</h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Profile section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {user?.name || "User"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email || "email@example.com"}
            </p>
            {user?.businessName && (
              <p className="text-sm text-primary truncate">{user.businessName}</p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.div>

        {/* Impact Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-success/5 to-transparent border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">{t("impactTracker")}</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {impactStats.mealsSaved}
              </p>
              <p className="text-xs text-muted-foreground">{t("mealsSaved")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {impactStats.co2Saved}kg
              </p>
              <p className="text-xs text-muted-foreground">{t("co2Saved")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {(impactStats.moneySaved / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-muted-foreground">{t("dzd")} saved</p>
            </div>
          </div>
        </motion.div>

        {/* Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            Accessibility
          </h3>
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <Accessibility className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">High Contrast</p>
                  <p className="text-xs text-muted-foreground">For color blindness</p>
                </div>
              </div>
              <Switch
                checked={accessibilityMode}
                onCheckedChange={handleAccessibilityToggle}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Voice Guidance (Groq AI)</p>
                  <p className="text-xs text-muted-foreground">AI-powered female voice assistant</p>
                </div>
              </div>
              <Switch 
                checked={accessibilityMode} 
                onCheckedChange={handleAccessibilityToggle}
              />
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            {t("language")}
          </h3>
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{t("language")}</p>
              <p className="text-sm text-muted-foreground">
                {languages.find((l) => l.code === language)?.nativeName}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            {t("notifications")}
          </h3>
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            {[
              { key: "newOffers", label: "New offers nearby" },
              { key: "orderUpdates", label: "Order updates" },
              { key: "promotions", label: "Promotions & deals" },
            ].map((item, index) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center justify-between p-4",
                  index !== 2 && "border-b border-border/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">{item.label}</span>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [item.key]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-14 rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t("logout")}
          </Button>
        </motion.div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end bg-foreground/50 backdrop-blur-sm"
          onClick={() => setShowLanguageModal(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl bg-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {t("language")}
              </h2>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-2 rounded-full hover:bg-muted"
              >
                <ChevronLeft className="h-5 w-5 rotate-90" />
              </button>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl transition-colors",
                    language === lang.code
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                  )}
                >
                  <div className="text-left">
                    <p className="font-medium text-foreground">{lang.name}</p>
                    <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
                  </div>
                  {language === lang.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
