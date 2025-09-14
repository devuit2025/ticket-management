import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import Button from '@components/global/button/Button';
import { StatsCard, DataTable, StatusBadge } from '@components/admin';

export default function AdminDemoScreen() {
    const { theme } = useTheme();

    const sampleData = [
        { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', status: 'confirmed', bookings: 5 },
        { id: 2, name: 'Trần Thị B', email: 'b@email.com', status: 'pending', bookings: 2 },
        { id: 3, name: 'Lê Văn C', email: 'c@email.com', status: 'cancelled', bookings: 0 },
    ];

    const columns = [
        { key: 'name', title: 'Tên', width: 120 },
        { key: 'email', title: 'Email', width: 150 },
        { 
            key: 'status', 
            title: 'Trạng thái', 
            width: 100,
            render: (value: string) => <StatusBadge status={value} />
        },
        { key: 'bookings', title: 'Số vé', width: 80, align: 'center' as const },
    ];

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Gap size="lg" />
                
                <Typography variant="h2" color={theme.colors.text}>
                    Admin System Demo
                </Typography>
                
                <Gap size="md" />
                
                <Typography variant="body1" color={theme.colors.textSecondary}>
                    Demo các components admin đã tạo
                </Typography>
                
                <Gap size="xl" />
                
                {/* Stats Cards Demo */}
                <Typography variant="h4" color={theme.colors.text}>
                    Stats Cards
                </Typography>
                <Gap size="md" />
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    <StatsCard 
                        title="Tổng vé bán" 
                        value="1,234" 
                        icon="receipt-outline"
                        color={theme.colors.primary}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatsCard 
                        title="Doanh thu" 
                        value="12.5M" 
                        icon="cash-outline"
                        color={theme.colors.success}
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatsCard 
                        title="Chuyến xe" 
                        value="45" 
                        icon="bus-outline"
                        color={theme.colors.warning}
                    />
                    <StatsCard 
                        title="Người dùng" 
                        value="2,156" 
                        icon="people-outline"
                        color={theme.colors.info}
                        trend={{ value: 5, isPositive: false }}
                    />
                </View>
                
                <Gap size="xl" />
                
                {/* Status Badges Demo */}
                <Typography variant="h4" color={theme.colors.text}>
                    Status Badges
                </Typography>
                <Gap size="md" />
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    <StatusBadge status="confirmed" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="cancelled" />
                    <StatusBadge status="completed" />
                    <StatusBadge status="active" />
                </View>
                
                <Gap size="xl" />
                
                {/* Data Table Demo */}
                <Typography variant="h4" color={theme.colors.text}>
                    Data Table
                </Typography>
                <Gap size="md" />
                
                <DataTable 
                    columns={columns}
                    data={sampleData}
                    onRowPress={(row) => console.log('Row pressed:', row)}
                />
                
                <Gap size="xl" />
                
                {/* Navigation Test */}
                <Card>
                    <Typography variant="h4" color={theme.colors.text} style={{ marginBottom: 16 }}>
                        Test Navigation
                    </Typography>
                    
                    <Typography variant="body2" color={theme.colors.textSecondary} style={{ marginBottom: 16 }}>
                        Để test admin system, bạn cần:
                    </Typography>
                    
                    <View style={{ gap: 8 }}>
                        <Typography variant="body2" color={theme.colors.text}>
                            1. Đăng nhập với tài khoản có role = 'admin' hoặc 'super_admin'
                        </Typography>
                        <Typography variant="body2" color={theme.colors.text}>
                            2. Hệ thống sẽ tự động chuyển sang AdminStack
                        </Typography>
                        <Typography variant="body2" color={theme.colors.text}>
                            3. Có thể truy cập Dashboard, Trips, Bookings, Users
                        </Typography>
                    </View>
                    
                    <Gap size="md" />
                    
                    <Button 
                        title="Test Admin Login"
                        onPress={() => {
                            // Simulate admin login
                            console.log('Simulating admin login...');
                        }}
                    />
                </Card>
            </ScrollView>
        </Container>
    );
}
