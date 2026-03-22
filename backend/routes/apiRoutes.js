// API Routes for Heritage Hub - Stub for missing routes
const express = require('express');
const router = express.Router();

// Stub heritage stats endpoint (for hmmm.html integration)
router.get('/heritage/stats', (req, res) => {
  res.json({
    works: 247,
    artisans: 58,
    sites: 34
  });
});

// Stub other endpoints
router.get('/ai/calligraphy', (req, res) => res.json({ imageUrl: '/api/placeholder-calligraphy.png' }));
router.post('/ai/restore-image', (req, res) => res.json({ restoredImageUrl: '/api/placeholder-restored.png' }));

// AI Studio (static frontend) — proxy to Gemini when GEMINI_API_KEY is set on the server
router.post('/ai/calligraphy-meaning', async (req, res) => {
  const word = (req.body && String(req.body.word || '').trim()) || '';
  const style = (req.body && String(req.body.style || '').trim()) || 'Thư pháp (Traditional)';
  if (!word) {
    return res.status(400).json({ error: 'word is required' });
  }

  const prompt =
    'You are a Vietnamese Calligraphy Master and Cultural Historian.\n' +
    `The user wants to write the word/phrase: "${word}" in the style of "${style}".\n\n` +
    'Please provide:\n' +
    '1. The Han-Nom or Vietnamese Quoc Ngu breakdown.\n' +
    '2. The deep philosophical meaning behind this word in Vietnamese culture.\n' +
    '3. A poetic instruction on how the brush strokes should flow (imagine you are teaching a student).\n' +
    '4. A short 4-line poem (luc bat format if possible) containing this word.\n\n' +
    'Format the response as clean Markdown.\n' +
    'Keep the tone wise, serene, and artistic.';

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.json({
      markdown:
        `## ${word}\n\n` +
        `*(Demo — thêm **GEMINI_API_KEY** vào \`backend/.env\` và khởi động lại server để dùng Gemini thật.)*\n\n` +
        `**Phong cách:** ${style}\n\n` +
        'Trong văn hóa Việt, mỗi nét chữ không chỉ là hình thức mà còn là nhịp thở của cả một dòng sử. ' +
        'Hãy tưởng tượng bút lông chạm giấy như dòng nước: chậm, tròn, có chừa âm cho khoảng lặng.'
    });
  }

  try {
    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
      encodeURIComponent(key);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await r.json();
    const text = data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts[0]
      ? data.candidates[0].content.parts[0].text
      : null;
    if (!text) {
      return res.status(502).json({ error: 'Empty model response', details: data });
    }
    return res.json({ markdown: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Gemini request failed' });
  }
});

router.get('/sites', (req, res) => {
  res.json([
    { id: 1, name: 'Ho Chi Minh Mausoleum', lat: 21.0388, lng: 105.8336, region: 'North' },
    { id: 2, name: 'Ha Long Bay', lat: 20.9101, lng: 107.1839, region: 'North' },
    { id: 3, name: 'Hue Imperial City', lat: 16.4675, lng: 107.579, region: 'Central' },
    { id: 4, name: 'My Son Sanctuary', lat: 15.7734, lng: 108.1169, region: 'Central' },
    { id: 5, name: 'Cu Chi Tunnels', lat: 11.1434, lng: 106.4462, region: 'South' },
    { id: 6, name: 'Can Tho Floating Market', lat: 10.0452, lng: 105.7469, region: 'South' }
  ]);
});

router.get('/community/events', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Festival Huế — Di sản văn hóa',
      date: '2026-04-18',
      location: 'Huế',
      excerpt: 'Âm nhạc cung đình, áo dài và ẩm thực xứ Kinh.'
    },
    {
      id: 2,
      title: 'Phiên chợ làng nghề truyền thống',
      date: '2026-05-02',
      location: 'Hà Nội',
      excerpt: 'Gốm, lụa, mây tre đan — gặp gỡ nghệ nhân.'
    },
    {
      id: 3,
      title: 'Workshop gốm Bát Tràng',
      date: '2026-05-22',
      location: 'Gia Lâm',
      excerpt: 'Tự tay tạo hình trên bàn xoay — dành cho người mới.'
    }
  ]);
});

router.get('/community/threads', (req, res) => {
  res.json([
    { id: 1, title: 'Chia sẻ kinh nghiệm phục chế ảnh cổ gia đình', author: 'Minh An', replies: 14, lastActive: '2 ngày trước' },
    { id: 2, title: 'Sách hay về triều Nguyễn — gợi ý đọc', author: 'Lan Hương', replies: 31, lastActive: '5 ngày trước' },
    { id: 3, title: 'Ghi âm dân ca — micro và phần mềm miễn phí?', author: 'Đức Thắng', replies: 8, lastActive: '1 tuần trước' },
    { id: 4, title: 'Kết nối nghệ nhân dệt Hà Đông', author: 'Thuỳ Chi', replies: 22, lastActive: '3 ngày trước' }
  ]);
});

module.exports = router;
