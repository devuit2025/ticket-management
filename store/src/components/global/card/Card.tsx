import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, ViewProps } from 'react-native';
import { useTheme } from '@context/ThemeContext';

export interface CardProps extends ViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    elevation?: number;
    bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    style,
    elevation = 2,
    bordered = false,
    ...rest
}) => {
    const { theme } = useTheme();

    const backgroundColor = theme.colors.card;
    const borderColor = theme.colors.border;
    // const shadow = {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: elevation,
    //     elevation,
    // };

    return (
        <View
            style={[
                {
                    backgroundColor,
                    padding: theme.spacing.md,
                    borderRadius: theme.radius.md,
                    ...(bordered ? { borderWidth: 1, borderColor } : {}),
                },
                style,
            ]}
            {...rest}
        >
            {children}
        </View>
    );
};

export default Card;
