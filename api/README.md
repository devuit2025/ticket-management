# 🎟️ User Service - Ticket Management System

Đây là service quản lý người dùng trong hệ thống đặt vé (ticket management system), được viết bằng Go với framework [Gin](https://github.com/gin-gonic/gin), sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu.

## ✅ Yêu cầu hệ thống

- Go >= 1.20
- Docker & Docker Compose
- PostgreSQL >= 14

---

## ⚙️ Cấu trúc thư mục

```
api/
├── services/
│   └── user/
│       ├── cmd/               # main.go entry point
│       ├── config/            # Cấu hình kết nối DB, env
│       ├── handler/           # Các handler xử lý request
│       ├── model/             # Định nghĩa các struct GORM
│       ├── router/            # Định nghĩa router (Gin)
│       ├── utils/             # Các hàm helper như response, error, etc.
│       └── Dockerfile         # Docker build user-service
```

---

## 🚀 Chạy Local Development với Hot Reload

### 🔧 Cài đặt [Air](https://github.com/air-verse/air) cho hot reload

```bash
go install github.com/air-verse/air@latest
```

### 📦 Chạy service

```bash
cd api/services/user
air
```

---

## 🧪 Test API với Postman

### ✅ Response Format

Mọi API sẽ trả về format giống như sau:

```json
{
  "code": 200,
  "message": "Success",
  "data": {...}
}
```

---

## 🛠️ Build production image (Docker)

```bash
docker build -t user-service .
```

---

## ❓ Câu hỏi thường gặp

### ❓ Sau khi sửa code, sao gọi Postman vẫn trả kết quả cũ?
🔸 Có thể do Docker container chưa rebuild. Hãy dùng lệnh:

```bash
docker compose down && docker compose up --build
```

### ❓ `utils` mới thêm, cần chạy gì?
🔸 Nếu bạn mới tạo folder hoặc file `.go` mới thì cần:
```bash
go mod tidy
```
để cập nhật các module nội bộ hoặc external.
