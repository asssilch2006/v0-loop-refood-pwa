"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Plus,
  TrendingUp,
  Clock,
  Package,
  DollarSign,
  Leaf,
  ChevronRight,
  Camera,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

// Chart colors - computed in JS, not CSS variables
const CHART_COLORS = {
  primary: "#0d9668",
  accent: "#f97316",
  teal: "#14b8a6",
  muted: "#94a3b8",
};

// Mock data
const salesTrendData = [
  { day: "Mon", sales: 12000 },
  { day: "Tue", sales: 18000 },
  { day: "Wed", sales: 15000 },
  { day: "Thu", sales: 22000 },
  { day: "Fri", sales: 28000 },
  { day: "Sat", sales: 32000 },
  { day: "Sun", sales: 25000 },
];

const categoryData = [
  { name: "Fast Food", value: 45, color: CHART_COLORS.primary },
  { name: "Pastries", value: 30, color: CHART_COLORS.accent },
  { name: "Beverages", value: 15, color: CHART_COLORS.teal },
  { name: "Other", value: 10, color: CHART_COLORS.muted },
];

const peakHoursData = [
  { hour: "8AM", customers: 15 },
  { hour: "10AM", customers: 25 },
  { hour: "12PM", customers: 45 },
  { hour: "2PM", customers: 35 },
  { hour: "4PM", customers: 30 },
  { hour: "6PM", customers: 55 },
  { hour: "8PM", customers: 40 },
];

const inventoryItems = [
  {
    id: 1,
    name: "Chicken Shawarma Box",
    quantity: 8,
    originalPrice: 1200,
    loopPrice: 500,
    expiresIn: 3,
    status: "active" as const,
  },
  {
    id: 2,
    name: "Mixed Grill Plate",
    quantity: 4,
    originalPrice: 2500,
    loopPrice: 900,
    expiresIn: 2,
    status: "active" as const,
  },
  {
    id: 3,
    name: "Beef Burger Combo",
    quantity: 0,
    originalPrice: 1000,
    loopPrice: 400,
    expiresIn: 0,
    status: "sold" as const,
  },
  {
    id: 4,
    name: "Falafel Wrap",
    quantity: 3,
    originalPrice: 600,
    loopPrice: 250,
    expiresIn: 1,
    status: "active" as const,
  },
];

export function SellerDashboardScreen() {
  const { t } = useLanguage();
  const { user } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "analytics">(
    "overview"
  );

  const stats = {
    totalRecovered: 45600,
    mealsSaved: 127,
    co2Saved: 85.5,
    activeListings: inventoryItems.filter((i) => i.status === "active").length,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-5 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-muted-foreground text-sm">
              {t("hello")}, {user?.name?.split(" ")[0] || "Seller"}
            </p>
            <h1 className="text-xl font-bold text-foreground">
              {user?.businessName || "Your Business"}
            </h1>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pb-4">
          {(["overview", "inventory", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab === "overview"
                ? t("dashboard")
                : tab === "inventory"
                  ? t("inventory")
                  : t("analytics")}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Loss Recovery Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-2 p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("lossRecovery")}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalRecovered.toLocaleString()} {t("dzd")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-primary font-medium">
                  {t("moneySaved")}
                </p>
              </motion.div>

              {/* Stats cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-2xl bg-card border border-border/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 mb-3">
                  <Package className="h-5 w-5 text-accent" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.mealsSaved}
                </p>
                <p className="text-sm text-muted-foreground">{t("mealsSaved")}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-2xl bg-card border border-border/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 mb-3">
                  <Leaf className="h-5 w-5 text-success" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.co2Saved} kg
                </p>
                <p className="text-sm text-muted-foreground">{t("co2Saved")}</p>
              </motion.div>
            </div>

            {/* Quick actions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Quick Actions
                </h2>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-lg font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t("postOffer")}
              </Button>
            </div>

            {/* Active listings preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {t("active")} Listings
                </h2>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="flex items-center gap-1 text-sm text-primary font-medium"
                >
                  {t("viewAll")}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {inventoryItems
                  .filter((item) => item.status === "active")
                  .slice(0, 2)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} left
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {item.loopPrice} {t("dzd")}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.expiresIn}h
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t("addItem")}
            </Button>

            {inventoryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-2xl bg-card border transition-all",
                  item.status === "sold"
                    ? "border-success/30 opacity-60"
                    : item.expiresIn <= 1
                      ? "border-accent/50"
                      : "border-border/50"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground line-through">
                        {item.originalPrice} {t("dzd")}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {item.loopPrice} {t("dzd")}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      item.status === "sold"
                        ? "bg-success/10 text-success"
                        : item.status === "active"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {t(item.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("quantity")}: {item.quantity}
                  </span>
                  {item.status === "active" && (
                    <span
                      className={cn(
                        "flex items-center gap-1",
                        item.expiresIn <= 1
                          ? "text-accent font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      <Clock className="h-4 w-4" />
                      {t("expiresIn")} {item.expiresIn} {t("hours")}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Sales Trend */}
            <div className="p-5 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  {t("salesTrends")}
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="p-5 rounded-2xl bg-card border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">
                {t("mostDemanded")}
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {categoryData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Peak Hours */}
            <div className="p-5 rounded-2xl bg-card border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">
                {t("peakHours")}
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="customers"
                      fill={CHART_COLORS.teal}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                AI Insight: Your peak hour is 6PM. Consider listing more items around
                5PM.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end bg-foreground/50 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[85vh] overflow-auto rounded-t-3xl bg-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {t("postOffer")}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Photo upload */}
              <div className="flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed border-muted hover:border-primary/50 transition-colors cursor-pointer">
                <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add photos</span>
              </div>

              {/* Item name */}
              <div className="space-y-2">
                <Label className="text-foreground">{t("itemName")}</Label>
                <Input
                  placeholder="e.g., Chicken Shawarma Box"
                  className="h-12 rounded-xl bg-muted/50 border-0"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("originalPrice")}</Label>
                  <Input
                    type="number"
                    placeholder="1200"
                    className="h-12 rounded-xl bg-muted/50 border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">{t("loopPrice")}</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    className="h-12 rounded-xl bg-muted/50 border-0"
                  />
                </div>
              </div>

              {/* Quantity and expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("quantity")}</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    className="h-12 rounded-xl bg-muted/50 border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">
                    {t("expiresIn")} ({t("hours")})
                  </Label>
                  <Input
                    type="number"
                    placeholder="4"
                    className="h-12 rounded-xl bg-muted/50 border-0"
                  />
                </div>
              </div>

              <Button
                onClick={() => setShowAddModal(false)}
                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-lg font-semibold"
              >
                {t("postOffer")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
