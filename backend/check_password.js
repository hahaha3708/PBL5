const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
require('dotenv').config();

async function test() {
  try {
    const email = 'admin@heritage.vn';
    const password = 'Admin123!';
    console.log('Đang tìm người dùng:', email);
    const user = await User.findByEmail(email);
    if (user) {
      console.log('Tìm thấy người dùng:', user.name);
      console.log('Hash từ DB:', user.password);
      const ok = await bcrypt.compare(password, user.password);
      console.log('So sánh mật khẩu:', ok ? 'THÀNH CÔNG' : 'THẤT BẠI');
    } else {
      console.log('Không tìm thấy người dùng!');
    }
    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err);
    process.exit(1);
  }
}

test();