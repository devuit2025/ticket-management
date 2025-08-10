# API Test Scripts

Các script bash để test các API của hệ thống.

## Cấu trúc thư mục

```
tests/api/
├── README.md
├── common.sh
├── test_all.sh
├── test_bus.sh
├── test_route.sh
├── test_seat.sh
└── test_trip.sh
```

## Cách sử dụng

1. Đảm bảo server đang chạy:

```bash
docker compose up -d
```

2. Chạy seeder để tạo dữ liệu mẫu:

```bash
docker compose exec app go run main.go --seed
```

3. Cấp quyền thực thi cho các script:

```bash
chmod +x tests/api/test_*.sh
```

4. Chạy test:

- Test tất cả API:

```bash
cd tests/api && ./test_all.sh
```

- Test từng module:

```bash
cd tests/api
./test_route.sh  # Test Route APIs
./test_bus.sh    # Test Bus APIs
./test_trip.sh   # Test Trip APIs
./test_seat.sh   # Test Seat APIs
```

## Lưu ý

1. Xác thực:

   - Các script sử dụng tài khoản admin để test các API yêu cầu quyền admin
   - Thông tin tài khoản admin được cấu hình trong `common.sh`:
     ```bash
     ADMIN_PHONE="0987654321"
     ADMIN_PASSWORD="Password123!"
     ADMIN_NAME="Admin"
     ```
   - Nếu tài khoản chưa tồn tại, script sẽ tự động đăng ký
   - Token được lấy tự động thông qua API login

2. Thứ tự test trong `test_all.sh` là quan trọng vì các API có phụ thuộc vào nhau:

   - Route APIs: Tạo tuyến đường
   - Bus APIs: Tạo xe
   - Trip APIs: Tạo chuyến xe (cần route_id và bus_id)
   - Seat APIs: Tạo ghế (cần trip_id)

3. Mỗi script test bao gồm:

   - Các test case thành công (happy path)
   - Các test case lỗi (error cases)
   - Kiểm tra các ràng buộc nghiệp vụ

4. Kết quả test được in ra màn hình dưới dạng JSON để dễ đọc. Bạn có thể thêm `| jq` vào cuối lệnh curl để format JSON đẹp hơn:

```bash
curl ... | jq
```

5. Nếu muốn sử dụng tài khoản admin khác, bạn có thể:
   - Sửa thông tin trong `common.sh`
   - Hoặc set các biến môi trường:
     ```bash
     export ADMIN_PHONE="0987654321"
     export ADMIN_PASSWORD="Password123!"
     export ADMIN_NAME="Admin"
     ```
