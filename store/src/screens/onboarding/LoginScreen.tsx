import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from '@i18n/useTranslation';
import { NavigationProp } from '@react-navigation/native';
import AuthLayout from '@components/layouts/AuthLayout';
import AuthHeader from '@components/auth/AuthHeader';
import AuthForm from '@components/auth/AuthForm';
import AuthLoginOptions from '@components/auth/AuthLoginOptions';
import AuthFooter from '@components/auth/AuthFooter';


interface LoginForm {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

interface LoginScreenProps {
  navigation: NavigationProp<Record<string, object | undefined>>;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { translate } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    console.log('Login data:', data);
    navigation.navigate('Home');
  };

  const handleSocialLogin = (type: 'phone' | 'facebook' | 'google') => {
    console.log('Social login:', type);
  };

  return (
    <AuthLayout>
      <AuthHeader
        title={translate('login.title') || 'Welcome Back'}
        image={require('@assets/image-actions/login.jpg')}
      />

      <AuthForm
        control={control}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        buttonTitle={translate('login.button') || 'Sign In'}
        labels={{
          email: translate('login.email') || 'Email',
          password: translate('login.password') || 'Password',
          emailPlaceholder: translate('login.emailPlaceholder') || 'Enter your email',
          passwordPlaceholder: translate('login.passwordPlaceholder') || 'Enter your password',
        }}
      />

      <AuthLoginOptions onSocialLogin={handleSocialLogin} />

      <AuthFooter
        text={translate('login.noAccount') || "Don't have an account?"}
        actionText={translate('login.signUp') || 'Sign Up'}
      />
    </AuthLayout>
  );
}
