# Trip API Documentation

## Base URL

```
http://localhost:8081/api/v1
```

## 1. Tìm Kiếm Chuyến Xe (Search Trips)

Tìm kiếm chuyến xe với các bộ lọc.

**Endpoint:** `GET /trips`

**Query Parameters:**

```
route_id - ID tuyến đường
from_date - Ngày khởi hành từ (YYYY-MM-DD)
to_date - Ngày khởi hành đến (YYYY-MM-DD)
min_price - Giá vé tối thiểu
max_price - Giá vé tối đa
has_seats - Còn ghế trống (true/false)
status - Trạng thái chuyến (upcoming/ongoing/complete/canceled)
```

**Response Success: (200)**

```json
{
  "trips": [
    {
      "id": 1,
      "route_id": 1,
      "route": {
        "origin": "Hà Nội",
        "destination": "Sapa",
        "distance": 320,
        "duration": "5h30m"
      },
      "bus": {
        "plate_number": "29B-12345",
        "type": "Giường nằm",
        "total_seats": 40
      },
      "driver": {
        "id": 3,
        "name": "Nguyễn Văn C",
        "phone": "0987654323"
      },
      "departure_time": "2024-03-15 20:00:00",
      "arrival_time": "2024-03-16 01:30:00",
      "price": 350000,
      "status": "upcoming",
      "available_seats": 40,
      "total_seats": 40,
      "total_bookings": 0,
      "note": "",
      "created_at": "2024-03-15 10:00:00",
      "updated_at": "2024-03-15 10:00:00"
    }
  ],
  "total": 1
}
```

## 2. Lấy Chuyến Xe Khả Dụng (Get Available Trips)

Lấy danh sách các chuyến xe còn ghế trống cho một tuyến đường và ngày cụ thể.

**Endpoint:** `GET /trips/available`

**Query Parameters:**

```
route_id - ID tuyến đường (bắt buộc)
date - Ngày khởi hành (YYYY-MM-DD, mặc định là ngày hiện tại)
```

**Response Success: (200)**

```json
{
  "trips": [
    {
      "id": 1,
      "route_id": 1,
      "route": {
        "origin": "Hà Nội",
        "destination": "Sapa",
        "distance": 320,
        "duration": "5h30m"
      },
      "bus": {
        "plate_number": "29B-12345",
        "type": "Giường nằm",
        "total_seats": 40
      },
      "driver": {
        "id": 3,
        "name": "Nguyễn Văn C",
        "phone": "0987654323"
      },
      "departure_time": "2024-03-15 20:00:00",
      "arrival_time": "2024-03-16 01:30:00",
      "price": 350000,
      "status": "upcoming",
      "available_seats": 40,
      "total_seats": 40,
      "total_bookings": 0,
      "note": "",
      "created_at": "2024-03-15 10:00:00",
      "updated_at": "2024-03-15 10:00:00"
    }
  ],
  "total": 1
}
```

## 3. Lấy Chi Tiết Chuyến Xe (Get Trip)

Lấy thông tin chi tiết của một chuyến xe.

**Endpoint:** `GET /trips/:id`

**Response Success: (200)**

```json
{
  "trip": {
    "id": 1,
    "route_id": 1,
    "route": {
      "origin": "Hà Nội",
      "destination": "Sapa",
      "distance": 320,
      "duration": "5h30m"
    },
    "bus": {
      "plate_number": "29B-12345",
      "type": "Giường nằm",
      "total_seats": 40
    },
    "driver": {
      "id": 3,
      "name": "Nguyễn Văn C",
      "phone": "0987654323"
    },
    "departure_time": "2024-03-15 20:00:00",
    "arrival_time": "2024-03-16 01:30:00",
    "price": 350000,
    "status": "upcoming",
    "available_seats": 40,
    "total_seats": 40,
    "total_bookings": 0,
    "note": "",
    "created_at": "2024-03-15 10:00:00",
    "updated_at": "2024-03-15 10:00:00"
  }
}
```

