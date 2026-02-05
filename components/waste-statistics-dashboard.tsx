'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Leaf, AlertCircle, Target } from 'lucide-react';
import { wasteStatistics } from '@/lib/algerian-waste-data';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function WasteStatisticsDashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Main Stat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-900/50"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Food Waste in Algeria</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-600 dark:text-red-400">
                {wasteStatistics.overall.wastePercentage}%
              </span>
              <span className="text-lg text-muted-foreground">of food wasted annually</span>
            </div>
          </div>
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm text-foreground/80">
          In households, causing environmental and economic impact across the nation
        </p>
      </motion.div>

      {/* Top Wasted Items */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground px-1">Most Wasted Items</h3>
        {wasteStatistics.topWastedItems.map((item, idx) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-foreground">{item.category}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {item.percentage}%
              </span>
            </div>
            <p className="text-xs text-foreground/70 pl-11">
              <Leaf className="h-3 w-3 inline mr-1" />
              {item.solution}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Key Findings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground px-1">Research Findings</h3>
        {wasteStatistics.keyFindings.map((finding, idx) => (
          <motion.div
            key={finding.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              'p-4 rounded-xl border transition-colors',
              idx === 0
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                : idx === 1
                  ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                  : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50'
            )}
          >
            <p className="font-medium text-foreground text-sm mb-2">{finding.title}</p>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground/80">{finding.statistic}</p>
              <p className="text-xs text-foreground/70">{finding.impact}</p>
              <p className="text-xs text-success flex items-center gap-1 mt-2">
                <Target className="h-3 w-3" />
                {finding.solution}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
