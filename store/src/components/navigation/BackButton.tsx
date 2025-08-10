import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface BackButtonProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
}

const BackButton: React.FC<BackButtonProps> = ({ navigation }) => (
    <Ionicons
        name="arrow-back"
        size={24}
        color="#007AFF"
        style={{ marginLeft: 15 }}
        onPress={() => navigation.goBack()}
    />
);

export default BackButton;
