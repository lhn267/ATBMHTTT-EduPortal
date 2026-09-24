const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Data persistence helpers
const DATA_FILE = path.join(__dirname, 'data.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'data_initial.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading data.json:", err);
  }
  return JSON.parse(fs.readFileSync(INITIAL_DATA_FILE, 'utf8'));
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing data.json:", err);
  }
}

let db = loadData();

// Configure multer for uploads (LỖI 4: Không lọc phần mở rộng, cho phép upload .php)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Giữ nguyên tên file gốc (bao_cao.php)
  }
});
const upload = multer({ storage: storage });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CỐ TÌNH THIẾU HTTP SECURITY HEADERS (LỖI 16)
// Tuyệt đối không set X-Frame-Options, CSP frame-ancestors
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Content-Security-Policy');
  res.setHeader('X-Powered-By', 'PHP/7.4.33, Express/4.18.2'); // Thông tin server lộ liễu
  next();
});

// Phục vụ thư mục static public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Clean page routes matching the script URLs
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/mooc', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mooc.html')));
app.get('/diem', (req, res) => res.sendFile(path.join(__dirname, 'public', 'diem.html')));
app.get('/minhchung', (req, res) => res.sendFile(path.join(__dirname, 'public', 'minhchung.html')));
app.get('/tailieu', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tailieu.html')));
app.get('/view', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tailieu.html')));
app.get('/timkiem', (req, res) => res.sendFile(path.join(__dirname, 'public', 'timkiem.html')));
app.get('/giangvien', (req, res) => res.sendFile(path.join(__dirname, 'public', 'giangvien.html')));
app.get('/thong-tin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'thong-tin.html')));
app.get('/detai', (req, res) => res.sendFile(path.join(__dirname, 'public', 'detai.html')));
app.get('/logs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'logs.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/debug-error', (req, res) => res.sendFile(path.join(__dirname, 'public', 'debug-error.html')));

// -------------------------------------------------------------
// LỖI 11: Lộ cấu trúc thư mục .git ra môi trường web
// -------------------------------------------------------------
app.get('/.git/config', (req, res) => {
  res.type('text/plain');
  res.send(`[core]
\trepositoryformatversion = 0
\tfilemode = false
\tbare = false
\tlogallrefupdates = true
\tignorecase = true
[remote "origin"]
\turl = https://github.com/eduportal-core/eduportal-web.git
\tfetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
\tremote = origin
\tmerge = refs/heads/main
[user]
\tname = Bao Ngoc
\temail = baongoc@uel.edu.vn`);
});

app.get('/.git/HEAD', (req, res) => {
  res.type('text/plain');
  res.send('ref: refs/heads/main\n');
});

// -------------------------------------------------------------
// LỖI 1 & 9 & 17 & 18: Đăng nhập (SQL Injection, Brute Force, Session URL)
// -------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const rawUser = String(username || '');
  const rawPass = String(password || '');

  // LỖI 1: SQL Injection bypass: admin' OR '1'='1' --
  const isSQLi = rawUser.includes("'") && (
    rawUser.toLowerCase().includes("or") || 
    rawUser.toLowerCase().includes("--") ||
    rawUser.toLowerCase().includes("#") ||
    rawUser.toLowerCase().includes("admin") ||
    rawUser.toLowerCase().includes("1=1")
  );

  if (isSQLi) {
    const sessionToken = "admin_sess_token";
    res.cookie('SESSION_ID', sessionToken);
    return res.json({
      success: true,
      message: "Đăng nhập thành công qua quyền Quản trị viên (SQLi Detected)!",
      user: {
        username: "admin",
        name: "TS. Hồng Ngọc (Giảng viên & Admin)",
        role: "admin"
      },
      session: sessionToken,
      redirect: "/dashboard.html"
    });
  }

  // Đăng nhập bình thường
  const user = db.users.find(u => u.username === rawUser && u.password === rawPass);
  if (user) {
    let sessionToken = '8f3a1c9d0e';
    if (user.username === 'SV001') sessionToken = 'abc123';
    else if (user.username === 'admin') sessionToken = 'admin_sess_token';

    res.cookie('SESSION_ID', sessionToken);
    return res.json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        role: user.role
      },
      session: sessionToken,
      redirect: "/dashboard.html"
    });
  }

  // LỖI 9: Không hề có Rate Limit hay khóa tài khoản khi gõ sai mật khẩu liên tục
  return res.status(401).json({
    success: false,
    message: "Tên đăng nhập hoặc mật khẩu không chính xác!"
  });
});

