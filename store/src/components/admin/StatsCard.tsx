import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Icon from '@components/global/icon/Icon';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: string;
    color?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatsCard({ 
    title, 
    value, 
    icon, 
    color, 
    trend 
}: StatsCardProps) {
    const { theme } = useTheme();
    
    const cardColor = color || theme.colors.primary;
    
    return (
        <Card style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {icon && (
                        <Icon 
                            name={icon} 
                            type="ion" 
                            size="lg" 
                            color={cardColor}
                        />
                    )}
                </View>
                
                <View style={styles.textContainer}>
                    <Typography 
                        variant="h3" 
                        color={cardColor}
                        style={styles.value}
                    >
                        {value}
                    </Typography>
                    
                    <Typography 
                        variant="body2" 
                        color={theme.colors.textSecondary}
                        style={styles.title}
                    >
                        {title}
                    </Typography>
                    
                    {trend && (
                        <View style={styles.trendContainer}>
                            <Icon 
                                name={trend.isPositive ? 'trending-up' : 'trending-down'} 
                                type="ion" 
                                size="sm" 
                                color={trend.isPositive ? theme.colors.success : theme.colors.error}
                            />
                            <Typography 
                                variant="caption" 
                                color={trend.isPositive ? theme.colors.success : theme.colors.error}
                                style={styles.trendText}
                            >
                                {Math.abs(trend.value)}%
                            </Typography>
                        </View>
                    )}
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    value: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    title: {
        marginBottom: 4,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendText: {
        marginLeft: 4,
        fontWeight: '500',
    },
});
