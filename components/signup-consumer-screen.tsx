"use client";

import React from "react"

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Upload,
  User,
  Mail,
  Lock,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "./logo";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function SignupConsumerScreen() {
  const { t } = useLanguage();
  const { setCurrentScreen, setUser } = useAppState();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    location: "Algiers",
    idDocument: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, idDocument: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    // Simulate signup - in real app, this would call an API
    setUser({
      id: "user-1",
      name: formData.fullName,
      email: formData.email,
      role: "consumer",
      location: formData.location,
    });
    setCurrentScreen("consumer-home");
  };

  const isStep1Valid =
    formData.fullName && formData.email && formData.password && formData.confirmPassword;
  const isStep2Valid = formData.dateOfBirth;

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            step === 1 ? setCurrentScreen("role-select") : setStep(step - 1)
          }
          className="h-10 w-10 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Logo size="sm" showText={false} />
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4">
        <div className="flex gap-2">
          <div className={cn("h-1 flex-1 rounded-full", "bg-primary")} />
          <div
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              step >= 2 ? "bg-primary" : "bg-muted"
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pt-8 pb-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("signUp")} - {t("consumer")}
              </h1>
              <p className="text-muted-foreground mb-8">
                {t("consumerDesc")}
              </p>

              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">
                    {t("fullName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ahmed Ben Ali"
                      className="h-14 pl-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary"
                    />
                  </div>
                </div>

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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    {t("confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="h-14 pl-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verification
              </h1>
              <p className="text-muted-foreground mb-8">
                Complete your profile for a better experience
              </p>

              <div className="space-y-5">
                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-foreground">
                    {t("dateOfBirth")}
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="h-14 pl-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Algiers"
                      className="h-14 pl-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* ID Document Upload */}
                <div className="space-y-2">
                  <Label className="text-foreground">{t("uploadId")}</Label>
                  <label
                    htmlFor="idDocument"
                    className={cn(
                      "flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
                      formData.idDocument
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <Upload
                      className={cn(
                        "h-8 w-8 mb-2",
                        formData.idDocument
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        formData.idDocument
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {formData.idDocument
                        ? formData.idDocument.name
                        : "Click to upload ID document"}
                    </span>
                    <input
                      id="idDocument"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    National ID, Passport, or Driver's License (Optional)
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-10">
        {step === 1 ? (
          <Button
            onClick={() => setStep(2)}
            disabled={!isStep1Valid}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {t("next")}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isStep2Valid}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {t("signUp")}
          </Button>
        )}
      </div>
    </div>
  );
}
