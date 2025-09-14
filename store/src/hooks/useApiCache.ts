import { useState, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isLoading: boolean;
}

interface UseApiCacheOptions {
  staleTime?: number; // Time in ms before data is considered stale (default: 5 minutes)
  cacheTime?: number; // Time in ms before data is removed from cache (default: 10 minutes)
}

export function useApiCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseApiCacheOptions = {}
) {
  const { staleTime = 5 * 60 * 1000, cacheTime = 10 * 60 * 1000 } = options;
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCachedData = useCallback(() => {
    const cached = cacheRef.current.get(key);
    if (!cached) return null;

    const now = Date.now();

    // Remove expired cache
    if (now - cached.timestamp > cacheTime) {
      cacheRef.current.delete(key);
      return null;
    }

    return cached;
  }, [key, cacheTime]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    const cached = getCachedData();

    // Return cached data if it's still fresh and not forcing refresh
    if (!forceRefresh && cached && !cached.isLoading) {
      const now = Date.now();
      if (now - cached.timestamp < staleTime) {
        setData(cached.data);
        setError(null);
        return cached.data;
      }
    }

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Update cache with loading state
    cacheRef.current.set(key, {
      data: cached?.data || data || null as T,
      timestamp: cached?.timestamp || 0,
      isLoading: true
    });

    try {
      const result = await fetchFn();

      // Update cache with fresh data
      cacheRef.current.set(key, {
        data: result,
        timestamp: Date.now(),
        isLoading: false
      });

      setData(result);
      setError(null);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);

      // Keep cached data on error
      if (cached) {
        setData(cached.data);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [key, fetchFn, staleTime, getCachedData]);

  const invalidateCache = useCallback(() => {
    cacheRef.current.delete(key);
  }, [key]);

  const clearAllCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    invalidateCache,
    clearAllCache
  };
}
