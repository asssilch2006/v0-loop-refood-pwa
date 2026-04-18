"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Check,
  ChevronLeft,
  ImagePlus,
  Tag,
  Timer,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea";
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
  { day: "Sat", sales: 28000 },
  { day: "Sun", sales: 32000 },
  { day: "Mon", sales: 18000 },
  { day: "Tue", sales: 22000 },
  { day: "Wed", sales: 19000 },
  { day: "Thu", sales: 35000 },
  { day: "Fri", sales: 42000 },
];

const categoryData = [
  { name: "Chawarma", value: 38, color: CHART_COLORS.primary },
  { name: "Pastries", value: 28, color: CHART_COLORS.accent },
  { name: "Pizzas", value: 20, color: CHART_COLORS.teal },
  { name: "Beverages", value: 14, color: CHART_COLORS.muted },
];

const peakHoursData = [
  { hour: "10h", customers: 18 },
  { hour: "12h", customers: 52 },
  { hour: "14h", customers: 38 },
  { hour: "16h", customers: 25 },
  { hour: "18h", customers: 48 },
  { hour: "20h", customers: 65 },
  { hour: "22h", customers: 35 },
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
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Mixed Grill Plate",
    quantity: 4,
    originalPrice: 2500,
    loopPrice: 900,
    expiresIn: 2,
    status: "active" as const,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Beef Burger Combo",
    quantity: 0,
    originalPrice: 1000,
    loopPrice: 400,
    expiresIn: 0,
    status: "sold" as const,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Falafel Wrap",
    quantity: 3,
    originalPrice: 600,
    loopPrice: 250,
    expiresIn: 1,
    status: "active" as const,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Assorted Pastries Box",
    quantity: 6,
    originalPrice: 1500,
    loopPrice: 550,
    expiresIn: 4,
    status: "active" as const,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop",
  },
];

type OfferStep = 1 | 2 | 3 | 4;

interface NewOffer {
  name: string;
  description: string;
  category: string;
  originalPrice: string;
  loopPrice: string;
  quantity: string;
  expiresIn: string;
  photo: string | null;
}

