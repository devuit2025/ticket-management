import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from '@components/global/icon/Icon';
import { useTheme } from '@context/ThemeContext';
import { NavigationProp } from '@react-navigation/native';
import MenuDrawer from '@components/navigation/MenuDrawer';

interface HeaderLeftProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
    routeName: string;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({ navigation, routeName }) => {
    const { theme } = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => {
        console.log('close menu');
        setMenuVisible(false);
    };

    if (routeName === 'Home') {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
                <TouchableOpacity onPress={openMenu} style={{ padding: 6 }}>
                    <Icon name="menu-outline" size="xxl" color={theme.colors.icon} />
                </TouchableOpacity>

                <MenuDrawer visible={menuVisible} onClose={closeMenu} navigation={navigation} />
            </View>
        );
    }

    return null; // or BackButton
};

export default HeaderLeft;
