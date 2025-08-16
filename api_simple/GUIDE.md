# Hướng dẫn sử dụng Docker và Database

## 1. Quản lý Container

### Khởi động các container

```bash
# Khởi động tất cả các container
docker compose up

# Khởi động ở chế độ chạy nền
docker compose up -d

# Khởi động và build lại
docker compose up --build
```

### Dừng các container

```bash
# Dừng tất cả các container
docker compose down

# Dừng và xóa volume
docker compose down -v
```

### Xem logs

```bash
# Xem logs của tất cả các container
docker compose logs

# Xem logs của container cụ thể
docker compose logs app
docker compose logs postgres
docker compose logs redis

# Xem logs realtime
docker compose logs -f
```

### Truy cập vào container

```bash
# Truy cập vào container app
docker exec -it api_simple-app-1 sh

# Truy cập vào container database
docker exec -it api_simple-postgres-1 bash

# Truy cập vào container redis
docker exec -it api_simple-redis-1 sh
```

## 2. Thao tác với Database

### Truy cập PostgreSQL

```bash
# Truy cập trực tiếp vào PostgreSQL
docker exec -it api_simple-postgres-1 psql -U postgres -d ticket_management

# Kết nối từ bên ngoài
psql -h localhost -p 5432 -U postgres -d ticket_management
```

### Các lệnh PostgreSQL cơ bản

```sql
-- Liệt kê các database
\l

-- Chuyển đổi database
\c ticket_management

-- Liệt kê các bảng
\dt

-- Xem cấu trúc bảng
\d table_name

-- Thoát
\q
```

### Các câu lệnh SQL thường dùng

```sql
-- Xem dữ liệu bảng users
SELECT * FROM users;

-- Xem dữ liệu bảng trips
SELECT * FROM trips;

-- Tạo admin user
UPDATE users SET role = 'admin' WHERE email = 'example@email.com';

-- Xóa dữ liệu bảng
TRUNCATE TABLE table_name CASCADE;
```

## 3. Thao tác với Redis

### Truy cập Redis

```bash
# Truy cập Redis CLI
docker exec -it api_simple-redis-1 redis-cli
```

### Các lệnh Redis cơ bản

```bash
# Xem tất cả keys
KEYS *

# Lấy giá trị của key
GET key_name

# Xóa key
DEL key_name

# Xóa tất cả keys
FLUSHALL

# Thoát
exit
```

## 4. API Endpoints

### Authentication

```bash
# Đăng ký tài khoản
curl -X POST http://localhost:8081/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "example@email.com",
  "password": "password123",
  "name": "Example User",
  "phone": "1234567890"
}'

# Đăng nhập
curl -X POST http://localhost:8081/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "example@email.com",
  "password": "password123"
}'
```

### Admin Endpoints

```bash
# Lấy danh sách users (yêu cầu token admin)
curl http://localhost:8081/api/v1/admin/users \
-H "Authorization: Bearer YOUR_TOKEN_HERE"

# Lấy thống kê (yêu cầu token admin)
curl http://localhost:8081/api/v1/admin/statistics \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Xử lý lỗi thường gặp

### 1. Container không thể khởi động

```bash
# Kiểm tra logs
docker compose logs

# Xóa và tạo lại container
docker compose down
docker compose up --build
```

### 2. Database connection error

```bash
# Kiểm tra trạng thái container
docker compose ps

# Kiểm tra logs database
docker compose logs postgres

# Kiểm tra biến môi trường
cat .env
```

### 3. Redis connection error

```bash
# Kiểm tra trạng thái Redis
docker compose logs redis

# Kiểm tra kết nối Redis
docker exec -it api_simple-redis-1 redis-cli ping
```
