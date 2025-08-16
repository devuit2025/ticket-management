import React, { useRef, useEffect, useState } from 'react';
import { Modal, Animated, Dimensions, Pressable, StyleSheet } from 'react-native';
import UserHeader from '@components/navigation/UserHeader';
import MenuSection from '@components/navigation/MenuSection';
import ThemeToggle from '@components/navigation/ThemeToggle';
import { NavigationProp } from '@react-navigation/native';
import Divider from '@components/global/divider/Divider';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MenuDrawerProps {
    visible: boolean;
    onClose: () => void;
    navigation: NavigationProp<Record<string, object | undefined>>;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ visible, onClose, navigation }) => {
    const [isVisible, setIsVisible] = useState(visible);
    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            ]).start();
        } else {
            // Animate out
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -screenWidth,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start(() => setIsVisible(false)); // only hide after animation
        }
    }, [visible]);

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="none">
            <Pressable style={styles.overlay} onPress={onClose}>
                {/* <Pressable onPress={() => {}} style={{ flex: 1 }}> */}
                <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                    <UserHeader />
                    <MenuSection />
                    <Divider />
                    <ThemeToggle />
                </Animated.View>
                {/* </Pressable> */}
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: screenWidth * 0.75,
        height: '100%',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
});

export default MenuDrawer;
