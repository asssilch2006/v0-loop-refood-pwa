"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Store, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useLanguage } from "@/lib/i18n";
import { useAppState, type UserRole } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function RoleSelectScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const { t } = useLanguage();
  const { setCurrentScreen } = useAppState();

  const handleContinue = () => {
    if (selectedRole === "consumer") {
      setCurrentScreen("signup-consumer");
    } else if (selectedRole === "seller") {
      setCurrentScreen("signup-seller");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Header */}
      <div className="relative px-6 pt-6">
        <Logo size="sm" />
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col px-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
            {t("selectRole")}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {t("welcomeSubtitle")}
          </p>
        </motion.div>

        {/* Role cards */}
        <div className="space-y-4">
          {/* Consumer Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => setSelectedRole("consumer")}
            className={cn(
              "w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left",
              "glass hover:border-primary/50",
              selectedRole === "consumer"
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-transparent"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                  selectedRole === "consumer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <ShoppingBag className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {t("consumer")}
                </h3>
                <p className="text-muted-foreground">{t("consumerDesc")}</p>
              </div>
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                  selectedRole === "consumer"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {selectedRole === "consumer" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2.5 w-2.5 rounded-full bg-primary-foreground"
                  />
                )}
              </div>
            </div>
          </motion.button>

          {/* Seller Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setSelectedRole("seller")}
            className={cn(
              "w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left",
              "glass hover:border-primary/50",
              selectedRole === "seller"
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-transparent"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                  selectedRole === "seller"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Store className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {t("seller")}
                </h3>
                <p className="text-muted-foreground">{t("sellerDesc")}</p>
              </div>
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                  selectedRole === "seller"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {selectedRole === "seller" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2.5 w-2.5 rounded-full bg-primary-foreground"
                  />
                )}
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-6 pb-10 pt-6">
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          {t("continue")}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="mt-4 text-center text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <button
            onClick={() => setCurrentScreen("signin")}
            className="text-primary font-semibold hover:underline"
          >
            {t("signIn")}
          </button>
        </p>
      </div>
    </div>
  );
}
