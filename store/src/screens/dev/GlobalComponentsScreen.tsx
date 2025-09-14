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
                    <Button title={translate('common.bookNow')} />
                    <Button title={translate('common.cancel')} variant="secondary" />
                    <Button title={translate('common.moreInfo')} variant="outline" />
                    <Button title={translate('common.loading')} loading />
                    <Button title={translate('common.disabled')} disabled />
                </View>
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={styles.heading}>TextInput</Text>

                {/* Basic TextInput */}
                <TextInput
                    label={translate('common.sampleInput')}
                    placeholder={translate('common.enterSomething')}
                    value={text}
                    onChangeText={setText}
                />

                {/* TextInput with helper text */}
                <TextInput
                    label={translate('login.email')}
                    placeholder={translate('common.emailExample')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    helperText="We'll never share your email."
                />

                {/* Password input */}
                <TextInput
                    label={translate('login.password')}
                    placeholder={translate('common.enterPassword')}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* TextInput showing error */}
                <TextInput
                    label={translate('common.errorInput')}
                    placeholder={translate('common.trySomething')}
                    value={errorInput}
                    onChangeText={setErrorInput}
                    error={errorInput.length < 5 ? translate('common.minimumCharacters') : undefined}
                />

                {/* Multiline input */}
                <TextInput
                    label={translate('common.multilineInput')}
                    placeholder={translate('common.typeMessage')}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: 'top' }}
                />
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={[styles.heading, { marginBottom: 20 }]}>Typography</Text>

                <Typography variant="h1" weight="bold" style={{ marginBottom: 10 }}>
                    {translate('common.welcomeTitle')}
                </Typography>

                <Typography variant="h2" weight="bold" style={{ marginBottom: 10 }}>
                    {translate('common.welcomeTitle')}
                </Typography>

                <Typography variant="h3" weight="bold" style={{ marginBottom: 10 }}>
                    {translate('common.welcomeTitle')}
                </Typography>

                <Typography variant='body' style={{ marginBottom: 10 }}>
                    {translate('common.planningTrip')}
                </Typography>

                <Typography variant="caption" weight="medium" color="#888" style={{ marginTop: 8 }}>
                    {translate('common.refundPolicy')}
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
                        <Text style={styles.iconLabel}>{translate('common.homeIcon')}</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="person" type="material" color="#FF6B00" />
                        <Text style={styles.iconLabel}>{translate('common.profileIcon')}</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="bus" type="fa" size="lg" />
                        <Text style={styles.iconLabel}>{translate('common.busIcon')}</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="credit-card" type="fa" size="md" />
                        <Text style={styles.iconLabel}>{translate('common.paymentIcon')}</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="calendar-outline" type="ion" />
                        <Text style={styles.iconLabel}>{translate('common.scheduleIcon')}</Text>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="help-circle-outline" type="ion" />
                        <Text style={styles.iconLabel}>{translate('common.helpIcon')}</Text>
                    </View>
                </View>
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={styles.heading}>Card</Text>

                <Card>
                    <Typography variant="h3" weight="bold">
                        {translate('common.saigonDalat')}
                    </Typography>
                    <Typography variant="body" style={{ marginTop: 4 }}>
                        {translate('common.departureInfo')}
                    </Typography>
                </Card>

                <Card bordered style={{ marginTop: 16 }}>
                    <Typography variant="body">{translate('common.passengerInfo')}</Typography>
                    <Typography variant="caption" color="#888" style={{ marginTop: 4 }}>
                        {translate('common.seatPayment')}
                    </Typography>
                </Card>
            </View>
            <Divider />
            <View style={styles.section}>
                <Text style={styles.heading}>Modal</Text>
                {/* Trigger modal */}
                <Button title={translate('common.openModal')} onPress={() => setModalVisible(true)} />
                <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <Text>{translate('common.modalContent')}</Text>
                    <Button title={translate('common.closeModal')} onPress={() => setModalVisible(false)} />
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
