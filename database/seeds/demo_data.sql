-- Demo Data for Viet Heritage Hub
-- Chạy file này để có dữ liệu mẫu cho demo
USE PBL5;

-- Xóa dữ liệu cũ (Tùy chọn, hãy cẩn thận)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users;
TRUNCATE TABLE historical_periods;
TRUNCATE TABLE heritage_sites;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1;

-- Chèn người dùng mẫu
-- admin@heritage.vn / Admin123! (Vai trò: admin)
-- member@example.com / 123456 (Vai trò: member)
-- artisan@example.com / 123456 (Vai trò: artisan)
INSERT INTO users (name, email, password, role) VALUES
('Quản trị hệ thống', 'admin@heritage.vn', '$2a$10$3/0mlmZjDCKy0OA.MkPRXOIstAso/uXhjMSGL1hUDs3k2QGuB0S8m', 'admin'),
('Nguyễn Văn Thành viên', 'member@example.com', '$2a$10$fS0Yv.U8yGq8K8X/1p8m1.Y2v0fP1f1f1f1f1f1f1f1f1f1f1f1f1', 'member'),
('Trần Thị Nghệ nhân', 'artisan@example.com', '$2a$10$fS0Yv.U8yGq8K8X/1p8m1.Y2v0fP1f1f1f1f1f1f1f1f1f1f1f1f1', 'artisan');

-- Chèn di sản mẫu
INSERT INTO heritage_sites (name, description, latitude, longitude, region, type, historical_period) VALUES
('Hoàng Thành Thăng Long', 'Di sản văn hóa thế giới tại Hà Nội, trung tâm quyền lực chính trị trong hơn 13 thế kỷ.', 21.0369, 105.8342, 'North', 'Palace', 'Ly Dynasty'),
('Cố đô Huế', 'Quần thể di tích lịch sử triều Nguyễn, biểu tượng của kiến trúc cung đình Việt Nam.', 16.4637, 107.5909, 'Central', 'Historical Site', 'Nguyen Dynasty'),
('Thánh địa Mỹ Sơn', 'Tổ hợp đền đài Chăm Pa cổ, minh chứng cho sự phát triển rực rỡ của văn hóa Chăm.', 15.7781, 108.1078, 'Central', 'Temple', 'Cham');

-- Chèn sản phẩm mẫu (giả định artisan_id là 3)
INSERT INTO products (name, description, price, category, artisan_id, stock_quantity) VALUES
('Bình gốm Bát Tràng', 'Bình gốm thủ công họa tiết sen xanh truyền thống.', 550000, 'Ceramics', 3, 20),
('Áo dài lụa Hà Đông', 'Áo dài lụa tơ tằm truyền thống, dệt tay tỉ mỉ.', 1200000, 'Clothing', 3, 10),
('Tranh sơn mài Tùng Hạc', 'Tranh sơn mài nghệ thuật cao cấp, mang ý nghĩa trường thọ.', 3500000, 'Art', 3, 5);

-- Chèn thời kỳ lịch sử mẫu
INSERT INTO historical_periods (dynasty, start_year, end_year, description, key_events) VALUES
('Nhà Lý', 1009, 1225, 'Thời kỳ thịnh trị của Phật giáo và văn hóa Đại Việt.', 'Dời đô về Thăng Long, xây dựng Văn Miếu'),
('Nhà Trần', 1225, 1400, 'Thời kỳ hào khí Đông A, ba lần đại thắng quân Nguyên Mông.', 'Chiến thắng Bạch Đằng, phát triển chữ Nôm'),
('Nhà Nguyễn', 1802, 1945, 'Triều đại phong kiến cuối cùng của Việt Nam.', 'Thống nhất đất nước, xây dựng Kinh thành Huế');
