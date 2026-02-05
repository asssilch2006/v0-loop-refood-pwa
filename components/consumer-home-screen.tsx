"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  ChevronLeft,
  X,
  Navigation,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { generateVoiceGuidance } from "@/lib/services/groq-voice";

type ServiceTab = "resto" | "animal" | "bread" | "map";
type FoodCategory = "all" | "fastfood" | "coffee" | "sweets";
type BreadState = "all" | "dry" | "crumbed" | "fresh";

// Realistic Algerian restaurant data
const restoItems = [
  {
    id: 1,
    name: "Mega Zinger Box",
    seller: "Chicken House - Bab El Oued",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    originalPrice: 1400,
    loopPrice: 550,
    distance: 0.6,
    rating: 4.9,
    reviews: 234,
    category: "fastfood" as const,
    expiresIn: 2,
    location: { lat: 36.7866, lng: 3.0597 },
  },
  {
    id: 2,
    name: "Cappuccino & Croissant Set",
    seller: "Café Tantonville - Didouche Mourad",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    originalPrice: 650,
    loopPrice: 250,
    distance: 1.1,
    rating: 4.8,
    reviews: 189,
    category: "coffee" as const,
    expiresIn: 3,
    location: { lat: 36.7753, lng: 3.0588 },
  },
  {
    id: 3,
    name: "Assorted Makrout & Baklawa",
    seller: "Pâtisserie El Yasmine - Hussein Dey",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=300&fit=crop",
    originalPrice: 1200,
    loopPrice: 400,
    distance: 0.4,
    rating: 4.7,
    reviews: 312,
    category: "sweets" as const,
    expiresIn: 4,
    location: { lat: 36.7456, lng: 3.1012 },
  },
  {
    id: 4,
    name: "Chawarma Poulet XL",
    seller: "Istanbul Grill - El Harrach",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
    originalPrice: 950,
    loopPrice: 380,
    distance: 1.8,
    rating: 4.6,
    reviews: 456,
    category: "fastfood" as const,
    expiresIn: 1,
    location: { lat: 36.7234, lng: 3.1345 },
  },
  {
    id: 5,
    name: "Gâteau au Chocolat",
    seller: "La Brioche Dorée - Kouba",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    originalPrice: 800,
    loopPrice: 280,
    distance: 2.3,
    rating: 4.9,
    reviews: 178,
    category: "sweets" as const,
    expiresIn: 5,
    location: { lat: 36.7321, lng: 3.0823 },
  },
  {
    id: 6,
    name: "Pizza Margherita Familiale",
    seller: "Pizza Milano - Bir Mourad Raïs",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    originalPrice: 1600,
    loopPrice: 600,
    distance: 1.5,
    rating: 4.5,
    reviews: 287,
    category: "fastfood" as const,
    expiresIn: 2,
    location: { lat: 36.7489, lng: 3.0456 },
  },
];

// Realistic Animal Food Data with images
const animalFoodItems = [
  {
    id: 1,
    name: "5kg Beef Scraps for Dogs",
    nameAr: "5 كغ بقايا لحم بقري للكلاب",
    seller: "Boucherie El Baraka - Bachdjarah",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop",
    weight: 5.0,
    pricePerKg: 120,
    totalPrice: 600,
    distance: 1.2,
    rating: 4.7,
    reviews: 89,
    description: "Fresh beef bones, trimmings, and offcuts. Ideal for large dogs.",
    location: { lat: 36.7123, lng: 3.0987 },
  },
  {
    id: 2,
    name: "3kg Chicken Parts for Cats",
    nameAr: "3 كغ أجزاء دجاج للقطط",
    seller: "Volailles Sidi Yahia",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop",
    weight: 3.0,
    pricePerKg: 80,
    totalPrice: 240,
    distance: 0.8,
    rating: 4.8,
    reviews: 134,
    description: "Necks, giblets, and small bones. Perfect for feline nutrition.",
    location: { lat: 36.7654, lng: 3.0432 },
  },
  {
    id: 3,
    name: "10kg Mixed Meat Offcuts",
    nameAr: "10 كغ قطع لحوم مختلطة",
    seller: "Boucherie Belcourt - Belouizdad",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop",
    weight: 10.0,
    pricePerKg: 100,
    totalPrice: 1000,
    distance: 2.1,
    rating: 4.5,
    reviews: 67,
    description: "Bulk meat scraps ideal for kennels or multiple pets.",
    location: { lat: 36.7567, lng: 3.0678 },
  },
  {
    id: 4,
    name: "2kg Lamb Bones for Dogs",
    nameAr: "2 كغ عظام خروف للكلاب",
    seller: "Boucherie El Feth - El Biar",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&h=300&fit=crop",
    weight: 2.0,
    pricePerKg: 150,
    totalPrice: 300,
    distance: 3.2,
    rating: 4.9,
    reviews: 45,
    description: "Premium lamb bones, great for dental health.",
    location: { lat: 36.7890, lng: 3.0234 },
  },
];

