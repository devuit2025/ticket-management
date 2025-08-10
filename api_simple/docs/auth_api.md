# Authentication API Documentation

## Base URL

```
http://localhost:8080/api/v1
```

## 1. Đăng Ký (Register)

Tạo tài khoản mới cho người dùng.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "phone": "0987654321", // Số điện thoại (bắt đầu bằng 0, 10 số)
  "password": "Password123!", // Mật khẩu (ít nhất 8 ký tự, tối đa 32 ký tự)
  "name": "Nguyễn Văn A", // Họ tên (2-50 ký tự)
  "role": "customer" // Vai trò (customer/driver/admin, mặc định: customer)
}
```

**Yêu cầu mật khẩu:**

- Ít nhất 8 ký tự, tối đa 32 ký tự
- Phải chứa ít nhất:
  - 1 chữ hoa
  - 1 chữ thường
  - 1 số
  - 1 ký tự đặc biệt

**Response Success: (200)**

```json
{
  "token": "eyJhbGciOiJIUzI1...", // JWT token
  "user": {
    "id": 1,
    "phone": "0987654321",
    "name": "Nguyễn Văn A",
    "role": "customer"
  }
}
```

**Response Error: (400)**

```json
{
  "error": "Số điện thoại đã được đăng ký"
  // Hoặc các lỗi khác:
  // "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 số)"
  // "Mật khẩu phải có ít nhất 8 ký tự"
  // "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
  // "Họ tên không được để trống"
  // "Vai trò không hợp lệ"
}
```

## 2. Đăng Nhập (Login)

Đăng nhập vào hệ thống.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "phone": "0987654321",
  "password": "Password123!"
}
```

**Response Success: (200)**

```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "phone": "0987654321",
    "name": "Nguyễn Văn A",
    "role": "customer"
  }
}
```

**Response Error: (401)**

```json
{
  "error": "Thông tin đăng nhập không chính xác"
}
```

## 3. Đăng Xuất (Logout)

Đăng xuất và vô hiệu hóa token.

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Response Success: (200)**

```json
{
  "message": "Đăng xuất thành công"
}
```

**Response Error: (401)**

```json
{
  "error": "Yêu cầu xác thực token"
}
```

## 4. Quên Mật Khẩu (Forgot Password)

Yêu cầu mã OTP để đặt lại mật khẩu.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**

```json
{
  "phone": "0987654321"
}
```

**Response Success: (200)**

```json
{
  "message": "Mã OTP đã được gửi thành công",
  "otp": "123456" // Chỉ có trong môi trường development
}
```

**Response Error: (404)**

```json
{
  "error": "Số điện thoại chưa được đăng ký"
}
```

## 5. Xác Thực OTP (Verify OTP)

Xác thực mã OTP đã nhận.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**

```json
{
  "phone": "0987654321",
  "otp": "123456" // Mã OTP 6 số
}
```

**Response Success: (200)**

```json
{
  "message": "Xác thực OTP thành công"
}
```

**Response Error: (400)**

```json
{
  "error": "Mã OTP không chính xác"
  // Hoặc: "Mã OTP đã hết hạn"
}
```

## 6. Đặt Lại Mật Khẩu (Reset Password)

Đặt mật khẩu mới sau khi xác thực OTP.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**

```json
{
  "phone": "0987654321",
  "otp": "123456",
  "new_password": "NewPassword123!"
}
```

**Response Success: (200)**

```json
{
  "message": "Đặt lại mật khẩu thành công"
}
```

**Response Error: (400)**

```json
{
  "error": "Mã OTP không chính xác"
  // Hoặc các lỗi validate mật khẩu khác
}
```

## 7. Đổi Mật Khẩu (Change Password)

Đổi mật khẩu khi đã đăng nhập.

**Endpoint:** `POST /auth/change-password`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Request Body:**

```json
{
  "old_password": "Password123!",
  "new_password": "NewPassword123!"
}
```

**Response Success: (200)**

```json
{
  "message": "Đổi mật khẩu thành công"
}
```

**Response Error: (400/401)**

```json
{
  "error": "Thông tin đăng nhập không chính xác"
  // Hoặc: "Mật khẩu mới không được trùng với mật khẩu cũ"
  // Hoặc các lỗi validate mật khẩu khác
}
```

## Lưu ý chung

1. Tất cả request phải có header:

```
Content-Type: application/json
```

2. Các API được bảo vệ (protected) cần thêm header:

```
Authorization: Bearer <token>
```

3. Mã OTP có hiệu lực trong 5 phút.

4. HTTP Status Codes:

- 200: Thành công
- 201: Tạo mới thành công
- 400: Lỗi dữ liệu đầu vào
- 401: Chưa xác thực hoặc xác thực thất bại
- 404: Không tìm thấy tài nguyên
- 500: Lỗi server

5. Vai trò người dùng:

- customer: Khách hàng (mặc định)
- driver: Tài xế
- admin: Quản trị viên
