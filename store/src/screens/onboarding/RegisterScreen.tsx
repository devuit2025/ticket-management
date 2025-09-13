import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';

import AuthHeader from '@components/auth/AuthHeader';
import AuthLoginOptions from '@components/auth/AuthLoginOptions';
import AuthFooter from '@components/auth/AuthFooter';
import { RegisterForm } from '@components/auth/RegisterForm';
import AuthLayout from '@components/layouts/AuthLayout';
import { RegisterRequest } from '@types/auth';
import { register } from '@api/auth';

interface RegisterForm {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterScreen({ navigation }) {
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
        handleRegister(data);
    };

    const handleRegister = async (data) => {
        // Map form values to your API request
        const payload: RegisterRequest = {
            name: data.fullName,
            phone: data.phone,
            password: data.password,
        };

        const response = await register(payload);

        // Navigate to login or home
        navigation.navigate('Login');
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
