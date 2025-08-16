import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Pressable,
    Image,
    Modal,
    Switch,
    TouchableWithoutFeedback,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useTranslation } from '@i18n/useTranslation';
import Icon from '@components/global/icon/Icon';
import { useTheme } from '@context/ThemeContext';

interface HeaderLeftProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
    routeName: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HeaderLeft: React.FC<HeaderLeftProps> = ({ navigation, routeName }) => {
    const { translate } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

    // Animate menu items individually
    const menuItemsAnim = useRef<Animated.Value[]>([]).current;

    // Internal user object
    const user = {
        isLoggedIn: true,
        name: 'Nguyen Van A',
        email: 'nguyen@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
    };

    const openMenu = () => {
        setMenuVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            Animated.stagger(
                50,
                menuItemsAnim.map((anim) =>
                    Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true })
                )
            ).start();
        });
    };

    const closeMenu = () => {
        Animated.timing(slideAnim, {
            toValue: -screenWidth,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setMenuVisible(false));
        menuItemsAnim.forEach((anim) => anim.setValue(0));
    };

    const renderMenuItem = (
        label: string,
        onPress: () => void,
        iconName: string,
        index: number,
        iconType: 'ion' | 'material' | 'fa' = 'ion'
    ) => {
        if (!menuItemsAnim[index]) menuItemsAnim[index] = new Animated.Value(0);

        const animStyle = {
            opacity: menuItemsAnim[index],
            transform: [
                {
                    translateX: menuItemsAnim[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                    }),
                },
            ],
        };

        return (
            <Animated.View style={animStyle} key={label}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                        onPress();
                        closeMenu();
                    }}
                    activeOpacity={0.7}
                >
                    <Icon name={iconName} type={iconType} size="md" style={styles.menuIcon} />
                    <Text style={[styles.menuItemText, { color: theme.colors.text }]}>{label}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (routeName === 'Home') {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
                    <Icon name="menu-outline" size="lg" type="ion" color={theme.colors.icon} />
                </TouchableOpacity>

                {menuVisible && (
                    <Modal visible={menuVisible} transparent animationType="none">
                        <Pressable style={styles.overlay} onPress={closeMenu}>
                            <TouchableWithoutFeedback onPress={() => {}}>
                                <Animated.View
                                    style={[
                                        styles.menuContainer,
                                        {
                                            transform: [{ translateX: slideAnim }],
                                            backgroundColor: theme.colors.background,
                                        },
                                    ]}
                                >
                                    {/* User Header */}
                                    <View style={styles.userHeader}>
                                        <Image
                                            source={{
                                                uri: user.isLoggedIn
                                                    ? user.avatarUrl
                                                    : 'https://via.placeholder.com/150',
                                            }}
                                            style={styles.avatar}
                                        />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text
                                                style={[
                                                    styles.greeting,
                                                    { color: theme.colors.secondary },
                                                ]}
                                            >
                                                {user.isLoggedIn
                                                    ? translate('common.welcome') + ','
                                                    : 'Xin Chào!'}
                                            </Text>
                                            {user.isLoggedIn && (
                                                <>
                                                    <Text
                                                        style={[
                                                            styles.username,
                                                            { color: theme.colors.text },
                                                        ]}
                                                    >
                                                        {user.name}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.email,
                                                            { color: theme.colors.secondary },
                                                        ]}
                                                    >
                                                        {user.email}
                                                    </Text>
                                                </>
                                            )}
                                        </View>
                                    </View>

                                    {/* Primary Menu */}
                                    <View style={styles.menuSection}>
                                        {renderMenuItem(
                                            'Home',
                                            () => console.log('Home'),
                                            'home-outline',
                                            0
                                        )}
                                        {user.isLoggedIn &&
                                            renderMenuItem(
                                                'My Bookings',
                                                () => console.log('Bookings'),
                                                'book-outline',
                                                1
                                            )}
                                        {renderMenuItem(
                                            'Tickets',
                                            () => console.log('Tickets'),
                                            'ticket-outline',
                                            2
                                        )}
                                        {renderMenuItem(
                                            'Map',
                                            () => console.log('Map'),
                                            'map-outline',
                                            3
                                        )}
                                    </View>

                                    {/* Divider */}
                                    <View
                                        style={[
                                            styles.divider,
                                            { backgroundColor: theme.colors.border },
                                        ]}
                                    />

                                    {/* Secondary Menu */}
                                    <View style={styles.menuSection}>
                                        {user.isLoggedIn
                                            ? renderMenuItem(
                                                  'Settings',
                                                  () => console.log('Settings'),
                                                  'settings-outline',
                                                  4
                                              )
                                            : renderMenuItem(
                                                  'Login',
                                                  () => navigation.navigate('Login'),
                                                  'log-in-outline',
                                                  4
                                              )}
                                        {renderMenuItem(
                                            'Help',
                                            () => console.log('Help'),
                                            'help-circle-outline',
                                            5
                                        )}
                                        {user.isLoggedIn &&
                                            renderMenuItem(
                                                'Logout',
                                                () => console.log('Logout'),
                                                'log-out-outline',
                                                6
                                            )}
                                    </View>

                                    {/* Divider */}
                                    <View
                                        style={[
                                            styles.divider,
                                            { backgroundColor: theme.colors.border },
                                        ]}
                                    />

                                    {/* Theme Toggle */}
                                    <View style={styles.themeToggle}>
                                        <Text
                                            style={{
                                                color: theme.colors.text,
                                                fontSize: 16,
                                                marginRight: 10,
                                            }}
                                        >
                                            {theme.isDark ? 'Dark Mode' : 'Light Mode'}
                                        </Text>
                                        <Switch
                                            value={theme.isDark}
                                            onValueChange={toggleTheme}
                                            trackColor={{ false: '#ccc', true: '#333' }}
                                            thumbColor={theme.isDark ? '#fff' : '#fff'}
                                        />
                                    </View>
                                </Animated.View>
                            </TouchableWithoutFeedback>
                        </Pressable>
                    </Modal>
                )}
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
    iconButton: { padding: 6 },
    overlay: {
        position: 'absolute',
        width: screenWidth,
        height: screenHeight,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: screenWidth * 0.75,
        height: '100%',
        paddingVertical: 30,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 1000,
    },
    userHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    avatar: { width: 60, height: 60, borderRadius: 30 },
    greeting: { fontSize: 14, color: '#888' },
    username: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    email: { fontSize: 12, color: '#666' },
    menuSection: { marginBottom: 20 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        paddingHorizontal: 4,
    },
    menuItemText: { fontSize: 16 },
    menuIcon: { marginRight: 12 },
    divider: { height: 1, marginVertical: 10 },
    themeToggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
});

export default HeaderLeft;
