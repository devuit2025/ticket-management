import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import Button from '@components/global/button/Button';
import Icon from '@components/global/icon/Icon';
import { getAdminTrips, createTrip, updateTrip, deleteTrip, getRoutes, getBuses, getDrivers } from '@api/admin';

interface Trip {
    ID: number;
    route_id: number;
    route: {
        id: number;
        origin: string;
        destination: string;
        distance: number;
        duration: string;
        base_price: number;
    };
    bus_id: number;
    bus: {
        ID: number;
        plate_number: string;
        seat_count: number;
        type: string;
        floor_count: number;
        is_active: boolean;
    };
    driver_id: number;
    driver: {
        id: number;
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
    created_at: string;
    updated_at: string;
}

interface Route {
    id: number;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    base_price: number;
}

interface Bus {
    id: number;
    plate_number: string;
    seat_count: number;
    type: string;
    floor_count: number;
    is_active: boolean;
}

interface Driver {
    ID: number;
    name: string;
    phone: string;
    role: string;
}

interface TripFormData {
    route_id: number;
    bus_id: number;
    driver_id: number;
    departure_time: string;
    price: number;
    note: string;
}

export default function AdminTripsScreen() {
    const { theme } = useTheme();
    const [selectedTab, setSelectedTab] = useState<'active' | 'scheduled'>('active');
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
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
    
    // Options for dropdowns
    const [routes, setRoutes] = useState<Route[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    
    // Dropdown states
    const [showRouteDropdown, setShowRouteDropdown] = useState(false);
    const [showBusDropdown, setShowBusDropdown] = useState(false);
    const [showDriverDropdown, setShowDriverDropdown] = useState(false);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const response = await getAdminTrips();
            setTrips(response.trips || []);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const [routesResponse, busesResponse, driversResponse] = await Promise.all([
                getRoutes(),
                getBuses(),
                getDrivers()
            ]);
            
            setRoutes(routesResponse.routes || []);
            setBuses(busesResponse.buses || []);
            setDrivers(driversResponse.users || []);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTrips();
        setRefreshing(false);
    };

    // Only fetch data when screen is focused, not on every mount
    useFocusEffect(
        React.useCallback(() => {
            fetchTrips();
            fetchOptions();
        }, [])
    );

    // CRUD Functions
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
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập thời gian khởi hành');
            return false;
        }
        if (!validateDateTime(formData.departure_time)) {
            Alert.alert('Định dạng sai', 'Định dạng thời gian không đúng. Vui lòng sử dụng định dạng YYYY-MM-DD HH:MM\n\nVí dụ: 2025-09-15 14:30');
            return false;
        }
        
        // Check if departure time is in the future
        const departureDate = new Date(formData.departure_time);
        const now = new Date();
        if (departureDate <= now) {
            Alert.alert('Thời gian không hợp lệ', 'Thời gian khởi hành phải ở tương lai. Vui lòng chọn thời gian sau thời điểm hiện tại.\n\nGợi ý: Sử dụng nút "Ngày mai" để tự động điền thời gian hợp lệ.');
            return false;
        }
        
