import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export const AuthGate: React.FC = () => {
    const tokenFromStore = useSelector((state: RootState) => state.user.token);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const storedToken = await AsyncStorage.getItem('AUTH_TOKEN');
            setToken(storedToken || tokenFromStore || null);
            setLoading(false);
        };
        checkToken();
    }, [tokenFromStore]);

    if (loading) return null; // optional splash screen

    return token ? <AppStack /> : <AuthStack />;
};
