import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from '@i18n/useTranslation';

const user = {
    isLoggedIn: true,
    name: 'Nguyen Van A',
    email: 'nguyen@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
};

const UserHeader = () => {
    const { translate } = useTranslation();

    return (
        <View style={styles.container}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.greeting}>
                    {user.isLoggedIn ? translate('common.welcome') + ',' : 'Xin Chào!'}
                </Text>
                {user.isLoggedIn && (
                    <>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.email}</Text>
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
