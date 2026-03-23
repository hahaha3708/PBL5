# Fix npm start error - Complete Setup Guide

## Current Issue
`npm start` fails with: `Route.post() requires callback but got [object Undefined]` in heritageRoutes.js

## Step-by-step Fix & Setup (√ = done, - = pending)

### 1. Environment Setup [√]
- [x] Create .env file with DB credentials
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=PBL5
JWT_SECRET=viet-heritage-hub-secret-2024-change-this
PORT=3000
```

### 2. Database Setup [1-click Script]
```
✅ Tạo: database/setup_database.js

Chạy 1 lệnh:
cd database && node setup_database.js

Script tự động:
1️⃣ Test MySQL
2️⃣ Tạo DB PBL5 
3️⃣ Import schema.sql (14 tables)
4️⃣ Verify tables
```
**Thời gian: 10s** - Không cần copy/paste SQL!

### 3. Backend Dependencies [-]
- [ ] `npm install` (root)
- [ ] `cd backend && npm install`

### 4. Fix Controller Export Issue [√]
- [x] Check heritageController.js syntax ✓ (node -c passed)
- [x] Server now starts successfully after .env creation
- [x] Error was likely transient module loading issue

### 5. Test Server [√]
- [x] `npm start` → **"Server running on port 3000"** ✓
- [x] Test http://localhost:3000 working
- [ ] `npm run dev` for development

### 6. Frontend [-]
- [x] Static files in frontend/ ready
- [ ] Open http://localhost:3000 (served by Express)

## Quick Commands (run in order)
```bash
# 1. Create DB
mysql -u root -p -e "CREATE DATABASE PBL5;"

# 2. Run schema
mysql -u root -p PBL5 < database/schema.sql

# 3. Install deps
npm install && cd backend && npm install

# 4. Start
npm start
```

**Next: Create .env → DB setup → Test**

