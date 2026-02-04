"use client";

import React from "react"

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "./logo";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export function SigninScreen() {
  const { t } = useLanguage();
  const { setCurrentScreen, setUser } = useAppState();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [role, setRole] = useState<"consumer" | "seller">("consumer");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Simulate login
    setUser({
      id: role === "consumer" ? "user-1" : "seller-1",
      name: "Demo User",
      email: formData.email,
      role: role,
      location: "Algiers",
      businessName: role === "seller" ? "Demo Business" : undefined,
      businessType: role === "seller" ? "restaurant" : undefined,
    });
    setCurrentScreen(role === "consumer" ? "consumer-home" : "seller-dashboard");
  };

  const isValid = formData.email && formData.password;

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-4 px-4 pt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentScreen("role-select")}
          className="h-10 w-10 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Logo size="sm" showText={false} />
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-auto px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("welcomeTitle")}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {t("signIn")} to your account
          </p>

          {/* Role Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-8">
            <button
              onClick={() => setRole("consumer")}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                role === "consumer"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {t("consumer")}
            </button>
            <button
              onClick={() => setRole("seller")}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                role === "seller"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {t("seller")}
            </button>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                {t("email")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="h-14 pl-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                {t("password")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="h-14 pl-12 pr-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button className="text-primary text-sm font-medium">
              Forgot password?
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative px-6 pb-10">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          {t("signIn")}
        </Button>

        <p className="mt-4 text-center text-muted-foreground">
          {t("dontHaveAccount")}{" "}
          <button
            onClick={() => setCurrentScreen("role-select")}
            className="text-primary font-semibold hover:underline"
          >
            {t("signUp")}
          </button>
        </p>
      </div>
    </div>
  );
}
