import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '@screens/home';
import HistoryScreen from '@screens/orders/MyTicketsScreen';
import CheckoutScreen from '@screens/booking/ReviewBookingScreen';
import NotificationScreen from '@screens/support/NotificationsScreen';
import AccountScreen from '@screens/profile/MyAccountScreen';

import HeaderLeft from '@components/navigation/HeaderLeft';
import ProfileIcon from '@components/navigation/ProfileIcon';
import Icon from '@components/global/icon/Icon';
import { useTheme } from '@context/ThemeContext';

const Tab = createBottomTabNavigator();

function getTabIconName(routeName: string) {
    switch (routeName) {
        case 'Home':
            return 'home';
        case 'History':
            return 'time';
        case 'Checkout':
            return 'cart';
        case 'Notifications':
            return 'notifications';
        case 'Account':
            return 'person';
        default:
            return 'home';
    }
}

function createScreenOptions({ route, navigation }: { route: any; navigation: any }) {
    const { theme } = useTheme();

    return {
        headerTitle: '',
        headerLeft: () => <HeaderLeft navigation={navigation} routeName={route.name} />,
        headerRight: () => <ProfileIcon />,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            const iconName = getTabIconName(route.name);
            return <Icon name={iconName} size="lg" />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
    };
}

export default function BottomTabs() {
    return (
        <Tab.Navigator screenOptions={createScreenOptions}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Checkout" component={CheckoutScreen} />
            <Tab.Screen name="Notifications" component={NotificationScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
}
