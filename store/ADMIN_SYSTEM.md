# Admin System Documentation

## Tổng quan

Hệ thống admin đã được tích hợp vào ứng dụng ticket management với đầy đủ các tính năng quản lý.

## Cấu trúc Admin System

### 1. Navigation

- **AdminStack**: Stack navigation chính cho admin
- **AdminBottomTabs**: Bottom tab navigation với 4 tab chính
- **AuthGate**: Tự động phân biệt user/admin dựa trên role

### 2. Screens

- **DashboardScreen**: Tổng quan thống kê hệ thống
- **TripsScreen**: Quản lý chuyến xe (thêm, sửa, xóa)
- **BookingsScreen**: Quản lý đặt vé (xác nhận, hủy)
- **UsersScreen**: Quản lý người dùng

### 3. Components

- **StatsCard**: Card hiển thị thống kê với trend
- **DataTable**: Bảng dữ liệu có thể scroll ngang
- **StatusBadge**: Badge hiển thị trạng thái

### 4. API & Types

- **admin.ts**: API endpoints cho admin
- **admin.ts (types)**: TypeScript types cho admin

## Cách sử dụng

### 1. Đăng nhập Admin

```typescript
// User cần có role = 'admin' hoặc 'super_admin'
const user = {
    role: 'admin', // hoặc 'super_admin'
    // ... other fields
};
```

### 2. Navigation Flow

```
AuthGate → Kiểm tra role → AdminStack → AdminBottomTabs
```

### 3. Demo Components

Truy cập: `GlobalComponents` → `Admin System` → `Xem Admin Demo`

## Features

### Dashboard

- Thống kê tổng quan (vé bán, doanh thu, chuyến xe, người dùng)
- Hoạt động gần đây
- Stats cards với trend indicators

### Trips Management

- Xem danh sách chuyến xe (đang chạy/đã lên lịch)
- Thêm chuyến xe mới
- Chỉnh sửa/xóa chuyến xe
- Hiển thị thông tin: route, thời gian, xe, ghế, giá

### Bookings Management

- Xem tất cả đặt vé với filter theo status
- Xác nhận/hủy đặt vé
- Chi tiết thông tin khách hàng và chuyến xe
- Theo dõi trạng thái thanh toán

### Users Management

- Quản lý người dùng và admin
- Thêm/chỉnh sửa/xóa người dùng
- Thống kê hoạt động của từng user
- Phân quyền role

## API Endpoints

### Dashboard

- `GET /admin/dashboard/stats` - Thống kê tổng quan
- `GET /admin/dashboard/activity` - Hoạt động gần đây

### Trips

- `GET /admin/trips` - Danh sách chuyến xe
- `POST /admin/trips` - Tạo chuyến xe mới
- `PUT /admin/trips/:id` - Cập nhật chuyến xe
- `DELETE /admin/trips/:id` - Xóa chuyến xe

### Bookings

- `GET /admin/bookings` - Danh sách đặt vé
- `PUT /admin/bookings/:id/status` - Cập nhật trạng thái đặt vé
- `GET /admin/bookings/:id` - Chi tiết đặt vé

### Users

- `GET /admin/users` - Danh sách người dùng
- `POST /admin/users` - Tạo người dùng mới
- `PUT /admin/users/:id` - Cập nhật người dùng
- `DELETE /admin/users/:id` - Xóa người dùng
- `GET /admin/users/:id/stats` - Thống kê người dùng

## Customization

### Thêm Screen mới

1. Tạo screen trong `src/screens/admin/`
2. Thêm vào `AdminBottomTabs.tsx`
3. Cập nhật `AdminTabParamList` trong `navigationTypes.ts`

### Thêm Component mới

1. Tạo component trong `src/components/admin/`
2. Export trong `src/components/admin/index.ts`
3. Import và sử dụng trong screens

### Thêm API mới

1. Thêm function trong `src/api/admin.ts`
2. Thêm types trong `src/types/admin.ts`
3. Sử dụng trong screens với Redux/Context

## Security

- Role-based access control
- Admin routes chỉ accessible với role admin/super_admin
- API endpoints cần authentication và authorization
- Input validation và sanitization

## Future Enhancements

- Real-time notifications
- Advanced filtering và search
- Export data (CSV, PDF)
- Analytics và reporting
- Multi-language support
- Dark mode cho admin
- Mobile responsive design
