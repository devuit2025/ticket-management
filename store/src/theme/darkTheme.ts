import { coreTokens } from './coreTokens';
import { darkColors } from './colors';
import type { Theme } from './theme';

export const darkTheme: Theme = {
    ...coreTokens,
    dark: true,
    colors: {
        ...darkColors,
    },
};
