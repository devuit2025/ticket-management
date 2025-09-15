import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useApiCache } from './useApiCache';
import {
  getAdminTrips,
  getAdminBookings,
  getAdminUsers,
  getDashboardStats,
  getRecentActivity,
  getRoutes,
  getBuses,
  getDrivers
} from '@api/admin';

// Custom hook for admin trips data
export function useAdminTrips() {
  const {
    data: tripsData,
    isLoading,
    error,
    fetchData,
    invalidateCache
  } = useApiCache('admin-trips', getAdminTrips, {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000   // 5 minutes
  });

  const refreshTrips = useCallback(() => {
    return fetchData(true); // Force refresh
  }, [fetchData]);

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure token is saved to AsyncStorage
      const timer = setTimeout(() => {
        fetchData();
      }, 100);
      return () => clearTimeout(timer);
    }, [fetchData])
  );

  return {
    trips: tripsData?.trips || [],
    total: tripsData?.total || 0,
    isLoading,
    error,
    refreshTrips,
    invalidateCache
  };
}

// Custom hook for admin bookings data
export function useAdminBookings() {
  const {
    data: bookingsData,
    isLoading,
    error,
    fetchData,
    invalidateCache
  } = useApiCache('admin-bookings', getAdminBookings, {
    staleTime: 1 * 60 * 1000, // 1 minute (bookings change more frequently)
    cacheTime: 3 * 60 * 1000   // 3 minutes
  });

  const refreshBookings = useCallback(() => {
    return fetchData(true); // Force refresh
  }, [fetchData]);

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure token is saved to AsyncStorage
      const timer = setTimeout(() => {
        fetchData();
      }, 100);
      return () => clearTimeout(timer);
    }, [fetchData])
  );

  return {
    bookings: bookingsData?.bookings || [],
    total: bookingsData?.total || 0,
    isLoading,
    error,
    refreshBookings,
    invalidateCache
  };
}

// Custom hook for admin users data
export function useAdminUsers() {
  const {
    data: usersData,
    isLoading,
    error,
    fetchData,
    invalidateCache
  } = useApiCache('admin-users', getAdminUsers, {
    staleTime: 5 * 60 * 1000, // 5 minutes (users change less frequently)
    cacheTime: 10 * 60 * 1000  // 10 minutes
  });

  const refreshUsers = useCallback(() => {
    return fetchData(true); // Force refresh
  }, [fetchData]);

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure token is saved to AsyncStorage
      const timer = setTimeout(() => {
        fetchData();
      }, 100);
      return () => clearTimeout(timer);
    }, [fetchData])
  );

  return {
    users: usersData?.users || [],
    total: usersData?.total || 0,
    isLoading,
    error,
    refreshUsers,
    invalidateCache
  };
}

// Custom hook for dashboard data
export function useAdminDashboard() {
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    fetchData: fetchStats,
    invalidateCache: invalidateStats
  } = useApiCache('admin-stats', getDashboardStats, {
    staleTime: 0, // Always fetch fresh data for dashboard
    cacheTime: 1 * 60 * 1000   // 1 minute
  });

  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
    fetchData: fetchActivity,
    invalidateCache: invalidateActivity
  } = useApiCache('admin-activity', getRecentActivity, {
    staleTime: 30 * 1000, // 30 seconds (activity changes frequently)
    cacheTime: 2 * 60 * 1000   // 2 minutes
  });

  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      fetchStats(true), // Force refresh
      fetchActivity(true)
    ]);
  }, [fetchStats, fetchActivity]);

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('useAdminDashboard: Screen focused - fetching stats and activity');
      // Small delay to ensure token is saved to AsyncStorage
      const timer = setTimeout(() => {
        fetchStats();
        fetchActivity();
      }, 100);
      return () => clearTimeout(timer);
    }, [fetchStats, fetchActivity])
  );

  return {
    stats: statsData,
    activities: activityData?.activities || [],
    isLoading: statsLoading || activityLoading,
    error: statsError || activityError,
    refreshDashboard,
    invalidateStats,
    invalidateActivity
  };
}

// Custom hook for dropdown options (routes, buses, drivers)
export function useAdminOptions() {
  const {
    data: routesData,
    isLoading: routesLoading,
    error: routesError,
    fetchData: fetchRoutes
  } = useApiCache('admin-routes', getRoutes, {
    staleTime: 10 * 60 * 1000, // 10 minutes (options change rarely)
    cacheTime: 30 * 60 * 1000   // 30 minutes
  });

  const {
    data: busesData,
    isLoading: busesLoading,
    error: busesError,
    fetchData: fetchBuses
  } = useApiCache('admin-buses', getBuses, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000   // 30 minutes
  });

  const {
    data: driversData,
    isLoading: driversLoading,
    error: driversError,
    fetchData: fetchDrivers
  } = useApiCache('admin-drivers', getDrivers, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000   // 30 minutes
  });

  const fetchOptions = useCallback(async () => {
    await Promise.all([
      fetchRoutes(),
      fetchBuses(),
      fetchDrivers()
    ]);
  }, [fetchRoutes, fetchBuses, fetchDrivers]);

  // Fetch options when screen is focused (only once per session)
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure token is saved to AsyncStorage
      const timer = setTimeout(() => {
        fetchOptions();
      }, 100);
      return () => clearTimeout(timer);
    }, [fetchOptions])
  );

  return {
    routes: routesData?.routes || [],
    buses: busesData?.buses || [],
    drivers: driversData?.users || [],
    isLoading: routesLoading || busesLoading || driversLoading,
    error: routesError || busesError || driversError,
    fetchOptions
  };
}
