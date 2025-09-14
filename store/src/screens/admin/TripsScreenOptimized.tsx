import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import Button from '@components/global/button/Button';
import { useAdminTrips, useAdminOptions } from '@hooks/useAdminData';
import { createTrip, updateTrip, deleteTrip } from '@api/admin';

interface Trip {
    ID: number;
    route: {
        origin: string;
        destination: string;
    };
    bus: {
        plate_number: string;
        type: string;
    };
    driver: {
        name: string;
        phone: string;
    };
    departure_time: string;
    price: number;
    is_active: boolean;
    is_completed: boolean;
    total_seats: number;
    booked_seats: number;
    note: string;
}

interface TripFormData {
    route_id: number;
    bus_id: number;
    driver_id: number;
    departure_time: string;
    price: number;
    note: string;
}

export default function AdminTripsScreenOptimized() {
    const { theme } = useTheme();
    const [selectedTab, setSelectedTab] = useState<'active' | 'scheduled'>('active');
    
    // Use optimized hooks with caching
    const { 
        trips, 
        isLoading, 
        error, 
        refreshTrips, 
        invalidateCache 
    } = useAdminTrips();
    
    const { 
        routes, 
        buses, 
        drivers, 
        isLoading: optionsLoading 
    } = useAdminOptions();
    
    // Form states
    const [showModal, setShowModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const [formData, setFormData] = useState<TripFormData>({
        route_id: 0,
        bus_id: 0,
        driver_id: 0,
        departure_time: '',
        price: 0,
        note: ''
    });
    
    // Dropdown states
    const [showRouteDropdown, setShowRouteDropdown] = useState(false);
    const [showBusDropdown, setShowBusDropdown] = useState(false);
    const [showDriverDropdown, setShowDriverDropdown] = useState(false);

    const onRefresh = async () => {
        await refreshTrips(); // This will force refresh and update cache
    };

    const handleCreateTrip = async () => {
        if (!validateForm()) return;
        
        try {
            const tripData = {
                ...formData,
                departure_time: new Date(formData.departure_time).toISOString()
            };
            
            await createTrip(tripData);
            setShowModal(false);
            resetForm();
            
            // Invalidate cache to force refresh on next focus
            invalidateCache();
            
            Alert.alert('Thành công', 'Chuyến xe đã được tạo thành công!');
        } catch (error: any) {
            console.error('Error creating trip:', error);
            const errorMessage = error.response?.data?.error || 'Không thể tạo chuyến xe. Vui lòng thử lại.';
            Alert.alert('Lỗi tạo chuyến xe', errorMessage);
        }
    };

    const handleUpdateTrip = async () => {
        if (!editingTrip || !editingTrip.ID) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin chuyến xe để cập nhật');
            return;
        }
        if (!validateForm()) return;
        
        try {
            const tripData = {
                ...formData,
                departure_time: new Date(formData.departure_time).toISOString()
            };
            
            await updateTrip(editingTrip.ID.toString(), tripData);
            setShowModal(false);
            setEditingTrip(null);
            resetForm();
            
            // Invalidate cache to force refresh on next focus
            invalidateCache();
            
            Alert.alert('Thành công', 'Chuyến xe đã được cập nhật thành công!');
        } catch (error: any) {
            console.error('Error updating trip:', error);
            const errorMessage = error.response?.data?.error || 'Không thể cập nhật chuyến xe. Vui lòng thử lại.';
            Alert.alert('Lỗi cập nhật chuyến xe', errorMessage);
        }
    };

    const handleDeleteTrip = async (tripId: number, tripInfo: string) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc chắn muốn xóa chuyến xe "${tripInfo}"? Tất cả booking liên quan cũng sẽ bị xóa.`,
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
                            await deleteTrip(tripId.toString());
                            
                            // Invalidate cache to force refresh on next focus
                            invalidateCache();
                            
                            Alert.alert('Thành công', 'Chuyến xe đã được xóa thành công!');
                        } catch (error: any) {
                            console.error('Error deleting trip:', error);
                            const errorMessage = error.response?.data?.error || 'Không thể xóa chuyến xe. Vui lòng thử lại.';
                            Alert.alert('Lỗi xóa chuyến xe', errorMessage);
                        }
                    }
                }
            ]
        );
    };

    const validateForm = () => {
        if (!formData.route_id) {
            Alert.alert('Thiếu thông tin', 'Vui lòng chọn tuyến đường');
            return false;
        }
        if (!formData.bus_id) {
            Alert.alert('Thiếu thông tin', 'Vui lòng chọn xe');
            return false;
        }
        if (!formData.driver_id) {
            Alert.alert('Thiếu thông tin', 'Vui lòng chọn tài xế');
            return false;
        }
        if (!formData.departure_time) {
            Alert.alert('Thiếu thông tin', 'Vui lòng chọn thời gian khởi hành');
            return false;
        }
        if (formData.price <= 0) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập giá vé hợp lệ');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            route_id: 0,
            bus_id: 0,
            driver_id: 0,
            departure_time: '',
            price: 0,
            note: ''
        });
    };

    const openEditModal = (trip: Trip) => {
        setEditingTrip(trip);
        setFormData({
            route_id: trip.route?.ID || 0,
            bus_id: trip.bus?.ID || 0,
            driver_id: trip.driver?.ID || 0,
            departure_time: formatDateTimeForInput(trip.departure_time),
            price: trip.price,
            note: trip.note || ''
        });
        setShowModal(true);
    };

    const formatDateTimeForInput = (dateString: string) => {
        const date = new Date(dateString);
        // Ensure the date is in the future
        const now = new Date();
        if (date <= now) {
            date.setDate(now.getDate() + 1);
        }
        return date.toISOString().slice(0, 16);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const filteredTrips = trips.filter(trip => {
        if (selectedTab === 'active') {
            return trip.is_active && !trip.is_completed;
        } else {
            return !trip.is_active || trip.is_completed;
        }
    });

    if (error) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Typography variant="h3" color={theme.colors.error} style={{ textAlign: 'center', marginBottom: 16 }}>
                        Lỗi tải dữ liệu
                    </Typography>
                    <Typography variant="body" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginBottom: 20 }}>
                        {error.message}
                    </Typography>
                    <Button title="Thử lại" onPress={onRefresh} />
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                <Gap />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h2" color={theme.colors.text}>
                        Quản lý chuyến xe
                    </Typography>
                    <Button 
                        title="Thêm chuyến xe"
                        onPress={() => {
                            resetForm();
                            setEditingTrip(null);
                            setShowModal(true);
                        }}
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    />
                </View>
                
                <Gap />
                
                {/* Tab Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                        {[
                            { key: 'active', label: 'Đang hoạt động', count: trips.filter(t => t.is_active && !t.is_completed).length },
                            { key: 'scheduled', label: 'Đã lên lịch', count: trips.filter(t => !t.is_active || t.is_completed).length }
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    backgroundColor: selectedTab === tab.key 
                                        ? theme.colors.primary 
                                        : theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border
                                }}
                                onPress={() => setSelectedTab(tab.key as any)}
                            >
                                <Typography 
                                    variant="body" 
                                    color={selectedTab === tab.key 
                                        ? theme.colors.white 
                                        : theme.colors.text}
                                >
                                    {tab.label} ({tab.count})
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                
                {/* Trips List */}
                <View style={{ gap: 12 }}>
                    {isLoading ? (
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: 8 }}>
                                Đang tải danh sách chuyến xe...
                            </Typography>
                        </View>
                    ) : filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                            <Card key={trip.ID}>
                                <View style={{ padding: 16 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1 }}>
                                            <Typography variant="h3" color={theme.colors.text}>
                                                {trip.route?.origin || 'N/A'} - {trip.route?.destination || 'N/A'}
                                            </Typography>
                                            <Gap />
                                            <Typography variant="body" color={theme.colors.textSecondary}>
                                                Xe: {trip.bus?.plate_number || 'N/A'} ({trip.bus?.type || 'N/A'})
                                            </Typography>
                                            <Typography variant="body" color={theme.colors.textSecondary}>
                                                Tài xế: {trip.driver?.name || 'N/A'} - {trip.driver?.phone || 'N/A'}
                                            </Typography>
                                            <Typography variant="body" color={theme.colors.textSecondary}>
                                                Khởi hành: {formatDateTime(trip.departure_time)}
                                            </Typography>
                                            <Typography variant="body" color={theme.colors.textSecondary}>
                                                Ghế: {trip.booked_seats}/{trip.total_seats}
                                            </Typography>
                                        </View>
                                        
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Typography variant="h3" color={theme.colors.primary}>
                                                {formatCurrency(trip.price)}
                                            </Typography>
                                            <Gap />
                                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                                <Button 
                                                    title="Sửa"
                                                    onPress={() => openEditModal(trip)}
                                                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                                                />
                                                <Button 
                                                    title="Xóa"
                                                    onPress={() => handleDeleteTrip(trip.ID, `${trip.route?.origin} - ${trip.route?.destination}`)}
                                                    style={{ 
                                                        paddingHorizontal: 12, 
                                                        paddingVertical: 6,
                                                        backgroundColor: theme.colors.error
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        ))
                    ) : (
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <Typography variant="h3" color={theme.colors.textSecondary}>
                                Không có chuyến xe nào
                            </Typography>
                            <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: 8 }}>
                                Hãy tạo chuyến xe đầu tiên
                            </Typography>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Create/Edit Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <Container>
                    <ScrollView>
                        <Gap />
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h2" color={theme.colors.text}>
                                {editingTrip ? 'Sửa chuyến xe' : 'Tạo chuyến xe mới'}
                            </Typography>
                            <Button 
                                title="Đóng"
                                onPress={() => {
                                    setShowModal(false);
                                    setEditingTrip(null);
                                    resetForm();
                                }}
                                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                            />
                        </View>
                        
                        <Gap />
                        
                        {/* Form fields would go here - simplified for example */}
                        <View style={{ gap: 16 }}>
                            <Typography variant="body" color={theme.colors.textSecondary}>
                                Form fields for creating/editing trips...
                            </Typography>
                            
                            <Button 
                                title={editingTrip ? 'Cập nhật' : 'Tạo mới'}
                                onPress={editingTrip ? handleUpdateTrip : handleCreateTrip}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </ScrollView>
                </Container>
            </Modal>
        </Container>
    );
}
