import { Theme as NavigationTheme } from '@react-navigation/native';

export interface Theme extends NavigationTheme {
    dark: boolean;
    colors: {
        primary: string;
        background: string;
        card: string;
        text: string;
        border: string;
        notification: string;
        // add any extra custom colors here if needed
        [key: string]: string;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    radius: {
        none: number;
        sm: number;
        md: number;
        lg: number;
        pill: number;
    };
    fonts: {
        regular: string;
        medium: string;
        bold: string;
        heavy: string; // Required by NavigationTheme
        sizes: {
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
    };
}
