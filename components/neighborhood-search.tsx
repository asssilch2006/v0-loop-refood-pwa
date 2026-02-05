'use client';

import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { algiersNeighborhoods } from '@/lib/algerian-waste-data';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface NeighborhoodSearchProps {
  onSelect?: (neighborhood: any) => void;
}

export function NeighborhoodSearch({ onSelect }: NeighborhoodSearchProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<any>(null);

  const filteredNeighborhoods = algiersNeighborhoods.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (neighborhood: any) => {
    setSelectedNeighborhood(neighborhood);
    setSearchTerm('');
    onSelect?.(neighborhood);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-900/50"
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-foreground">Search by Neighborhood</h3>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Kouba, Hydra, Bab Ezzouar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selected Neighborhood Display */}
        {selectedNeighborhood && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-lg bg-background/50 mb-3"
          >
            <p className="text-xs text-muted-foreground mb-1">Currently viewing:</p>
            <p className="font-semibold text-foreground text-sm">{selectedNeighborhood.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedNeighborhood.description}</p>
            <p className="text-xs text-success mt-2 font-medium">
              {selectedNeighborhood.storeCount} stores available
            </p>
          </motion.div>
        )}

        {/* Neighborhood Grid */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto"
          >
            {filteredNeighborhoods.map((neighborhood, idx) => (
              <motion.button
                key={neighborhood.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleSelect(neighborhood)}
                className="p-2 rounded-lg bg-background/60 hover:bg-background border border-border/50 hover:border-blue-400 transition-all text-left text-xs"
              >
                <p className="font-medium text-foreground">{neighborhood.name}</p>
                <p className="text-[10px] text-muted-foreground">{neighborhood.type}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Popular Neighborhoods */}
        {!searchTerm && (
          <div className="grid grid-cols-2 gap-2">
            <h4 className="col-span-2 text-xs font-semibold text-foreground mb-2">Popular Neighborhoods</h4>
            {algiersNeighborhoods.slice(0, 6).map((neighborhood, idx) => (
              <motion.button
                key={neighborhood.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(neighborhood)}
                className={cn(
                  'p-2.5 rounded-lg transition-all text-left text-xs font-medium',
                  selectedNeighborhood?.name === neighborhood.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-background/60 hover:bg-background border border-border/50 text-foreground'
                )}
              >
                <p>{neighborhood.name}</p>
                <p className={cn('text-[10px] mt-1', selectedNeighborhood?.name === neighborhood.name ? 'opacity-90' : 'text-muted-foreground')}>
                  {neighborhood.storeCount} stores
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
