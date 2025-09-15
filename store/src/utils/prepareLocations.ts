import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRoutes as apiGetRoutes, Route } from '@api/routes';
import { normalizeLocation } from '@utils/stringUtils';

export interface Options {
    label: string;
    value: string;
}

const STORAGE_KEY = 'cached_routes';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day

/**
 * Main method to prepare location options.
 */
export const prepareLocations = async (): Promise<Options[]> => {
    try {
        const routes = await getRoutes();
        return mapRoutesToOptions(routes);
    } catch (error: any) {
        console.error('Error preparing locations:', error);
        return [];
    }
};

/**
 * Internal method: get routes from cache or API.
 */
const getRoutes = async (): Promise<Route[]> => {
    const cached = await getCachedRoutes();
    if (cached) return cached;

    const freshRoutes = await fetchRoutesFromApi();
    await saveRoutesToCache(freshRoutes);
    return freshRoutes;
};

/**
 * Try to get cached routes from AsyncStorage if not expired.
 */
const getCachedRoutes = async (): Promise<Route[] | null> => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (!json) return null;

        const jsonStored = JSON.parse(json);
        return jsonStored.data
    } catch (error) {
        console.error('Error reading cached routes:', error);
        return null;
    }
};

/**
 * Fetch fresh routes from API.
 */
const fetchRoutesFromApi = async (): Promise<Route[]> => {
    try {
        const routes = await apiGetRoutes();
        return routes;
    } catch (error) {
        console.error('Error fetching routes from API:', error);
        return [];
    }
};

/**
 * Save routes to AsyncStorage with timestamp.
 */
const saveRoutesToCache = async (routes: Route[]): Promise<void> => {
    try {
        const payload = {
            timestamp: Date.now(),
            data: routes,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
        console.error('Error saving routes to cache:', err);
    }
};

/**
 * Map unique locations from routes to Options[].
 */
export const mapRoutesToOptions = (routes: Route[]): Options[] => {
    const allLocations = routes.flatMap((route) => [
        { label: route.origin, value: route.originValue ?? normalizeLocation(route.origin) },
        {
            label: route.destination,
            value: route.destinationValue ?? normalizeLocation(route.destination),
        },
    ]);

    // Remove duplicates by value
    const uniqueMap = new Map<string, Options>();
    allLocations.forEach((loc) => {
        if (!uniqueMap.has(loc.value)) uniqueMap.set(loc.value, loc);
    });

    return Array.from(uniqueMap.values());
};

/**
 * Given a normalized value, return the label from routes
 */
export const getLocationLabel = async (value: string): Promise<string> => {
    const routes = await getRoutes();

    // flatten all locations with value -> label mapping
    const map: Record<string, string> = {};
    routes.forEach((r) => {
        map[normalizeLocation(r.origin)] = r.origin;
        map[normalizeLocation(r.destination)] = r.destination;
    });

    return map[value] || value; // fallback to value if not found
};

/**
 * Get route ID by normalized origin and destination values.
 * Returns empty string if not found.
 */
export const getRouteId = async (
    originValue: string,
    destinationValue: string
): Promise<string> => {
    const routes: Route[] = await getRoutes();
    console.log(routes)
    const route = routes.find(
        (r) =>
            (r.originValue ?? r.origin.toLowerCase().replace(/\s+/g, '')) === originValue &&
            (r.destinationValue ?? r.destination.toLowerCase().replace(/\s+/g, '')) ===
                destinationValue
    );

    return route?.id?.toString() ?? '';
};
