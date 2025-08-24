import React from 'react';
import { View, Button } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@context/ThemeContext';
import { FormInput } from '@components/form/FormInput';

interface RegisterFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: SubmitHandler<RegisterFormValues>;
  buttonTitle?: string;
}

// ✅ Define Yup schema
const schema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Phone must be 10–15 digits'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  buttonTitle = 'Sign Up',
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema), // ✅ use Yup schema
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { theme } = useTheme();

  return (
    <View style={{ padding: theme.spacing.md }}>
      {/* Full Name */}
      <FormInput
        name="fullName"
        label="Full Name"
        placeholder="Enter your full name"
        control={control}
        error={errors.fullName?.message}
      />

      {/* Email */}
      <FormInput
        name="email"
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        control={control}
        error={errors.email?.message}
      />

      {/* Phone */}
      <FormInput
        name="phone"
        label="Phone Number"
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        control={control}
        error={errors.phone?.message}
      />

      {/* Password */}
      <FormInput
        name="password"
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        control={control}
        error={errors.password?.message}
      />

      {/* Confirm Password */}
      <FormInput
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Re-enter your password"
        secureTextEntry
        control={control}
        error={errors.confirmPassword?.message}
      />

      <Button title={buttonTitle} onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
