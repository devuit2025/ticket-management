import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@validations/authSchema';
import { FormInput } from '@components/form/FormInput';

import { FormSubmitButton } from '@components/form/FormSubmitButton';
import { MainLayout } from '@components/layouts/MainLayout';

type LoginFormData = {
    email: string;
    password: string;
};

const LoginScreen = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        console.log('✅ Submitted Data:', data);
    };

    return (
        <MainLayout>
            <View style={styles.container}>
                <FormInput
                    name="email"
                    label="Email"
                    control={control}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter your email"
                />

                <FormInput
                    name="password"
                    label="Password"
                    control={control}
                    error={errors.password?.message}
                    secureTextEntry
                    placeholder="Password"
                />

                <FormSubmitButton
                    title="Login"
                    onPress={handleSubmit(onSubmit)}
                    isSubmitting={isSubmitting}
                />
            </View>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
});

export default LoginScreen;
