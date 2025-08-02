# 🗃️ PostgreSQL - Hướng dẫn thao tác Cơ sở dữ liệu

## ✅ Kết nối vào DB bằng terminal

### ⚙️ Nếu dùng Docker Compose:

```bash
docker exec -it <container_name> psql -U <username> -d <db_name>
```

Ví dụ hiện tại:
```bash
docker exec -it ticket-postgres psql -U postgres -d ticketdb
```

---

## 📌 Các câu lệnh cơ bản

| Mục đích | Lệnh |
|---------|------|
| Liệt kê databases | `\l` |
| Chọn database | `\c ticket_db` |
| Liệt kê tables | `\dt` |
| Xem schema table | `\d users` |
| Thoát | `\q` |

---

## 🔧 Tạo database

```sql
CREATE DATABASE ticket_db;
```

---

## 👤 Tạo user và phân quyền

```sql
CREATE USER intern WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE ticket_db TO intern;
```

---

## 🧹 Reset lại bảng

```sql
DROP TABLE IF EXISTS users;
```

---

## 🔄 GORM tự động migrate

Trong file `main.go`:

```go
config.DB.AutoMigrate(&model.User{})
```

---

## 🧪 Câu lệnh SQL mẫu

```sql
-- Thêm user
INSERT INTO users (id, name, email) VALUES (1, 'Trung', 'trung@example.com');

-- Xem dữ liệu
SELECT * FROM users;

-- Cập nhật user
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- Xoá user
DELETE FROM users WHERE id = 1;
```

---

## 📎 Backup & Restore

### 📥 Backup

```bash
pg_dump -U postgres -d ticket_db > backup.sql
```

### 📤 Restore

```bash
psql -U postgres -d ticket_db < backup.sql
```
