import { useEffect, useState } from 'react';
import { generateVoiceGuidance } from '@/lib/services/groq-voice';

export interface Listing {
  id: string;
  name: string;
  seller: string;
  image: string;
  originalPrice: number;
  loopPrice: number;
  distance: number;
  rating: number;
  reviews: number;
  category: string;
  expiresIn: number;
  location: { lat: number; lng: number };
}

export function useListings(category?: string, neighborhood?: string) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try cache first
        const params = new URLSearchParams({
          useCache: 'true',
          ...(category && { category }),
          ...(neighborhood && { neighborhood: neighborhood || 'Algiers' }),
        });

        const response = await fetch(`/api/listings?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        console.log('[v0] Fetched listings:', data);
        setListings(data.data || []);

        // Announce loading completion for accessibility
        if (category) {
          await generateVoiceGuidance(
            `Loaded ${data.data?.length || 0} items in ${category} category`
          ).catch(console.error);
        }
      } catch (err) {
        console.error('[v0] Listing fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, neighborhood]);

  return { listings, loading, error };
}

export function useFoodSearch(query: string, neighborhood = 'Algiers') {
  const [results, setResults] = useState<Listing[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        setSearching(true);
        const params = new URLSearchParams({
          search: query,
          neighborhood,
        });

        const response = await fetch(`/api/listings?${params}`);
        const data = await response.json();
        setResults(data.data || []);
      } catch (err) {
        console.error('[v0] Search error:', err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, neighborhood]);

  return { results, searching };
}
