// src/components/layouts/MainLayout.tsx

import React, { ReactNode } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    ViewStyle,
    StyleProp,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface MainLayoutProps {
    children: ReactNode;
    withScroll?: boolean;
    withPadding?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const MainLayout = ({
    children,
    withScroll = false,
    withPadding = true,
    style,
}: MainLayoutProps) => {
    const { theme } = useTheme();

    const Wrapper = withScroll ? ScrollView : View;

    const paddingStyle: ViewStyle = withPadding
        ? {
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
          }
        : {};

    return (
        <SafeAreaView
            style={[
                {
                    flex: 1,
                },
            ]}
        >
            {/* <StatusBar
                barStyle={theme.dark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            /> */}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <Wrapper
                    style={[{ flex: 1 }, paddingStyle, style]}
                    contentContainerStyle={withScroll ? { flexGrow: 1 } : undefined}
                >
                    {children}
                </Wrapper>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
