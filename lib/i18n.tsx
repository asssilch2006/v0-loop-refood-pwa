"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Language = "en" | "fr" | "ar";

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Common
  appName: {
    en: "Loop Refood",
    fr: "Loop Refood",
    ar: "لوب ريفود",
  },
  tagline: {
    en: "Save Food, Save Money",
    fr: "Économisez la nourriture, économisez de l'argent",
    ar: "وفّر الطعام، وفّر المال",
  },
  getStarted: {
    en: "Get Started",
    fr: "Commencer",
    ar: "ابدأ الآن",
  },
  continue: {
    en: "Continue",
    fr: "Continuer",
    ar: "متابعة",
  },
  back: {
    en: "Back",
    fr: "Retour",
    ar: "رجوع",
  },
  next: {
    en: "Next",
    fr: "Suivant",
    ar: "التالي",
  },
  save: {
    en: "Save",
    fr: "Enregistrer",
    ar: "حفظ",
  },
  cancel: {
    en: "Cancel",
    fr: "Annuler",
    ar: "إلغاء",
  },
  search: {
    en: "Search",
    fr: "Rechercher",
    ar: "بحث",
  },
  settings: {
    en: "Settings",
    fr: "Paramètres",
    ar: "الإعدادات",
  },

  // Onboarding
  welcomeTitle: {
    en: "Welcome to Loop Refood",
    fr: "Bienvenue sur Loop Refood",
    ar: "مرحباً بك في لوب ريفود",
  },
  welcomeSubtitle: {
    en: "Join the circular food economy",
    fr: "Rejoignez l'économie alimentaire circulaire",
    ar: "انضم إلى الاقتصاد الغذائي الدائري",
  },
  selectRole: {
    en: "I want to",
    fr: "Je veux",
    ar: "أريد أن",
  },
  consumer: {
    en: "Consumer",
    fr: "Consommateur",
    ar: "مستهلك",
  },
  seller: {
    en: "Seller",
    fr: "Vendeur",
    ar: "بائع",
  },
  consumerDesc: {
    en: "Find discounted food near you",
    fr: "Trouvez de la nourriture à prix réduit près de chez vous",
    ar: "اعثر على طعام بأسعار مخفضة بالقرب منك",
  },
  sellerDesc: {
    en: "Sell surplus food & reduce waste",
    fr: "Vendez les surplus alimentaires et réduisez le gaspillage",
    ar: "بع الطعام الفائض وقلل من الهدر",
  },

  // Auth fields
  fullName: {
    en: "Full Name",
    fr: "Nom complet",
    ar: "الاسم الكامل",
  },
  email: {
    en: "Email",
    fr: "E-mail",
    ar: "البريد الإلكتروني",
  },
  password: {
    en: "Password",
    fr: "Mot de passe",
    ar: "كلمة المرور",
  },
  confirmPassword: {
    en: "Confirm Password",
    fr: "Confirmer le mot de passe",
    ar: "تأكيد كلمة المرور",
  },
  dateOfBirth: {
    en: "Date of Birth",
    fr: "Date de naissance",
    ar: "تاريخ الميلاد",
  },
  phoneNumber: {
    en: "Phone Number",
    fr: "Numéro de téléphone",
    ar: "رقم الهاتف",
  },
  uploadId: {
    en: "Upload ID Document",
    fr: "Télécharger une pièce d'identité",
    ar: "رفع وثيقة الهوية",
  },
  businessName: {
    en: "Business Name",
    fr: "Nom de l'entreprise",
    ar: "اسم النشاط التجاري",
  },
  businessType: {
    en: "Business Type",
    fr: "Type d'entreprise",
    ar: "نوع النشاط التجاري",
  },
  restaurant: {
    en: "Restaurant",
    fr: "Restaurant",
    ar: "مطعم",
  },
  butcher: {
    en: "Butcher",
    fr: "Boucherie",
    ar: "جزار",
  },
  bakery: {
    en: "Bakery",
    fr: "Boulangerie",
    ar: "مخبز",
  },
  businessLocation: {
    en: "Business Location",
    fr: "Emplacement de l'entreprise",
    ar: "موقع النشاط التجاري",
  },
  signUp: {
    en: "Sign Up",
    fr: "S'inscrire",
    ar: "إنشاء حساب",
  },
  signIn: {
    en: "Sign In",
    fr: "Se connecter",
    ar: "تسجيل الدخول",
  },
  alreadyHaveAccount: {
    en: "Already have an account?",
    fr: "Vous avez déjà un compte ?",
    ar: "لديك حساب بالفعل؟",
  },
  dontHaveAccount: {
    en: "Don't have an account?",
    fr: "Vous n'avez pas de compte ?",
    ar: "ليس لديك حساب؟",
  },

  // Consumer
  hello: {
    en: "Hello",
    fr: "Bonjour",
    ar: "مرحباً",
  },
  letsSaveFood: {
    en: "let's save food near",
    fr: "économisons la nourriture près de",
    ar: "لنوفر الطعام بالقرب من",
  },
  resto: {
    en: "Resto",
    fr: "Resto",
    ar: "مطاعم",
  },
  animalFood: {
    en: "Animal Food",
    fr: "Nourriture Animale",
    ar: "طعام الحيوانات",
  },
  pain: {
    en: "Bread",
    fr: "Pain",
    ar: "خبز",
  },
  fastFood: {
    en: "Fast Food",
    fr: "Fast Food",
    ar: "وجبات سريعة",
  },
  coffee: {
    en: "Coffee",
    fr: "Café",
    ar: "قهوة",
  },
  sweets: {
    en: "Sweets",
    fr: "Sucreries",
    ar: "حلويات",
  },
  meatScraps: {
    en: "Meat Scraps",
    fr: "Restes de viande",
    ar: "بقايا اللحوم",
  },
  dryBread: {
    en: "Dry",
    fr: "Sec",
    ar: "جاف",
  },
  crumbed: {
    en: "Crumbed",
    fr: "Émietté",
    ar: "مفتت",
  },
  freshLeftover: {
    en: "Fresh Leftover",
    fr: "Restes frais",
    ar: "بقايا طازجة",
  },
  priceSlashed: {
    en: "Price Slashed",
    fr: "Prix réduit",
    ar: "سعر مخفض",
  },
  originalPrice: {
    en: "Original",
    fr: "Original",
    ar: "الأصلي",
  },
  loopPrice: {
    en: "Loop Price",
    fr: "Prix Loop",
    ar: "سعر لوب",
  },
  km: {
    en: "km",
    fr: "km",
    ar: "كم",
  },
  kg: {
    en: "kg",
    fr: "kg",
    ar: "كغ",
  },
  perKg: {
    en: "/kg",
    fr: "/kg",
    ar: "/كغ",
  },
  dzd: {
    en: "DZD",
    fr: "DZD",
    ar: "دج",
  },
  viewAll: {
    en: "View All",
    fr: "Voir tout",
    ar: "عرض الكل",
  },
  nearYou: {
    en: "Near You",
    fr: "Près de vous",
    ar: "بالقرب منك",
  },
  topRated: {
    en: "Top Rated",
    fr: "Mieux notés",
    ar: "الأعلى تقييماً",
  },
  trending: {
    en: "Trending",
    fr: "Tendance",
    ar: "رائج",
  },

  // Seller Dashboard
  dashboard: {
    en: "Dashboard",
    fr: "Tableau de bord",
    ar: "لوحة التحكم",
  },
  postOffer: {
    en: "Post an Offer",
    fr: "Publier une offre",
    ar: "نشر عرض",
  },
  inventory: {
    en: "Inventory",
    fr: "Inventaire",
    ar: "المخزون",
  },
  analytics: {
    en: "Analytics",
    fr: "Analytique",
    ar: "التحليلات",
  },
  lossRecovery: {
    en: "Loss Recovery",
    fr: "Récupération des pertes",
    ar: "استرداد الخسائر",
  },
  moneySaved: {
    en: "Money Saved from Waste",
    fr: "Argent économisé du gaspillage",
    ar: "الأموال المحفوظة من الهدر",
  },
  salesTrends: {
    en: "Sales Trends",
    fr: "Tendances des ventes",
    ar: "اتجاهات المبيعات",
  },
  mostDemanded: {
    en: "Most Demanded Categories",
    fr: "Catégories les plus demandées",
    ar: "الفئات الأكثر طلباً",
  },
  peakHours: {
    en: "Peak Customer Hours",
    fr: "Heures de pointe",
    ar: "ساعات الذروة",
  },
  addItem: {
    en: "Add Item",
    fr: "Ajouter un article",
    ar: "إضافة عنصر",
  },
  itemName: {
    en: "Item Name",
    fr: "Nom de l'article",
    ar: "اسم العنصر",
  },
  quantity: {
    en: "Quantity",
    fr: "Quantité",
    ar: "الكمية",
  },
  expiresIn: {
    en: "Expires in",
    fr: "Expire dans",
    ar: "ينتهي في",
  },
  hours: {
    en: "hours",
    fr: "heures",
    ar: "ساعات",
  },
  active: {
    en: "Active",
    fr: "Actif",
    ar: "نشط",
  },
  sold: {
    en: "Sold",
    fr: "Vendu",
    ar: "مباع",
  },
  expired: {
    en: "Expired",
    fr: "Expiré",
    ar: "منتهي",
  },

  // Settings & Impact
  language: {
    en: "Language",
    fr: "Langue",
    ar: "اللغة",
  },
  notifications: {
    en: "Notifications",
    fr: "Notifications",
    ar: "الإشعارات",
  },
  impactTracker: {
    en: "Impact Tracker",
    fr: "Suivi d'impact",
    ar: "متتبع التأثير",
  },
  co2Saved: {
    en: "CO₂ Saved",
    fr: "CO₂ économisé",
    ar: "ثاني أكسيد الكربون الموفر",
  },
  mealsSaved: {
    en: "Meals Saved",
    fr: "Repas sauvés",
    ar: "الوجبات المحفوظة",
  },
  profile: {
    en: "Profile",
    fr: "Profil",
    ar: "الملف الشخصي",
  },
  logout: {
    en: "Logout",
    fr: "Déconnexion",
    ar: "تسجيل الخروج",
  },

  // Navigation
  home: {
    en: "Home",
    fr: "Accueil",
    ar: "الرئيسية",
  },
  orders: {
    en: "Orders",
    fr: "Commandes",
    ar: "الطلبات",
  },
  favorites: {
    en: "Favorites",
    fr: "Favoris",
    ar: "المفضلة",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (lang === "ar") {
      document.body.classList.add("font-arabic");
    } else {
      document.body.classList.remove("font-arabic");
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[language] || key;
    },
    [language]
  );

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
