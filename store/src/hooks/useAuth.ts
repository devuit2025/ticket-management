// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    login as loginAction,
    phoneLogin as phoneLoginAction,
    facebookLogin as facebookLoginAction,
    googleLogin as googleLoginAction,
    logout as logoutAction,
    clearError,
    setToken,
} from '@store/userSlice';
import type { AppDispatch, RootState } from '@store';
import type { LoginRequest, PhoneLoginRequest } from '@types/auth';

const TOKEN_KEY = 'AUTH_TOKEN';

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const { currentUser, token, isLoading, error } = useSelector((state: RootState) => state.user);

    const USER_KEY = 'CURRENT_USER';

    const storeCurrentUser = async (user: any) => {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (err) {
            console.error('Failed to store user', err);
        }
    };

    const getCurrentUser = async () => {
        try {
            const userString = await AsyncStorage.getItem(USER_KEY);
            if (userString) {
                return JSON.parse(userString);
            }
            return null;
        } catch (err) {
            console.error('Failed to get user', err);
            return null;
        }
    };

    const removeCurrentUser = async () => {
        try {
            await AsyncStorage.removeItem(USER_KEY);
        } catch (err) {
            console.error('Failed to remove user', err);
        }
    };

    // --- Email login ---
    const login = useCallback(
        async (data: LoginRequest) => {
            const result = await dispatch(loginAction(data)).unwrap();
            await AsyncStorage.setItem(TOKEN_KEY, result.token);
            await storeCurrentUser(result.user);
            return result;
        },
        [dispatch]
    );

    // --- Phone login ---
    const phoneLogin = useCallback(
        async (data: PhoneLoginRequest) => {
            const result = await dispatch(phoneLoginAction(data)).unwrap();
            await AsyncStorage.setItem(TOKEN_KEY, result.token);
            return result;
        },
        [dispatch]
    );

    // --- Facebook login ---
    const facebookLogin = useCallback(
        async (accessToken: string) => {
            const result = await dispatch(facebookLoginAction(accessToken)).unwrap();
            await AsyncStorage.setItem(TOKEN_KEY, result.token);
            return result;
        },
        [dispatch]
    );

    // --- Google login ---
    const googleLogin = useCallback(
        async (accessToken: string) => {
            const result = await dispatch(googleLoginAction(accessToken)).unwrap();
            await AsyncStorage.setItem(TOKEN_KEY, result.token);
            return result;
        },
        [dispatch]
    );

    // --- Logout ---
    const logout = useCallback(
        async (navigation?: any) => {
            await dispatch(logoutAction()).unwrap();
            await dispatch(setToken(''));
            await AsyncStorage.removeItem(TOKEN_KEY);
            await removeCurrentUser();
        },
        [dispatch]
    );

    // --- Clear error ---
    const clearAuthError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        token,
        isLoading,
        error,
        login,
        phoneLogin,
        facebookLogin,
        googleLogin,
        logout,
        clearAuthError,
        getCurrentUser,
    };
};
