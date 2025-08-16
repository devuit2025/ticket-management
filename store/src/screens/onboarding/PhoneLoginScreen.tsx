import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { FormInput } from '@components/form/FormInput';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import LoginImage from '@assets/image-actions/login.jpg';

interface PhoneLoginForm {
    phone: string;
}

export default function PhoneLoginScreen() {
    const { translate } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PhoneLoginForm>({
        defaultValues: { phone: '' },
    });

    const onSubmit = (data: PhoneLoginForm) => {
        console.log('Phone login data:', data);
        // Trigger OTP request here
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.formCard}>
                <Image source={LoginImage} style={styles.topImage} resizeMode="contain" />

                <Typography variant="h1" weight="bold" style={styles.title}>
                    {translate('login.phoneTitle') || 'Login with Phone'}
                </Typography>

                <FormInput
                    name="phone"
                    control={control}
                    label={translate('login.phone') || 'Phone Number'}
                    placeholder={translate('login.phonePlaceholder') || 'Enter your phone number'}
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                    iconName="call-outline"
                />

                <FormSubmitButton
                    title={translate('login.sendOtp') || 'Send OTP'}
                    onPress={handleSubmit(onSubmit)}
                />
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#00CAFF',
        padding: 20,
    },
    formCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 4,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    topImage: {
        width: '100%',
        height: 120,
        marginBottom: 20,
        borderRadius: 12,
    },
});
