import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import MenuItem from './MenuItem';
import Divider from '@components/global/divider/Divider';
import { useAuth } from '@hooks/useAuth';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from '@i18n/useTranslation';

const MenuSection: React.FC = ({ navigation, onClose }) => {
    const { logout } = useAuth();
    const { translate } = useTranslation();
    const animValues = useRef(new Array(7).fill(null).map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.stagger(
            100,
            animValues.map((anim) =>
                Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true })
            )
        ).start();
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const renderAnimatedItem = (anim: Animated.Value, content: JSX.Element, key: string) => {
        const animStyle = {
            opacity: anim,
            transform: [
                {
                    translateX: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                    }),
                },
            ],
        };
        return (
            <Animated.View style={animStyle} key={key}>
                {content}
            </Animated.View>
        );
    };

    return (
        <View style={{ marginBottom: 20 }}>
            {renderAnimatedItem(
                animValues[0],
                <MenuItem
                    label={translate('common.home')}
                    iconName='home-outline'
                    onPress={() => {
                        navigation.navigate('Home');
                        onClose(); // Close the drawer after navigation
                    }}
                />,
                'home'
            )}
            {renderAnimatedItem(
                animValues[1],
                <MenuItem
                    label={translate('common.myBookings')}
                    iconName='book-outline'
                    onPress={() => {
                        navigation.navigate('History');
                        onClose(); // Close the drawer
                    }}
                />,
                'bookings'
            )}
            {/* {renderAnimatedItem(
                animValues[2],
                <MenuItem
                    label="Tickets"
                    iconName="ticket-outline"
                    onPress={() => console.log('Tickets')}
                />,
                'tickets'
            )}
            {renderAnimatedItem(
                animValues[3],
                <MenuItem label="Map" iconName="map-outline" onPress={() => console.log('Map')} />,
                'map'
            )} */}

            <Divider />
            {/* {renderAnimatedItem(
                animValues[4],
                <MenuItem
                    label="Settings"
                    iconName="settings-outline"
                    onPress={() => console.log('Settings')}
                />,
                'settings'
            )}
            {renderAnimatedItem(
                animValues[5],
                <MenuItem
                    label="Help"
                    iconName="help-circle-outline"
                    onPress={() => console.log('Help')}
                />,
                'help'
            )} */}
            {renderAnimatedItem(
                animValues[6],
                <MenuItem
                    label={translate('common.logout')}
                    iconName='log-out-outline'
                    onPress={() => handleLogout()}
                />,
                'logout'
            )}
        </View>
    );
};

const styles = StyleSheet.create({});

export default MenuSection;