// Realistic Bread Data
const breadItems = [
  {
    id: 1,
    name: "20 Dry Baguettes",
    nameAr: "20 باغيت جافة",
    seller: "Boulangerie Traditionnelle - Oued Smar",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop",
    quantity: "20 pieces",
    price: 150,
    state: "dry" as const,
    distance: 0.9,
    description: "Perfect for sheep and goat feed. Collected daily.",
    forAnimals: ["Sheep", "Goats", "Cattle"],
  },
  {
    id: 2,
    name: "5kg Bread Crumbs",
    nameAr: "5 كغ فتات الخبز",
    seller: "Boulangerie Moderne - Bir Khadem",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    quantity: "5 kg bag",
    price: 100,
    state: "crumbed" as const,
    distance: 1.4,
    description: "Fine bread crumbs, ideal for poultry feed mix.",
    forAnimals: ["Chickens", "Ducks", "Turkeys"],
  },
  {
    id: 3,
    name: "Fresh Leftover Khobz",
    nameAr: "خبز طازج متبقي",
    seller: "Fournil de Bab Ezzouar",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop",
    quantity: "15 loaves",
    price: 200,
    state: "fresh" as const,
    distance: 0.5,
    description: "Same-day bread, still soft. Can be dried for storage.",
    forAnimals: ["All Livestock"],
  },
  {
    id: 4,
    name: "Kesra & Matlou3 Leftovers",
    nameAr: "بقايا كسرة ومطلوع",
    seller: "Boulangerie El Amir - Rouiba",
    image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=400&h=300&fit=crop",
    quantity: "10 pieces",
    price: 120,
    state: "fresh" as const,
    distance: 2.8,
    description: "Traditional Algerian bread, nutritious for farm animals.",
    forAnimals: ["Sheep", "Goats", "Horses"],
  },
  {
    id: 5,
    name: "Bulk Dry Bread Mix",
    nameAr: "مزيج خبز جاف بالجملة",
    seller: "Boulangerie Staoueli",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&h=300&fit=crop",
    quantity: "25 kg sack",
    price: 300,
    state: "dry" as const,
    distance: 4.5,
    description: "Bulk dried bread, long shelf life. Delivery available.",
    forAnimals: ["Cattle", "Sheep", "Goats"],
  },
];

