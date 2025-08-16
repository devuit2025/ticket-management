import React from 'react';
import { View, ViewStyle } from 'react-native';

interface GapProps {
    width?: number;
    height?: number;
    style?: ViewStyle; // optional extra styling
}

const Gap: React.FC<GapProps> = ({ width = 0, height = 20, style }) => {
    return <View style={[{ width, height }, style]} />;
};

export default Gap;
