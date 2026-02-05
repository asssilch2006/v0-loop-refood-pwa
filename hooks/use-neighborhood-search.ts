import { useCallback, useState, useEffect } from 'react';

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  distance: number;
}

export function useNeighborhoodSearch(
  initialLat = 36.75,
  initialLng = 3.05
) {
  const [latitude, setLatitude] = useState(initialLat);
  const [longitude, setLongitude] = useState(initialLng);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);

  const search = useCallback(async (lat?: number, lng?: number, radius = 5) => {
    // Throttle searches to avoid too many API calls
    const now = Date.now();
    if (now - lastSearchTime < 1000) {
      console.log('[v0] Search throttled');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const searchLat = lat || latitude;
      const searchLng = lng || longitude;

      console.log('[v0] Neighborhood search:', { searchLat, searchLng, radius });

      const params = new URLSearchParams({
        type: 'neighborhood',
        lat: searchLat.toString(),
        lng: searchLng.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      console.log(`[v0] Found ${data.data?.length || 0} items near location`);

      setResults(data.data || []);
      setLatitude(searchLat);
      setLongitude(searchLng);
      setLastSearchTime(now);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search error';
      console.error('[v0] Search error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, lastSearchTime]);

  // Get user's current location (if permitted)
  const getMyLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    try {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          console.log('[v0] User location obtained:', { lat, lng });
          search(lat, lng);
        },
        (err) => {
          console.error('[v0] Geolocation error:', err);
          // Fallback to Algiers
          setError('Using default location (Algiers)');
          search();
        }
      );
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Auto-search on component mount
  useEffect(() => {
    search();
  }, []); // Run once on mount

  return {
    results,
    loading,
    error,
    search,
    getMyLocation,
    currentLocation: { latitude, longitude },
  };
}

// Cache popular offers hook
export function usePopularOffers() {
  const [offers, setOffers] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopular = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/search?type=popular');
      if (!response.ok) throw new Error('Failed to fetch popular offers');

      const data = await response.json();
      console.log('[v0] Fetched popular offers:', data.data?.length || 0);
      setOffers(data.data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching offers';
      console.error('[v0] Popular offers error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopular();
    // Refresh every 30 minutes
    const interval = setInterval(fetchPopular, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { offers, loading, error, refetch: fetchPopular };
}
