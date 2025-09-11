import client from './client';

// --- Route Types ---
export interface Route {
    id: number;
    origin: string;
    destination: string;
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
    return response;
};
