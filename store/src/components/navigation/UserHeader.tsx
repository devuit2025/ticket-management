import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from '@i18n/useTranslation';
import { useAuth } from '@hooks/useAuth';

interface UserData {
    isLoggedIn: boolean;
    name?: string;
    // email?: string;
    phone?: string;
    avatarUrl?: string;
}

const UserHeader = () => {
    const { translate } = useTranslation();
    const { getCurrentUser } = useAuth();
    const [user, setUser] = useState<UserData>({ isLoggedIn: false });

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser({
                    isLoggedIn: true,
                    name: currentUser.name,
                    // email: currentUser.email,
                    phone: currentUser.phone,
                    avatarUrl: currentUser.avatarUrl || 'https://i.pravatar.cc/150?img=12', // default avatar
                });
            }
        };
        fetchUser();
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: user.avatarUrl || 'https://i.pravatar.cc/150?img=12' }}
                style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.greeting}>
                    {user.isLoggedIn ? `${translate('common.welcome')},` : 'Xin Chào!'}
                </Text>
                {user.isLoggedIn && (
                    <>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.phone}</Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    avatar: { width: 60, height: 60, borderRadius: 30 },
    greeting: { fontSize: 14, color: '#888' },
    name: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    email: { fontSize: 12, color: '#666' },
});

export default UserHeader;
