import React, { useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useTranslation } from '@i18n/useTranslation';
import AuthLayout from '@components/layouts/AuthLayout';
import AuthHeader from '@components/auth/AuthHeader';
import LoginForm from '@components/auth/LoginForm';
import AuthLoginOptions from '@components/auth/AuthLoginOptions';
import AuthFooter from '@components/auth/AuthFooter';
import { useAuth } from '@hooks/useAuth';
import type { LoginRequest } from '@types/auth';

interface LoginScreenProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const { translate } = useTranslation();
    const { login, isLoading, error } = useAuth();

    const onSubmit = async (data: LoginRequest) => {
        await login(data);
        // navigation.navigate('Home');
    };

    return (
        <AuthLayout>
            <AuthHeader
                title={translate('login.title') || 'Welcome Back'}
                image={require('@assets/image-actions/login.jpg')}
            />

            <LoginForm onSubmit={onSubmit} />

            <AuthLoginOptions />

            <AuthFooter
                text={translate('login.noAccount') || "Don't have an account?"}
                actionText={translate('login.signUp') || 'Sign Up'}
                actionRoute="Register"
            />
        </AuthLayout>
    );
}
