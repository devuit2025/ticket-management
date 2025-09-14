import React from 'react';
import { View, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { UserRole } from '@types/auth';
import Typography from '@components/global/typography/Typography';
import Button from '@components/global/button/Button';
import { useTheme } from '@context/ThemeContext';
import { useAuth } from '@hooks/useAuth';

interface AdminGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
    const { theme } = useTheme();
    const { logout } = useAuth();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    
    const userRole = currentUser?.role as UserRole;
    
    // Check if user is admin or super_admin
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    
    if (!isAdmin) {
        if (fallback) {
            return <>{fallback}</>;
        }
        
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: 20,
                backgroundColor: theme.colors.background 
            }}>
                <Typography variant="h2" color={theme.colors.text} style={{ textAlign: 'center', marginBottom: 16 }}>
                    Truy cập bị từ chối
                </Typography>
                <Typography variant="body" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginBottom: 24 }}>
                    Bạn không có quyền truy cập vào trang này. Chỉ admin mới có thể truy cập.
                </Typography>
                <Button
                    title="Đăng xuất"
                    onPress={() => {
                        Alert.alert(
                            'Xác nhận',
                            'Bạn có muốn đăng xuất không?',
                            [
                                { text: 'Hủy', style: 'cancel' },
                                { text: 'Đăng xuất', onPress: logout }
                            ]
                        );
                    }}
                />
            </View>
        );
    }
    
    return <>{children}</>;
};

export default AdminGuard;
