import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { FormInput } from '@components/form/FormInput';
import { FormSubmitButton } from '@components/form/FormSubmitButton';

interface AuthFormProps {
  control: Control<any>;
  errors: FieldErrors;
  onSubmit: () => void;
  buttonTitle: string;
  labels: {
    email: string;
    password: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
  };
}

const AuthForm: React.FC<AuthFormProps> = ({ control, errors, onSubmit, buttonTitle, labels }) => (
  <>
    <FormInput
      name="email"
      control={control}
      label={labels.email}
      placeholder={labels.emailPlaceholder}
      keyboardType="email-address"
      autoCapitalize="none"
      error={errors.email?.message as string}
    />

    <FormInput
      name="password"
      control={control}
      label={labels.password}
      placeholder={labels.passwordPlaceholder}
      secureTextEntry
      error={errors.password?.message as string}
    />

    <FormSubmitButton title={buttonTitle} onPress={onSubmit} />
  </>
);

export default AuthForm;
