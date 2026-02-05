'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'ar';

// Complete translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Core
    home: 'Home',
    marketplace: 'Marketplace',
    myListings: 'My Listings',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    
    // Consumer Home
    browseFood: 'Browse Food',
    nearestOffers: 'Nearest Offers',
    discounts: 'Discounts',
    restaurants: 'Restaurants',
    animalFeed: 'Animal Feed',
    bread: 'Bread',
    other: 'Other',
    
    // Marketplace
    postListing: 'Post Listing',
    placeOrder: 'Place Order',
    getDirections: 'Get Directions',
    selectItem: 'Select Item',
    checkout: 'Checkout',
    
    // Map & Location
    mapView: 'Map View',
    neighborhood: 'Neighborhood',
    algiers: 'Algiers',
    searchNearby: 'Search Nearby',
    
    // Accessibility
    highContrastMode: 'High Contrast Mode',
    voiceGuidance: 'Voice Guidance',
    accessibility: 'Accessibility',
    
    // Notifications
    notifications: 'Notifications',
    newOffers: 'New Offers Nearby',
    orderUpdates: 'Order Updates',
    
    // Sustainability
    sustainabilityInsights: 'Sustainability Insights',
    foodWasteData: 'Food Waste Data',
    communityReviews: 'Community Reviews',
    impactTracker: 'Impact Tracker',
    
    // Impact Stats
    mealsSaved: 'Meals Saved',
    co2Saved: 'CO2 Saved',
    dzd: 'DZD',
    moneyReturned: 'Money Returned',
    
    // Dialog Messages
    confirmOrder: 'Confirm your order',
    total: 'Total',
    confirm: 'Confirm',
    cancel: 'Cancel',
    
    // Language
    language: 'Language',
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
    
    // User Types
    consumer: 'Consumer',
    seller: 'Seller',
    
    // Common Actions
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
  },
  fr: {
    // Navigation & Core
    home: 'Accueil',
    marketplace: 'Marché',
    myListings: 'Mes Annonces',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
    
    // Consumer Home
    browseFood: 'Parcourir les Aliments',
    nearestOffers: 'Offres les Plus Proches',
    discounts: 'Réductions',
    restaurants: 'Restaurants',
    animalFeed: 'Nourriture pour Animaux',
    bread: 'Pain',
    other: 'Autre',
    
    // Marketplace
    postListing: 'Publier une Annonce',
    placeOrder: 'Passer une Commande',
    getDirections: 'Obtenir des Directions',
    selectItem: 'Sélectionner un Article',
    checkout: 'Passer la Commande',
    
    // Map & Location
    mapView: 'Vue Carte',
    neighborhood: 'Quartier',
    algiers: 'Alger',
    searchNearby: 'Rechercher à Proximité',
    
    // Accessibility
    highContrastMode: 'Mode Contraste Élevé',
    voiceGuidance: 'Assistance Vocale',
    accessibility: 'Accessibilité',
    
    // Notifications
    notifications: 'Notifications',
    newOffers: 'Nouvelles Offres à Proximité',
    orderUpdates: 'Mises à Jour des Commandes',
    
    // Sustainability
    sustainabilityInsights: 'Perspectives de Durabilité',
    foodWasteData: 'Données sur le Gaspillage Alimentaire',
    communityReviews: 'Avis de la Communauté',
    impactTracker: 'Suivi de l\'Impact',
    
    // Impact Stats
    mealsSaved: 'Repas Sauvés',
    co2Saved: 'CO2 Économisé',
    dzd: 'DZD',
    moneyReturned: 'Argent Retourné',
    
    // Dialog Messages
    confirmOrder: 'Confirmez votre commande',
    total: 'Total',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    
    // Language
    language: 'Langue',
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
    
    // User Types
    consumer: 'Consommateur',
    seller: 'Vendeur',
    
    // Common Actions
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    close: 'Fermer',
  },
  ar: {
    // Navigation & Core
    home: 'الرئيسية',
    marketplace: 'السوق',
    myListings: 'إعلاناتي',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    
    // Consumer Home
    browseFood: 'تصفح الطعام',
    nearestOffers: 'أقرب العروض',
    discounts: 'خصومات',
    restaurants: 'المطاعم',
    animalFeed: 'غذاء الحيوانات',
    bread: 'خبز',
    other: 'أخرى',
    
    // Marketplace
    postListing: 'نشر قائمة',
    placeOrder: 'ضع أمرًا',
    getDirections: 'احصل على الاتجاهات',
    selectItem: 'اختر عنصرًا',
    checkout: 'الدفع',
    
    // Map & Location
    mapView: 'عرض الخريطة',
    neighborhood: 'الحي',
    algiers: 'الجزائر',
    searchNearby: 'ابحث بالقرب',
    
    // Accessibility
    highContrastMode: 'وضع التباين العالي',
    voiceGuidance: 'الإرشادات الصوتية',
    accessibility: 'إمكانية الوصول',
    
    // Notifications
    notifications: 'إخطارات',
    newOffers: 'عروض جديدة بالقرب',
    orderUpdates: 'تحديثات الطلب',
    
    // Sustainability
    sustainabilityInsights: 'رؤى الاستدامة',
    foodWasteData: 'بيانات تضييع الطعام',
    communityReviews: 'تقييمات المجتمع',
    impactTracker: 'متتبع التأثير',
    
    // Impact Stats
    mealsSaved: 'الوجبات المحفوظة',
    co2Saved: 'ثاني أكسيد الكربون المحفوظ',
    dzd: 'دج',
    moneyReturned: 'المال المرجعي',
    
    // Dialog Messages
    confirmOrder: 'أكد طلبك',
    total: 'الإجمالي',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    
    // Language
    language: 'اللغة',
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
    
    // User Types
    consumer: 'مستهلك',
    seller: 'بائع',
    
    // Common Actions
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    close: 'إغلاق',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved language preference
    const saved = localStorage.getItem('loop-refood-language');
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'ar')) {
      setLanguageState(saved);
      applyLanguageSettings(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('loop-refood-language', lang);
    applyLanguageSettings(lang);
  };

  const applyLanguageSettings = (lang: Language) => {
    const isRTL = lang === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
