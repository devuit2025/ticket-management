import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import Button from '@components/global/button/Button';
import { useTheme } from '@context/ThemeContext';
import { useAuth } from '@hooks/useAuth';
import AdminGuard from '@components/auth/AdminGuard';
import UserGuard from '@components/auth/UserGuard';

export default function AuthTestScreen() {
    const { theme } = useTheme();
    const { logout } = useAuth();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const token = useSelector((state: RootState) => state.user.token);

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Gap />
                
                <Typography variant="h2" color={theme.colors.text}>
                    Authentication Test
                </Typography>
                
                <Gap />
                
                {/* Current User Info */}
                <Card>
                    <View style={{ padding: 16 }}>
                        <Typography variant="h3" color={theme.colors.text}>
                            Thông tin người dùng hiện tại
                        </Typography>
                        <Gap />
                        
                        <Typography variant="body" color={theme.colors.text}>
                            Token: {token ? 'Có' : 'Không có'}
                        </Typography>
                        <Typography variant="body" color={theme.colors.text}>
                            User: {currentUser ? currentUser.name : 'Chưa đăng nhập'}
                        </Typography>
                        <Typography variant="body" color={theme.colors.text}>
                            Role: {currentUser?.role || 'N/A'}
                        </Typography>
                        <Typography variant="body" color={theme.colors.text}>
                            Phone: {currentUser?.phone || 'N/A'}
                        </Typography>
                    </View>
                </Card>
                
                <Gap />
                
                {/* Admin Guard Test */}
                <Card>
                    <View style={{ padding: 16 }}>
                        <Typography variant="h3" color={theme.colors.text}>
                            Admin Guard Test
                        </Typography>
                        <Gap />
                        
                        <AdminGuard>
                            <Typography variant="body" color={theme.colors.success}>
                                ✅ Bạn có quyền admin! Có thể truy cập nội dung này.
                            </Typography>
                        </AdminGuard>
                    </View>
                </Card>
                
                <Gap />
                
                {/* User Guard Test */}
                <Card>
                    <View style={{ padding: 16 }}>
                        <Typography variant="h3" color={theme.colors.text}>
                            User Guard Test
                        </Typography>
                        <Gap />
                        
                        <UserGuard>
                            <Typography variant="body" color={theme.colors.success}>
                                ✅ Bạn là user thường! Có thể truy cập nội dung này.
                            </Typography>
                        </UserGuard>
                    </View>
                </Card>
                
                <Gap />
                
                {/* Logout Button */}
                <Button
                    title="Đăng xuất"
                    onPress={logout}
                    style={{ backgroundColor: theme.colors.error }}
                />
                
                <Gap />
            </ScrollView>
        </Container>
    );
}
