import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput as RNTextInput } from 'react-native';

// Import your global components
import Button from '@components/global/button/Button';
import Card from '@components/global/card/Card';

import TextInput from '@components/global/textinput/TextInput';
import Typography from '@components/global/typography/Typography';
import Icon from '@components/global/icon/Icon';
import Modal from '@components/global/modal/Modal';
import Divider from '@components/global/divider/Divider';
import Avatar from '@components/global/avatar/Avatar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { useTranslation } from '@i18n/useTranslation';
import Loader from './Loader';

type GlobalComponentsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'GlobalComponents'
>;

const GlobalComponentsScreen = () => {
    const { translate } = useTranslation();

    const [modalVisible, setModalVisible] = useState(false);

    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorInput, setErrorInput] = useState('');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{translate('common.welcome')}</Text>

            <View style={styles.section}>
                <Text style={styles.heading}>Button</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    <Button title="Book Now" />
                    <Button title="Cancel" variant="secondary" />
                    <Button title="More Info" variant="outline" />
                    <Button title="Loading..." loading />
                    <Button title="Disabled" disabled />
                </View>
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={styles.heading}>TextInput</Text>

                {/* Basic TextInput */}
                <TextInput
                    label="Sample Input"
                    placeholder="Enter something..."
                    value={text}
                    onChangeText={setText}
                />

                {/* TextInput with helper text */}
                <TextInput
                    label="Email"
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    helperText="We'll never share your email."
                />

                {/* Password input */}
                <TextInput
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* TextInput showing error */}
                <TextInput
                    label="Error input"
                    placeholder="Try something"
                    value={errorInput}
                    onChangeText={setErrorInput}
                    error={errorInput.length < 5 ? 'Minimum 5 characters required' : undefined}
                />

                {/* Multiline input */}
                <TextInput
                    label="Multiline Input"
                    placeholder="Type your message"
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: 'top' }}
                />
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={[styles.heading, { marginBottom: 20 }]}>Typography</Text>

                <Typography variant="h1" weight="bold" style={{ marginBottom: 10 }}>
                    Welcome to Phuong Trang Tickets
                </Typography>

                <Typography variant="h2" weight="bold" style={{ marginBottom: 10 }}>
                    Welcome to Phuong Trang Tickets
                </Typography>

                <Typography variant="h3" weight="bold" style={{ marginBottom: 10 }}>
                    Welcome to Phuong Trang Tickets
                </Typography>

                <Typography variant="body" style={{ marginBottom: 10 }}>
                    Planning your trip has never been easier. Browse our extensive list of bus
                    routes and schedules, select the best seat for your comfort, and book your
                    ticket securely within minutes. Whether you're traveling for business or
                    leisure, we ensure a smooth and safe journey with our modern fleet and
                    professional drivers. Enjoy exclusive offers and real-time updates on your trip
                    status right from your device.
                </Typography>

                <Typography variant="caption" weight="medium" color="#888" style={{ marginTop: 8 }}>
                    * Tickets are refundable up to 24 hours before departure. Please check our
                    refund policy for details.
                </Typography>
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={[styles.heading, { marginBottom: 12 }]}>Icon Examples</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <View style={styles.iconItem}>
                        <Icon name="home-outline" type="ion" size="lg" />
                        <Text style={styles.iconLabel}>Home</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="person" type="material" color="#FF6B00" />
                        <Text style={styles.iconLabel}>Profile</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="bus" type="fa" size="lg" />
                        <Text style={styles.iconLabel}>Bus</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="credit-card" type="fa" size="md" />
                        <Text style={styles.iconLabel}>Payment</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="calendar-outline" type="ion" />
                        <Text style={styles.iconLabel}>Schedule</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="help-circle-outline" type="ion" />
                        <Text style={styles.iconLabel}>Help</Text>
                    </View>
                </View>
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={styles.heading}>Card</Text>

                <Card>
                    <Typography variant="h3" weight="bold">
                        Saigon → Da Lat
                    </Typography>
                    <Typography variant="body" style={{ marginTop: 4 }}>
                        Departure: 10:00 AM · Duration: 6h 30m · Price: 250,000đ
                    </Typography>
                </Card>

                <Card bordered style={{ marginTop: 16 }}>
                    <Typography variant="body">Passenger: Nguyen Van A</Typography>
                    <Typography variant="caption" color="#888" style={{ marginTop: 4 }}>
                        Seat: B12 · Payment: Momo
                    </Typography>
                </Card>
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={styles.heading}>Modal</Text>
                {/* Trigger modal */}
                <Button title="Open Modal" onPress={() => setModalVisible(true)} />
                <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <Text>This is a modal content</Text>
                    <Button title="Close Modal" onPress={() => setModalVisible(false)} />
                </Modal>
            </View>

            <View style={styles.section}>
                <Text style={styles.heading}>Loader</Text>
                <Loader />
            </View>

            <View style={styles.section}>
                <Text style={styles.heading}>Divider</Text>
                <Divider />
            </View>

            <View style={styles.section}>
                <Text style={styles.heading}>Avatar</Text>

                <View style={{ flexDirection: 'row', gap: 16, padding: 16 }}>
                    <Avatar size={64} imageUrl="https://randomuser.me/api/portraits/men/32.jpg" />
                    <Avatar size={48} initials="LT" borderColor="#FF6B00" />
                    <Avatar size={40} initials="HN" showStatus statusOnline />
                    <Avatar size={40} initials="NH" showStatus statusOnline={false} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    iconItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        marginBottom: 16,
    },
    iconLabel: {
        marginTop: 6,
        fontSize: 12,
        color: '#444',
        fontFamily: 'inter-Regular',
    },
});

export default GlobalComponentsScreen;
