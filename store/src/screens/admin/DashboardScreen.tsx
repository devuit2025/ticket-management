import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import { getDashboardStats, getRecentActivity } from '@api/admin';

interface DashboardStats {
    total_users: number;
    total_trips: number;
    active_trips: number;
    total_bookings: number;
    today_bookings: number;
    today_revenue: number;
    total_revenue: number;
}

interface Activity {
    id: number;
    type: string;
    message: string;
    timestamp: string;
    status: string;
}

export default function AdminDashboardScreen() {
    const { theme } = useTheme();
    const token = useSelector((state: RootState) => state.user.token);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            console.log('fetchData called - starting API calls');
            setLoading(true);
            const [statsResponse, activityResponse] = await Promise.all([
                getDashboardStats(),
                getRecentActivity()
            ]);
            
            console.log('fetchData completed - API calls successful');
            setStats(statsResponse);
            setActivities(activityResponse.activities || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        console.log('DashboardScreen useEffect triggered, token:', token ? 'exists' : 'null');
        if (token) {
            console.log('Fetching dashboard data...');
            // Small delay to ensure token is saved to AsyncStorage
            const timer = setTimeout(() => {
                fetchData();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [token]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Gap size="md" />
                    <Typography variant="body1" color={theme.colors.textSecondary}>
                        Đang tải dữ liệu...
                    </Typography>
                </View>
            </Container>
        );
    }

    const statsData = stats ? [
        { 
            title: 'Tổng người dùng', 
            value: formatNumber(stats.total_users), 
            color: theme.colors.info 
        },
        { 
            title: 'Tổng chuyến xe', 
            value: formatNumber(stats.total_trips), 
            color: theme.colors.warning 
        },
        { 
            title: 'Chuyến xe hoạt động', 
            value: formatNumber(stats.active_trips), 
            color: theme.colors.success 
        },
        { 
            title: 'Tổng vé bán', 
            value: formatNumber(stats.total_bookings), 
            color: theme.colors.primary 
        },
        { 
            title: 'Vé hôm nay', 
            value: formatNumber(stats.today_bookings), 
            color: theme.colors.secondary 
        },
        { 
            title: 'Doanh thu hôm nay', 
            value: formatCurrency(stats.today_revenue), 
            color: theme.colors.success 
        },
    ] : [];

    return (
        <Container>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Gap size="lg" />
                
                <Typography variant="h2" color={theme.colors.text}>
                    Dashboard Admin
                </Typography>
                
                <Gap size="md" />
                
                <Typography variant="body1" color={theme.colors.textSecondary}>
                    Tổng quan hệ thống quản lý vé xe
                </Typography>
                
                <Gap size="xl" />
                
                {/* Stats Cards */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {statsData.map((stat, index) => (
                        <Card key={index} style={{ flex: 1, minWidth: '45%' }}>
                            <View style={{ alignItems: 'center', padding: 16 }}>
                                <Typography 
                                    variant="h3" 
                                    color={stat.color}
                                    style={{ fontWeight: 'bold' }}
                                >
                                    {stat.value}
                                </Typography>
                                <Gap size="xs" />
                                <Typography 
                                    variant="body2" 
                                    color={theme.colors.textSecondary}
                                    style={{ textAlign: 'center' }}
                                >
                                    {stat.title}
                                </Typography>
                            </View>
                        </Card>
                    ))}
                </View>
                
                <Gap size="xl" />
                
                {/* Recent Activity */}
                <Card>
                    <Typography variant="h4" color={theme.colors.text} style={{ marginBottom: 16 }}>
                        Hoạt động gần đây
                    </Typography>
                    
                    {activities.length > 0 ? (
                        <View style={{ gap: 12 }}>
                            {activities.map((activity, index) => (
                                <View 
                                    key={activity.id || index}
                                    style={{ 
                                        flexDirection: 'row', 
                                        justifyContent: 'space-between',
                                        paddingVertical: 8,
                                        borderBottomWidth: index < activities.length - 1 ? 1 : 0,
                                        borderBottomColor: theme.colors.border
                                    }}
                                >
                                    <Typography variant="body2" color={theme.colors.text}>
                                        {activity.message}
                                    </Typography>
                                    <Typography variant="caption" color={theme.colors.textSecondary}>
                                        {formatTime(activity.timestamp)}
                                    </Typography>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Typography variant="body2" color={theme.colors.textSecondary}>
                                Chưa có hoạt động nào
                            </Typography>
                        </View>
                    )}
                </Card>
            </ScrollView>
        </Container>
    );
}
