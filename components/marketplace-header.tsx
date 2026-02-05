'use client';

import { motion } from 'framer-motion';
import { MapPin, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { useAppState } from '@/lib/app-state';

interface MarketplaceHeaderProps {
  onSearchChange?: (query: string) => void;
  onPostListing?: () => void;
  onMapClick?: () => void;
}

export function MarketplaceHeader({
  onSearchChange,
  onPostListing,
  onMapClick,
}: MarketplaceHeaderProps) {
  const { t, isRTL } = useLanguage();
  const { user } = useAppState();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50 safe-top"
    >
      <div className="px-4 py-4 space-y-4">
        {/* Location & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t('algiers')}
              </p>
              <p className="text-xs text-muted-foreground">
                Active Offers Nearby
              </p>
            </div>
          </div>
          {user?.role === 'seller' && (
            <Button
              onClick={onPostListing}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('postListing')}
            </Button>
          )}
        </div>

        {/* Search & Map Toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchNearby')}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onMapClick}
            className="px-3"
          >
            🗺
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
