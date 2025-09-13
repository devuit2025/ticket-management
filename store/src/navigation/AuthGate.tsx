import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '@store';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import { useSelector, useDispatch } from 'react-redux'; // import useDispatch
import { setToken } from '@store/userSlice';
export const AuthGate: React.FC = () => {
    const tokenFromStore = useSelector((state: RootState) => state.user.token);
    const dispatch = useDispatch(); // get dispatch function
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStorage = async () => {
            const storedToken = await AsyncStorage.getItem('AUTH_TOKEN');
            if (!storedToken) {
                dispatch(setToken('')); // ✅ this should now work
            }
            console.log(storedToken);
            if (storedToken && !tokenFromStore) {
                dispatch(setToken(storedToken)); // ✅ this should now work
            } else {
            }
            setLoading(false);
        };
        checkStorage();
    }, [dispatch, tokenFromStore]);

    if (loading) return null; // optional splash screen

    return tokenFromStore ? <AppStack /> : <AuthStack />;
};
