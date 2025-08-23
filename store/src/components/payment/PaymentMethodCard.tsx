// PaymentMethodCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import Icon from '@components/global/icon/Icon';

export const PaymentMethodCard = ({
    paymentMethods,
    selectedPayment,
    setSelectedPayment,
    primaryColor,
}) => (
    <Card style={{ marginBottom: 15 }}>
        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
            Payment Method
        </Typography>
        {paymentMethods.map((method) => (
            <TouchableOpacity
                key={method.id}
                style={[
                    styles.paymentOption,
                    selectedPayment === method.id && { borderColor: primaryColor, borderWidth: 2 },
                ]}
                onPress={() => setSelectedPayment(method.id)}
            >
                <Icon name={method.icon} type="ion" size="md" color={primaryColor} />
                <Typography variant="body" weight="medium" style={{ marginLeft: 8 }}>
                    {method.label}
                </Typography>
            </TouchableOpacity>
        ))}
    </Card>
);

const styles = StyleSheet.create({
    sectionTitle: { marginBottom: 12 },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});
