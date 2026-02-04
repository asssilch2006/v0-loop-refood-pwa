"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  Utensils,
  Dog,
  Wheat,
  Coffee,
  Cake,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

type ServiceTab = "resto" | "animal" | "bread";
type FoodCategory = "all" | "fastfood" | "coffee" | "sweets";
type BreadState = "all" | "dry" | "crumbed" | "fresh";

// Mock data for demo
const restoItems = [
  {
    id: 1,
    name: "Zesty Burger Meal",
    seller: "Burger Palace",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    originalPrice: 1200,
    loopPrice: 450,
    distance: 0.8,
    rating: 4.8,
    category: "fastfood" as const,
    expiresIn: 2,
  },
  {
    id: 2,
    name: "Premium Coffee Box",
    seller: "Café Aroma",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    originalPrice: 800,
    loopPrice: 300,
    distance: 1.2,
    rating: 4.9,
    category: "coffee" as const,
    expiresIn: 4,
  },
  {
    id: 3,
    name: "Assorted Pastries",
    seller: "La Boulangerie",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    originalPrice: 1500,
    loopPrice: 500,
    distance: 0.5,
    rating: 4.7,
    category: "sweets" as const,
    expiresIn: 3,
  },
  {
    id: 4,
    name: "Pizza Combo",
    seller: "Pizza Mondo",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    originalPrice: 1800,
    loopPrice: 650,
    distance: 1.5,
    rating: 4.6,
    category: "fastfood" as const,
    expiresIn: 1,
  },
  {
    id: 5,
    name: "Chocolate Cake Slice",
    seller: "Sweet Dreams",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    originalPrice: 600,
    loopPrice: 200,
    distance: 2.1,
    rating: 4.9,
    category: "sweets" as const,
    expiresIn: 5,
  },
];

const animalFoodItems = [
  {
    id: 1,
    name: "Beef Scraps Mix",
    seller: "Halal Butcher Shop",
    weight: 2.5,
    pricePerKg: 150,
    distance: 1.3,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Chicken Bones & Trims",
    seller: "Fresh Poultry",
    weight: 3.0,
    pricePerKg: 100,
    distance: 0.9,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Mixed Meat Offcuts",
    seller: "Premium Meats",
    weight: 5.0,
    pricePerKg: 120,
    distance: 2.4,
    rating: 4.3,
  },
];

const breadItems = [
  {
    id: 1,
    name: "Dry Baguettes",
    seller: "Traditional Bakery",
    quantity: "10 pieces",
    price: 100,
    state: "dry" as const,
    distance: 0.6,
  },
  {
    id: 2,
    name: "Crumbed Bread Mix",
    seller: "City Bakery",
    quantity: "2 kg",
    price: 80,
    state: "crumbed" as const,
    distance: 1.1,
  },
  {
    id: 3,
    name: "Fresh Leftover Loaves",
    seller: "La Boulangerie",
    quantity: "5 loaves",
    price: 150,
    state: "fresh" as const,
    distance: 0.5,
  },
  {
    id: 4,
    name: "Sandwich Bread Ends",
    seller: "Modern Bakery",
    quantity: "3 kg",
    price: 60,
    state: "dry" as const,
    distance: 1.8,
  },
];