// LỖI 18: Không thu hồi session khi đăng xuất
app.post('/api/logout', (req, res) => {
  // Chỉ xóa cookie ở trình duyệt client, KHÔNG hủy session "8f3a1c9d0e" trên server
  res.clearCookie('SESSION_ID');
  res.json({ success: true, message: "Đã đăng xuất giao diện." });
});

// Kiểm tra phiên người dùng hiện tại (hỗ trợ session qua URL - LỖI 17)
app.get('/api/current-user', (req, res) => {
  const sessionFromUrl = req.query.session;
  const sessionFromCookie = req.cookies.SESSION_ID;
  const token = sessionFromUrl || sessionFromCookie;

  if (token && db.sessions[token] && db.sessions[token].valid) {
    return res.json({
      authenticated: true,
      sessionToken: token,
      user: db.sessions[token]
    });
  }

  return res.json({ authenticated: false });
});

// -------------------------------------------------------------
// LỖI 2: Bình luận khóa học MOOC dính Stored XSS
// -------------------------------------------------------------
app.get('/api/comments', (req, res) => {
  res.json(db.comments);
});

app.post('/api/comments', (req, res) => {
  const { user, content } = req.body;
  // Lưu trực tiếp không sanitize, không escape HTML
  const newComment = {
    id: db.comments.length + 1,
    user: user || "TS. Hồng Ngọc",
    avatar: "user",
    content: content || "",
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " " + new Date().toLocaleDateString('vi-VN')
  };
  db.comments.push(newComment);
  saveData(db);
  res.json({ success: true, comment: newComment });
});

// -------------------------------------------------------------
// LỖI 3: Xem điểm IDOR (?ma_de_tai=104 -> 105)
// -------------------------------------------------------------
app.get('/api/grades', (req, res) => {
  const maDeTai = req.query.ma_de_tai || "104";
  const grade = db.grades[maDeTai];
  if (grade) {
    return res.json({ success: true, data: grade });
  }
  return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu đề tài #" + maDeTai });
});

// -------------------------------------------------------------
// LỖI 4: Nộp minh chứng cho phép upload file PHP
// -------------------------------------------------------------
app.post('/api/upload-minhchung', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Chưa chọn file!" });
  }
  // Hệ thống hoàn toàn chấp nhận file .php
  res.json({
    success: true,
    message: `Tải lên thành công — ${req.file.originalname}`,
    filename: req.file.originalname,
    path: `/uploads/${req.file.originalname}`,
    size: req.file.size
  });
});

// -------------------------------------------------------------
// LỖI 5: Đường dẫn file dính Directory Traversal (LFI)
// -------------------------------------------------------------
app.get('/api/view-file', (req, res) => {
  const fileParam = req.query.file || '';

  // Nếu người dùng yêu cầu ../../../../etc/passwd
  if (fileParam.includes('etc/passwd') || fileParam.includes('passwd')) {
    const passwdPath = path.join(__dirname, 'docs', 'etc_passwd.txt');
    if (fs.existsSync(passwdPath)) {
      res.type('text/plain; charset=utf-8');
      return res.send(fs.readFileSync(passwdPath, 'utf8'));
    }
  }

  // Đọc file thông thường
  const targetPath = path.join(__dirname, 'docs', path.basename(fileParam));
  if (fs.existsSync(targetPath)) {
    res.type('text/plain; charset=utf-8');
    return res.send(fs.readFileSync(targetPath, 'utf8'));
  }

  res.status(404).type('text/plain').send(`404 File Not Found: Không tìm thấy tài liệu [${fileParam}]`);
});

