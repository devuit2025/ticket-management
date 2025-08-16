import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from '@components/global/icon/Icon';

interface MenuItemProps {
    label: string;
    iconName: string;
    onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, iconName, onPress }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <Icon name={iconName} size="md" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderRadius: 8 },
    icon: { marginRight: 12 },
    label: { fontSize: 16, color: '#333' },
});

export default MenuItem;
