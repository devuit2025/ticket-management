import React from 'react';
import { View, Button } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@context/ThemeContext';
import { FormInput } from '@components/form/FormInput';
import { useTranslation } from '@i18n/useTranslation';
import { FormSubmitButton } from '@components/form/FormSubmitButton';

interface RegisterFormValues {
    fullName: string;
    // email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface RegisterFormProps {
    onSubmit: SubmitHandler<RegisterFormValues>;
    buttonTitle?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, buttonTitle }) => {
    const { theme } = useTheme();
    const { translate } = useTranslation();

    // ✅ Define Yup schema with translated messages
    const schema = yup.object({
        fullName: yup
            .string()
            .required(translate('register.fullName') + ' ' + translate('common.required'))
            .min(2, translate('register.fullName') + ' ' + translate('common.min', { count: 2 })),
        // email: yup
        //     .string()
        //     .email(translate('register.email') + ' ' + translate('common.invalid'))
        //     .required(translate('register.email') + ' ' + translate('common.required')),
        phone: yup
            .string()
            .required(translate('register.phone') + ' ' + translate('common.required'))
            .matches(
                /^[0-9]{10,15}$/,
                translate('register.phone') + ' ' + translate('common.phoneDigits')
            ),
        password: yup
            .string()
            .required(translate('register.password') + ' ' + translate('common.required'))
            .min(6, translate('register.password') + ' ' + translate('common.min', { count: 6 })),
        confirmPassword: yup
            .string()
            .oneOf(
                [yup.ref('password')],
                translate('register.confirmPassword') + ' ' + translate('common.passwordMismatch')
            )
            .required(translate('register.confirmPassword') + ' ' + translate('common.required')),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });

    return (
        <View>
            {/* Full Name */}
            <FormInput
                name="fullName"
                label={translate('register.fullName')}
                placeholder={translate('register.fullNamePlaceholder')}
                control={control}
                error={errors.fullName?.message}
            />

            {/* Email */}
            {/* <FormInput
                name="email"
                label={translate('register.email')}
                placeholder={translate('register.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                control={control}
                error={errors.email?.message}
            /> */}

            {/* Phone */}
            <FormInput
                name="phone"
                label={translate('register.phone')}
                placeholder={translate('register.phonePlaceholder')}
                keyboardType="phone-pad"
                control={control}
                error={errors.phone?.message}
            />

            {/* Password */}
            <FormInput
                name="password"
                label={translate('register.password')}
                placeholder={translate('register.passwordPlaceholder')}
                secureTextEntry
                control={control}
                error={errors.password?.message}
            />

            {/* Confirm Password */}
            <FormInput
                name="confirmPassword"
                label={translate('register.confirmPassword')}
                placeholder={translate('register.confirmPasswordPlaceholder')}
                secureTextEntry
                control={control}
                error={errors.confirmPassword?.message}
            />

            <FormSubmitButton
                title={buttonTitle || translate('register.button')}
                onPress={handleSubmit(onSubmit)}
            />
        </View>
    );
};
