import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';

import AdminDashboardScreen from '@screens/admin/DashboardScreen';
import AdminTripsScreen from '@screens/admin/TripsScreen';
import AdminBookingsScreen from '@screens/admin/BookingsScreen';
import AdminUsersScreen from '@screens/admin/UsersScreen';

import Icon from '@components/global/icon/Icon';
import Typography from '@components/global/typography/Typography';
import { useTheme } from '@context/ThemeContext';
import { logout as logoutAction, setLoggingOut } from '@store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

// Logout Button Component
const LogoutButton: React.FC = () => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const isLoggingOut = useSelector((state: RootState) => state.user.isLoggingOut);

    const handleLogout = () => {
        console.log('handleLogout called!');
        // Test simple Alert first
        Alert.alert('Test', 'Alert working?', [
            { text: 'OK', onPress: () => console.log('Alert OK pressed') }
        ]);
        
        // Then show logout confirmation
        setTimeout(() => {
            Alert.alert(
                'Đăng xuất',
                'Bạn có chắc chắn muốn đăng xuất?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Đăng xuất',
                        style: 'destructive',
                        onPress: performLogout
                    }
                ]
            );
        }, 100);
    };

    const performLogout = async () => {
        try {
            console.log('Starting logout process...');
            
            // Set logging out state
            dispatch(setLoggingOut(true));
            console.log('Set logging out to true');
            
            // Call API logout first (like user site)
            await dispatch(logoutAction()).unwrap();
            console.log('API logout completed');
            
            // Clear AsyncStorage
            await AsyncStorage.multiRemove(['AUTH_TOKEN', 'CURRENT_USER']);
            console.log('Cleared AsyncStorage');
            
            console.log('Logout process completed');
            
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if API fails, still clear local data
            await AsyncStorage.multiRemove(['AUTH_TOKEN', 'CURRENT_USER']);
        } finally {
            // Always reset logging out state
            dispatch(setLoggingOut(false));
            console.log('Reset logging out state');
        }
    };

    return (
        <TouchableOpacity 
            onPress={handleLogout}
            disabled={isLoggingOut}
            style={{ 
                padding: 12,
                opacity: isLoggingOut ? 0.5 : 1,
                backgroundColor: theme.colors.error + '20',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.error,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 50,
                minHeight: 50
            }}
        >
            <Icon 
                name={isLoggingOut ? "hourglass-outline" : "log-out-outline"} 
                type="ion" 
                size="xl" 
                color={theme.colors.error} 
            />
        </TouchableOpacity>
    );
};

function getAdminTabIconName(routeName: string) {
    switch (routeName) {
        case 'Dashboard':
            return 'analytics-outline';
        case 'Trips':
            return 'bus-outline';
        case 'Bookings':
            return 'receipt-outline';
        case 'Users':
            return 'people-outline';
        default:
            return 'analytics-outline';
    }
}

function createAdminScreenOptions({ route }: { route: any }) {
    const { theme } = useTheme();

    return {
        headerTitle: route.name,
        headerStyle: {
            backgroundColor: theme.colors.card,
            elevation: 4,
            shadowOpacity: 0.25,
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        headerRight: () => <LogoutButton />,
        tabBarIcon: ({
            focused,
            color,
            size,
        }: {
            focused: boolean;
            color: string;
            size: number;
        }) => {
            const iconName = getAdminTabIconName(route.name);
            return <Icon name={iconName} type="ion" size="lg" color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: theme.colors.card,
        },
    };
}

export default function AdminBottomTabs() {
    return (
        <Tab.Navigator screenOptions={createAdminScreenOptions}>
            <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
            <Tab.Screen name="Trips" component={AdminTripsScreen} />
            <Tab.Screen name="Bookings" component={AdminBookingsScreen} />
            <Tab.Screen name="Users" component={AdminUsersScreen} />
        </Tab.Navigator>
    );
}
