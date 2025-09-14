import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Typography from '@components/global/typography/Typography';

interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ 
    status, 
    variant = 'default',
    size = 'md'
}: StatusBadgeProps) {
    const { theme } = useTheme();

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'active':
            case 'paid':
                return {
                    color: theme.colors.success,
                    text: 'Đã xác nhận',
                    bgColor: theme.colors.success + '20'
                };
            case 'pending':
            case 'scheduled':
                return {
                    color: theme.colors.warning,
                    text: 'Chờ xác nhận',
                    bgColor: theme.colors.warning + '20'
                };
            case 'cancelled':
            case 'failed':
                return {
                    color: theme.colors.error,
                    text: 'Đã hủy',
                    bgColor: theme.colors.error + '20'
                };
            case 'completed':
                return {
                    color: theme.colors.info,
                    text: 'Hoàn thành',
                    bgColor: theme.colors.info + '20'
                };
            default:
                return {
                    color: theme.colors.textSecondary,
                    text: status,
                    bgColor: theme.colors.textSecondary + '20'
                };
        }
    };

    const config = getStatusConfig(status);
    
    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return {
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                };
            case 'lg':
                return {
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                };
            default:
                return {
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                };
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'sm':
                return 'caption';
            case 'lg':
                return 'body2';
            default:
                return 'caption';
        }
    };

    return (
        <View
            style={[
                styles.badge,
                getSizeStyles(),
                {
                    backgroundColor: variant === 'outline' ? 'transparent' : config.bgColor,
                    borderWidth: variant === 'outline' ? 1 : 0,
                    borderColor: config.color,
                }
            ]}
        >
            <Typography
                variant={getTextSize() as any}
                color={config.color}
                style={styles.text}
            >
                {config.text}
            </Typography>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: '500',
    },
});
