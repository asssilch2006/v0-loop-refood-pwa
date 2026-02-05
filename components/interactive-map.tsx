'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { MapPin, Navigation, Phone, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Store {
  id: string | number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'bakery' | 'butcher' | 'farm';
  rating?: number;
  phone?: string;
  items?: number;
}

const ALGIERS_CENTER = { lat: 36.75, lng: 3.05 };
const MAP_SCALE = 100; // pixels per degree

interface InteractiveMapProps {
  stores: Store[];
  selectedStore?: Store | null;
  onStoreSelect?: (store: Store) => void;
}

export function InteractiveMap({ stores, selectedStore, onStoreSelect }: InteractiveMapProps) {
  const { t } = useLanguage();
  const [hoveredStore, setHoveredStore] = useState<string | number | null>(null);

  // Calculate relative positions on the map
  const storePositions = useMemo(() => {
    const mapWidth = 400;
    const mapHeight = 300;

    return stores.map((store) => {
      const x = ((store.lng - ALGIERS_CENTER.lng) * MAP_SCALE) + mapWidth / 2;
      const y = ((ALGIERS_CENTER.lat - store.lat) * MAP_SCALE) + mapHeight / 2;

      return { ...store, x, y };
    });
  }, [stores]);

  const openGoogleMaps = (store: Store) => {
    const query = encodeURIComponent(`${store.name}, Algiers, Algeria`);
    window.open(
      `https://www.google.com/maps/search/${query}/@${store.lat},${store.lng},15z`,
      '_blank'
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'bg-blue-500';
      case 'bakery':
        return 'bg-amber-500';
      case 'butcher':
        return 'bg-red-500';
      case 'farm':
        return 'bg-green-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 border border-border/50"
        style={{ width: '100%', paddingBottom: '75%' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Centered marker for Algiers */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-primary bg-primary/10 z-10" />

          {/* Store markers */}
          {storePositions.map((store) => (
            <motion.button
              key={store.id}
              onClick={() => onStoreSelect?.(store)}
              onHoverStart={() => setHoveredStore(store.id)}
              onHoverEnd={() => setHoveredStore(null)}
              style={{
                position: 'absolute',
                left: `${(store.x / 400) * 100}%`,
                top: `${(store.y / 300) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="group relative"
              whileHover={{ scale: 1.2 }}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-all',
                  getTypeColor(store.type),
                  hoveredStore === store.id || selectedStore?.id === store.id
                    ? 'ring-4 ring-primary/50 scale-125'
                    : 'shadow-md'
                )}
              >
                📍
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {(hoveredStore === store.id || selectedStore?.id === store.id) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-card border border-border shadow-lg p-2 z-20 text-left"
                  >
                    <p className="font-semibold text-sm text-foreground truncate">
                      {store.name}
                    </p>
                    {store.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">
                          {store.rating} ({store.items || 0} items)
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute top-3 left-3 text-xs space-y-1 bg-card/80 backdrop-blur-sm p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Restaurant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Bakery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Butcher</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Farm</span>
          </div>
        </div>
      </motion.div>

      {/* Selected Store Details */}
      <AnimatePresence mode="wait">
        {selectedStore && (
          <motion.div
            key={selectedStore.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl bg-muted/50 border border-border/50 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{selectedStore.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedStore.location}</p>
                {selectedStore.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-foreground">
                      {selectedStore.rating} - {selectedStore.items || 0} items
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onStoreSelect?.(null as any)}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => openGoogleMaps(selectedStore)}
                className="flex-1 gap-2"
              >
                <Navigation className="h-4 w-4" />
                {t('getDirections')}
              </Button>
              {selectedStore.phone && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${selectedStore.phone}`)}
                  className="gap-2"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