        if (!formData.price || formData.price <= 0) {
            Alert.alert('Giá vé không hợp lệ', 'Vui lòng nhập giá vé lớn hơn 0');
            return false;
        }
        return true;
    };

    const handleCreateTrip = async () => {
        if (!validateForm()) return;
        
        try {
            // Convert departure_time to ISO format
            const tripData = {
                ...formData,
                departure_time: new Date(formData.departure_time).toISOString()
            };
            
            await createTrip(tripData);
            setShowModal(false);
            resetForm();
            await fetchTrips();
            Alert.alert('Thành công', 'Chuyến xe đã được tạo thành công!');
        } catch (error: any) {
            console.error('Error creating trip:', error);
            
            // Parse error message from backend
            let errorMessage = 'Không thể tạo chuyến xe. Vui lòng thử lại.';
            
            if (error.response?.data?.error) {
                const backendError = error.response.data.error;
                
                if (backendError.includes('Thời gian khởi hành phải ở tương lai')) {
                    errorMessage = 'Thời gian khởi hành phải ở tương lai. Vui lòng chọn thời gian sau thời điểm hiện tại.';
                } else if (backendError.includes('Vui lòng điền đầy đủ thông tin')) {
                    errorMessage = 'Vui lòng điền đầy đủ thông tin. Kiểm tra lại các trường bắt buộc.';
                } else if (backendError.includes('Tuyến đường không tồn tại')) {
                    errorMessage = 'Tuyến đường không tồn tại. Vui lòng chọn tuyến đường khác.';
                } else if (backendError.includes('Xe không tồn tại')) {
                    errorMessage = 'Xe không tồn tại. Vui lòng chọn xe khác.';
                } else if (backendError.includes('Tài xế không tồn tại')) {
                    errorMessage = 'Tài xế không tồn tại. Vui lòng chọn tài xế khác.';
                } else {
                    errorMessage = backendError;
                }
            }
            
            Alert.alert('Lỗi tạo chuyến xe', errorMessage);
        }
    };

    const handleUpdateTrip = async () => {
        console.log('handleUpdateTrip called');
        console.log('editingTrip:', editingTrip);
        console.log('formData:', formData);
        
        if (!editingTrip || !editingTrip.ID) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin chuyến xe để cập nhật');
            return;
        }
        if (!validateForm()) return;
        
        try {
            // Convert departure_time to ISO format
            const tripData = {
                ...formData,
                departure_time: new Date(formData.departure_time).toISOString()
            };
            
            console.log('Sending tripData:', tripData);
            console.log('Trip ID:', editingTrip.ID.toString());
            
            await updateTrip(editingTrip.ID.toString(), tripData);
            setShowModal(false);
            setEditingTrip(null);
            resetForm();
            await fetchTrips();
            Alert.alert('Thành công', 'Chuyến xe đã được cập nhật thành công!');
        } catch (error: any) {
            console.error('Error updating trip:', error);
            
            // Parse error message from backend
            let errorMessage = 'Không thể cập nhật chuyến xe. Vui lòng thử lại.';
            
            if (error.response?.data?.error) {
                const backendError = error.response.data.error;
                
                if (backendError.includes('Thời gian khởi hành phải ở tương lai')) {
                    errorMessage = 'Thời gian khởi hành phải ở tương lai. Vui lòng chọn thời gian sau thời điểm hiện tại.';
                } else if (backendError.includes('Không tìm thấy chuyến đi')) {
                    errorMessage = 'Không tìm thấy chuyến xe để cập nhật. Vui lòng thử lại.';
                } else if (backendError.includes('Vui lòng điền đầy đủ thông tin')) {
                    errorMessage = 'Vui lòng điền đầy đủ thông tin. Kiểm tra lại các trường bắt buộc.';
                } else {
                    errorMessage = backendError;
                }
            }
            
            Alert.alert('Lỗi cập nhật chuyến xe', errorMessage);
        }
    };

    const handleDeleteTrip = async (trip: Trip) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc chắn muốn xóa chuyến xe ${trip.route.origin} - ${trip.route.destination}?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTrip(trip.ID.toString());
                            await fetchTrips();
                            Alert.alert('Thành công', 'Chuyến xe đã được xóa thành công!');
                        } catch (error: any) {
                            console.error('Error deleting trip:', error);
                            
                            // Parse error message from backend
                            let errorMessage = 'Không thể xóa chuyến xe. Vui lòng thử lại.';
                            
                            if (error.response?.data?.error) {
                                const backendError = error.response.data.error;
                                
                                if (backendError.includes('Không tìm thấy chuyến đi')) {
                                    errorMessage = 'Không tìm thấy chuyến xe để xóa. Có thể chuyến xe đã bị xóa trước đó.';
                                } else if (backendError.includes('Không thể xóa chuyến đi đã có vé đặt')) {
                                    errorMessage = 'Không thể xóa chuyến xe đã có vé đặt. Vui lòng hủy tất cả vé trước khi xóa chuyến xe.';
                                } else if (backendError.includes('Chuyến đi đã bắt đầu')) {
                                    errorMessage = 'Không thể xóa chuyến xe đã bắt đầu. Chỉ có thể xóa chuyến xe chưa khởi hành.';
                                } else {
                                    errorMessage = backendError;
                                }
                            }
                            
                            Alert.alert('Lỗi xóa chuyến xe', errorMessage);
                        }
                    }
                }
            ]
        );
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
        // Close all dropdowns
        setShowRouteDropdown(false);
        setShowBusDropdown(false);
        setShowDriverDropdown(false);
    };

    const openCreateModal = () => {
        resetForm();
        setEditingTrip(null);
        setShowModal(true);
    };

    const openEditModal = (trip: Trip) => {
        setFormData({
            route_id: trip.route_id,
            bus_id: trip.bus_id,
            driver_id: trip.driver_id,
            departure_time: formatDateTimeForInput(trip.departure_time),
            price: trip.price,
            note: trip.note || ''
        });
        setEditingTrip(trip);
        setShowModal(true);
    };

    // Dropdown handlers
    const selectRoute = (route: Route) => {
        setFormData({...formData, route_id: route.id});
        setShowRouteDropdown(false);
    };

    const selectBus = (bus: Bus) => {
        setFormData({...formData, bus_id: bus.id});
        setShowBusDropdown(false);
    };

    const selectDriver = (driver: Driver) => {
        setFormData({...formData, driver_id: driver.ID});
        setShowDriverDropdown(false);
    };

    // Helper functions for time formatting
    const formatDateTimeForInput = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            // Ensure the date is in the future by adding 1 day if it's in the past
            const now = new Date();
            if (date <= now) {
                date.setDate(date.getDate() + 1);
            }
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } catch (error) {
            return dateString;
        }
    };

    const validateDateTime = (dateTimeString: string) => {
        if (!dateTimeString) return false;
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        return regex.test(dateTimeString);
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getTripStatus = (trip: Trip) => {
        if (trip.is_completed) return 'completed';
        
        const now = new Date();
        const departureTime = new Date(trip.departure_time);
        
        // Nếu thời gian khởi hành đã qua hoặc đang ở hiện tại → "active" (đang chạy)
        if (departureTime <= now) {
            return 'active';
        }
        
        // Nếu thời gian khởi hành ở tương lai → "scheduled" (đã lên lịch)
        return 'scheduled';
    };

    const filteredTrips = trips.filter(trip => {
        const status = getTripStatus(trip);
        let matchesTab = false;
        
        if (selectedTab === 'active') {
            matchesTab = status === 'active';
        } else {
            matchesTab = status === 'scheduled';
        }
        
        if (!matchesTab) return false;
        
        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                trip.route.origin.toLowerCase().includes(query) ||
                trip.route.destination.toLowerCase().includes(query) ||
                trip.bus.plate_number.toLowerCase().includes(query) ||
                trip.driver.name.toLowerCase().includes(query) ||
                trip.driver.phone.includes(query)
            );
        }
        
        return true;
    });

    if (loading) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Gap />
                    <Typography variant="body" color={theme.colors.textSecondary}>
                        Đang tải dữ liệu...
                    </Typography>
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Gap />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h2" color={theme.colors.text}>
                        Quản lý chuyến xe
                    </Typography>
                    <Button 
                        title="Thêm chuyến"
                        onPress={openCreateModal}
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    />
                </View>
                
                <Gap />
                
                {/* Search Form */}
                <Card>
                    <View style={{ padding: 16 }}>
                        <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                            Tìm kiếm chuyến xe
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
                            placeholder="Tìm theo tuyến đường, xe, tài xế..."
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                        {searchQuery.trim() && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                <Typography variant="caption" color={theme.colors.textSecondary}>
                                    Tìm thấy {filteredTrips.length} kết quả
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
                
                {/* Tab Selector */}
                <View style={{ 
                    flexDirection: 'row', 
                    backgroundColor: theme.colors.card,
                    borderRadius: 8,
                    padding: 4,
                    marginBottom: 16
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 6,
                            backgroundColor: selectedTab === 'active' ? theme.colors.primary : 'transparent',
                            alignItems: 'center'
                        }}
                        onPress={() => setSelectedTab('active')}
                    >
                        <Typography 
                            variant="body" 
                            color={selectedTab === 'active' ? theme.colors.white : theme.colors.text}
                        >
                            Đang chạy ({trips.filter(trip => getTripStatus(trip) === 'active').length})
                        </Typography>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 6,
                            backgroundColor: selectedTab === 'scheduled' ? theme.colors.primary : 'transparent',
                            alignItems: 'center'
                        }}
                        onPress={() => setSelectedTab('scheduled')}
                    >
                        <Typography 
                            variant="body" 
                            color={selectedTab === 'scheduled' ? theme.colors.white : theme.colors.text}
                        >
                            Đã lên lịch ({trips.filter(trip => getTripStatus(trip) === 'scheduled').length})
                        </Typography>
                    </TouchableOpacity>
                </View>
                
                {/* Trips List */}
                <View style={{ gap: 12 }}>
                    {filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                        <Card key={trip.ID}>
                            <View style={{ padding: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View style={{ flex: 1 }}>
                                            <Typography variant="h3" color={theme.colors.text}>
                                                {trip.route.origin} - {trip.route.destination}
                                            </Typography>
                                            <Gap />
                                            <Typography variant="body" color={theme.colors.textSecondary}>
                                                Khởi hành: {formatTime(trip.departure_time)} ({formatDate(trip.departure_time)})
                                            </Typography>
                                        <Typography variant="body" color={theme.colors.textSecondary}>
                                            Xe: {trip.bus.plate_number} ({trip.bus.type})
                                        </Typography>
                                            <Typography variant="body" color={theme.colors.textSecondary}>
                                                Tài xế: {trip.driver.name}
                                            </Typography>
                                        </View>
                                        
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Typography variant="h3" color={theme.colors.primary}>
                                                {formatCurrency(trip.price)}
                                            </Typography>
                                            <Gap />
                                            <Typography variant="caption" color={theme.colors.textSecondary}>
                                                {(trip.total_seats - trip.booked_seats)}/{trip.total_seats} ghế trống
                                        </Typography>
                                            <Typography variant="caption" color={theme.colors.textSecondary}>
                                                {trip.route.distance}km - {trip.route.duration}
                                        </Typography>
                                        </View>
                                    </View>
                                    
                                    {trip.note && (
                                        <>
                                            <Gap />
                                            <Typography variant="caption" color={theme.colors.textSecondary}>
                                                Ghi chú: {trip.note}
                                            </Typography>
                                        </>
                                    )}
                                    
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
                                            onPress={() => openEditModal(trip)}
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
                                                backgroundColor: theme.colors.error + '20',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 40,
                                                minHeight: 40
                                            }}
                                            onPress={() => handleDeleteTrip(trip)}
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
                                <Typography variant="body" color={theme.colors.textSecondary}>
                                    Không có chuyến xe nào
                                </Typography>
                                <Gap />
                                <Typography variant="caption" color={theme.colors.textSecondary}>
                                    {selectedTab === 'active' ? 'Chưa có chuyến xe đang chạy' : 'Chưa có chuyến xe đã lên lịch'}
                                </Typography>
                            </View>
                        </Card>
                    )}
                </View>
            </ScrollView>

            {/* Trip Form Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <Container>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Gap />
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h2" color={theme.colors.text}>
                                {editingTrip ? 'Chỉnh sửa chuyến xe' : 'Thêm chuyến xe mới'}
                            </Typography>
                            <Button
                                title="Đóng"
                                variant="outline"
                                onPress={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                            />
                        </View>
                        
                        <Gap />
                        
                        <Card>
                            <View style={{ padding: 16, gap: 16 }}>
                                {/* Route Selection */}
                                <View>
                                    <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                                        Tuyến đường *
                                    </Typography>
                                    <TouchableOpacity 
                                        style={{ 
                                            borderWidth: 1, 
                                            borderColor: theme.colors.border, 
                                            borderRadius: 8, 
                                            padding: 12 
                                        }}
                                        onPress={() => setShowRouteDropdown(!showRouteDropdown)}
                                    >
                                        <Typography variant="body" color={theme.colors.text}>
                                            {formData.route_id ? 
                                                routes.find(r => r.id === formData.route_id)?.origin + ' - ' + 
                                                routes.find(r => r.id === formData.route_id)?.destination :
                                                'Chọn tuyến đường'
                                            }
                                        </Typography>
                                    </TouchableOpacity>
                                    
                                    {showRouteDropdown && (
                                        <View style={{
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                            borderRadius: 8,
                                            marginTop: 4,
                                            maxHeight: 150,
                                            backgroundColor: theme.colors.background
                                        }}>
                                            <ScrollView style={{ maxHeight: 150 }}>
                                                {routes.map((item) => (
                                                    <TouchableOpacity
                                                        key={item.id.toString()}
                                                        style={{
                                                            padding: 12,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: theme.colors.border
                                                        }}
                                                        onPress={() => selectRoute(item)}
                                                    >
                                                        <Typography variant="body" color={theme.colors.text}>
                                                            {item.origin} - {item.destination}
                                                        </Typography>
                                                        <Typography variant="caption" color={theme.colors.textSecondary}>
                                                            {item.distance}km • {item.duration} • {formatCurrency(item.base_price)}
                                                        </Typography>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                {/* Bus Selection */}
                                <View>
                                    <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                                        Xe *
                                    </Typography>
                                    <TouchableOpacity 
                                        style={{ 
                                            borderWidth: 1, 
                                            borderColor: theme.colors.border, 
                                            borderRadius: 8, 
                                            padding: 12 
                                        }}
                                        onPress={() => setShowBusDropdown(!showBusDropdown)}
                                    >
                                        <Typography variant="body" color={theme.colors.text}>
                                            {formData.bus_id ? 
                                                buses.find(b => b.id === formData.bus_id)?.plate_number + ' (' + 
                                                buses.find(b => b.id === formData.bus_id)?.type + ')' :
                                                'Chọn xe'
                                            }
                                        </Typography>
                                    </TouchableOpacity>
                                    
                                    {showBusDropdown && (
                                        <View style={{
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                            borderRadius: 8,
                                            marginTop: 4,
                                            maxHeight: 150,
                                            backgroundColor: theme.colors.background
                                        }}>
                                            <ScrollView style={{ maxHeight: 150 }}>
                                                {buses.map((item) => (
                                                    <TouchableOpacity
                                                        key={item.id.toString()}
                                                        style={{
                                                            padding: 12,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: theme.colors.border
                                                        }}
                                                        onPress={() => selectBus(item)}
                                                    >
                                                        <Typography variant="body" color={theme.colors.text}>
                                                            {item.plate_number} ({item.type})
                                                        </Typography>
                                        <Typography variant="caption" color={theme.colors.textSecondary}>
                                                            {item.seat_count} chỗ • {item.floor_count} tầng
                                                        </Typography>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                {/* Driver Selection */}
                                <View>
                                    <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                                        Tài xế *
                                    </Typography>
                                    <TouchableOpacity 
                                        style={{ 
                                            borderWidth: 1, 
                                            borderColor: theme.colors.border, 
                                            borderRadius: 8, 
                                            padding: 12 
                                        }}
                                        onPress={() => setShowDriverDropdown(!showDriverDropdown)}
                                    >
                                        <Typography variant="body" color={theme.colors.text}>
                                            {formData.driver_id ? 
                                                drivers.find(d => d.ID === formData.driver_id)?.name :
                                                'Chọn tài xế'
                                            }
                                        </Typography>
                                    </TouchableOpacity>
                                    
                                    {showDriverDropdown && (
                                        <View style={{
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                            borderRadius: 8,
                                            marginTop: 4,
                                            maxHeight: 150,
                                            backgroundColor: theme.colors.background
                                        }}>
                                            <ScrollView style={{ maxHeight: 150 }}>
                                                {drivers.map((item) => (
                                                    <TouchableOpacity
                                                        key={item.ID.toString()}
                                                        style={{
                                                            padding: 12,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: theme.colors.border
                                                        }}
                                                        onPress={() => selectDriver(item)}
                                                    >
                                                        <Typography variant="body" color={theme.colors.text}>
                                                            {item.name}
                                                        </Typography>
                                                        <Typography variant="caption" color={theme.colors.textSecondary}>
                                                            {item.phone}
                                                        </Typography>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                {/* Departure Time */}
                                <View>
                                    <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                                        Thời gian khởi hành *
                                    </Typography>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <TextInput
                                            style={{
                                                borderWidth: 1,
                                                borderColor: theme.colors.border,
                                                borderRadius: 8,
                                                padding: 12,
                                                color: theme.colors.text,
                                                backgroundColor: theme.colors.background,
                                                flex: 1
                                            }}
                                            value={formData.departure_time}
                                            onChangeText={(text) => setFormData({...formData, departure_time: text})}
                                            placeholder="YYYY-MM-DD HH:MM (VD: 2024-12-25 08:30)"
                                            placeholderTextColor={theme.colors.textSecondary}
                                        />
                                        <Button
                                            title="Tự động điền"
                                            variant="outline"
                                            onPress={() => {
                                                const tomorrow = new Date();
                                                tomorrow.setDate(tomorrow.getDate() + 1);
                                                tomorrow.setHours(8, 0, 0, 0); // Set to 8:00 AM
                                                const formatted = formatDateTimeForInput(tomorrow.toISOString());
                                                setFormData({...formData, departure_time: formatted});
                                            }}
                                            style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                                        />
                                    </View>
                                    <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
                                        💡 Gợi ý: Sử dụng định dạng YYYY-MM-DD HH:MM hoặc nhấn "Tự động điền"
                                    </Typography>
                                </View>

                                {/* Price */}
                                <View>
                                    <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                                        Giá vé *
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
                                        value={formData.price.toString()}
                                        onChangeText={(text) => setFormData({...formData, price: parseFloat(text) || 0})}
                                        placeholder="Nhập giá vé"
                                        placeholderTextColor={theme.colors.textSecondary}
                                        keyboardType="numeric"
                                    />
                                </View>

                                {/* Note */}
                                <View>
                                    <Typography variant="body" color={theme.colors.text} style={{ marginBottom: 8 }}>
                                        Ghi chú
                                    </Typography>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                            borderRadius: 8,
                                            padding: 12,
                                            color: theme.colors.text,
                                            backgroundColor: theme.colors.background,
                                            minHeight: 80,
                                            textAlignVertical: 'top'
                                        }}
                                        value={formData.note}
                                        onChangeText={(text) => setFormData({...formData, note: text})}
                                        placeholder="Nhập ghi chú (tùy chọn)"
                                        placeholderTextColor={theme.colors.textSecondary}
                                        multiline
                                    />
                                </View>
                                
                                <Gap />
                                
                                {/* Action Buttons */}
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <Button
                                        title="Hủy"
                                        variant="outline"
                                        onPress={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        title={editingTrip ? 'Cập nhật' : 'Tạo mới'}
                                        onPress={editingTrip ? handleUpdateTrip : handleCreateTrip}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                            </View>
                        </Card>
            </ScrollView>
                </Container>
            </Modal>
        </Container>
    );
}
