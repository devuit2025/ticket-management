# Bus API Documentation

## Base URL

```
http://localhost:8080/api/v1
```

## 1. Tạo Xe (Create Bus) [Admin]

Tạo một xe mới.

**Endpoint:** `POST /admin/buses`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "plate_number": "29B-12345", // Biển số xe (bắt buộc)
  "type": "Giường nằm", // Loại xe (bắt buộc)
  "seat_count": 40, // Số ghế (bắt buộc)
  "floor_count": 2 // Số tầng (1 hoặc 2, bắt buộc)
}
```

**Response Success: (201)**

```json
{
  "message": "Tạo xe thành công",
  "bus": {
    "id": 1,
    "plate_number": "29B-12345",
    "type": "Giường nằm",
    "seat_count": 40,
    "floor_count": 2,
    "is_active": true,
    "created_at": "2024-03-15 20:00:00",
    "updated_at": "2024-03-15 20:00:00"
  }
}
```

**Response Error: (400)**

```json
{
  "error": "Biển số xe đã tồn tại"
}
```

## 2. Cập Nhật Xe (Update Bus) [Admin]

Cập nhật thông tin của một xe.

**Endpoint:** `PUT /admin/buses/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "plate_number": "29B-12345", // Biển số xe (tùy chọn)
  "type": "Giường nằm", // Loại xe (tùy chọn)
  "seat_count": 40, // Số ghế (tùy chọn)
  "floor_count": 2, // Số tầng (1 hoặc 2, tùy chọn)
  "is_active": true // Trạng thái hoạt động (tùy chọn)
}
```

**Response Success: (200)**

```json
{
  "message": "Cập nhật xe thành công",
  "bus": {
    "id": 1,
    "plate_number": "29B-12345",
    "type": "Giường nằm",
    "seat_count": 40,
    "floor_count": 2,
    "is_active": true,
    "created_at": "2024-03-15 20:00:00",
    "updated_at": "2024-03-15 20:00:00"
  }
}
```

## 3. Xóa Xe (Delete Bus) [Admin]

Xóa một xe.

**Endpoint:** `DELETE /admin/buses/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response Success: (200)**

```json
{
  "message": "Xóa xe thành công"
}
```

## 4. Lấy Danh Sách Xe (Get Buses)

Lấy danh sách tất cả các xe.

**Endpoint:** `GET /buses`

**Response Success: (200)**

```json
{
  "buses": [
    {
      "id": 1,
      "plate_number": "29B-12345",
      "type": "Giường nằm",
      "seat_count": 40,
      "floor_count": 2,
      "is_active": true,
      "created_at": "2024-03-15 20:00:00",
      "updated_at": "2024-03-15 20:00:00"
    }
  ],
  "total": 1
}
```

## 5. Lấy Chi Tiết Xe (Get Bus)

Lấy thông tin chi tiết của một xe.

**Endpoint:** `GET /buses/:id`

**Response Success: (200)**

```json
{
  "bus": {
    "id": 1,
    "plate_number": "29B-12345",
    "type": "Giường nằm",
    "seat_count": 40,
    "floor_count": 2,
    "is_active": true,
    "created_at": "2024-03-15 20:00:00",
    "updated_at": "2024-03-15 20:00:00"
  }
}
```

## Lưu ý

1. Biển số xe (`plate_number`):

   - Phải là duy nhất
   - Format: XXX-XXXXX (ví dụ: 29B-12345)

2. Số ghế (`seat_count`):

   - Phải lớn hơn 0

3. Số tầng (`floor_count`):
   - Chỉ có thể là 1 hoặc 2
   - Xe 1 tầng: tất cả ghế ở tầng 1 (A01, A02, ...)
   - Xe 2 tầng: ghế được chia đều cho 2 tầng (A01-A20, B01-B20)
