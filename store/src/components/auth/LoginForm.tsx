import React from 'react';
import { View } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@context/ThemeContext';
import { FormInput } from '@components/form/FormInput';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import { useTranslation } from '@i18n/useTranslation';

interface LoginFormValues {
    phone: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: SubmitHandler<LoginFormValues>;
    buttonTitle?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, buttonTitle }) => {
    const { theme } = useTheme();
    const { translate } = useTranslation();

    // ✅ Yup validation with translations
    const schema = yup.object({
        phone: yup
            .string()
            .matches(/^[0-9]{10,15}$/, translate('login.phone') + ' ' + translate('common.invalid'))
            .required(translate('login.phone') + ' ' + translate('common.required')),
        password: yup
            .string()
            .required(translate('login.password') + ' ' + translate('common.required'))
            .min(6, translate('login.password') + ' ' + translate('common.min', { count: 6 })),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            phone: '',
            password: '',
        },
    });

    return (
        <View>
            <FormInput
                name="phone"
                control={control}
                label={translate('login.phone') || 'Phone Number'}
                placeholder={translate('login.phonePlaceholder') || 'Enter your phone number'}
                keyboardType="phone-pad"
                error={errors.phone?.message}
                iconName="call-outline"
            />

            {/* Password */}
            <FormInput
                name="password"
                label={translate('login.password')}
                placeholder={translate('login.passwordPlaceholder')}
                secureTextEntry
                control={control}
                error={errors.password?.message}
            />

            {/* Submit Button */}
            <FormSubmitButton
                title={buttonTitle || translate('login.signIn')}
                onPress={handleSubmit(onSubmit)}
            />
        </View>
    );
};

export default LoginForm;
