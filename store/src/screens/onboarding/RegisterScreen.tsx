import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';

import AuthHeader from '@components/auth/AuthHeader';
import AuthLoginOptions from '@components/auth/AuthLoginOptions';
import AuthFooter from '@components/auth/AuthFooter';
import { RegisterForm } from '@components/auth/RegisterForm';
import AuthLayout from '@components/layouts/AuthLayout';

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

    const onSubmit = (data: RegisterForm) => {
        console.log('Register data:', data);
    };

    return (
        <AuthLayout>
            <AuthHeader
                title={translate('register.title') || 'Create Account'}
                subtitle={translate('register.subtitle') || 'Sign up to get started'}
                image={require('@assets/image-actions/login.jpg')}
            />

            <RegisterForm onSubmit={onSubmit}></RegisterForm>

            <AuthLoginOptions />

            <AuthFooter
                text={translate('register.haveAccount') || 'Already have an account?'}
                actionText={translate('login.title') || 'Login'}
            />
        </AuthLayout>
    );
}
