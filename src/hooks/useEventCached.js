/**
 * Cached hook for fetching a single event by ID using React Query.
 */
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '../service/api.js';
import { API_ENDPOINTS } from '../service/api.js';

/**
 * Hook for fetching a single event by ID
 * @param {string} eventId - Event ID to fetch
 * @param {Object} options - Query options
 * @param {boolean} options.enabled - Whether the query should run (default: true if eventId exists)
 */
export const useEventCached = (eventId, options = {}) => {
  const { enabled = !!eventId } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['event', eventId], // Cache key includes event ID
    queryFn: async () => {
      const { data, success, error: apiError } = await apiCall(API_ENDPOINTS.EVENT_BY_ID(eventId));
      if (success && data) {
        return data;
      } else {
        throw new Error(apiError || 'Failed to fetch event');
      }
    },
    enabled, // Only run if eventId exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  return {
    event: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};

