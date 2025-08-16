# Seat API Documentation

## Base URL

```
http://localhost:8081/api/v1
```

## 1. Tạo Sơ Đồ Ghế (Create Seats) [Admin]

Tạo sơ đồ ghế cho một chuyến xe.

**Endpoint:** `POST /admin/trips/:id/seats`

**Headers:**

```
Authorization: Bearer <token>
```

**Response Success: (201)**

```json
{
  "message": "Tạo sơ đồ ghế thành công",
  "seats": [
    {
      "id": 1,
      "trip_id": 1,
      "seat_number": "A01",
      "type": "double",
      "floor": 1,
      "status": "available",
      "price": 456000
    }
  ],
  "total": 45
}
```

**Response Error: (400)**

```json
{
  "error": "Chuyến xe đã có sơ đồ ghế"
}
```

## 2. Lấy Sơ Đồ Ghế (Get Seat Map)

Lấy sơ đồ ghế của một chuyến xe.

**Endpoint:** `GET /trips/:id/seats`

**Response Success: (200)**

```json
{
  "trip_info": {
    "id": 1,
    "route": "Hà Nội - Sapa",
    "departure_time": "2024-03-15 20:00:00",
    "bus_type": "Giường nằm",
    "base_price": 380000
  },
  "floors": [
    {
      "floor": 1,
      "seats": [
        {
          "id": 1,
          "trip_id": 1,
          "seat_number": "A01",
          "type": "normal",
          "floor": 1,
          "status": "available",
          "price": 380000
        }
      ]
    }
  ]
}
```

## 3. Lấy Ghế Trống (Get Available Seats)

Lấy danh sách các ghế còn trống của một chuyến xe.

**Endpoint:** `GET /trips/:id/seats/available`

**Response Success: (200)**

```json
{
  "seats": [
    {
      "id": 1,
      "trip_id": 1,
      "seat_number": "A01",
      "type": "normal",
      "floor": 1,
      "status": "available",
      "price": 380000
    }
  ],
  "total": 1
}
```

## 4. Kiểm Tra Trạng Thái Ghế (Check Seat Status)

Kiểm tra trạng thái của một hoặc nhiều ghế.

**Endpoint:** `POST /trips/:id/seats/check`

**Request Body:**

```json
{
  "seat_ids": [1, 2, 3]
}
```

**Response Success: (200)**

```json
{
  "statuses": {
    "1": "available",
    "2": "booked",
    "3": "pending"
  }
}
```

## 5. Khóa Ghế (Lock Seats)

Khóa một hoặc nhiều ghế để đặt vé.

**Endpoint:** `POST /trips/:id/seats/lock`

**Request Body:**

```json
{
  "seat_ids": [1, 2, 3]
}
```

**Response Success: (200)**

```json
{
  "message": "Đã khóa ghế thành công"
}
```

**Response Error: (400)**

```json
{
  "error": "Một số ghế đã được đặt"
}
```

## 6. Mở Khóa Ghế (Unlock Seats)

Mở khóa một hoặc nhiều ghế đã khóa.

**Endpoint:** `POST /trips/:id/seats/unlock`

**Request Body:**

```json
{
  "seat_ids": [1, 2, 3]
}
```

**Response Success: (200)**

```json
{
  "message": "Đã mở khóa ghế thành công"
}
```

## Lưu ý

1. Loại ghế (`type`):

   - normal: Ghế thường
   - vip: Ghế VIP
   - single: Ghế đơn
   - double: Ghế đôi
   - upstairs: Tầng trên
   - downstairs: Tầng dưới

2. Trạng thái ghế (`status`):

   - available: Còn trống
   - booked: Đã đặt
   - pending: Đang chọn
   - locked: Đã khóa

3. Số ghế (`seat_number`) theo format: [Tầng][Số] (ví dụ: A01, B02)

   - A: Tầng dưới
   - B: Tầng trên

4. Ghế sẽ tự động được mở khóa sau 15 phút nếu không được đặt

5. Giá vé (`price`) có thể khác nhau tùy theo loại ghế:

   - Ghế VIP tầng 1: +20% giá cơ bản
   - Ghế thường tầng 1: giá cơ bản
   - Ghế VIP tầng 2: +30% giá cơ bản
   - Ghế thường tầng 2: +10% giá cơ bản

6. Khi tạo sơ đồ ghế:
   - Xe 1 tầng: tất cả ghế ở tầng 1 (A01-A45)
   - Xe 2 tầng: ghế được chia đều cho 2 tầng (A01-A20, B01-B20)
   - 4 ghế đầu mỗi tầng là ghế VIP
   - Các ghế số lẻ là ghế đôi
