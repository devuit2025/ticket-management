import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@validations/authSchema';
import { FormInput } from '@components/form/FormInput';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { FormSubmitButton } from '@components/form/FormSubmitButton';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

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
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
});

export default LoginScreen;
