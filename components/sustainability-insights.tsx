'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Leaf, Users, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  title: string;
  description: string;
  stat: string;
  icon: React.ReactNode;
}

const wasteInsights = [
  {
    id: 'bread-waste',
    title: 'Bread & Cereals',
    description: '38% of household food waste in Algiers comes from bread and cereals. Improper storage is the main cause.',
    stat: '38%',
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    id: 'household-waste',
    title: 'Household Waste',
    description: '45% of food waste occurs in urban households due to overconsumption and poor planning.',
    stat: '45%',
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    id: 'co2-impact',
    title: 'Environmental Impact',
    description: 'Food waste generates 3.3 billion tonnes of CO2 globally. Every kg of bread saved prevents 2.5kg CO2.',
    stat: '2.5kg CO2',
    icon: <Leaf className="h-5 w-5" />,
  },
];

const reviews = [
  {
    id: 1,
    name: 'Amine (USTHB Student)',
    text: 'This app saved my budget! I find cheap meals near Bab Ezzouar every day.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Karim (Farmer)',
    text: 'As a worker, I buy surplus bread for my small farm. It\'s a game-changer for recycling.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Lydia (Environmental Volunteer)',
    text: 'Finally, an app that addresses the 45% of food waste in our cities!',
    rating: 5,
  },
];

export function SustainabilityInsights() {
  const { t } = useLanguage();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'reviews'>('insights');

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('insights')}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all',
            activeTab === 'insights'
              ? 'bg-primary/10 text-primary'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          )}
        >
          {t('foodWasteData')}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all',
            activeTab === 'reviews'
              ? 'bg-primary/10 text-primary'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          )}
        >
          {t('communityReviews')}
        </button>
      </div>

      {/* Insights Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {wasteInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-muted/40 border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedInsight(
                      expandedInsight === insight.id ? null : insight.id
                    )
                  }
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 text-left">
                    <div className="text-primary mt-0.5">{insight.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {insight.title}
                      </p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {insight.stat}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
                      expandedInsight === insight.id && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {expandedInsight === insight.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/50 overflow-hidden"
                    >
                      <p className="p-3 text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-muted/40 border border-border/50 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {review.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {review.text}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="text-amber-400">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
