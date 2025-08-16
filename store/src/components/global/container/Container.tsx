import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

interface ContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    withPadding?: boolean; // optional prop to add horizontal padding
}

const Container: React.FC<ContainerProps> = ({ children, style, withPadding = true }) => {
    return (
        <View
            style={[
                {
                    flex: 1,
                    width: '100%',
                    alignSelf: 'center',
                    maxWidth: 1200, // optional max width like web container
                    paddingHorizontal: withPadding ? 16 : 0, // similar to web padding
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

export default Container;
