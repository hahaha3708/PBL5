-- Tài khoản quản trị mẫu (mật khẩu: Admin123!)
-- Chạy sau khi đã import schema.sql
USE PBL5;

INSERT INTO users (name, email, password, role)
SELECT 'Quản trị hệ thống', 'admin@heritage.vn', '$2a$10$3/0mlmZjDCKy0OA.MkPRXOIstAso/uXhjMSGL1hUDs3k2QGuB0S8m', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@heritage.vn');