// Algerian user reviews with 20+ entries
const userReviews = [
  { id: 1, name: "Mohamed Belhadji", location: "Alger Centre", rating: 5, text: "أفضل تطبيق، وفرت الكثير من المال وساعدت في تقليل التبذير!" },
  { id: 2, name: "Amina Khoudi", location: "Bab El Oued", rating: 5, text: "Excellent service! J'ai trouvé des pâtisseries délicieuses à moitié prix." },
  { id: 3, name: "Youcef Medjahed", location: "Hussein Dey", rating: 4, text: "تطبيق رائع، الأسعار ممتازة والجودة عالية" },
  { id: 4, name: "Meriem Saidani", location: "Kouba", rating: 5, text: "Je recommande vivement! Les commerçants sont très gentils." },
  { id: 5, name: "Lamine Haddad", location: "El Harrach", rating: 5, text: "ممتاز للمزارعين، أجد طعام حيواناتي بأسعار معقولة" },
  { id: 6, name: "Chahinez Amira", location: "Bir Mourad Raïs", rating: 4, text: "Super application pour économiser et aider l'environnement!" },
  { id: 7, name: "Karim Djamel", location: "Bachdjarah", rating: 5, text: "الخبز الجاف ممتاز لمواشي، شكراً لوب ريفود" },
  { id: 8, name: "Fatima Zahra", location: "Belouizdad", rating: 5, text: "Application très pratique, livraison rapide!" },
  { id: 9, name: "Amine Rachid", location: "El Biar", rating: 4, text: "جيد جداً، أنصح الجميع بتجربته" },
  { id: 10, name: "Sarah Louiza", location: "Sidi Yahia", rating: 5, text: "Les prix sont imbattables! J'utilise l'app tous les jours." },
  { id: 11, name: "Wassim Tahar", location: "Oued Smar", rating: 5, text: "شكراً على هذا التطبيق الرائع، وفرت كثيراً" },
  { id: 12, name: "Nadia Benouar", location: "Bir Khadem", rating: 4, text: "Très bon concept, je soutiens à 100%!" },
  { id: 13, name: "Hamza Farah", location: "Bab Ezzouar", rating: 5, text: "أفضل تطبيق للاقتصاد الدائري في الجزائر" },
  { id: 14, name: "Lynda Messaoui", location: "Rouiba", rating: 5, text: "Génial pour trouver de la nourriture pas chère!" },
  { id: 15, name: "Omar Ghouat", location: "Staoueli", rating: 4, text: "تطبيق مفيد جداً، أتمنى المزيد من المتاجر" },
  { id: 16, name: "Rania Kaid", location: "Dely Ibrahim", rating: 5, text: "Je fais des économies incroyables chaque semaine!" },
  { id: 17, name: "Bilal Sahraoui", location: "Cheraga", rating: 5, text: "ممتاز، سهل الاستخدام وموثوق" },
  { id: 18, name: "Yasmine Hamdi", location: "Draria", rating: 4, text: "Bonne initiative pour réduire le gaspillage alimentaire." },
  { id: 19, name: "Nordine Boudjemaï", location: "Algiers", rating: 5, text: "تطبيق يغير حياتي، أنصح به بقوة" },
  { id: 20, name: "Leila Bouhidel", location: "Algiers", rating: 5, text: "Service impeccable, communauté très accueillante!" },
  { id: 21, name: "Hassan Cherif", location: "Algiers", rating: 4, text: "من أفضل التطبيقات الجزائرية، برافو!" },
  { id: 22, name: "Soumia Djadjaoui", location: "Algiers", rating: 5, text: "C'est révolutionnaire pour ma famille!" },
];

// Map pins data
const mapPins = [
  { id: 1, type: "resto", name: "Chicken House", lat: 36.7866, lng: 3.0597 },
  { id: 2, type: "resto", name: "Café Tantonville", lat: 36.7753, lng: 3.0588 },
  { id: 3, type: "resto", name: "Pâtisserie El Yasmine", lat: 36.7456, lng: 3.1012 },
  { id: 4, type: "butcher", name: "Boucherie El Baraka", lat: 36.7123, lng: 3.0987 },
  { id: 5, type: "butcher", name: "Volailles Sidi Yahia", lat: 36.7654, lng: 3.0432 },
  { id: 6, type: "bakery", name: "Boulangerie Traditionnelle", lat: 36.7234, lng: 3.0765 },
  { id: 7, type: "bakery", name: "Fournil de Bab Ezzouar", lat: 36.7345, lng: 3.0876 },
];

