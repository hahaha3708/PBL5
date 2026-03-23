const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

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
    const tables = ['users', 'historical_periods', 'heritage_sites', 'products', 'orders', 'posts', 'groups', 'events', 'ai_usage_history', 'comments'];
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
        dynasty VARCHAR(255) NOT NULL,
        start_year INT NOT NULL,
        end_year INT NOT NULL,
        description TEXT,
        key_events TEXT,
        image_url VARCHAR(500),
        audio_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE heritage_sites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        region VARCHAR(100),
        type VARCHAR(100),
        historical_period VARCHAR(255),
        image_url VARCHAR(500),
        audio_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        artisan_id INT,
        image_url VARCHAR(500),
        stock_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (artisan_id) REFERENCES users(id)
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
      'INSERT INTO heritage_sites (name, description, latitude, longitude, region, type, historical_period) VALUES ?',
      [[
        ['Hoàng Thành Thăng Long', 'Di sản văn hóa thế giới tại Hà Nội.', 21.0369, 105.8342, 'North', 'Palace', 'Ly Dynasty'],
        ['Cố đô Huế', 'Quần thể di tích lịch sử triều Nguyễn.', 16.4637, 107.5909, 'Central', 'Historical Site', 'Nguyen Dynasty'],
        ['Thánh địa Mỹ Sơn', 'Tổ hợp đền đài Chăm Pa cổ.', 15.7781, 108.1078, 'Central', 'Temple', 'Cham']
      ]]
    );

    await connection.query(
      'INSERT INTO products (name, description, price, category, artisan_id, stock_quantity) VALUES ?',
      [[
        ['Bình gốm Bát Tràng', 'Bình gốm thủ công họa tiết sen xanh.', 550000, 'Ceramics', artisanId, 20],
        ['Áo dài lụa Hà Đông', 'Áo dài lụa tơ tằm truyền thống.', 1200000, 'Clothing', artisanId, 10],
        ['Tranh sơn mài Tùng Hạc', 'Tranh sơn mài nghệ thuật cao cấp.', 3500000, 'Art', artisanId, 5]
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
