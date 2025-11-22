/**
 * Cached hook for fetching categories using React Query.
 * Categories are cached for 10 minutes and shared across all components.
 */
import { useQuery } from '@tanstack/react-query';
import { publicApiCall } from '../service/api.js';
import { API_ENDPOINTS } from '../service/api.js';

export const useCategoriesCached = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'], // Cache key - shared across all components
    queryFn: async () => {
      const { data, success, error: apiError } = await publicApiCall(API_ENDPOINTS.CATEGORIES);
      if (success && data) {
        // Handle paginated response: data.items contains the array, or data itself if it's an array
        const categoriesArray = Array.isArray(data) ? data : (data.items || []);
        return categoriesArray;
      } else {
        throw new Error(apiError || 'Failed to fetch categories');
      }
    },
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes (categories rarely change)
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  return {
    categories: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};

