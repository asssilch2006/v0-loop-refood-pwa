'use client';

import { motion } from 'framer-motion';
import { Leaf, Zap, TrendingUp } from 'lucide-react';
import { wasteStatistics } from '@/lib/algerian-waste-data';
import { useAppState } from '@/lib/app-state';
import { cn } from '@/lib/utils';

export function SustainabilityBadge() {
  // Simulated user impact - in real app, fetch from user's transaction history
  const userCO2Saved = 127; // kg CO2 saved
  const userFoodSaved = 60.5; // kg of food saved
  const userMoneySaved = 4235; // DZD saved

  const level = userCO2Saved < 50 ? 'Bronze' : userCO2Saved < 150 ? 'Silver' : 'Gold';
  const levelColor = level === 'Bronze' ? 'amber' : level === 'Silver' ? 'gray' : 'yellow';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'p-4 rounded-2xl border-2 transition-all',
        levelColor === 'amber'
          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600'
          : levelColor === 'gray'
            ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-400 dark:border-slate-600'
            : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-400 dark:border-yellow-600'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('p-2.5 rounded-full', `bg-${levelColor}-100 dark:bg-${levelColor}-900/30`)}>
            <Leaf className={cn('h-5 w-5', `text-${levelColor}-600 dark:text-${levelColor}-400`)} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">Sustainability Champion</h3>
            <p className={cn('text-xs font-semibold', `text-${levelColor}-600 dark:text-${levelColor}-400`)}>
              {level} Level
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <TrendingUp className={cn('h-5 w-5', `text-${levelColor}-600 dark:text-${levelColor}-400`)} />
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Leaf className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          </div>
          <p className="font-bold text-foreground text-sm">{userCO2Saved} kg</p>
          <p className="text-[10px] text-muted-foreground">CO2 Prevented</p>
        </div>
        <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-bold text-foreground text-sm">{userFoodSaved} kg</p>
          <p className="text-[10px] text-muted-foreground">Food Saved</p>
        </div>
        <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-sm">💰</span>
          </div>
          <p className="font-bold text-foreground text-sm">{userMoneySaved}</p>
          <p className="text-[10px] text-muted-foreground">DZD Saved</p>
        </div>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(userCO2Saved / 200) * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="mt-3 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
      />
      <p className="text-xs text-muted-foreground mt-2">
        {((userCO2Saved / 200) * 100).toFixed(0)}% towards Platinum level (200 kg CO2)
      </p>
    </motion.div>
  );
}
