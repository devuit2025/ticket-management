import { getRoutes, Route } from '@api/routes';

export interface Options {
    label: string;
    value: string;
}

/**
 * Fetch all routes and return unique locations (origins + destinations)
 * as Options[] format.
 */
export const prepareLocations = async (): Promise<Options[]> => {
    try {
        // Call API to get all routes
        const data = await getRoutes();
        console.log(data);
        // Collect all origins and destinations
        const allLocations = data.routes.flatMap((route: Route) => [
            route.origin,
            route.destination,
        ]);

        // Remove duplicates
        const uniqueLocations = Array.from(new Set(allLocations));

        // Map to Options[]
        const locations: Options[] = uniqueLocations.map((loc) => ({
            label: loc,
            value: loc.toLowerCase().replace(/\s+/g, ''), // e.g., 'Ho Chi Minh City' -> 'hochiminhcity'
        }));

        return locations;
    } catch (error: any) {
        console.error('Error preparing locations:', error);
        return [];
    }
};
