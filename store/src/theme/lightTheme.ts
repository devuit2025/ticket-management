import { coreTokens } from './coreTokens';
import { lightColors } from './colors';
import type { Theme } from './theme';

export const lightTheme: Theme = {
    ...coreTokens,
    dark: false,
    colors: {
        ...lightColors,
    },
};
