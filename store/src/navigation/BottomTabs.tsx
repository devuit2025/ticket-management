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
import { SelectPickupDropoffScreen } from '@screens/booking';
import HeaderRightLanguageSwitcher from '@components/navigation/HeaderRightLanguageSwitcher';

const Tab = createBottomTabNavigator();

function getTabIconName(routeName: string) {
    switch (routeName) {
        case 'Home':
            return 'home-outline';
        case 'History':
            return 'time-outline';
        case 'Checkout':
            return 'cart-outline';
        case 'Notifications':
            return 'notifications-outline';
        case 'Account':
            return 'person-outline';
        default:
            return 'home-outline';
    }
}

function createScreenOptions({ route, navigation }: { route: any; navigation: any }) {
    const { theme } = useTheme();

    return {
        headerTitle: '',
        headerLeft: () => <HeaderLeft navigation={navigation} routeName={route.name} />,
        headerRight: () => <HeaderRightLanguageSwitcher />,
        tabBarIcon: ({
            focused,
            color,
            size,
        }: {
            focused: boolean;
            color: string;
            size: number;
        }) => {
            const iconName = getTabIconName(route.name);

            return <Icon name={iconName} type="ion" size="lg" color={color} />;
        },

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
            borderTopWidth: 0, // removes top border
            elevation: 0, // removes shadow on Android
            shadowOpacity: 0, // removes shadow on iOS
            backgroundColor: theme.colors.card, // match your theme
        },
    };
}

export default function BottomTabs() {
    return (
        <Tab.Navigator screenOptions={createScreenOptions}>
            <Tab.Screen name="Home" component={SelectPickupDropoffScreen} />
            {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Checkout" component={CheckoutScreen} />
            <Tab.Screen name="Notifications" component={NotificationScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
}
