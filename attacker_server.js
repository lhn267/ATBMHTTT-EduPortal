const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'attacker_public')));

// Trang điều hướng Hacker Portal tại đường dẫn gốc "/"
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>Hacker Portal - Trang Tấn Công Mô Phỏng</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #1e293b; padding: 36px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 520px; width: 100%; border: 1px solid #334155; }
        h2 { margin-top: 0; color: #ef4444; font-size: 20px; display: flex; align-items: center; gap: 8px; }
        p { color: #94a3b8; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
        .link-item { display: block; padding: 14px 18px; margin-bottom: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #38bdf8; text-decoration: none; font-weight: 500; font-size: 14px; transition: all 0.2s; }
        .link-item:hover { border-color: #38bdf8; background: #182234; }
        .desc { display: block; font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Trang Web Hacker Mô Phỏng (Cross-Origin)</h2>
        <p>Bấm chọn phân cảnh bạn muốn thực hiện để kiểm thử tấn công sang EduPortal:</p>
        <a class="link-item" href="/tailieu-khoaluan.html">
          1. Tài liệu Khóa luận (Lỗi 6 - CSRF)
          <span class="desc">Trang tải tài liệu giả mạo âm thầm kích hoạt thao tác trên EduPortal</span>
        </a>
        <a class="link-item" href="/test-site.html">
          2. Trang ngoài kiểm tra CORS (Lỗi 12 - CORS)
          <span class="desc">Trang web độc lập đọc trộm dữ liệu điểm sinh viên qua API</span>
        </a>
        <a class="link-item" href="/test-clickjacking.html">
          3. Nhúng khung iframe lừa click (Lỗi 16 - Clickjacking)
          <span class="desc">Nhúng trọn vẹn giao diện EduPortal bên trong iframe viền đỏ</span>
        </a>
      </div>
    </body>
    </html>
  `);
});

// Fallback direct routes matching script names
app.get('/tailieu-khoaluan', (req, res) => {
  res.sendFile(path.join(__dirname, 'attacker_public', 'tailieu-khoaluan.html'));
});

app.get('/test-site', (req, res) => {
  res.sendFile(path.join(__dirname, 'attacker_public', 'test-site.html'));
});

app.get('/clickjacking', (req, res) => {
  res.sendFile(path.join(__dirname, 'attacker_public', 'test-clickjacking.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  WEBSITE TẤN CÔNG / TEST NGOÀI ĐANG CHẠY: http://localhost:${PORT}`);
  console.log(`  - Trang tài liệu CSRF:   http://localhost:${PORT}/tailieu-khoaluan.html`);
  console.log(`  - Trang test CORS ngoài: http://localhost:${PORT}/test-site.html`);
  console.log(`  - Trang Clickjacking:    http://localhost:${PORT}/test-clickjacking.html`);
  console.log(`=======================================================`);
});