export function SellerDashboardScreen() {
  const { t } = useLanguage();
  const { user, setSidebarOpen, speak, accessibilityMode } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "analytics">(
    "overview"
  );
  const [offerStep, setOfferStep] = useState<OfferStep>(1);
  const [newOffer, setNewOffer] = useState<NewOffer>({
    name: "",
    description: "",
    category: "",
    originalPrice: "",
    loopPrice: "",
    quantity: "",
    expiresIn: "",
    photo: null,
  });

  const stats = {
    totalRecovered: 156800,
    mealsSaved: 342,
    co2Saved: 215.5,
    activeListings: inventoryItems.filter((i) => i.status === "active").length,
    weeklyGrowth: 23,
  };

  const categories = [
    { id: "fastfood", label: "Fast Food", icon: "🍔" },
    { id: "pastries", label: "Pastries", icon: "🥐" },
    { id: "beverages", label: "Beverages", icon: "☕" },
    { id: "meals", label: "Full Meals", icon: "🍽️" },
  ];

  const resetOffer = () => {
    setOfferStep(1);
    setNewOffer({
      name: "",
      description: "",
      category: "",
      originalPrice: "",
      loopPrice: "",
      quantity: "",
      expiresIn: "",
      photo: null,
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetOffer();
  };

  const handleNextStep = () => {
    if (offerStep < 4) {
      setOfferStep((prev) => (prev + 1) as OfferStep);
      if (accessibilityMode) speak(`Step ${offerStep + 1}`);
    }
  };

  const handlePrevStep = () => {
    if (offerStep > 1) {
      setOfferStep((prev) => (prev - 1) as OfferStep);
    }
  };

  const handleSubmitOffer = () => {
    // In a real app, this would submit to the backend
    if (accessibilityMode) speak("Offer posted successfully");
    handleCloseModal();
  };

  const discount = newOffer.originalPrice && newOffer.loopPrice
    ? Math.round(((Number(newOffer.originalPrice) - Number(newOffer.loopPrice)) / Number(newOffer.originalPrice)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <p className="text-muted-foreground text-sm">
                {t("hello")}, {user?.name?.split(" ")[0] || "Seller"}
              </p>
              <h1 className="text-base font-bold text-foreground truncate">
                {user?.businessName || "Your Business"}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pb-3">
          {(["overview", "inventory", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (accessibilityMode) speak(tab);
              }}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
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
      <div className="px-4 py-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Loss Recovery Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-2 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {t("lossRecovery")}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {stats.totalRecovered.toLocaleString()} {t("dzd")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
                      <TrendingUp className="h-3 w-3" />
                      +{stats.weeklyGrowth}%
                    </span>
                    <p className="text-[10px] text-muted-foreground">this week</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 rounded-2xl bg-card border border-border/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 mb-2">
                  <Package className="h-4 w-4 text-accent" />
                </div>
                <p className="text-xl font-bold text-foreground">
                  {stats.mealsSaved}
                </p>
                <p className="text-xs text-muted-foreground">{t("mealsSaved")}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-3 rounded-2xl bg-card border border-border/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 mb-2">
                  <Leaf className="h-4 w-4 text-success" />
                </div>
                <p className="text-xl font-bold text-foreground">
                  {stats.co2Saved} kg
                </p>
                <p className="text-xs text-muted-foreground">{t("co2Saved")}</p>
              </motion.div>
            </div>

            {/* Quick actions */}
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-base font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t("postOffer")}
            </Button>

            {/* Active listings preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">
                  {t("active")} Listings
                </h2>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="flex items-center gap-1 text-xs text-primary font-medium"
                >
                  {t("viewAll")}
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {inventoryItems
                  .filter((item) => item.status === "active")
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50"
                    >
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} left
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary text-sm">
                          {item.loopPrice} {t("dzd")}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          {item.expiresIn}h
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Mini chart */}
            <div className="p-4 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">
                    Weekly Sales
                  </h3>
                </div>
                <span className="text-xs text-success font-medium">+{stats.weeklyGrowth}%</span>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData}>
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t("addItem")}
            </Button>

            {inventoryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex gap-3 p-3 rounded-2xl bg-card border transition-all",
                  item.status === "sold"
                    ? "border-success/30 opacity-60"
                    : item.expiresIn <= 1
                      ? "border-accent/50"
                      : "border-border/50"
                )}
              >
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {item.name}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap",
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground line-through">
                      {item.originalPrice} {t("dzd")}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {item.loopPrice} {t("dzd")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
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
                        <Clock className="h-3 w-3" />
                        {item.expiresIn}h left
                      </span>
                    )}
                  </div>
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
            className="space-y-4"
          >
            {/* Sales Trend */}
            <div className="p-4 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">
                  {t("salesTrends")}
                </h3>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" width={35} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="p-4 rounded-2xl bg-card border border-border/50">
              <h3 className="font-semibold text-foreground text-sm mb-3">
                {t("mostDemanded")}
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-28 w-28 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
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
                <div className="flex-1 space-y-1.5">
                  {categoryData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-foreground">{item.name}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Peak Hours */}
            <div className="p-4 rounded-2xl bg-card border border-border/50">
              <h3 className="font-semibold text-foreground text-sm mb-3">
                {t("peakHours")}
              </h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" width={25} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
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
              <div className="mt-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground">
                    <span className="font-medium">AI Insight:</span> Your peak is at 20h with 65 customers. List items by 19h for maximum visibility.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Multi-step Add Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end bg-foreground/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[90vh] overflow-auto rounded-t-3xl bg-card safe-bottom"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card border-b border-border/50 p-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {offerStep > 1 && (
                      <button
                        onClick={handlePrevStep}
                        className="p-1.5 rounded-full hover:bg-muted"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}
                    <h2 className="text-lg font-bold text-foreground">
                      {t("postOffer")}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-full hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress steps */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex-1 flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                          offerStep >= step
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {offerStep > step ? <Check className="h-3 w-3" /> : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 rounded-full transition-colors",
                            offerStep > step ? "bg-primary" : "bg-muted"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5">
                {/* Step 1: Photo & Name */}
                {offerStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-4">
                      <ImagePlus className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="font-semibold text-foreground">Add Photo & Details</h3>
                      <p className="text-sm text-muted-foreground">Start with a great photo</p>
                    </div>

                    {/* Photo upload */}
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed transition-colors cursor-pointer",
                        newOffer.photo
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      {newOffer.photo ? (
                        <div className="relative w-full h-full">
                          <img
                            src={newOffer.photo || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <button
                            onClick={() => setNewOffer({ ...newOffer, photo: null })}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-foreground/80 text-background"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Tap to add photo</span>
                        </>
                      )}
                    </div>

                    {/* Item name */}
                    <div className="space-y-2">
                      <Label className="text-foreground">{t("itemName")}</Label>
                      <Input
                        value={newOffer.name}
                        onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                        placeholder="e.g., Chicken Shawarma Box"
                        className="h-12 rounded-xl bg-muted/50 border-0"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-foreground">Description</Label>
                      <Textarea
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                        placeholder="Describe what's included..."
                        className="min-h-[80px] rounded-xl bg-muted/50 border-0 resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleNextStep}
                      disabled={!newOffer.name}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                    >
                      Continue
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Category */}
                {offerStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-4">
                      <Tag className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="font-semibold text-foreground">Select Category</h3>
                      <p className="text-sm text-muted-foreground">Help customers find your item</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setNewOffer({ ...newOffer, category: cat.id })}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all text-left",
                            newOffer.category === cat.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-2xl mb-2 block">{cat.icon}</span>
                          <span className="font-medium text-foreground">{cat.label}</span>
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={handleNextStep}
                      disabled={!newOffer.category}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                    >
                      Continue
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 3: Pricing */}
                {offerStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-4">
                      <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="font-semibold text-foreground">Set Your Price</h3>
                      <p className="text-sm text-muted-foreground">Competitive pricing attracts more customers</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">{t("originalPrice")} ({t("dzd")})</Label>
                        <Input
                          type="number"
                          value={newOffer.originalPrice}
                          onChange={(e) => setNewOffer({ ...newOffer, originalPrice: e.target.value })}
                          placeholder="1200"
                          className="h-12 rounded-xl bg-muted/50 border-0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">{t("loopPrice")} ({t("dzd")})</Label>
                        <Input
                          type="number"
                          value={newOffer.loopPrice}
                          onChange={(e) => setNewOffer({ ...newOffer, loopPrice: e.target.value })}
                          placeholder="500"
                          className="h-12 rounded-xl bg-muted/50 border-0"
                        />
                      </div>
                    </div>

                    {discount > 0 && (
                      <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                        <p className="text-sm text-foreground">
                          Discount: <span className="font-bold text-accent">{discount}% OFF</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Customers save {Number(newOffer.originalPrice) - Number(newOffer.loopPrice)} {t("dzd")}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleNextStep}
                      disabled={!newOffer.originalPrice || !newOffer.loopPrice}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                    >
                      Continue
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 4: Quantity & Timer */}
                {offerStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-4">
                      <Timer className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="font-semibold text-foreground">Final Details</h3>
                      <p className="text-sm text-muted-foreground">Set quantity and expiry time</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">{t("quantity")}</Label>
                        <Input
                          type="number"
                          value={newOffer.quantity}
                          onChange={(e) => setNewOffer({ ...newOffer, quantity: e.target.value })}
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
                          value={newOffer.expiresIn}
                          onChange={(e) => setNewOffer({ ...newOffer, expiresIn: e.target.value })}
                          placeholder="4"
                          className="h-12 rounded-xl bg-muted/50 border-0"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Preview</p>
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
                          {newOffer.photo ? (
                            <img src={newOffer.photo || "/placeholder.svg"} alt="" className="h-full w-full object-cover rounded-xl" />
                          ) : (
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">{newOffer.name || "Item Name"}</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm font-bold text-primary">{newOffer.loopPrice || "0"} {t("dzd")}</span>
                            <span className="text-xs text-muted-foreground line-through">{newOffer.originalPrice || "0"}</span>
                            {discount > 0 && (
                              <span className="text-xs font-medium text-accent">-{discount}%</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>Qty: {newOffer.quantity || "0"}</span>
                            <span>Expires: {newOffer.expiresIn || "0"}h</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmitOffer}
                      disabled={!newOffer.quantity || !newOffer.expiresIn}
                      className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-lg font-semibold"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      {t("postOffer")}
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