// -------------------------------------------------------------
// LỖI 6: Không có Token chống CSRF
// -------------------------------------------------------------
// Cho phép request từ website tấn công (http://localhost:4000) kèm Cookie
app.use('/api/cap-nhat-thong-bao', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:4000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.post('/api/cap-nhat-thong-bao', (req, res) => {
  // Cho phép request gửi từ bất kỳ origin nào không cần CSRF token
  const newNotice = {
    id: db.announcements.length + 1,
    tieu_de: req.body.tieu_de || "YÊU CẦU DUYỆT BỔ SUNG MINH CHỨNG ĐỀ TÀI #87 (CSRF Triggered)",
    noi_dung: req.body.noi_dung || "Thao tác tự động được kích hoạt thông qua phiên đăng nhập của sinh viên mà không có CSRF Token xác thực.",
    ngay: new Date().toLocaleTimeString('vi-VN') + " " + new Date().toLocaleDateString('vi-VN'),
    nguoi_dang: "Hệ Thống Tự Động (CSRF Action)"
  };
  db.announcements.unshift(newNotice);
  saveData(db);

  // Thêm log
  db.audit_logs.push({
    timestamp: new Date().toLocaleTimeString('vi-VN') + " " + new Date().toLocaleDateString('vi-VN'),
    method: "POST",
    url: "/api/cap-nhat-thong-bao",
    ip: req.ip || "127.0.0.1",
    user: "SESSION: " + (req.cookies.SESSION_ID || "Khách"),
    detail: "Cập nhật thông báo qua POST không CSRF Token"
  });

  res.json({ success: true, message: "Cập nhật thành công.", notice: newNotice });
});

app.get('/api/announcements', (req, res) => {
  res.json(db.announcements);
});

// -------------------------------------------------------------
// LỖI 7: Hiển thị chi tiết mã lỗi truy vấn SQL ra màn hình
// -------------------------------------------------------------
app.get('/api/tim-kiem-sv', (req, res) => {
  const ma_sv = req.query.ma_sv || '';
  const trimmed = ma_sv.trim();
  const lower = trimmed.toLowerCase();

  // Kích hoạt lỗi SQL nếu có dấu ngoặc kép " hoặc nháy đơn ' HOẶC gõ 12a / 12a" theo kịch bản
  if (trimmed.includes('"') || trimmed.includes("'") || lower === '12a' || lower.startsWith('12a')) {
    const displayQuery = trimmed.includes('"') ? trimmed : `${trimmed}"`;
    return res.status(500).json({
      error: true,
      message: `Error: SQLSTATE[42000]: Syntax error or access violation: 1064 You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near "SELECT * FROM diem WHERE ma_sv = '${displayQuery}'" at line 1`,
      query: `SELECT * FROM diem WHERE ma_sv = '${displayQuery}'`,
      code: "SQLSTATE[42000]"
    });
  }

  // Bình thường
  res.json({
    error: false,
    results: [
      { ma_sv: "SV001", ho_ten: "Bảo Nghi", lop: "K22_UEL", gpa: "2.1 / 4.0" },
      { ma_sv: "SV002", ho_ten: "Bảo Ngọc", lop: "K22_UEL", gpa: "3.6 / 4.0" }
    ]
  });
});

// -------------------------------------------------------------
// LỖI 8: API lộ thông tin cá nhân của giảng viên
// -------------------------------------------------------------
app.get('/api/giangvien/:id', (req, res) => {
  const gv = db.lecturers[req.params.id];
  if (gv) {
    // Trả đầy đủ thông tin cá nhân nhạy cảm (SĐT, Địa chỉ riêng...) mà không cần đăng nhập
    return res.json(gv);
  }
  return res.status(404).json({ error: "Không tìm thấy giảng viên" });
});

app.get('/api/giangvien', (req, res) => {
  res.json(Object.values(db.lecturers));
});

// -------------------------------------------------------------
// LỖI 12: Cấu hình CORS lỏng lẻo cho phép mọi domain gọi API
// -------------------------------------------------------------
app.get('/api/diem', (req, res) => {
  // LỖI 12: Cho phép mọi domain đọc dữ liệu
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.json({
    sinh_vien: "Bảo Ngọc",
    mssv: "SV002",
    khoa: "Hệ thống thông tin",
    bang_diem: {
      "Cơ sở dữ liệu": 8.5,
      "An toàn thông tin": 9.0,
      "Mạng máy tính": 8.0,
      "Lập trình Web": 9.5
    }
  });
});

// -------------------------------------------------------------
// LỖI 14: Mã JWT Token sinh ra không được mã hóa an toàn / không kiểm tra chữ ký
// -------------------------------------------------------------
app.get('/api/get-jwt', (req, res) => {
  const defaultToken = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJtYV9zdiI6IlNWMDAxIiwicm9sZSI6InNpbmh2aWVuIn0.";
  res.json({ token: defaultToken });
});

app.post('/api/verify-jwt', (req, res) => {
  const authHeader = req.headers.authorization || req.body.token || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ success: false, message: "Thiếu JWT Token!" });
  }

  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      // Decode payload trực tiếp mà KHÔNG KIỂM TRA CHỮ KÝ
      const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
      const payload = JSON.parse(payloadStr);

      if (payload.role === 'admin') {
        return res.json({
          success: true,
          status: 200,
          role: "admin",
          message: "Xác thực JWT thành công! Cấp quyền Quản trị viên EduPortal.",
          payload: payload
        });
      } else {
        return res.json({
          success: true,
          status: 200,
          role: payload.role || 'sinhvien',
          message: "Xác thực JWT thành công: Quyền sinh viên thường.",
          payload: payload
        });
      }
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "Token không hợp lệ!" });
  }

  res.status(400).json({ success: false, message: "Không thể phân tích JWT." });
});

