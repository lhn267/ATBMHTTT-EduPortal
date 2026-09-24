const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'attacker_public')));

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