export function ConsumerHomeScreen() {
  const { t, language } = useLanguage();
  const { user } = useAppState();
  const [activeTab, setActiveTab] = useState<ServiceTab>("resto");
  const [foodCategory, setFoodCategory] = useState<FoodCategory>("all");
  const [breadState, setBreadState] = useState<BreadState>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const services: { id: ServiceTab; icon: typeof Utensils; labelKey: string }[] = [
    { id: "resto", icon: Utensils, labelKey: "resto" },
    { id: "animal", icon: Dog, labelKey: "animalFood" },
    { id: "bread", icon: Wheat, labelKey: "pain" },
  ];

  const foodCategories: { id: FoodCategory; icon: typeof Zap; labelKey: string }[] = [
    { id: "all", icon: Zap, labelKey: "trending" },
    { id: "fastfood", icon: Zap, labelKey: "fastFood" },
    { id: "coffee", icon: Coffee, labelKey: "coffee" },
    { id: "sweets", icon: Cake, labelKey: "sweets" },
  ];

  const breadStates: { id: BreadState; labelKey: string }[] = [
    { id: "all", labelKey: "viewAll" },
    { id: "dry", labelKey: "dryBread" },
    { id: "crumbed", labelKey: "crumbed" },
    { id: "fresh", labelKey: "freshLeftover" },
  ];

  const filteredRestoItems =
    foodCategory === "all"
      ? restoItems
      : restoItems.filter((item) => item.category === foodCategory);

  const filteredBreadItems =
    breadState === "all"
      ? breadItems
      : breadItems.filter((item) => item.state === breadState);

  const discountPercent = (original: number, loop: number) =>
    Math.round(((original - loop) / original) * 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-5 pt-6 pb-4">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <p className="text-muted-foreground text-sm">
              {t("hello")}, {user?.name?.split(" ")[0] || "User"}
            </p>
            <h1 className="text-xl font-bold text-foreground">
              {t("letsSaveFood")}{" "}
              <span className="text-primary inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user?.location || "Algiers"}
              </span>
            </h1>
          </motion.div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t("search")}...`}
              className="h-12 pl-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Service tabs */}
        <div className="flex gap-3 px-5 pb-4 overflow-x-auto scrollbar-hide">
          {services.map(({ id, icon: Icon, labelKey }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all",
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Icon className="h-5 w-5" />
              {t(labelKey)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        {/* Resto Tab */}
        {activeTab === "resto" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide -mx-5 px-5">
              {foodCategories.map(({ id, icon: Icon, labelKey }) => (
                <button
                  key={id}
                  onClick={() => setFoodCategory(id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    foodCategory === id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(labelKey)}
                </button>
              ))}
            </div>

            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {t("nearYou")}
              </h2>
              <button className="flex items-center gap-1 text-sm text-primary font-medium">
                {t("viewAll")}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredRestoItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "group rounded-2xl bg-card overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-all cursor-pointer",
                    index === 0 && "col-span-2"
                  )}
                >
                  <div className={cn("relative", index === 0 ? "h-48" : "h-32")}>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Discount badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                      -{discountPercent(item.originalPrice, item.loopPrice)}%
                    </div>
                    {/* Timer */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-foreground/80 text-background text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      {item.expiresIn}h
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 truncate">
                      {item.seller}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-primary">
                          {item.loopPrice} {t("dzd")}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {item.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.rating}
                        </span>
                        <span>{item.distance} {t("km")}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Animal Food Tab */}
        {activeTab === "animal" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {t("meatScraps")}
              </h2>
              <button className="flex items-center gap-1 text-sm text-primary font-medium">
                {t("viewAll")}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {animalFoodItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
                    <Dog className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-0.5 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.seller}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-primary">
                          {item.pricePerKg} {t("dzd")}{t("perKg")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.weight} {t("kg")} available
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.rating}
                        </span>
                        <span>{item.distance} {t("km")}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bread Tab */}
        {activeTab === "bread" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Bread state filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide -mx-5 px-5">
              {breadStates.map(({ id, labelKey }) => (
                <button
                  key={id}
                  onClick={() => setBreadState(id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    breadState === id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Surplus Bread
              </h2>
              <p className="text-sm text-muted-foreground">
                For farmers & livestock
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredBreadItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 mb-3">
                    <Wheat className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.seller}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        item.state === "fresh"
                          ? "bg-success/10 text-success"
                          : item.state === "dry"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {t(item.state === "fresh" ? "freshLeftover" : item.state === "dry" ? "dryBread" : "crumbed")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.distance} {t("km")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      {item.price} {t("dzd")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.quantity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
