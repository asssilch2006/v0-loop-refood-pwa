"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Leaf, Utensils, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

const slides = [
  {
    icon: Leaf,
    titleKey: "slide1Title",
    descKey: "slide1Desc",
    title: {
      en: "Reduce Food Waste",
      fr: "Réduisez le gaspillage",
      ar: "قلل هدر الطعام",
    },
    desc: {
      en: "Every year, tons of food go to waste. Be part of the solution.",
      fr: "Chaque année, des tonnes de nourriture sont gaspillées. Faites partie de la solution.",
      ar: "كل عام، تُهدر أطنان من الطعام. كن جزءاً من الحل.",
    },
  },
  {
    icon: TrendingDown,
    titleKey: "slide2Title",
    descKey: "slide2Desc",
    title: {
      en: "Save Up to 70%",
      fr: "Économisez jusqu'à 70%",
      ar: "وفّر حتى 70%",
    },
    desc: {
      en: "Get quality food at a fraction of the price from local sellers.",
      fr: "Obtenez de la nourriture de qualité à une fraction du prix.",
      ar: "احصل على طعام عالي الجودة بجزء بسيط من السعر.",
    },
  },
  {
    icon: Utensils,
    titleKey: "slide3Title",
    descKey: "slide3Desc",
    title: {
      en: "Join the Loop",
      fr: "Rejoignez la boucle",
      ar: "انضم إلى الحلقة",
    },
    desc: {
      en: "Connect with restaurants, bakeries, and butchers near you.",
      fr: "Connectez-vous avec les restaurants, boulangeries et boucheries.",
      ar: "تواصل مع المطاعم والمخابز والجزارين بالقرب منك.",
    },
  },
];

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language, t } = useLanguage();
  const { setCurrentScreen } = useAppState();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentScreen("role-select");
    }
  };

  const handleSkip = () => {
    setCurrentScreen("role-select");
  };

  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <Logo size="sm" showText={false} />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10"
            >
              <SlideIcon className="h-16 w-16 text-primary" />
            </motion.div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-foreground text-balance">
              {slide.title[language]}
            </h1>

            {/* Description */}
            <p className="max-w-sm text-lg text-muted-foreground text-pretty">
              {slide.desc[language]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 pb-10">
        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Continue button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90"
        >
          {currentSlide === slides.length - 1 ? t("getStarted") : t("continue")}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
