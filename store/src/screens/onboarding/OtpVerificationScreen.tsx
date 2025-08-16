import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import LoginImage from '@assets/image-actions/login.jpg';
import Gap from '@components/global/gap/Gap';

interface OtpForm {
    otp1: string;
    otp2: string;
    otp3: string;
    otp4: string;
    otp5: string;
    otp6: string;
}

export default function OtpVerificationScreen() {
    const { translate } = useTranslation();
    const { control, handleSubmit, setValue } = useForm<OtpForm>({
        defaultValues: { otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' },
    });

    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setResendDisabled] = useState(true);

    useEffect(() => {
        if (timer <= 0) {
            setResendDisabled(false);
            return;
        }
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const onSubmit = (data: OtpForm) => {
        const otpCode = Object.values(data).join('');
        console.log('OTP entered:', otpCode);
        // Verify OTP logic here
    };

    const handleResendOtp = () => {
        console.log('Resend OTP triggered');
        // Trigger resend OTP API here
        setTimer(60);
        setResendDisabled(true);
    };

    const handleChangePhone = () => {
        console.log('Change phone number triggered');
        // Navigate back to phone login screen
    };

    const handleInputChange = (text: string, index: number, onChange: (val: string) => void) => {
        let value = text;
        if (value.length > 1) value = value.slice(-1); // keep only last digit
        onChange(value);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const values = useWatch({ control });

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (!values[`otp${index + 1}`]) {
                if (index > 0) {
                    inputRefs.current[index - 1]?.focus();
                    setValue(`otp${index}`, ''); // clear current box if needed
                }
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.formCard}>
                <Image source={LoginImage} style={styles.topImage} resizeMode="contain" />

                <Typography variant="h1" weight="bold" style={styles.title}>
                    {translate('login.verifyOtp') || 'Verify OTP'}
                </Typography>

                <Typography variant="body" color="gray" style={styles.subtitle}>
                    {translate('login.otpSent') || 'We have sent an OTP to your phone number'}
                </Typography>

                <View style={styles.otpContainer}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Controller
                            key={index}
                            control={control}
                            name={`otp${index + 1}` as keyof OtpForm}
                            render={({ field: { value, onChange } }) => (
                                <TextInput
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    style={styles.otpInput}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={value}
                                    onChangeText={(text) =>
                                        handleInputChange(text, index, onChange)
                                    }
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    textAlign="center"
                                    selectionColor="#007AFF"
                                />
                            )}
                        />
                    ))}
                </View>

                <FormSubmitButton
                    title={translate('login.verify') || 'Verify'}
                    onPress={handleSubmit(onSubmit)}
                    style={{ marginTop: 20 }}
                />

                <View style={styles.actionsRow}>
                    <TouchableOpacity disabled={isResendDisabled} onPress={handleResendOtp}>
                        <Typography
                            variant="body"
                            color={isResendDisabled ? 'gray' : 'primary'}
                            weight="bold"
                        >
                            {isResendDisabled
                                ? `${translate('login.resendOtp') || 'Resend OTP'} (${timer}s)`
                                : translate('login.resendOtp') || 'Resend OTP'}
                        </Typography>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleChangePhone}>
                        <Typography variant="body" color="primary" weight="bold">
                            {translate('login.changePhone') || 'Change Phone'}
                        </Typography>
                    </TouchableOpacity>
                </View>
            </Card>

            <Gap />

            <View style={styles.bottomTextContainer}>
                <Typography variant="body">
                    {translate('common.backTo') || "Don't have an account?"}{' '}
                    <Typography variant="body" color="primary" weight="bold">
                        {translate('login.signIn') || 'Sign In'}
                    </Typography>
                </Typography>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#00CAFF',
        padding: 20,
    },
    formCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 4,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 20,
    },
    topImage: {
        width: '100%',
        height: 120,
        marginBottom: 20,
        borderRadius: 12,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: 50,
        height: 60,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 22,
        fontWeight: 'bold',
        backgroundColor: '#F7F9FC',
        textAlign: 'center',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    bottomTextContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});
