import React from 'react';
import {
    Modal,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Gap from '@components/global/gap/Gap';
import Button from '@components/global/button/Button';
import Icon from '@components/global/icon/Icon';
import { Booking } from '@types/booking';

interface BookingDetailModalProps {
    visible: boolean;
    booking: Booking | null;
    onClose: () => void;
    onStatusUpdate?: (bookingId: number, newStatus: 'confirmed' | 'cancelled') => void;
    onPaymentUpdate?: (bookingId: number, newStatus: 'paid' | 'unpaid') => void;
    onCancelBooking?: (bookingId: number) => void;
}

export default function BookingDetailModal({
    visible,
    booking,
    onClose,
    onStatusUpdate,
    onPaymentUpdate,
    onCancelBooking,
}: BookingDetailModalProps) {
    const { theme } = useTheme();

    if (!booking) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

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

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return theme.colors.success;
            case 'unpaid': return theme.colors.warning;
            default: return theme.colors.textSecondary;
        }
    };

    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case 'paid': return 'Đã thanh toán';
            case 'unpaid': return 'Chưa thanh toán';
            default: return status;
        }
    };

    const handleStatusUpdate = (newStatus: 'confirmed' | 'cancelled') => {
        // Alert.alert(
        //     'Xác nhận',
        //     `Bạn có chắc chắn muốn ${newStatus === 'confirmed' ? 'xác nhận' : 'hủy'} đơn hàng này?`,
        //     [
        //         { text: 'Hủy', style: 'cancel' },
        //         {
        //             text: 'Xác nhận',
        //             onPress: () => {
        //                 onStatusUpdate?.(booking.ID, newStatus);
        //                 onClose();
        //             }
        //         }
        //     ]
        // );
        onStatusUpdate?.(booking.ID, newStatus);
        onClose();
    };

    const handlePaymentUpdate = (newStatus: 'paid' | 'unpaid') => {
        Alert.alert(
            'Xác nhận',
            `Bạn có chắc chắn muốn ${newStatus === 'paid' ? 'đánh dấu đã thanh toán' : 'đánh dấu chưa thanh toán'}?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xác nhận',
                    onPress: () => {
                        onPaymentUpdate?.(booking.ID, newStatus);
                        onClose();
                    }
                }
            ]
        );
    };

    const handleCancelBooking = () => {
        Alert.alert(
            'Xác nhận hủy vé',
            'Bạn có chắc chắn muốn hủy vé này? Hành động này không thể hoàn tác.',
            [
                { text: 'Không', style: 'cancel' },
                {
                    text: 'Có, hủy vé',
                    style: 'destructive',
                    onPress: () => {
                        onCancelBooking?.(booking.ID);
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <Container style={styles.container}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" type="ion" size="lg" color={theme.colors.text} />
                    </TouchableOpacity>
                    <Typography variant="h3" style={styles.headerTitle}>
                        Chi tiết đơn hàng
                    </Typography>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Booking Info */}
                    <Card style={styles.card}>
                        <Typography variant="h4" style={styles.sectionTitle}>
                            Thông tin đơn hàng
                        </Typography>
                        <Gap size="sm" />
                        
                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Mã đơn hàng:
                            </Typography>
                            <Typography variant="body" style={styles.value}>
                                {booking.booking_code}
                            </Typography>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Trạng thái:
                            </Typography>
                            <View style={styles.statusContainer}>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(booking.status) + '20' }
                                ]}>
                                    <Typography variant="caption" style={[
                                        styles.statusText,
                                        { color: getStatusColor(booking.status) }
                                    ]}>
                                        {getStatusText(booking.status)}
                                    </Typography>
                                </View>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Thanh toán:
                            </Typography>
                            <View style={styles.statusContainer}>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getPaymentStatusColor(booking.payment_status) + '20' }
                                ]}>
                                    <Typography variant="caption" style={[
                                        styles.statusText,
                                        { color: getPaymentStatusColor(booking.payment_status) }
                                    ]}>
                                        {getPaymentStatusText(booking.payment_status)}
                                    </Typography>
                                </View>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Tổng tiền:
                            </Typography>
                            <Typography variant="body" style={[styles.value, styles.priceText]}>
                                {formatCurrency(booking.total_amount)}
                            </Typography>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Phương thức thanh toán:
                            </Typography>
                            <Typography variant="body" style={styles.value}>
                                {booking.payment_type === 'cash' ? 'Tiền mặt' : booking.payment_type}
                            </Typography>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Ngày tạo:
                            </Typography>
                            <Typography variant="body" style={styles.value}>
                                {formatDateTime(booking.created_at)}
                            </Typography>
                        </View>

                        {booking.note && (
                            <View style={styles.infoRow}>
                                <Typography variant="body" style={styles.label}>
                                    Ghi chú:
                                </Typography>
                                <Typography variant="body" style={styles.value}>
                                    {booking.note}
                                </Typography>
                            </View>
                        )}
                    </Card>

                    {/* Trip Info */}
                    <Card style={styles.card}>
                        <Typography variant="h4" style={styles.sectionTitle}>
                            Thông tin chuyến đi
                        </Typography>
                        <Gap size="sm" />
                        
                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Tuyến đường:
                            </Typography>
                            <Typography variant="body" style={styles.value}>
                                {booking.trip?.route?.origin} → {booking.trip?.route?.destination}
                            </Typography>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Thời gian khởi hành:
                            </Typography>
                            <Typography variant="body" style={styles.value}>
                                {formatDateTime(booking.trip?.departure_time || '')}
                            </Typography>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Xe:
                            </Typography>
                            <Typography variant="body" style={styles.value}>
                                {booking.trip?.bus?.plate_number}
                            </Typography>
                        </View>

                        <View style={styles.infoRow}>
                            <Typography variant="body" style={styles.label}>
                                Ghế đã đặt:
                            </Typography>
                            <Typography variant="body" style={styles.value}>
                                {booking.seat_ids?.join(', ')}
                            </Typography>
                        </View>
                    </Card>

                    {/* Customer Info */}
                    <Card style={styles.card}>
                        <Typography variant="h4" style={styles.sectionTitle}>
                            Thông tin khách hàng
                        </Typography>
                        <Gap size="sm" />
                        
                        {booking.user ? (
                            <>
                                <View style={styles.infoRow}>
                                    <Typography variant="body" style={styles.label}>
                                        Tên:
                                    </Typography>
                                    <Typography variant="body" style={styles.value}>
                                        {booking.user.name}
                                    </Typography>
                                </View>

                                <View style={styles.infoRow}>
                                    <Typography variant="body" style={styles.label}>
                                        Số điện thoại:
                                    </Typography>
                                    <Typography variant="body" style={styles.value}>
                                        {booking.user.phone}
                                    </Typography>
                                </View>

                                <View style={styles.infoRow}>
                                    <Typography variant="body" style={styles.label}>
                                        Vai trò:
                                    </Typography>
                                    <Typography variant="body" style={styles.value}>
                                        {booking.user.role}
                                    </Typography>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.infoRow}>
                                    <Typography variant="body" style={styles.label}>
                                        Tên:
                                    </Typography>
                                    <Typography variant="body" style={styles.value}>
                                        {booking.guest_info?.name}
                                    </Typography>
                                </View>

                                <View style={styles.infoRow}>
                                    <Typography variant="body" style={styles.label}>
                                        Số điện thoại:
                                    </Typography>
                                    <Typography variant="body" style={styles.value}>
                                        {booking.guest_info?.phone}
                                    </Typography>
                                </View>

                                {booking.guest_info?.email && (
                                    <View style={styles.infoRow}>
                                        <Typography variant="body" style={styles.label}>
                                            Email:
                                        </Typography>
                                        <Typography variant="body" style={styles.value}>
                                            {booking.guest_info.email}
                                        </Typography>
                                    </View>
                                )}
                            </>
                        )}
                    </Card>

                    {/* Action Buttons */}
                    <Card style={styles.card}>
                        <Typography variant="h4" style={styles.sectionTitle}>
                            Thao tác
                        </Typography>
                        <Gap size="md" />
                        
                        <View style={styles.buttonRow}>
                            {(booking.status === 'pending' || booking.status === 'cancelled') && (
                                <Button
                                    title="Xác nhận đơn"
                                    onPress={() => handleStatusUpdate('confirmed')}
                                    style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                                    textStyle={{ color: 'white' }}
                                />
                            )}
                            
                            {(
                                <Button
                                    title="Hủy đơn"
                                    onPress={() => handleStatusUpdate('cancelled')}
                                    style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                                    textStyle={{ color: 'white' }}
                                />
                            )}
                        </View>

                        <Gap size="sm" />
                        
                        {/* <View style={styles.buttonRow}>
                            {booking.payment_status === 'unpaid' && (
                                <Button
                                    title="Đánh dấu đã thanh toán"
                                    onPress={() => handlePaymentUpdate('paid')}
                                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                                    textStyle={{ color: 'white' }}
                                />
                            )}
                            
                            {booking.payment_status === 'paid' && (
                                <Button
                                    title="Đánh dấu chưa thanh toán"
                                    onPress={() => handlePaymentUpdate('unpaid')}
                                    style={[styles.actionButton, { backgroundColor: theme.colors.warning }]}
                                    textStyle={{ color: 'white' }}
                                />
                            )}
                        </View> */}

                        {/* Cancel Booking Button - Show for all statuses except cancelled */}
                        {/* {booking.status !== 'cancelled' && (
                            <>
                                <Gap size="sm" />
                                <Button
                                    title="Hủy vé"
                                    onPress={handleCancelBooking}
                                    style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                                    textStyle={{ color: 'white' }}
                                />
                            </>
                        )} */}
                    </Card>
                </ScrollView>
            </Container>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    label: {
        flex: 1,
        fontWeight: '500',
    },
    value: {
        flex: 2,
        textAlign: 'right',
    },
    priceText: {
        fontWeight: '600',
        color: '#2E7D32',
    },
    statusContainer: {
        flex: 2,
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
    },
});
