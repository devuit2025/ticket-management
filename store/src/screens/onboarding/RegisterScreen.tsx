import React from 'react';
import { StyleSheet, ScrollView, Image, View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { FormInput } from '@components/form/FormInput';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import Gap from '@components/global/gap/Gap';
import LoginImage from '@assets/image-actions/login.jpg';
import Icon from '@components/global/icon/Icon';

interface RegisterForm {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterScreen() {
    const { translate } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });
    const handleSocialLogin = (type: 'phone' | 'facebook' | 'google') => {
        console.log('Social login:', type);
    };

    const onSubmit = (data: RegisterForm) => {
        console.log('Register data:', data);
        // Handle registration logic here
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.formCard}>
                <Image source={LoginImage} style={styles.topImage} resizeMode="contain" />

                <Typography variant="h1" weight="bold" style={styles.title}>
                    {translate('register.title') || 'Create Account'}
                </Typography>

                <Typography variant="body" color="gray" style={styles.subtitle}>
                    {translate('register.subtitle') || 'Sign up to get started'}
                </Typography>

                <FormInput
                    name="fullName"
                    control={control}
                    label={translate('register.fullName') || 'Full Name'}
                    placeholder={
                        translate('register.fullNamePlaceholder') || 'Enter your full name'
                    }
                    error={errors.fullName?.message}
                    iconName="person-outline"
                />

                <FormInput
                    name="email"
                    control={control}
                    label={translate('register.email') || 'Email'}
                    placeholder={translate('register.emailPlaceholder') || 'Enter your email'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                    iconName="mail-outline"
                />

                <FormInput
                    name="phone"
                    control={control}
                    label={translate('register.phone') || 'Phone Number'}
                    placeholder={
                        translate('register.phonePlaceholder') || 'Enter your phone number'
                    }
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                    iconName="call-outline"
                />

                <FormInput
                    name="password"
                    control={control}
                    label={translate('register.password') || 'Password'}
                    placeholder={translate('register.passwordPlaceholder') || 'Enter your password'}
                    secureTextEntry
                    error={errors.password?.message}
                    iconName="lock-closed-outline"
                />

                <FormInput
                    name="confirmPassword"
                    control={control}
                    label={translate('register.confirmPassword') || 'Confirm Password'}
                    placeholder={
                        translate('register.confirmPasswordPlaceholder') || 'Re-enter your password'
                    }
                    secureTextEntry
                    error={errors.confirmPassword?.message}
                    iconName="lock-closed-outline"
                />

                <FormSubmitButton
                    title={translate('register.button') || 'Sign Up'}
                    onPress={handleSubmit(onSubmit)}
                />

                <Typography
                    variant="body"
                    color="gray"
                    style={{ textAlign: 'center', marginVertical: 10 }}
                >
                    -- Or sign up with --
                </Typography>

                <View style={styles.socialRow}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin('phone')}
                    >
                        <Icon name="call-outline" size="xxl" color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin('facebook')}
                    >
                        <Icon name="facebook" type="fa" size="xxl" color="#1877F2" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin('google')}
                    >
                        <Icon name="google" type="mc" size="xxl" color="#DB4437" />
                    </TouchableOpacity>
                </View>
            </Card>

            <Gap size={20} />

            <View style={styles.bottomTextContainer}>
                <Typography variant="body">
                    {translate('register.haveAccount') || 'Already have an account?'}{' '}
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
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 8,
    },
    socialButton: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#E6F0FA',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    bottomTextContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    topImage: {
        width: '100%',
        height: 120,
        marginBottom: 20,
        borderRadius: 12,
    },
});
