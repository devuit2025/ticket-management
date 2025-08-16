import React from 'react';
import { MainLayout } from '@components/layouts/MainLayout';
import { FormInput } from '@components/form/FormInput';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { ScrollView, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import Gap from '@components/global/gap/Gap';
import Icon from '@components/global/icon/Icon';
import LoginImage from '@assets/image-actions/login.jpg';
interface LoginForm {
    email: string;
    password: string;
}

export default function LoginScreen() {
    const { translate } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = (data: LoginForm) => {
        console.log('Login data:', data);
        // Handle login logic here
    };

    const handleSocialLogin = (type: 'phone' | 'facebook' | 'google') => {
        console.log('Social login:', type);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={LoginImage} // replace with your image path
                style={styles.topImage}
                resizeMode="contain"
            />

            <Card style={styles.formCard}>
                <Typography variant="h1" weight="bold" style={styles.title}>
                    {translate('login.title') || 'Welcome Back'}
                </Typography>

                <FormInput
                    name="email"
                    control={control}
                    label={translate('login.email') || 'Email'}
                    placeholder={translate('login.emailPlaceholder') || 'Enter your email'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                    iconName="mail-outline"
                />

                <FormInput
                    name="password"
                    control={control}
                    label={translate('login.password') || 'Password'}
                    placeholder={translate('login.passwordPlaceholder') || 'Enter your password'}
                    secureTextEntry
                    error={errors.password?.message}
                    iconName="lock-closed-outline"
                />

                <FormSubmitButton
                    title={translate('login.button') || 'Sign In'}
                    onPress={handleSubmit(onSubmit)}
                />

                <Typography
                    variant="body"
                    color="gray"
                    style={{ textAlign: 'center', marginVertical: 10 }}
                >
                    -- Or --
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
                    {translate('login.noAccount') || "Don't have an account?"}{' '}
                    <Typography variant="body" color="primary" weight="bold">
                        {translate('login.signUp') || 'Sign Up'}
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
        backgroundColor: 'white', // light blue background
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 20,
    },
    formCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    socialRow: {
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
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
        height: 120, // adjust height as needed
        marginBottom: 20, // spacing between image and title
        borderRadius: 12, // optional: rounded corners
    },
});