## 4. Tạo Chuyến Xe (Create Trip) [Admin]

Tạo một chuyến xe mới.

**Endpoint:** `POST /admin/trips`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "route_id": 1,
  "bus_id": 1,
  "driver_id": 3,
  "departure_time": "2024-03-15 20:00:00",
  "price": 350000,
  "note": "Có wifi miễn phí"
}
```

**Response Success: (201)**

```json
{
  "message": "Tạo chuyến xe thành công",
  "trip": {
    "id": 1,
    "route_id": 1,
    "route": {
      "origin": "Hà Nội",
      "destination": "Sapa",
      "distance": 320,
      "duration": "5h30m"
    },
    "bus": {
      "plate_number": "29B-12345",
      "type": "Giường nằm",
      "total_seats": 40
    },
    "driver": {
      "id": 3,
      "name": "Nguyễn Văn C",
      "phone": "0987654323"
    },
    "departure_time": "2024-03-15 20:00:00",
    "arrival_time": "2024-03-16 01:30:00",
    "price": 350000,
    "status": "upcoming",
    "available_seats": 40,
    "total_seats": 40,
    "total_bookings": 0,
    "note": "Có wifi miễn phí",
    "created_at": "2024-03-15 10:00:00",
    "updated_at": "2024-03-15 10:00:00"
  }
}
```

## 5. Cập Nhật Chuyến Xe (Update Trip) [Admin]

Cập nhật thông tin của một chuyến xe.

**Endpoint:** `PUT /admin/trips/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "route_id": 1,
  "bus_id": 1,
  "driver_id": 3,
  "departure_time": "2024-03-15 20:00:00",
  "price": 350000,
  "status": "canceled",
  "note": "Có wifi miễn phí"
}
```

**Response Success: (200)**

```json
{
  "message": "Cập nhật chuyến xe thành công",
  "trip": {
    "id": 1,
    "route_id": 1,
    "route": {
      "origin": "Hà Nội",
      "destination": "Sapa",
      "distance": 320,
      "duration": "5h30m"
    },
    "bus": {
      "plate_number": "29B-12345",
      "type": "Giường nằm",
      "total_seats": 40
    },
    "driver": {
      "id": 3,
      "name": "Nguyễn Văn C",
      "phone": "0987654323"
    },
    "departure_time": "2024-03-15 20:00:00",
    "arrival_time": "2024-03-16 01:30:00",
    "price": 350000,
    "status": "canceled",
    "available_seats": 40,
    "total_seats": 40,
    "total_bookings": 0,
    "note": "Có wifi miễn phí",
    "created_at": "2024-03-15 10:00:00",
    "updated_at": "2024-03-15 10:00:00"
  }
}
```

## 6. Xóa Chuyến Xe (Delete Trip) [Admin]

Xóa một chuyến xe.

**Endpoint:** `DELETE /admin/trips/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response Success: (200)**

```json
{
  "message": "Xóa chuyến xe thành công"
}
```

## Lưu ý

1. Trạng thái chuyến (`status`):

   - upcoming: Sắp khởi hành
   - ongoing: Đang chạy
   - complete: Đã hoàn thành
   - canceled: Đã hủy

2. Thời gian:

   - `departure_time`: Thời gian khởi hành (YYYY-MM-DD HH:mm:ss)
   - `arrival_time`: Thời gian đến (tự động tính bằng cách cộng thời gian di chuyển của tuyến đường)

3. Ghế:

   - `total_seats`: Tổng số ghế của xe
   - `available_seats`: Số ghế còn trống
   - `total_bookings`: Tổng số vé đã đặt

4. Tự động cập nhật:

   - Trạng thái chuyến sẽ tự động cập nhật dựa trên thời gian
   - Số ghế trống sẽ tự động cập nhật khi có đặt vé hoặc hủy vé

5. Quyền truy cập:
   - API tìm kiếm và xem chi tiết là public
   - API tạo, sửa, xóa yêu cầu quyền admin
