import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import BackButton from './BackButton';
import Typography from '@components/global/typography/Typography';
import Avatar from '@components/global/avatar/Avatar';
import { useTranslation } from '@i18n/useTranslation';

interface HeaderLeftProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
    routeName: string;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({ navigation, routeName }) => {
    const { translate } = useTranslation();

    // Internal user object
    const user = {
        isLoggedIn: false, // false = show login
        name: 'Nguyen Van A',
        avatarUrl: 'https://i.pravatar.cc/150?img=12', // placeholder avatar
    };

    if (routeName === 'Home') {
        return (
            <View style={[styles.container]}>
                {/* Avatar */}
                {user.isLoggedIn ? (
                    <Avatar size={40} imageUrl={user.avatarUrl} />
                ) : (
                    <Avatar size={40} imageUrl="https://randomuser.me/api/portraits/men/32.jpg" />

                    // <View style={styles.avatarPlaceholder}>
                    //     <Text style={styles.avatarPlaceholderText}>?</Text>
                    // </View>
                )}

                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    {/* Greeting / Name */}
                    <View style={styles.textContainer}>
                        <Typography variant="caption">{translate('common.welcome')}</Typography>
                        {/* <Text style={styles.greeting}>
                            {translate('common.welcome')}
                        </Text> */}
                        {user.isLoggedIn && <Text style={styles.username}>{user.name}</Text>}
                    </View>

                    {/* Login Button */}
                    {!user.isLoggedIn && (
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Typography variant="body">{translate('login.title')}</Typography>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    return <BackButton navigation={navigation} />;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarPlaceholderText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: '#333',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default HeaderLeft;
