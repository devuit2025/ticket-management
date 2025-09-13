import { normalizeLocation } from '@utils/stringUtils';
import client from './client';

export interface Route {
    id: number;
    origin: string;
    originValue: string;
    destination: string;
    destinationValue: string;
    distance: number;
    duration: string;
    base_price: number;
    is_active: boolean;
    total_trips: number;
    upcoming_trips: number;
    min_price: number;
    max_price: number;
    created_at: string;
    updated_at: string;
}

export interface GetRoutesResponse {
    routes: Route[];
    total: number;
}

export interface GetRoutesParams {
    origin?: string;
    destination?: string;
    min_distance?: number;
    max_distance?: number;
    min_price?: number;
    max_price?: number;
    is_active?: boolean;
}

// --- Get Routes ---
export const getRoutes = async (params?: GetRoutesParams): Promise<GetRoutesResponse> => {
    const response = await client.get<GetRoutesResponse>('/routes', {
        params,
    });

    const routesWithValue = response.routes.map((r) => ({
        ...r,
        originValue: normalizeLocation(r.origin),
        destinationValue: normalizeLocation(r.destination),
    }));

    return routesWithValue;
};

// --- Get Routes ---
export const getRoute = async (id): Promise<GetRoutesResponse> => {
    const response = await client.get<GetRoutesResponse>(`/routes/${id}`, {});

    return response;
};
