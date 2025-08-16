export const coreTokens = {
    spacing: {
        xs: 5,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        none: 0,
        sm: 4,
        md: 6,
        lg: 16,
        pill: 9999,
    },
    fonts: {
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        bold: 'Inter-Bold',
        heavy: 'Inter-Bold', // Required by NavigationTheme
        sizes: {
            sm: 12,
            md: 14,
            lg: 16,
            xl: 17,
            xxl: 22,
        },
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1, // Android
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 6,
        },
    },
};
