import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Typography from '@components/global/typography/Typography';

interface AuthFooterProps {
    text: string;
    actionText: string;
    actionRoute?: string; // optional route, default to "/login"
}

const AuthFooter: React.FC<AuthFooterProps> = ({
    text,
    actionText,
    actionRoute = 'Login', // use your React Navigation route name
}) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate(actionRoute as never); // cast to `never` to satisfy TS
    };

    return (
        <View style={styles.container}>
            <Typography variant="body">
                {text}{' '}
                <Pressable onPress={handlePress}>
                    <Typography variant="body" color="primary" weight="bold">
                        {actionText}
                    </Typography>
                </Pressable>
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
});

export default AuthFooter;
