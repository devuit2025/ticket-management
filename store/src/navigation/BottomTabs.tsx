import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HistoryScreen from '@screens/orders/MyTicketsScreen';
import AccountScreen from '@screens/profile/MyAccountScreen';

import HeaderLeft from '@components/navigation/HeaderLeft';
import Icon from '@components/global/icon/Icon';
import { useTheme } from '@context/ThemeContext';
import { SelectPickupDropoffScreen } from '@screens/booking';
import HeaderRightLanguageSwitcher from '@components/navigation/HeaderRightLanguageSwitcher';
import { StyleSheet } from 'react-native';
import { useTranslation } from '@i18n/useTranslation';

const Tab = createBottomTabNavigator();

function getTabIconName(routeName: string) {
    switch (routeName) {
        case 'Home':
            return 'home-outline';
        case 'History':
            return 'time-outline';
        case 'Checkout':
            return 'cart-outline';
        // case 'Notifications':
        //     return 'notifications-outline';
        case 'Account':
            return 'person-outline';
        default:
            return 'home-outline';
    }
}

function createScreenOptions({ route, navigation }: { route: any; navigation: any }) {
    const { theme } = useTheme();

    const showHeader = route.name !== 'Home'; // Only show header if NOT Home

    return {
        headerTitle: '',
        headerLeft: () => <HeaderLeft navigation={navigation} routeName={route.name} />,
        headerRight: () => <HeaderRightLanguageSwitcher />,
        headerStyle: {
            backgroundColor: showHeader ? theme.colors.card : 'transparent',
            elevation: showHeader ? 4 : 0,
            shadowOpacity: showHeader ? 0.25 : 0,
            borderBottomWidth: showHeader ? StyleSheet.hairlineWidth : 0,
        },
        headerTransparent: !showHeader,
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
    const { translate } = useTranslation()

    return (
        <Tab.Navigator screenOptions={createScreenOptions}>
<Tab.Screen
  name="Home"
  component={SelectPickupDropoffScreen}
  options={{ title: translate('tabs.home') }}
/>
<Tab.Screen
  name="History"
  component={HistoryScreen}
  options={{ title: translate('tabs.history') }}
/>
{/* <Tab.Screen
  name="Checkout"
  component={CheckoutScreen}
  options={{ title: translate('tabs.checkout') }}
/> */}
{/* <Tab.Screen
  name="Notifications"
  component={NotificationScreen}
  options={{ title: translate('tabs.notifications') }}
/> */}
<Tab.Screen
  name="Account"
  component={AccountScreen}
  options={{ title: translate('tabs.account') }}
/>
        </Tab.Navigator>
    );
}
