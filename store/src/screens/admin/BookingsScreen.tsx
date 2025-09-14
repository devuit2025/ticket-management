import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import Button from '@components/global/button/Button';
import { getAdminBookings, updateBookingStatus, createGuestBooking, getAdminTrips } from '@api/admin';

interface Booking {
    ID: number;
    user_id: number;
    trip_id: number;
    trip: {
        ID: number;
        route: {
            origin: string;
            destination: string;
        };
        departure_time: string;
        price: number;
    };
    seats: Array<{
        ID: number;
        number: string;
    }>;
    seat_ids: number[];
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'refunded';
    created_at: string;
    updated_at: string;
    note: string;
}

interface Trip {
    ID: number;
    route: {
        origin: string;
        destination: string;
    };
    departure_time: string;
    price: number;
}

interface BookingFormData {
    trip_id: number;
    seat_ids: number[];
    payment_type: string;
    guest_info: {
        name: string;
        phone: string;
        email: string;
    };
    note: string;
}

export default function AdminBookingsScreen() {
    const { theme } = useTheme();
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Form states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [formData, setFormData] = useState<BookingFormData>({
        trip_id: 0,
        seat_ids: [],
        payment_type: 'cash',
        guest_info: {
            name: '',
            phone: '',
            email: ''
        },
        note: ''
    });

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getAdminBookings();
            setBookings(response.bookings || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrips = async () => {
        try {
            const response = await getAdminTrips();
            setTrips(response.trips || []);
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    const handleCreateBooking = async () => {
        try {
            await createGuestBooking(formData);
            Alert.alert('Thành công', 'Tạo booking thành công!');
            setShowCreateModal(false);
            resetForm();
            fetchBookings();
        } catch (error) {
            console.error('Error creating booking:', error);
            Alert.alert('Lỗi', 'Không thể tạo booking. Vui lòng thử lại.');
        }
    };

    const resetForm = () => {
        setFormData({
            trip_id: 0,
            seat_ids: [],
            payment_type: 'cash',
            guest_info: {
                name: '',
                phone: '',
                email: ''
            },
            note: ''
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBookings();
        setRefreshing(false);
    };

    const handleStatusUpdate = async (bookingId: number, newStatus: 'confirmed' | 'cancelled') => {
        try {
            await updateBookingStatus(bookingId.toString(), newStatus);
            await fetchBookings(); // Refresh data
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    // Only fetch data when screen is focused, not on every mount
    useFocusEffect(
        React.useCallback(() => {
            fetchBookings();
            fetchTrips();
        }, [])
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const filteredBookings = bookings.filter(booking => {
        if (selectedStatus === 'all') return true;
        return booking.status === selectedStatus;
    });


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return theme.colors.success;
            case 'pending': return theme.colors.warning;
            case 'cancelled': return theme.colors.error;
            default: return theme.colors.textSecondary;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xác nhận';
            case 'cancelled': return 'Đã hủy';
            default: return status;
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
                <Gap  />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h2" color={theme.colors.text}>
                        Quản lý đặt vé
                    </Typography>
                    {/* <Button 
                        title="Tạo booking"
                        onPress={() => setShowCreateModal(true)}
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    /> */}
                </View>
                
                <Gap  />
                
                {/* Status Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                        {[
                            { key: 'all', label: 'Tất cả', count: bookings.length },
                            { key: 'pending', label: 'Chờ xác nhận', count: bookings.filter(b => b.status === 'pending').length },
                            { key: 'confirmed', label: 'Đã xác nhận', count: bookings.filter(b => b.status === 'confirmed').length },
                            { key: 'cancelled', label: 'Đã hủy', count: bookings.filter(b => b.status === 'cancelled').length }
                        ].map((filter) => (
                            <TouchableOpacity
                                key={filter.key}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    backgroundColor: selectedStatus === filter.key 
                                        ? theme.colors.primary 
                                        : theme.colors.card,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border
                                }}
                                onPress={() => setSelectedStatus(filter.key as any)}
                            >
                                <Typography 
                                    variant="body" 
                                    color={selectedStatus === filter.key 
                                        ? theme.colors.white 
                                        : theme.colors.text}
                                >
                                    {filter.label} ({filter.count})
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                
                {/* Bookings List */}
                <View style={{ gap: 12 }}>
                    {loading ? (
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: 8 }}>
                                Đang tải danh sách đặt vé...
                            </Typography>
                        </View>
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings?.map((booking) => (
                        <Card key={booking.ID}>
                            <View style={{ padding: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View style={{ flex: 1 }}>
                                        <Typography variant="h3" color={theme.colors.text}>
                                            Booking #{booking.ID}
                                        </Typography>
                                        <Gap  />
                                        <Typography variant="body" color={theme.colors.textSecondary}>
                                            User ID: {booking.user_id}
                                        </Typography>
                                        <Typography variant="body" color={theme.colors.textSecondary}>
                                            {booking.trip?.route?.origin || 'N/A'} - {booking.trip?.route?.destination || 'N/A'}
                                        </Typography>
                                        <Typography variant="body" color={theme.colors.textSecondary}>
                                            Khởi hành: {booking.trip?.departure_time ? formatDateTime(booking.trip.departure_time) : 'N/A'}
                                        </Typography>
                                        <Typography variant="body" color={theme.colors.textSecondary}>
                                            Ghế: {booking.seats?.map(seat => seat.number).join(', ') || 
                                                  (booking.seat_ids?.length > 0 ? `ID: ${booking.seat_ids.join(', ')}` : 'N/A')}
                                        </Typography>
                                    </View>
                                    
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <View style={{
                                            paddingHorizontal: 8,
                                            paddingVertical: 4,
                                            borderRadius: 12,
                                            backgroundColor: getStatusColor(booking.status) + '20'
                                        }}>
                                            <Typography 
                                                variant="caption" 
                                                color={getStatusColor(booking.status)}
                                            >
                                                {getStatusText(booking.status)}
                                            </Typography>
                                        </View>
                                        <Gap  />
                                        <Typography variant="h3" color={theme.colors.primary}>
                                            {formatCurrency(booking.total_amount)}
                                        </Typography>
                                    </View>
                                </View>
                                
                                <Gap  />
                                
                                {/* <Typography variant="caption" color={theme.colors.textSecondary}>
                                    Đặt lúc: {formatDateTime(booking.created_at)}
                                </Typography> */}
                                
                                <Gap  />
                                
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {booking.status === 'pending' && (
                                        <>
                                            <Button
                                                title="Xác nhận"
                                                onPress={() => handleStatusUpdate(booking.ID, 'confirmed')}
                                                style={{ flex: 1 }}
                                            />
                                            <Button
                                                title="Hủy"
                                                variant="outline"
                                                onPress={() => handleStatusUpdate(booking.ID, 'cancelled')}
                                                style={{ flex: 1 }}
                                            />
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <Button
                                            title="Chi tiết"
                                            variant="outline"
                                            onPress={() => {}}
                                            style={{ flex: 1 }}
                                        />
                                    )}
                                </View>
                            </View>
                        </Card>
                        ))
                    ) : (
                        <Card>
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Typography variant="h3" color={theme.colors.textSecondary}>
                                    📋
                                </Typography>
                                <Gap />
                                <Typography variant="h3" color={theme.colors.text}>
                                    Chưa có đặt vé nào
                                </Typography>
                                <Gap />
                                <Typography variant="body" color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
                                    {selectedStatus === 'all' 
                                        ? 'Chưa có đặt vé nào trong hệ thống'
                                        : `Chưa có đặt vé với trạng thái "${getStatusText(selectedStatus)}"`
                                    }
                                </Typography>
                            </View>
                        </Card>
                    )}
                </View>
            </ScrollView>

            {/* Create Booking Modal */}
            <Modal
                visible={showCreateModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <Container>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Gap  />
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* <Typography variant="h2" color={theme.colors.text}>
                                Tạo booking mới
                            </Typography> */}
                            <Button 
                                title="Đóng"
                                variant="outline"
                                onPress={() => setShowCreateModal(false)}
                                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                            />
                        </View>
                        
                        <Gap  />
                        
                        {/* Trip Selection */}
                        <Card>
                            <View style={{ padding: 16 }}>
                                <Typography variant="h3" color={theme.colors.text}>
                                    Chọn chuyến xe
                                </Typography>
                                <Gap />
                                <ScrollView style={{ maxHeight: 200 }}>
                                    {trips?.map((trip) => (
                                        <TouchableOpacity
                                            key={trip.ID}
                                            style={{
                                                padding: 12,
                                                borderRadius: 8,
                                                backgroundColor: formData.trip_id === trip.ID 
                                                    ? theme.colors.primary + '20' 
                                                    : theme.colors.card,
                                                borderWidth: 1,
                                                borderColor: formData.trip_id === trip.ID 
                                                    ? theme.colors.primary 
                                                    : theme.colors.border,
                                                marginBottom: 8
                                            }}
                                            onPress={() => setFormData({...formData, trip_id: trip.ID})}
                                        >
                                            <Typography variant="body" color={theme.colors.text}>
                                                {trip.route?.origin || 'N/A'} → {trip.route?.destination || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" color={theme.colors.textSecondary}>
                                                {formatDateTime(trip.departure_time)} - {formatCurrency(trip.price)}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </Card>
                        
                        <Gap />
                        
                        {/* Guest Info */}
                        <Card>
                            <View style={{ padding: 16 }}>
                                <Typography variant="h3" color={theme.colors.text}>
                                    Thông tin khách hàng
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
                                    placeholder="Họ tên khách hàng"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={formData.guest_info.name}
                                    onChangeText={(text) => setFormData({
                                        ...formData,
                                        guest_info: {...formData.guest_info, name: text}
                                    })}
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
                                    value={formData.guest_info.phone}
                                    onChangeText={(text) => setFormData({
                                        ...formData,
                                        guest_info: {...formData.guest_info, phone: text}
                                    })}
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
                                    placeholder="Email (tùy chọn)"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={formData.guest_info.email}
                                    onChangeText={(text) => setFormData({
                                        ...formData,
                                        guest_info: {...formData.guest_info, email: text}
                                    })}
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
                                    placeholder="Ghi chú (tùy chọn)"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={formData.note}
                                    onChangeText={(text) => setFormData({...formData, note: text})}
                                />
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
                                title="Tạo booking"
                                onPress={handleCreateBooking}
                                style={{ flex: 1 }}
                            />
                        </View>
                        
                        <Gap  />
                    </ScrollView>
                </Container>
            </Modal>
        </Container>
    );
}
