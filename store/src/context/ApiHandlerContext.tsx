import React, { createContext, useState, ReactNode, forwardRef, useImperativeHandle } from 'react';
import { Alert, View, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { showToast } from '@utils/toast';

interface ApiHandlerContextProps {
    startLoading: () => void;
    stopLoading: () => void;
    showError: (message: string) => void;
}

export const ApiHandlerContext = createContext<ApiHandlerContextProps>({
    startLoading: () => {},
    stopLoading: () => {},
    showError: () => {},
});

export const ApiHandlerProvider = forwardRef(({ children }: { children: ReactNode }, ref) => {
    const [loadingCount, setLoadingCount] = useState(0);

    const startLoading = () => setLoadingCount((c) => c + 1);
    const stopLoading = () => setLoadingCount((c) => Math.max(0, c - 1));
    const showError = (message: string) => {
        showToast('error', message);
    };

    // 👇 Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        startLoading,
        stopLoading,
        showError,
    }));

    return (
        <ApiHandlerContext.Provider value={{ startLoading, stopLoading, showError }}>
            {children}

            {/* Spinner overlay */}
            <Modal transparent visible={loadingCount > 0}>
                <View style={styles.spinnerOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </Modal>
        </ApiHandlerContext.Provider>
    );
});

const styles = StyleSheet.create({
    spinnerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
