import React from 'react';
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '@context/ThemeContext';

export interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
    color?: string;
    align?: 'left' | 'center' | 'right';
    weight?: 'regular' | 'medium' | 'bold';
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
    variant = 'body',
    color,
    align = 'left',
    weight = 'regular',
    style,
    children,
    ...rest
}) => {
    const { theme } = useTheme();

    const variantMapping = {
        h1: {
            fontSize: theme.fonts.sizes.xl * 1.5,
            lineHeight: 32,
        },
        h2: {
            fontSize: theme.fonts.sizes.xl,
            lineHeight: 28,
        },
        h3: {
            fontSize: theme.fonts.sizes.lg,
            lineHeight: 24,
        },
        body: {
            fontSize: theme.fonts.sizes.md,
            lineHeight: 20,
        },
        caption: {
            fontSize: theme.fonts.sizes.sm,
            lineHeight: 16,
        },
    };

    const fontFamily =
        weight === 'bold'
            ? theme.fonts.bold
            : weight === 'medium'
              ? theme.fonts.medium
              : theme.fonts.regular;

    const variantStyle = variantMapping[variant] || variantMapping.body;

    return (
        <Text
            {...rest}
            style={[
                {
                    color: color || theme.colors.text,
                    fontFamily,
                    textAlign: align,
                    fontSize: variantStyle.fontSize,
                    lineHeight: variantStyle.lineHeight,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
};

export default Typography;