export function ConsumerHomeScreen() {
  const { t, language } = useLanguage();
  const { user, setSidebarOpen, speak, accessibilityMode } = useAppState();
  const [activeTab, setActiveTab] = useState<ServiceTab>("resto");
  const [foodCategory, setFoodCategory] = useState<FoodCategory>("all");
  const [breadState, setBreadState] = useState<BreadState>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof restoItems[0] | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  const services: { id: ServiceTab; icon: typeof Utensils; labelKey: string }[] = [
    { id: "resto", icon: Utensils, labelKey: "resto" },
    { id: "animal", icon: Dog, labelKey: "animalFood" },
    { id: "bread", icon: Wheat, labelKey: "pain" },
    { id: "map", icon: MapPin, labelKey: "nearYou" },
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

  const handleTabChange = (id: ServiceTab) => {
    setActiveTab(id);
    if (accessibilityMode) {
      const tab = services.find(s => s.id === id);
      if (tab) {
        const tabName = t(tab.labelKey);
        speak(`Switched to ${tabName} tab`);
        // Generate AI-enhanced guidance for accessibility
        generateVoiceGuidance(`User is now viewing the ${tabName} section`).catch(err => 
          console.error('[v0] Voice guidance error:', err)
        );
      }
    }
  };

  // Announce active section when component mounts or accessibility mode changes
  useEffect(() => {
    if (accessibilityMode) {
      const announcement = `Welcome to Loop Refood. You are on the ${t(
        services.find(s => s.id === activeTab)?.labelKey || 'home'
      )} section with ${
        activeTab === 'resto' ? filteredRestoItems.length :
        activeTab === 'animal' ? animalFoodItems.length :
        activeTab === 'bread' ? filteredBreadItems.length :
        'multiple'
      } items available`;
      speak(announcement);
    }
  }, [accessibilityMode]);

  return (
    <div className="min-h-screen bg-background pb-24 safe-top">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          {/* Top row with menu and greeting */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
            {accessibilityMode && (
              <button
                onClick={() => {
                  const text = `You are viewing ${user?.location || 'Algiers'} with ${filteredRestoItems.length} food offers, ${animalFoodItems.length} animal food items, and ${breadItems.length} bread items available.`;
                  speak(text);
                }}
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                aria-label="Read current screen"
              >
                <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </button>
            )}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <p className="text-muted-foreground text-sm">
                {t("hello")}, {user?.name?.split(" ")[0] || "User"}
              </p>
              <h1 className="text-base font-bold text-foreground flex items-center gap-1 flex-wrap">
                <span className="truncate">{t("letsSaveFood")}</span>
                <span className="text-primary inline-flex items-center gap-0.5 whitespace-nowrap">
                  <MapPin className="h-3.5 w-3.5" />
                  {user?.location || "Alger"}
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t("search")}...`}
              className="h-10 pl-10 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Service tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {services.map(({ id, icon: Icon, labelKey }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange(id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all text-sm",
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(labelKey)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Resto Tab */}
        {activeTab === "resto" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
              {foodCategories.map(({ id, icon: Icon, labelKey }) => (
                <button
                  key={id}
                  onClick={() => setFoodCategory(id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                    foodCategory === id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {t(labelKey)}
                </button>
              ))}
            </div>

            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">
                {t("nearYou")}
              </h2>
              <button 
                onClick={() => setShowReviews(true)}
                className="flex items-center gap-1 text-xs text-primary font-medium"
              >
                {userReviews.length} reviews
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredRestoItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    "group rounded-2xl bg-card overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-all cursor-pointer",
                    index === 0 && "col-span-2"
                  )}
                >
                  <div className={cn("relative", index === 0 ? "h-40" : "h-28")}>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Discount badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                      -{discountPercent(item.originalPrice, item.loopPrice)}%
                    </div>
                    {/* Timer */}
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-foreground/80 text-background text-[10px] font-medium">
                      <Clock className="h-2.5 w-2.5" />
                      {item.expiresIn}h
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-semibold text-foreground text-xs mb-0.5 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-1.5 truncate">
                      {item.seller}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-primary">
                          {item.loopPrice} {t("dzd")}
                        </span>
                        <span className="text-[10px] text-muted-foreground line-through">
                          {item.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">
                {t("meatScraps")}
              </h2>
              <span className="text-xs text-muted-foreground">
                {animalFoodItems.length} items
              </span>
            </div>

            <div className="space-y-3">
              {animalFoodItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5 truncate">
                      {language === "ar" ? item.nameAr : item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {item.seller}
                    </p>
                    <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-primary">
                          {item.totalPrice} {t("dzd")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({item.pricePerKg}{t("perKg")})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
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
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
              {breadStates.map(({ id, labelKey }) => (
                <button
                  key={id}
                  onClick={() => setBreadState(id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                    breadState === id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">
                Surplus Bread
              </h2>
              <p className="text-xs text-muted-foreground">
                For farmers & livestock
              </p>
            </div>

            <div className="space-y-3">
              {filteredBreadItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {language === "ar" ? item.nameAr : item.name}
                      </h3>
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap",
                          item.state === "fresh"
                            ? "bg-success/10 text-success"
                            : item.state === "dry"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {t(item.state === "fresh" ? "freshLeftover" : item.state === "dry" ? "dryBread" : "crumbed")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {item.seller}
                    </p>
                    <p className="text-[10px] text-muted-foreground mb-1.5 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-primary">
                          {item.price} {t("dzd")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.quantity}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {item.distance} {t("km")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Map Tab */}
        {activeTab === "map" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Interactive Map - Algiers [36.75, 3.05] */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-muted border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
              {/* Map background - Algiers coordinates */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-50 dark:from-blue-950 dark:to-emerald-900" />
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Map View - Algiers [36.75, 3.05]</p>
              </div>
              
              {/* Map pins */}
              {mapPins.map((pin, i) => (
                <motion.div
                  key={pin.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "absolute flex items-center justify-center h-8 w-8 rounded-full shadow-lg cursor-pointer",
                    pin.type === "resto" && "bg-primary",
                    pin.type === "butcher" && "bg-accent",
                    pin.type === "bakery" && "bg-amber-500"
                  )}
                  style={{
                    left: `${20 + (i * 12)}%`,
                    top: `${25 + (i % 3) * 20}%`,
                  }}
                >
                  {pin.type === "resto" && <Utensils className="h-4 w-4 text-white" />}
                  {pin.type === "butcher" && <Dog className="h-4 w-4 text-white" />}
                  {pin.type === "bakery" && <Wheat className="h-4 w-4 text-white" />}
                </motion.div>
              ))}

              {/* User location */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                  <div className="absolute inset-0 h-4 w-4 rounded-full bg-blue-500 animate-ping opacity-50" />
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-[10px]">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Restaurants</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-[10px]">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>Butchers</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-[10px]">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Bakeries</span>
                </div>
              </div>
            </div>

            {/* Nearby list */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Nearby Offers ({restoItems.length + animalFoodItems.length + breadItems.length})
              </h3>
              <div className="space-y-2">
                {[...restoItems.slice(0, 2), ...animalFoodItems.slice(0, 1), ...breadItems.slice(0, 1)].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/50">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      i < 2 ? "bg-primary/10" : i === 2 ? "bg-accent/10" : "bg-amber-100"
                    )}>
                      {i < 2 && <Utensils className="h-4 w-4 text-primary" />}
                      {i === 2 && <Dog className="h-4 w-4 text-accent" />}
                      {i === 3 && <Wheat className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {"name" in item ? item.name : ""}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {"distance" in item ? `${item.distance} km away` : ""}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Navigation className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end bg-foreground/50 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[80vh] overflow-auto rounded-t-3xl bg-card safe-bottom"
            >
              <div className="relative h-48">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-card/80 backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  -{discountPercent(selectedItem.originalPrice, selectedItem.loopPrice)}% OFF
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {selectedItem.name}
                </h2>
                <p className="text-muted-foreground mb-4">{selectedItem.seller}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {selectedItem.loopPrice} {t("dzd")}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {selectedItem.originalPrice} {t("dzd")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {selectedItem.rating} ({selectedItem.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedItem.distance} {t("km")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedItem.expiresIn}h left
                  </span>
                </div>

                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-base font-semibold">
                  Reserve Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Modal */}
      <AnimatePresence>
        {showReviews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end bg-foreground/50 backdrop-blur-sm"
            onClick={() => setShowReviews(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[90vh] overflow-auto rounded-t-3xl bg-card safe-bottom"
            >
              <div className="sticky top-0 bg-card border-b border-border/50 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Community Reviews
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {userReviews.length} reviews from Algerian users
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviews(false)}
                    className="p-2 rounded-full hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Overall Rating Summary */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-primary/5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {(userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length).toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">Overall Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {userReviews.filter(r => r.rating >= 4).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Positive</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {userReviews.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {userReviews.sort((a, b) => b.rating - a.rating).map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