// -------------------------------------------------------------
// LỖI 19 & 20: Bỏ qua kiểm duyệt đề tài & Chỉ validate ở client
// -------------------------------------------------------------
app.get('/api/detai/:id', (req, res) => {
  const id = req.params.id;
  const item = db.thesis[id];
  if (item) {
    return res.json(item);
  }
  res.status(404).json({ error: "Không tìm thấy đề tài #" + id });
});

app.put('/api/detai/:id', (req, res) => {
  const id = req.params.id;
  const { trang_thai } = req.body;

  // Ghi log chi tiết cho A kiểm tra (LỖI 20)
  const logEntry = {
    timestamp: new Date().toLocaleTimeString('vi-VN') + " " + new Date().toLocaleDateString('vi-VN'),
    method: "PUT",
    url: `/api/detai/${id}`,
    ip: req.ip || "127.0.0.1",
    user: "Bảo Nghi (C) - MSSV: SV001",
    payload: req.body,
    bypass_ui: true,
    detail: `Gửi thẳng request PUT cập nhật trạng thái thành "${trang_thai}" không qua phê duyệt của Trưởng bộ môn!`
  };
  db.audit_logs.push(logEntry);

  if (db.thesis[id]) {
    db.thesis[id].trang_thai = trang_thai;
    db.thesis[id].trang_thai_label = (trang_thai === 'da_duyet' ? 'Đã duyệt' : 'Chờ duyệt');
    saveData(db);
    return res.json({
      success: true,
      message: "Cập nhật đề tài thành công!",
      data: db.thesis[id]
    });
  }

  res.status(404).json({ success: false, message: "Không tìm thấy đề tài" });
});

// Endpoint xem log request (cho A soi trong Cảnh 4)
app.get('/api/logs', (req, res) => {
  res.json(db.audit_logs);
});

// Endpoint Reset Data tiện lợi
app.post('/api/reset-all', (req, res) => {
  const initial = JSON.parse(fs.readFileSync(INITIAL_DATA_FILE, 'utf8'));
  db = initial;
  saveData(db);
  res.json({ success: true, message: "Dữ liệu hệ thống đã được phục hồi về trạng thái ban đầu!" });
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  HỆ THỐNG EDUPORTAL ĐANG CHẠY TẠI: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

