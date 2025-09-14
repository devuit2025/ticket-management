import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../store';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import AdminStack from './AdminStack';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setCurrentUser } from '../store/userSlice';
import { UserRole } from '../types/auth';
export const AuthGate: React.FC = () => {
    const tokenFromStore = useSelector((state: RootState) => state.user.token);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const dispatch = useDispatch(); // get dispatch function
    const [loading, setLoading] = useState(true);

    // Debug logging
    console.log('AuthGate render - tokenFromStore:', tokenFromStore, 'currentUser:', currentUser?.role);

    useEffect(() => {
        const checkStorage = async () => {
            const storedToken = await AsyncStorage.getItem('AUTH_TOKEN');
            const storedUser = await AsyncStorage.getItem('CURRENT_USER');
            
            if (!storedToken) {
                dispatch(setToken(''));
                dispatch(setCurrentUser(null));
            } else {
                if (!tokenFromStore) {
                    dispatch(setToken(storedToken));
                }
                
                if (storedUser && !currentUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        dispatch(setCurrentUser(userData));
                    } catch (error) {
                        console.error('Error parsing stored user:', error);
                    }
                }
            }
            setLoading(false);
        };
        checkStorage();
    }, []); // Remove dependencies to prevent infinite loops

    if (loading) return null; // optional splash screen

    if (!tokenFromStore) {
        return <AuthStack />;
    }

    // Check user role to determine which stack to show
    const userRole = currentUser?.role as UserRole;
    
    // Admin users go to AdminStack
    if (userRole === 'admin' || userRole === 'super_admin') {
        return <AdminStack />;
    }
    
    // Regular users go to AppStack
    if (userRole === 'user' || userRole === 'customer') {
        return <AppStack />;
    }
    
    // If role is not recognized, redirect to login
    console.warn('Unknown user role:', userRole);
    return <AuthStack />;
};
