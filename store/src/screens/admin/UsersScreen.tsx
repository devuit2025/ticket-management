import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import Button from '@components/global/button/Button';
import Avatar from '@components/global/avatar/Avatar';
import Icon from '@components/global/icon/Icon';
import { getAdminUsers, updateUserRole, updateUser, createUser, deleteUser } from '@api/admin';

interface User {
    ID: number;
    name: string;
    phone: string;
    role: 'customer' | 'admin' | 'staff' | 'driver';
    CreatedAt: string;
    UpdatedAt: string;
}

interface UserFormData {
    name: string;
    phone: string;
    password: string;
    role: 'customer' | 'admin' | 'staff' | 'driver';
}

export default function AdminUsersScreen() {
    const { theme } = useTheme();
    const [selectedRole, setSelectedRole] = useState<'all' | 'customer' | 'admin' | 'staff' | 'driver'>('all');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Form states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        phone: '',
        password: '',
        role: 'customer'
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAdminUsers();
            setUsers(response.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    };

    const handleRoleUpdate = async (userId: number, newRole: 'customer' | 'admin' | 'staff' | 'driver') => {
        try {
            await updateUserRole(userId.toString(), { role: newRole });
            await fetchUsers(); // Refresh data
            Alert.alert('Thành công', 'Vai trò người dùng đã được cập nhật thành công!');
        } catch (error) {
            console.error('Error updating user role:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật vai trò người dùng. Vui lòng thử lại.');
        }
    };

    const handleCreateUser = async () => {
        // Validation
        if (!formData.name.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng');
            return;
        }
        
        if (!formData.phone.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
            return;
        }
        
        if (!formData.password.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (10-11 chữ số)');
            return;
        }
        
        // Password validation (minimum 6 characters)
        if (formData.password.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            await createUser({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                role: formData.role
            });
            Alert.alert('Thành công', 'Tạo người dùng thành công!');
            setShowCreateModal(false);
            resetForm();
            fetchUsers();
        } catch (error: any) {
            console.error('Error creating user:', error);
            const errorMessage = error?.response?.data?.error || 'Không thể tạo người dùng. Vui lòng thử lại.';
            Alert.alert('Lỗi', errorMessage);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            password: '',
            role: 'customer'
        });
    };

    const handleEditUser = async () => {
        if (!editingUser) return;
        
        // Validation
        if (!formData.name.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng');
            return;
        }
        
        if (!formData.phone.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            Alert.alert('Lỗi', 'Số điện thoại không hợp lệ (10-11 chữ số)');
            return;
        }
        
        try {
            await updateUser(editingUser.ID.toString(), {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                role: formData.role
            });
            Alert.alert('Thành công', 'Cập nhật thông tin người dùng thành công!');
            setShowEditModal(false);
            setEditingUser(null);
            resetForm();
            fetchUsers();
        } catch (error: any) {
            console.error('Error updating user:', error);
            const errorMessage = error?.response?.data?.error || 'Không thể cập nhật thông tin người dùng. Vui lòng thử lại.';
            Alert.alert('Lỗi', errorMessage);
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            phone: user.phone,
            password: '', // Don't pre-fill password
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleDeleteUser = async (userId: number, userName: string) => {
        // await deleteUser(userId.toString());
        // Alert.alert('Thành công', 'Xóa người dùng thành công!');
        // fetchUsers(); // Refresh data
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc chắn muốn xóa người dùng "${userName}"?`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel'
                },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteUser(userId.toString());
                            Alert.alert('Thành công', 'Xóa người dùng thành công!');
                            fetchUsers(); // Refresh data
                        } catch (error) {
                            console.error('Error deleting user:', error);
                            Alert.alert('Lỗi', 'Không thể xóa người dùng. Vui lòng thử lại.');
                        }
                    }
                }
            ]
        );
    };

    // Only fetch data when screen is focused, not on every mount
    useFocusEffect(
        React.useCallback(() => {
            fetchUsers();
        }, [])
    );

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const filteredUsers = users.filter(user => {
        // Role filter
        let matchesRole = true;
        if (selectedRole !== 'all') {
            matchesRole = user.role === selectedRole;
        }
        
        if (!matchesRole) return false;
        
        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                user.name.toLowerCase().includes(query) ||
                user.phone.includes(query) ||
                user.ID.toString().includes(query)
            );
        }
        
        return true;
    });


    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return theme.colors.error;
            case 'customer': return theme.colors.primary;
            case 'staff': return theme.colors.warning;
            case 'driver': return theme.colors.success;
            default: return theme.colors.textSecondary;
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'customer': return 'Khách hàng';
            case 'staff': return 'Nhân viên';
            case 'driver': return 'Tài xế';
            default: return role;
        }
    };


    return (
        <Container>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                <Gap />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h2" color={theme.colors.text}>
                        Quản lý người dùng
                    </Typography>
                    <Button 
                        title="Thêm người dùng"
                        onPress={() => setShowCreateModal(true)}
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    />
                </View>
                
                <Gap />
                
                {/* Search Form */}
                <Card>
                    <View style={{ padding: 16 }}>
                        <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                            Tìm kiếm người dùng
                        </Typography>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                borderRadius: 8,
                                padding: 12,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.background
                            }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Tìm theo tên, số điện thoại, ID..."
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                        {searchQuery.trim() && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                <Typography variant="caption" color={theme.colors.textSecondary}>
                                    Tìm thấy {filteredUsers.length} kết quả
                                </Typography>
                                <TouchableOpacity
                                    style={{ marginLeft: 'auto' }}
                                    onPress={() => setSearchQuery('')}
                                >
                                    <Typography variant="caption" color={theme.colors.primary}>
                                        Xóa tìm kiếm
                                    </Typography>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Card>
                
                <Gap />
                
                {/* Role Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                        {[
                            { key: 'all', label: 'Tất cả', count: users.length },
                            { key: 'customer', label: 'Khách hàng', count: users.filter(u => u.role === 'customer').length },
                            { key: 'admin', label: 'Quản trị viên', count: users.filter(u => u.role === 'admin').length },
                            { key: 'staff', label: 'Nhân viên', count: users.filter(u => u.role === 'staff').length },
                            { key: 'driver', label: 'Tài xế', count: users.filter(u => u.role === 'driver').length }
                        ].map((filter) => (
                            <TouchableOpacity
                                key={filter.key}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    backgroundColor: selectedRole === filter.key 
                                        ? theme.colors.primary 
                                        : theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border
                                }}
                                onPress={() => setSelectedRole(filter.key as any)}
                            >
                                <Typography 
                                    variant="body" 
                                    color={selectedRole === filter.key 
                                        ? theme.colors.white 
                                        : theme.colors.text}
                                >
                                    {filter.label} ({filter.count})
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                
                {/* Users List */}
                <View style={{ gap: 12 }}>
                    {loading ? (
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: 8 }}>
                                Đang tải danh sách người dùng...
                            </Typography>
                        </View>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                        <Card key={user.ID}>
                            <View style={{ padding: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* <Avatar 
                                        size={50}
                                    />
                                    
                                    <Gap /> */}
                                    
                                    <View style={{ flex: 1 }}>
                                        <Typography variant="h3" color={theme.colors.text}>
                                            {user.name}
                                        </Typography>
                                        <Gap />
                                        <Typography variant="body" color={theme.colors.textSecondary}>
                                            ID: {user.ID}
                                        </Typography>
                                        <Typography variant="body" color={theme.colors.textSecondary}>
                                            {user.phone}
                                        </Typography>
                                    </View>
                                    
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <View style={{
                                            paddingHorizontal: 8,
                                            paddingVertical: 4,
                                            borderRadius: 12,
                                            backgroundColor: getRoleColor(user.role) + '20'
                                        }}>
                                            <Typography 
                                                variant="caption" 
                                                color={getRoleColor(user.role)}
                                            >
                                                {getRoleText(user.role)}
                                            </Typography>
                                        </View>
                                        <Gap />
                                        <Typography variant="caption" color={theme.colors.textSecondary}>
                                            Tham gia: {formatDateTime(user.CreatedAt)}
                                        </Typography>
                                    </View>
                                </View>
                                
                                <Gap />
                                
                                <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{
                                            padding: 8,
                                            borderRadius: 8,
                                            backgroundColor: theme.colors.primary + '20',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 40,
                                            minHeight: 40
                                        }}
                                        onPress={() => openEditModal(user)}
                                    >
                                        <Icon 
                                            name="create-outline" 
                                            type="ion" 
                                            size="md" 
                                            color={theme.colors.primary}
                                        />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={{
                                            padding: 8,
                                            borderRadius: 8,
                                            backgroundColor: theme.colors.warning + '20',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 40,
                                            minHeight: 40
                                        }}
                                        onPress={() => {
                                            Alert.alert(
                                                'Đổi vai trò',
                                                `Chọn vai trò mới cho ${user.name}:`,
                                                [
                                                    { text: 'Hủy', style: 'cancel' },
                                                    { text: 'Khách hàng', onPress: () => handleRoleUpdate(user.ID, 'customer') },
                                                    { text: 'Nhân viên', onPress: () => handleRoleUpdate(user.ID, 'staff') },
                                                    { text: 'Tài xế', onPress: () => handleRoleUpdate(user.ID, 'driver') },
                                                    { text: 'Admin', onPress: () => handleRoleUpdate(user.ID, 'admin') }
                                                ]
                                            );
                                        }}
                                    >
                                        <Icon 
                                            name="swap-horizontal-outline" 
                                            type="ion" 
                                            size="md" 
                                            color={theme.colors.warning}
                                        />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={{
                                            padding: 8,
                                            borderRadius: 8,
                                            backgroundColor: theme.colors.error + '20',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 40,
                                            minHeight: 40
                                        }}
                                        onPress={() => handleDeleteUser(user.ID, user.name)}
                                    >
                                        <Icon 
                                            name="trash-outline" 
                                            type="ion" 
                                            size="md" 
                                            color={theme.colors.error}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                        ))
                    ) : (
                        <Card>
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Typography variant="h3" color={theme.colors.textSecondary}>
                                    👥
                                </Typography>
                                <Gap />
                                <Typography variant="h3" color={theme.colors.text}>
                                    Chưa có người dùng nào
                                </Typography>
                                <Gap />
                                <Typography variant="body" color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
                                    {selectedRole === 'all' 
                                        ? 'Chưa có người dùng nào trong hệ thống'
                                        : `Chưa có người dùng với vai trò "${getRoleText(selectedRole)}"`
                                    }
                                </Typography>
                            </View>
                        </Card>
                    )}
                </View>
            </ScrollView>

            {/* Create User Modal */}
            <Modal
                visible={showCreateModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <Container>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Gap />
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h2" color={theme.colors.text}>
                                Tạo người dùng mới
                            </Typography>
                            <Button 
                                title="Đóng"
                                variant="outline"
                                onPress={() => setShowCreateModal(false)}
                                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                            />
                        </View>
                        
                        <Gap />
                        
                        {/* User Info Form */}
                        <Card>
                            <View style={{ padding: 16 }}>
                                <Typography variant="h3" color={theme.colors.text}>
                                    Thông tin người dùng
                                </Typography>
                                <Gap />
                                
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        borderRadius: 8,
                                        padding: 12,
                                        color: theme.colors.text,
                                        backgroundColor: theme.colors.card,
                                        marginBottom: 12
                                    }}
                                    placeholder="Họ tên"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({...formData, name: text})}
                                />
                                
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        borderRadius: 8,
                                        padding: 12,
                                        color: theme.colors.text,
                                        backgroundColor: theme.colors.card,
                                        marginBottom: 12
                                    }}
                                    placeholder="Số điện thoại"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({...formData, phone: text})}
                                />
                                
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        borderRadius: 8,
                                        padding: 12,
                                        color: theme.colors.text,
                                        backgroundColor: theme.colors.card,
                                        marginBottom: 12
                                    }}
                                    placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({...formData, password: text})}
                                    secureTextEntry
                                />
                                
                                {/* Role Selection */}
                                <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                                    Vai trò:
                                </Typography>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {[
                                        { key: 'customer', label: 'Khách hàng' },
                                        { key: 'staff', label: 'Nhân viên' },
                                        { key: 'driver', label: 'Tài xế' },
                                        { key: 'admin', label: 'Admin' }
                                    ].map((role) => (
                                        <TouchableOpacity
                                            key={role.key}
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                borderRadius: 20,
                                                backgroundColor: formData.role === role.key 
                                                    ? theme.colors.primary 
                                                    : theme.colors.card,
                                                borderWidth: 1,
                                                borderColor: formData.role === role.key 
                                                    ? theme.colors.primary 
                                                    : theme.colors.border
                                            }}
                                            onPress={() => setFormData({...formData, role: role.key as any})}
                                        >
                                            <Typography 
                                                variant="body" 
                                                color={formData.role === role.key 
                                                    ? theme.colors.white 
                                                    : theme.colors.text}
                                            >
                                                {role.label}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </Card>
                        
                        <Gap />
                        
                        {/* Action Buttons */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Button
                                title="Hủy"
                                variant="outline"
                                onPress={() => setShowCreateModal(false)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Tạo người dùng"
                                onPress={handleCreateUser}
                                style={{ flex: 1 }}
                            />
                        </View>
                        
                        <Gap />
                    </ScrollView>
                </Container>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                visible={showEditModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowEditModal(false)}
            >
                <Container style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Typography variant="h2">Chỉnh sửa người dùng</Typography>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Icon name="close" type="ion" size="lg" color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <Card style={{ padding: 16 }}>
                            <Typography variant="h4" style={{ marginBottom: 16 }}>Thông tin người dùng</Typography>
                            
                            <Gap size="md" />
                            
                            <View style={{ marginBottom: 16 }}>
                                <Typography variant="body" style={{ marginBottom: 8 }}>Tên người dùng *</Typography>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        borderRadius: 8,
                                        padding: 12,
                                        fontSize: 16,
                                        color: theme.colors.text,
                                        backgroundColor: theme.colors.background
                                    }}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="Nhập tên người dùng"
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Typography variant="body" style={{ marginBottom: 8 }}>Số điện thoại *</Typography>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        borderRadius: 8,
                                        padding: 12,
                                        fontSize: 16,
                                        color: theme.colors.text,
                                        backgroundColor: theme.colors.background
                                    }}
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                    placeholder="Nhập số điện thoại"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Typography variant="body" style={{ marginBottom: 8 }}>Vai trò *</Typography>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {['customer', 'staff', 'driver', 'admin'].map((role) => (
                                        <TouchableOpacity
                                            key={role}
                                            style={{
                                                paddingHorizontal: 16,
                                                paddingVertical: 8,
                                                borderRadius: 20,
                                                backgroundColor: formData.role === role ? theme.colors.primary : theme.colors.surface,
                                                borderWidth: 1,
                                                borderColor: formData.role === role ? theme.colors.primary : theme.colors.border
                                            }}
                                            onPress={() => setFormData({ ...formData, role: role as any })}
                                        >
                                            <Typography 
                                                variant="body" 
                                                style={{ 
                                                    color: formData.role === role ? 'white' : theme.colors.text,
                                                    fontSize: 14
                                                }}
                                            >
                                                {role === 'customer' ? 'Khách hàng' : 
                                                 role === 'staff' ? 'Nhân viên' : 
                                                 role === 'driver' ? 'Tài xế' : 'Admin'}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <Gap size="lg" />
                            
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Button
                                    title="Hủy"
                                    onPress={() => setShowEditModal(false)}
                                    style={{ flex: 1, backgroundColor: theme.colors.surface }}
                                    textStyle={{ color: theme.colors.text }}
                                />
                                <Button
                                    title="Cập nhật"
                                    onPress={handleEditUser}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </Card>
                        
                        <Gap />
                    </ScrollView>
                </Container>
            </Modal>
        </Container>
    );
}
