import React from 'react';
import { StyleSheet, ScrollView, Image, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { FormInput } from '@components/form/FormInput';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import Gap from '@components/global/gap/Gap';
import LoginImage from '@assets/image-actions/login.jpg';

interface ForgotPasswordForm {
    emailOrPhone: string;
}

export default function ForgotPasswordScreen() {
    const { translate } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        defaultValues: { emailOrPhone: '' },
    });

    const onSubmit = (data: ForgotPasswordForm) => {
        console.log('Forgot password request for:', data);
        // Handle sending OTP or reset link
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.formCard}>
                <Image source={LoginImage} style={styles.topImage} resizeMode="contain" />

                <Typography variant="h1" weight="bold" style={styles.title}>
                    {translate('forgotPassword.title') || 'Forgot Password'}
                </Typography>

                <Typography variant="body" color="gray" style={styles.subtitle}>
                    {translate('forgotPassword.subtitle') ||
                        'Enter your email or phone to reset your password'}
                </Typography>

                <FormInput
                    name="emailOrPhone"
                    control={control}
                    label={translate('forgotPassword.emailOrPhone') || 'Email or Phone'}
                    placeholder={
                        translate('forgotPassword.emailOrPhonePlaceholder') ||
                        'Enter your email or phone'
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.emailOrPhone?.message}
                    iconName="mail-outline"
                />

                <FormSubmitButton
                    title={translate('forgotPassword.button') || 'Send OTP'}
                    onPress={handleSubmit(onSubmit)}
                />
            </Card>

            <Gap size={20} />

            <View style={styles.bottomTextContainer}>
                <Typography variant="body">
                    {translate('forgotPassword.rememberPassword') || 'Remember your password?'}{' '}
                    <Typography variant="body" color="primary" weight="bold">
                        {translate('login.title') || 'Login'}
                    </Typography>
                </Typography>
            </View>
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
        marginBottom: 4,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 20,
    },
    topImage: {
        width: '100%',
        height: 120,
        marginBottom: 20,
        borderRadius: 12,
    },
    bottomTextContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});
