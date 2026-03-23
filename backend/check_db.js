const User = require('./models/userModel');
require('dotenv').config();

async function test() {
  try {
    const email = 'admin@heritage.vn';
    console.log('Đang tìm người dùng:', email);
    const user = await User.findByEmail(email);
    if (user) {
      console.log('Tìm thấy người dùng:', user.name, 'Role:', user.role);
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