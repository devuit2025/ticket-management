# Route API Documentation

## Base URL

```
http://localhost:8080/api/v1
```

## 1. Lấy Danh Sách Tuyến Đường (Get Routes)

Lấy danh sách tất cả các tuyến đường.

**Endpoint:** `GET /routes`

**Query Parameters:**

```
origin - Điểm đi
destination - Điểm đến
min_distance - Khoảng cách tối thiểu (km)
max_distance - Khoảng cách tối đa (km)
min_price - Giá vé tối thiểu
max_price - Giá vé tối đa
is_active - Trạng thái hoạt động (true/false)
```

**Response Success: (200)**

```json
{
  "routes": [
    {
      "id": 1,
      "origin": "Hà Nội",
      "destination": "Sapa",
      "distance": 320,
      "duration": "5h30m",
      "base_price": 350000,
      "is_active": true,
      "total_trips": 10,
      "upcoming_trips": 5,
      "min_price": 350000,
      "max_price": 455000,
      "created_at": "2024-03-15 20:00:00",
      "updated_at": "2024-03-15 20:00:00"
    }
  ],
  "total": 1
}
```

## 2. Lấy Tuyến Đường Phổ Biến (Get Popular Routes)

Lấy danh sách các tuyến đường phổ biến.

**Endpoint:** `GET /routes/popular`

**Response Success: (200)**

```json
{
  "routes": [
    {
      "id": 1,
      "origin": "Hà Nội",
      "destination": "Sapa",
      "distance": 320,
      "duration": "5h30m",
      "base_price": 350000,
      "is_active": true,
      "total_trips": 10,
      "upcoming_trips": 5,
      "min_price": 350000,
      "max_price": 455000,
      "created_at": "2024-03-15 20:00:00",
      "updated_at": "2024-03-15 20:00:00"
    }
  ],
  "total": 1
}
```

## 3. Lấy Chi Tiết Tuyến Đường (Get Route)

Lấy thông tin chi tiết của một tuyến đường.

**Endpoint:** `GET /routes/:id`

**Response Success: (200)**

```json
{
  "route": {
    "id": 1,
    "origin": "Hà Nội",
    "destination": "Sapa",
    "distance": 320,
    "duration": "5h30m",
    "base_price": 350000,
    "is_active": true,
    "total_trips": 10,
    "upcoming_trips": 5,
    "min_price": 350000,
    "max_price": 455000,
    "created_at": "2024-03-15 20:00:00",
    "updated_at": "2024-03-15 20:00:00"
  }
}
```

## 4. Tạo Tuyến Đường (Create Route) [Admin]

Tạo một tuyến đường mới.

**Endpoint:** `POST /admin/routes`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "origin": "Hà Nội",
  "destination": "Sapa",
  "distance": 320,
  "duration": "5h30m",
  "base_price": 350000
}
```

**Response Success: (201)**

```json
{
  "message": "Tạo tuyến đường thành công",
  "route": {
    "id": 1,
    "origin": "Hà Nội",
    "destination": "Sapa",
    "distance": 320,
    "duration": "5h30m",
    "base_price": 350000,
    "is_active": true,
    "total_trips": 0,
    "upcoming_trips": 0,
    "min_price": 350000,
    "max_price": 350000,
    "created_at": "2024-03-15 20:00:00",
    "updated_at": "2024-03-15 20:00:00"
  }
}
```

## 5. Cập Nhật Tuyến Đường (Update Route) [Admin]

Cập nhật thông tin của một tuyến đường.

**Endpoint:** `PUT /admin/routes/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "origin": "Hà Nội",
  "destination": "Sapa",
  "distance": 320,
  "duration": "5h30m",
  "base_price": 350000,
  "is_active": true
}
```

**Response Success: (200)**

```json
{
  "message": "Cập nhật tuyến đường thành công",
  "route": {
    "id": 1,
    "origin": "Hà Nội",
    "destination": "Sapa",
    "distance": 320,
    "duration": "5h30m",
    "base_price": 350000,
    "is_active": true,
    "total_trips": 10,
    "upcoming_trips": 5,
    "min_price": 350000,
    "max_price": 455000,
    "created_at": "2024-03-15 20:00:00",
    "updated_at": "2024-03-15 20:00:00"
  }
}
```

## 6. Xóa Tuyến Đường (Delete Route) [Admin]

Xóa một tuyến đường.

**Endpoint:** `DELETE /admin/routes/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response Success: (200)**

```json
{
  "message": "Xóa tuyến đường thành công"
}
```

## Lưu ý

1. Thông tin tuyến đường:

   - `origin`: Điểm đi
   - `destination`: Điểm đến
   - `distance`: Khoảng cách (km)
   - `duration`: Thời gian di chuyển (định dạng: "XhYm")
   - `base_price`: Giá vé cơ bản

2. Thống kê:

   - `total_trips`: Tổng số chuyến xe
   - `upcoming_trips`: Số chuyến xe sắp tới
   - `min_price`: Giá vé thấp nhất
   - `max_price`: Giá vé cao nhất

3. Tự động cập nhật:

   - Thống kê sẽ tự động cập nhật khi có thay đổi về chuyến xe
   - Giá vé thực tế có thể cao hơn giá cơ bản tùy theo loại ghế

4. Quyền truy cập:
   - API lấy danh sách và xem chi tiết là public
   - API tạo, sửa, xóa yêu cầu quyền admin
