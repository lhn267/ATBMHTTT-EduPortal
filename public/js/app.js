// Common client script for EduPortal

// LỖI 14: Khởi tạo sẵn JWT Token trong LocalStorage (Alg: none)
(function initJWT() {
  const existingToken = localStorage.getItem('edu_jwt_token');
  if (!existingToken) {
    // Header: {"alg":"none","typ":"JWT"}
    // Payload: {"ma_sv":"SV001","role":"sinhvien"}
    const sampleJWT = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJtYV9zdiI6IlNWMDAxIiwicm9sZSI6InNpbmh2aWVuIn0.";
    localStorage.setItem('edu_jwt_token', sampleJWT);
  }
})();

// Xử lý Session ID trên URL (LỖI 17) & Cập nhật thanh Header
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionFromUrl = urlParams.get('session');

  if (sessionFromUrl) {
    // Lưu cookie để các trang khác nhận diện
    document.cookie = `SESSION_ID=${sessionFromUrl}; path=/`;
  }

  // Lấy thông tin user hiện tại
  try {
    const res = await fetch('/api/current-user' + (sessionFromUrl ? `?session=${sessionFromUrl}` : ''));
    const data = await res.json();

    const userBadgeEl = document.getElementById('user-badge-container');
    if (userBadgeEl) {
      if (data.authenticated && data.user) {
        userBadgeEl.innerHTML = `
          <div class="user-badge">
            <span class="user-avatar" style="display: flex; align-items: center; justify-content: center;">
              <svg class="icon" style="width: 16px; height: 16px;" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <span>${data.user.name}</span>
            <button onclick="handleLogout()" class="btn btn-secondary btn-sm" style="margin-left: 8px; padding: 4px 10px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Đăng xuất
            </button>
          </div>
        `;
      } else {
        userBadgeEl.innerHTML = `
          <a href="/login.html" class="btn btn-primary btn-sm" style="color: white; border: 1px solid rgba(255,255,255,0.3); display: inline-flex; align-items: center; gap: 6px;">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Đăng nhập
          </a>
        `;
      }
    }
  } catch (err) {
    console.error("Lỗi xác thực người dùng:", err);
  }
});

// Hàm Đăng xuất (LỖI 18: Không thu hồi session phía server)
async function handleLogout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
    document.cookie = "SESSION_ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login.html';
  } catch (err) {
    window.location.href = '/login.html';
  }
}

