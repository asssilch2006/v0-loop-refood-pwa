"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  User,
  Globe,
  Bell,
  Leaf,
  Accessibility,
  Volume2,
  LogOut,
  X,
  Check,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useLanguage, type Language } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { SustainabilityInsights } from "./sustainability-insights";

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export function SidebarDrawer() {
  const { t, language, setLanguage } = useLanguage();
  const {
    user,
    setUser,
    setCurrentScreen,
    sidebarOpen,
    setSidebarOpen,
    accessibilityMode,
    setAccessibilityMode,
    speak,
  } = useAppState();
  const [showLanguageList, setShowLanguageList] = useState(false);
  const [notifications, setNotifications] = useState({
    newOffers: true,
    orderUpdates: true,
  });

  const handleLogout = () => {
    setSidebarOpen(false);
    setUser(null);
    setCurrentScreen("splash");
  };

  const handleAccessibilityToggle = (checked: boolean) => {
    setAccessibilityMode(checked);
    if (checked) {
      document.documentElement.classList.add("high-contrast");
      speak("Accessibility mode enabled. Voice guidance is now active.");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const handleMenuClick = (label: string) => {
    if (accessibilityMode) {
      speak(label);
    }
  };

  // Impact stats (mock data)
  const impactStats = {
    mealsSaved: 47,
    co2Saved: 28.5,
    moneySaved: 12400,
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-[60] bg-foreground/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-[70] w-[80%] max-w-[320px] bg-card safe-top safe-bottom overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-xl border-b border-border/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">{t("settings")}</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Profile */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleMenuClick("Profile")}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "email@example.com"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Impact Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-success/5 to-transparent border border-primary/20"
                onClick={() => handleMenuClick("Impact Tracker")}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {t("impactTracker")}
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {impactStats.mealsSaved}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{t("mealsSaved")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {impactStats.co2Saved}kg
                    </p>
                    <p className="text-[10px] text-muted-foreground">{t("co2Saved")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {(impactStats.moneySaved / 1000).toFixed(1)}k
                    </p>
                    <p className="text-[10px] text-muted-foreground">{t("dzd")}</p>
                  </div>
                </div>
              </motion.div>

              {/* Accessibility Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1 uppercase tracking-wider">
                  Accessibility
                </h3>
                <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 border-b border-border/50"
                    onClick={() => handleMenuClick("Accessibility Mode")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Accessibility className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          High Contrast Mode
                        </p>
                        <p className="text-xs text-muted-foreground">
                          For color blindness
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={accessibilityMode}
                      onCheckedChange={handleAccessibilityToggle}
                    />
                  </div>
                  <div
                    className="flex items-center justify-between p-4"
                    onClick={() => handleMenuClick("Voice Guidance")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Volume2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Voice Guidance
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Screen reader simulation
                        </p>
                      </div>
                    </div>
                    <Switch checked={accessibilityMode} disabled />
                  </div>
                </div>
              </motion.div>

              {/* Language - Top Right Position */}
              <div className="fixed top-4 right-4 z-[75]">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={() => {
                      setShowLanguageList(!showLanguageList);
                      handleMenuClick("Language selection");
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/30"
                  >
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase">
                      {language}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showLanguageList && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-12 right-0 rounded-lg bg-card border border-border shadow-lg overflow-hidden"
                      >
                        <div className="w-40 space-y-0">
                          {languages.map((lang, index) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                setShowLanguageList(false);
                                handleMenuClick(`Language changed to ${lang.name}`);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between p-3 text-left text-sm font-medium transition-colors",
                                index !== languages.length - 1 && "border-b border-border/50",
                                language === lang.code
                                  ? "bg-primary/10 text-primary"
                                  : "bg-card hover:bg-muted text-foreground"
                              )}
                            >
                              <span>{lang.nativeName}</span>
                              {language === lang.code && (
                                <Check className="h-3.5 w-3.5 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Sustainability Insights Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xs font-medium text-muted-foreground mb-3 px-1 uppercase tracking-wider">
                  {t("sustainabilityInsights")}
                </h3>
                <SustainabilityInsights />
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1 uppercase tracking-wider">
                  {t("notifications")}
                </h3>
                <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
                  {[
                    { key: "newOffers", label: "New offers nearby" },
                    { key: "orderUpdates", label: "Order updates" },
                  ].map((item, index) => (
                    <div
                      key={item.key}
                      className={cn(
                        "flex items-center justify-between p-4",
                        index !== 1 && "border-b border-border/50"
                      )}
                      onClick={() => handleMenuClick(item.label)}
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{item.label}</span>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">{t("logout")}</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
