"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { LanguageProvider } from "@/lib/i18n";
import { AppStateProvider, useAppState } from "@/lib/app-state";
import { SplashScreen } from "./splash-screen";
import { OnboardingScreen } from "./onboarding-screen";
import { RoleSelectScreen } from "./role-select-screen";
import { SignupConsumerScreen } from "./signup-consumer-screen";
import { SignupSellerScreen } from "./signup-seller-screen";
import { SigninScreen } from "./signin-screen";
import { ConsumerHomeScreen } from "./consumer-home-screen";
import { SellerDashboardScreen } from "./seller-dashboard-screen";
import { SettingsScreen } from "./settings-screen";
import { BottomNavigation } from "./bottom-navigation";
import { SidebarDrawer } from "./sidebar-drawer";

function AppContent() {
  const { currentScreen, isAuthenticated, accessibilityMode } = useAppState();

  const showNavigation =
    isAuthenticated &&
    (currentScreen === "consumer-home" ||
      currentScreen === "seller-dashboard" ||
      currentScreen === "settings");

  // Apply high contrast mode on mount if accessibility is enabled
  useEffect(() => {
    if (accessibilityMode) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [accessibilityMode]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === "splash" && <SplashScreen key="splash" />}
        {currentScreen === "onboarding" && <OnboardingScreen key="onboarding" />}
        {currentScreen === "role-select" && <RoleSelectScreen key="role-select" />}
        {currentScreen === "signup-consumer" && (
          <SignupConsumerScreen key="signup-consumer" />
        )}
        {currentScreen === "signup-seller" && (
          <SignupSellerScreen key="signup-seller" />
        )}
        {currentScreen === "signin" && <SigninScreen key="signin" />}
        {currentScreen === "consumer-home" && (
          <ConsumerHomeScreen key="consumer-home" />
        )}
        {currentScreen === "seller-dashboard" && (
          <SellerDashboardScreen key="seller-dashboard" />
        )}
        {currentScreen === "settings" && <SettingsScreen key="settings" />}
      </AnimatePresence>

      {showNavigation && <BottomNavigation />}
      {isAuthenticated && <SidebarDrawer />}
    </div>
  );
}

export function LoopRefoodApp() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </LanguageProvider>
  );
}
