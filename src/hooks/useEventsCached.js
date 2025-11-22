/**
 * Cached hook for fetching events using React Query.
 * Supports different query keys for different event lists (all events, approved, filtered, etc.)
 */
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '../service/api.js';
import { API_ENDPOINTS } from '../service/api.js';

/**
 * Hook for fetching all events for map display (no pagination)
 * @param {Object} options - Query options
 * @param {boolean} options.enabled - Whether the query should run
 * @param {number} options.status - Event status filter (optional)
 */
export const useEventsAllCached = (options = {}) => {
  const { enabled = true, status = null } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', 'all', status], // Cache key includes status for different cache entries
    queryFn: async () => {
      let url = API_ENDPOINTS.EVENTS_ALL;
      if (status) {
        url += `?status=${status}`;
      }
      
      const { data, success, error: apiError } = await apiCall(url);
      if (success && data) {
        // The endpoint returns an array directly (not paginated)
        const eventsArray = Array.isArray(data) ? data : [];
        return eventsArray;
      } else {
        throw new Error(apiError || 'Failed to fetch events');
      }
    },
    enabled, // Only run if enabled is true
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  return {
    events: data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};

/**
 * Hook for fetching paginated events (for admin/list views)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.pageSize - Items per page (default: 20)
 * @param {string} options.categoryId - Category filter (optional)
 * @param {number} options.status - Status filter (optional)
 */
export const useEventsPaginatedCached = (options = {}) => {
  const { 
    page = 1, 
    pageSize = 20, 
    categoryId = null, 
    status = null,
    enabled = true 
  } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', 'paginated', page, pageSize, categoryId, status],
    queryFn: async () => {
      let url = `${API_ENDPOINTS.EVENTS}?page=${page}&page_size=${pageSize}`;
      if (categoryId) {
        url += `&category_id=${categoryId}`;
      }
      if (status !== null) {
        url += `&status=${status}`;
      }

      const { data, success, error: apiError } = await apiCall(url);
      if (success && data) {
        // Handle paginated response
        return {
          items: Array.isArray(data.items) ? data.items : (data.items || []),
          total: data.total || 0,
          page: data.page || page,
          pageSize: data.page_size || pageSize,
          hasNext: data.has_next || false,
          hasPrevious: data.has_previous || false,
        };
      } else {
        throw new Error(apiError || 'Failed to fetch events');
      }
    },
    enabled,
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute (more dynamic)
    cacheTime: 3 * 60 * 1000, // Keep in cache for 3 minutes
  });

  return {
    events: data?.items || [],
    total: data?.total || 0,
    page: data?.page || page,
    pageSize: data?.pageSize || pageSize,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};

