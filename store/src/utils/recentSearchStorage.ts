import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookingData } from '@types';

const STORAGE_KEY = 'recent_searches';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day

export interface StoredSearch extends BookingData {
    timestamp: number;
}

export async function getRecentSearches(): Promise<StoredSearch[]> {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (!json) return [];

        const items: StoredSearch[] = JSON.parse(json);

        const now = Date.now();
        const validItems = items.filter((item) => now - item.timestamp < EXPIRY_MS);

        return validItems.slice(0, 5); // ensure max 5
    } catch (err) {
        console.error('Error reading recent searches:', err);
        return [];
    }
}

export async function addRecentSearch(data: BookingData): Promise<void> {
    try {
        const existing = await getRecentSearches();

        // avoid duplicates (based on from/to/day/dayBack)
        const filtered = existing.filter(
            (s) =>
                !(
                    s.from === data.from &&
                    s.to === data.to &&
                    s.day === data.day &&
                    s.dayBack === data.dayBack
                )
        );

        const newSearch: StoredSearch = {
            ...data,
            timestamp: Date.now(),
        };

        const updated = [newSearch, ...filtered].slice(0, 5); // keep latest 5

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
        console.error('Error saving recent search:', err);
    }
}
