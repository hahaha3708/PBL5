# Viet Heritage Hub - Hướng Dẫn Cài Đặt Local Hoàn Chỉnh (Cho Mọi Máy)

## 🎯 **Tổng Quan**
Ứng dụng **Viet Heritage Hub** gồm:
- **Backend**: Node.js + Express + MySQL (port 3000)
- **Frontend**: HTML/CSS/JS tĩnh (serve từ backend)
- **Database**: MySQL `PBL5`

## 📋 **Yêu Cầu Hệ Thống**
```
Node.js v16+  
MySQL 8.0+ (XAMPP, WAMP, hoặc MySQL Workbench)
Git
VS Code (khuyến nghị)
```

## 🚀 **Cài Đặt Bước 1: Clone & Dependencies**

```bash
# Clone project
git clone <your-repo-url>
cd PBL5

# Install backend deps
npm install
cd backend && npm install
cd ..

# Server sẽ chạy npm start từ root
```

## 🗄️ **Bước 2: Cài Database (QUAN TRỌNG)**

### 2.1. Cài MySQL
```
- Windows: Tải XAMPP → Start Apache + MySQL
- Mac: brew install mysql
- Linux: sudo apt install mysql-server
```

### 2.2. Tạo Database & Import Schema
```bash
# 1. Đăng nhập MySQL
mysql -u root -p

# 2. Tạo DB
CREATE DATABASE PBL5 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Thoát MySQL, import schema
mysql -u root -p PBL5 < database/schema.sql

# 4. Verify
mysql -u root -p PBL5 -e "SHOW TABLES;"
```

**Lưu ý**: Password mặc định `123456789` trong `.env`. **Đổi ngay khi production!**

## ⚙️ **Bước 3: Cấu Hình .env**
Tạo file `.env` ở **root project**:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456789  # ← Đổi password MySQL của bạn
DB_NAME=PBL5
JWT_SECRET=viet-heritage-hub-secret-2024-change-production
PORT=3000
```

## ▶️ **Bước 4: Chạy Server**
```bash
# Production
npm start

# Development (hot reload)
npm run dev

# Server sẽ listen http://localhost:3000
```

## 🌐 **Bước 5: Truy Cập & Test**

```
✅ Frontend: http://localhost:3000
✅ API Docs: http://localhost:3000/api
✅ Test API: http://localhost:3000/api/heritage-sites
```

## 🔄 **Deploy Lên Máy Khác**

### Option 1: Copy Toàn Bộ (Đơn Giản)
```
1. Copy THÙƠNG THỰC folder PBL5/
2. Cài Node.js + MySQL trên máy mới
3. Chạy bước 2-4 ở trên
```

### Option 2: Git + Export DB
```bash
# Export DB hiện tại
mysqldump -u root -p PBL5 > backup_pbl5.sql

# Commit code (không commit .env!)
git add . && git commit -m "Deploy ready" && git push

# Trên máy mới:
git clone/pull
# Import: mysql -u root -p PBL5 < backup_pbl5.sql
```

## 🛠️ **Troubleshooting**

| Lỗi | Giải Pháp |
|-----|-----------|
| `npm start` fail route undefined | Tạo `.env` + restart |
| `ER_ACCESS_DENIED_ERROR` | Check MySQL password trong `.env` |
| `Unknown database 'PBL5'` | Chạy schema.sql |
| Port 3000 busy | `killall node` hoặc đổi PORT=3001 |

## 📱 **API Endpoints**
```
POST /api/auth/register
POST /api/auth/login  
GET /api/heritage-sites
GET /api/products
```

**🎉 Hoàn thành! Mở http://localhost:3000 và explore!**

**Cần hỗ trợ? Check TODO.md hoặc mở issue trên GitHub.**

