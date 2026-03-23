const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'PBL5',
};

async function seed() {
  let connection;
  try {
    // Connect without database first to ensure it exists
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    
    console.log(`Đang đảm bảo database ${dbConfig.database} tồn tại...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);

    console.log('Đang tạo lại cấu trúc bảng (để khớp với mã nguồn)...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Drop existing tables to ensure clean state matching the schema
    const tables = ['order_details', 'orders', 'products', 'shops', 'users', 'historical_periods', 'heritage_sites', 'heritage_media', 'posts', 'groups', 'events', 'ai_usage_history', 'comments'];
    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
    }

    // Create tables based on project schema
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('guest', 'member', 'artisan', 'admin') DEFAULT 'member',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE historical_periods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_year INT NOT NULL,
        end_year INT NOT NULL,
        capital VARCHAR(255),
        notable_figures TEXT,
        key_events TEXT,
        description TEXT,
        image_url VARCHAR(500),
        theme_color VARCHAR(255),
        background_pattern VARCHAR(255),
        background_music VARCHAR(255),
        influence INT DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE heritage_sites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        region_music VARCHAR(255),
        description_vi TEXT,
        description_en TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE heritage_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_id INT,
        media_type VARCHAR(255),
        media_url VARCHAR(255),
        FOREIGN KEY (site_id) REFERENCES heritage_sites(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE shops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        artisan_id INT,
        shop_name VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        shop_id INT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(500),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        status VARCHAR(255) COMMENT 'Pending, Shipping, Completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE order_details (
        order_id INT,
        product_id INT,
        quantity INT,
        price DECIMAL(10, 2),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Đang chèn dữ liệu mẫu...');
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const memberPassword = await bcrypt.hash('123456', 10);
    const artisanPassword = await bcrypt.hash('123456', 10);

    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES ?',
      [[
        ['Quản trị hệ thống', 'admin@heritage.vn', adminPassword, 'admin'],
        ['Nguyễn Văn Thành viên', 'member@example.com', memberPassword, 'member'],
        ['Trần Thị Nghệ nhân', 'artisan@example.com', artisanPassword, 'artisan']
      ]]
    );
    const artisanId = userResult.insertId + 2;

    await connection.query(
      'INSERT INTO historical_periods (name, start_year, end_year, capital, notable_figures, key_events, description, image_url, theme_color, background_pattern, background_music, influence) VALUES ?',
      [[
        ['Hùng Vương', -2879, -258, 'Phong Châu', '18 đời vua Hùng', 'Dựng nước Văn Lang', 'Thời kỳ bình minh của lịch sử Việt Nam.', 'https://picsum.photos/1200/600?random=20', '#c5a059', 'pattern-lac-viet', 'music-trong-dong', 40],
        ['Nhà Lý', 1009, 1225, 'Thăng Long', 'Lý Thái Tổ, Lý Thường Kiệt', 'Dời đô về Thăng Long, Phá Tống bình Chiêm', 'Triều đại đặt nền móng văn hóa rực rỡ.', 'https://picsum.photos/1200/600?random=21', '#8b0000', 'pattern-dragon-ly', 'music-nha-nhac', 85],
        ['Nhà Trần', 1225, 1400, 'Thăng Long', 'Trần Hưng Đạo, Trần Nhân Tông', 'Ba lần kháng chiến chống Nguyên Mông', 'Thời kỳ hào khí Đông A lẫy lừng.', 'https://picsum.photos/1200/600?random=22', '#daa520', 'pattern-cloud-tran', 'music-quan-ho', 95],
        ['Nhà Lê', 1428, 1789, 'Đông Kinh', 'Lê Lợi, Nguyễn Trãi', 'Khởi nghĩa Lam Sơn, Luật Hồng Đức', 'Thời kỳ hưng thịnh nhất của phong kiến Việt Nam.', 'https://picsum.photos/1200/600?random=23', '#006400', 'pattern-phoenix-le', 'music-ca-tru', 90],
        ['Nhà Nguyễn', 1802, 1945, 'Huế', 'Gia Long, Minh Mạng', 'Thống nhất đất nước, Xây dựng Kinh đô Huế', 'Triều đại phong kiến cuối cùng.', 'https://picsum.photos/1200/600?random=24', '#ff8c00', 'pattern-lotus-nguyen', 'music-cung-dinh', 75]
      ]]
    );

    await connection.query(
      'INSERT INTO heritage_sites (name, type, latitude, longitude, region_music, description_vi, description_en, image_url) VALUES ?',
      [[
        ['Hoàng Thành Thăng Long', 'Di tích', 21.0369, 105.8342, 'Ca Trù', 'Di sản văn hóa thế giới tại Hà Nội.', 'Imperial Citadel of Thang Long.', 'https://picsum.photos/800/600?random=10'],
        ['Cố đô Huế', 'Di tích', 16.4637, 107.5909, 'Nhã nhạc cung đình', 'Quần thể di tích lịch sử triều Nguyễn.', 'Complex of Hue Monuments.', 'https://picsum.photos/800/600?random=11'],
        ['Thánh địa Mỹ Sơn', 'Di tích', 15.7781, 108.1078, 'Múa Chăm', 'Tổ hợp đền đài Chăm Pa cổ.', 'My Son Sanctuary.', 'https://picsum.photos/800/600?random=12']
      ]]
    );

    // Get site IDs for media
    const [sites] = await connection.query('SELECT id FROM heritage_sites');
    if (sites.length > 0) {
      await connection.query(
        'INSERT INTO heritage_media (site_id, media_type, media_url) VALUES ?',
        [[
          [sites[0].id, 'image', 'https://picsum.photos/800/600?random=10'],
          [sites[1].id, 'image', 'https://picsum.photos/800/600?random=11'],
          [sites[2].id, 'image', 'https://picsum.photos/800/600?random=12']
        ]]
      );
    }

    const [shopResult] = await connection.query(
      'INSERT INTO shops (artisan_id, shop_name, description) VALUES ?',
      [[
        [artisanId, 'Gốm Sứ Bát Tràng', 'Cửa hàng chuyên các sản phẩm gốm sứ thủ công truyền thống.']
      ]]
    );
    const shopId = shopResult.insertId;

    await connection.query(
      'INSERT INTO products (shop_id, name, description, price, category, stock, image_url) VALUES ?',
      [[
        [shopId, 'Bình gốm Bát Tràng', 'Bình gốm thủ công họa tiết sen xanh.', 550000, 'Ceramics', 20, 'https://picsum.photos/300/400?random=1'],
        [shopId, 'Áo dài lụa Hà Đông', 'Áo dài lụa tơ tằm truyền thống.', 1200000, 'Clothing', 10, 'https://picsum.photos/300/400?random=2'],
        [shopId, 'Tranh sơn mài Tùng Hạc', 'Tranh sơn mài nghệ thuật cao cấp.', 3500000, 'Art', 5, 'https://picsum.photos/300/400?random=3']
      ]]
    );

    console.log('✅ Cập nhật dữ liệu demo thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật database:', error);
  } finally {
    if (connection) await connection.end();
  }
}

seed();
