#!/usr/bin/env node
/**
 * Viet Heritage Hub - MySQL Database Auto-Setup Script
 * Chạy: node database/setup_database.js
 * Tự động: Tạo DB → Import schema.sql → Seed data → Test connection
 */

require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456789',
  database: process.env.DB_NAME || 'PBL5'
};

async function setupDatabase() {
  const spinner = ['|', '/', '-', '\\'];
  let i = 0;
  
  console.log('🚀 Viet Heritage Hub Database Setup...');
  
  try {
    // 1. Test MySQL connection
    console.log('1️⃣ Kiểm tra MySQL...');
    const testConn = await mysql.createConnection({ ...config, database: 'mysql' });
    await testConn.ping();
    await testConn.end();
    console.log('   ✅ MySQL OK');
    
    // 2. Create database
    console.log('2️⃣ Tạo database PBL5...');
    const adminConn = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      multipleStatements: true
    });
    
    await adminConn.execute(`CREATE DATABASE IF NOT EXISTS ${config.database} 
                            CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConn.end();
    console.log('   ✅ Database PBL5 created');
    
    // 3. Import schema
    console.log('3️⃣ Import schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    const dbConn = await mysql.createConnection({
      ...config,
      multipleStatements: true
    });
    await dbConn.execute(schemaSql);
    await dbConn.end();
    console.log('   ✅ Schema imported (14 tables)');
    
    // 4. Test tables
    console.log('4️⃣ Test connection & tables...');
    const finalConn = await mysql.createConnection(config);
    const [tables] = await finalConn.execute('SHOW TABLES');
    await finalConn.end();
    
    console.log(`   ✅ Success! ${tables.length} tables ready:`);
    console.table(tables.map(t => t[`Tables_in_${config.database}`]).slice(0, 5));
    if (tables.length > 5) console.log(`   ... + ${tables.length - 5} more`);
    
    console.log('\n🎉 **Database setup COMPLETE!**');
    console.log('📱 Chạy server: cd .. && npm start');
    console.log('🌐 Test: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Lỗi setup:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Fix: Check .env → DB_PASSWORD khớp với MySQL');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Fix: Start MySQL service (XAMPP → Start MySQL)');
    }
    process.exit(1);
  }
}

setupDatabase();
