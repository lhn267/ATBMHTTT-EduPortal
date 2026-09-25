# CẨM NANG ĐẠO DIỄN & KỊCH BẢN QUAY CHI TIẾT (NHÓM 6 - ATBMHTTT)
> **Dự án:** Tiểu phẩm tình huống An Toàn Bảo Mật Hệ Thống Thông Tin  
> **Chủ đề:** 20 Lỗ hổng Ứng dụng Web (Web Vulnerabilities) trên hệ thống **EduPortal**  
> **Nhân vật:**
> - **Bảo Ngọc (A)**: Trưởng nhóm, Lập trình viên chính xây dựng EduPortal.
> - **Cô Hồng Ngọc (B)**: Cô giáo viên hướng dẫn kiêm Quản trị hệ thống.
> - **Bảo Nghi (C)**: Thành viên cùng nhóm nhưng đang trượt đề tài tốt nghiệp.

---

## I. HƯỚNG DẪN MÔI TRƯỜNG QUAY & ĐƯỜNG LINK (CHỌN 1 TRONG 2)

> 🌟 **LƯU Ý DÀNH CHO DIỄN VIÊN VỀ ĐƯỜNG LINK TRUY CẬP:**
>
> * **NẾU QUAY ONLINE TRÊN CLOUD (RENDER):**  
>   - Link chính thức EduPortal: **`https://<link-web-cua-ban>.onrender.com`** (ví dụ: `https://eduportal-nhom6.onrender.com`).  
>   - Mỗi khi kịch bản ghi `http://localhost:3000/...`, diễn viên chỉ cần truy cập vào đường link Render của mình với đuôi tương ứng (hoặc **bấm trực tiếp các nút trên thanh menu giao diện**, hệ thống sẽ tự chuyển đúng trang).  
>   - **Cách Reset dữ liệu 1-Click khi quay online:** Mở link `https://<link-web-cua-ban>.onrender.com/reset` là dữ liệu lập tức trở về nguyên bản sạch sẽ 100%!
>
> * **NẾU QUAY OFFLINE TRÊN MÁY TÍNH (LOCALHOST):**  
>   - Vào thư mục dự án, nhấp đúp file **`run.bat`** để khởi động hệ thống.  
>   - Dùng đúng các link `http://localhost:3000` và `http://localhost:4000` như trong kịch bản.  
>   - **Cách Reset dữ liệu:** Nhấp đúp file **`reset_data.bat`** (hoặc mở `http://localhost:3000/reset`).

---

## II. PHÂN CẢNH CHI TIẾT TỪNG LỖ HỔNG (SCENE BY SCENE)

### 🎬 CẢNH 1: PHÒNG LAB - A DEMO EDUPORTAL CHO CÔ B
*Bối cảnh: Trong phòng Lab. A và Cô B ngồi trước máy tính, A mở EduPortal để báo cáo tiến độ.*

#### 1. Form đăng nhập dính SQL Injection (Lỗi 1)
- **Lời thoại Cô Hồng Ngọc (B):** *"Sắp báo cáo tiến độ rồi, cho cô xem tổng quan đi em."*
- **Thao tác trên máy (B gõ):**
  - Mở trang đăng nhập: `http://localhost:3000/login` *(hoặc link Render: `.../login`)*
  - Ô **Tên đăng nhập / Mã số**: Gõ chính xác chuỗi:
    ```sql
    admin' OR '1'='1' --
    ```
  - Ô **Mật khẩu**: Để trống (hoặc gõ bất kỳ).
  - Bấm nút: **"Đăng Nhập"**.
- **Màn hình hiển thị:** Chuyển thẳng vào Bảng điều khiển Quản trị viên (`/dashboard.html`) với tên *TS. Hồng Ngọc (Giảng viên & Admin)*.
- **Lời thoại Cô Hồng Ngọc (B):** *(Khựng lại, ngạc nhiên)* *"Ơ... cô gõ bậy bạ vậy mà vô được trang quản trị luôn á?"*
- **Lời thoại Bảo Ngọc (A):** *(Cười trừ, mắt nhìn sang màn hình)* *"Chắc tài khoản demo em chưa xóa á cô, để mai em check, giờ xem tiếp phần MOOC cho kịp giờ lab."*

#### 2. Bình luận khóa học MOOC dính Stored XSS (Lỗi 2)
- **Thao tác trên máy:**
  - Bấm vào menu **"Khóa Học MOOC"** (hoặc truy cập `http://localhost:3000/mooc` *(hoặc link Render: `.../mooc`)*).
  - Cuộn xuống phần **Thảo luận & Bình luận**.
  - Trong ô *Nội dung bình luận*, B gõ:
    ```html
    <script>alert('test')</script>
    ```
  - Bấm nút: **"Gửi bình luận"**.
- **Màn hình hiển thị:** Trang tải lại, một hộp thoại popup **`alert("test")`** lập tức bật lên ngay giữa màn hình!
- **Lời thoại Bảo Ngọc (A):** *(Giật mình rồi bật cười)* *"Ủa gõ ký tự lạ mà nó chạy thành popup luôn kìa, chắc em quên lọc mấy ký tự đặc biệt. Kệ đi cô, không ảnh hưởng chức năng chính đâu."*
- **Lời thoại Cô Hồng Ngọc (B):** *(Nhìn đồng hồ)* *"Thôi để ý sau nhé, giờ demo tiếp phần nộp minh chứng....."*

---

### 🎬 CẢNH 2: PHÒNG LAB CHIỀU HÔM ĐÓ - C TEST MỘT MÌNH
*Bối cảnh: Cô B giao nhiệm vụ cho C test web, sau đó C ở lại phòng Lab một mình.*

- **Lời thoại B (trước khi về):** *"Em test kỹ giùm cô mấy chức năng trước khi mình launch cho cả khoa nha, có gì lạ báo cô liền."*
- **Lời thoại Bảo Nghi (C):** *"Dạ được cô."*

- **Thao tác chuyển cảnh (Rất quan trọng):**
  - C đăng xuất tài khoản của Cô B (bấm nút **"Đăng xuất"** ở góc trên bên phải).
  - C đăng nhập vào tài khoản sinh viên của mình:
    - **Tên đăng nhập / Mã số:** `SV001`
    - **Mật khẩu:** `quan123`
    - Bấm nút: **"Đăng Nhập"**
  - **Màn hình hiển thị:** Chuyển vào Dashboard, góc trên bên phải hiện tên: **Bảo Nghi (C)**.
  - *(Ghi chú: Toàn bộ Cảnh 2 là C test với vai trò sinh viên bình thường, nhờ đó các tình huống phát hiện điểm của mình bị rớt, bị chặn quyền truy cập admin, nộp đề tài... mới hoàn toàn ăn khớp với kịch bản!)*

#### 3. Sửa ID trên URL để xem điểm nhóm khác - IDOR (Lỗi 3)
- **Lời thoại Bảo Nghi (C):** *"Chức năng xem điểm... để test thử coi có bug gì không."*
- **Thao tác trên máy (C làm):**
  - Mở trang điểm: `http://localhost:3000/diem?ma_de_tai=104` *(hoặc link Render: `.../diem?ma_de_tai=104`)*
  - Màn hình hiện: Điểm của nhóm C (*Đề tài #104 - 4.0 điểm - Không đạt / Rớt đề tài*).
  - C bôi đen số `104` trên thanh địa chỉ URL, sửa thành: `105` rồi nhấn **Enter** (`http://localhost:3000/diem?ma_de_tai=105` hoặc link Render: `.../diem?ma_de_tai=105`).
- **Màn hình hiển thị:** Lập tức hiện bảng điểm của nhóm khác (*Đề tài #105 - 9.0 điểm - Đạt / Được duyệt*).
- **Lời thoại Bảo Nghi (C):** *"Dễ vậy luôn hả, đổi mỗi con số thôi mà. (Khựng lại, sững sờ) Ơ, đề tài mình bị rớt mà nhóm khác được duyệt... (Im lặng một lúc) ...thôi, test tiếp đã."*

#### 4. Module minh chứng cho phép upload file PHP (Lỗi 4)
- **Lời thoại Bảo Nghi (C):** *"Mà khoan... nếu điểm với thông tin đề tài của nhóm khác còn xem được, không biết mấy chỗ khác có kiểm tra kỹ hơn không."*
- **Thao tác trên máy:**
  - Bấm vào menu **"Nộp Minh Chứng"** (`http://localhost:3000/minhchung` *(hoặc link Render: `.../minhchung`)*).
  - Mở thư mục hoặc kéo thả tệp **`uploads/bao_cao.php`** (đã chuẩn bị sẵn trong thư mục dự án) vào khung tải tệp.
- **Màn hình hiển thị:** Thông báo màu xanh nổi bật: **"Tải lên thành công — bao_cao.php"**.
- **Lời thoại Bảo Nghi (C):** *(Ồ lên khe khẽ)* *"Up lên được thiệt luôn? Nó đâu có kiểm tra đuôi file gì đâu ta..."*

#### 5. Đường dẫn file dính Directory Traversal (Lỗi 5)
- **Lời thoại Bảo Nghi (C):** *"Upload được file gì cũng cho qua... vậy cái chỗ đọc tài liệu này có kiểm tra đường dẫn không?"*
- **Thao tác trên máy:**
  - Bấm vào menu **"Tài Liệu"** (`http://localhost:3000/tailieu?file=huong_dan_khoa_luan.pdf` *(hoặc link Render: `.../tailieu?file=...`)* hoặc `/view?file=...`).
- **Lời thoại Bảo Nghi (C):** *"Có tham số file luôn..."*
- **Thao tác trên máy:**
  - Sửa tham số trên URL thành:
    ```
    http://localhost:3000/tailieu?file=../../../../etc/passwd
    (hoặc link Render: https://<web>/tailieu?file=../../../../etc/passwd)
    ```
  - Nhấn **Enter**.
- **Màn hình hiển thị:** Toàn bộ nội dung tập tin `/etc/passwd` trên máy chủ hiển thị trên màn hình (`root:x:0:0:root:...`).
- **Lời thoại Bảo Nghi (C):** *"Wow. Đi vòng vòng vậy mà đọc được cả file trên server luôn á?"*

#### 6. Không có mã Token chống CSRF (Lỗi 6)
- **Hành động:** Điện thoại C rung chuông có tin nhắn từ bạn: *"Có tài liệu hướng dẫn làm khóa luận mới, mọi người vào xem nhé: tailieu-khoaluan.edu"*.
- **Lời thoại Bảo Nghi (C):** *"Ủa, có tài liệu mới hả? Để coi thử."*
- **Thao tác trên máy:**
  - Mở một tab mới trên trình duyệt, truy cập:
    ```
    http://localhost:4000/tailieu-khoaluan.html
    ```
  - Màn hình hiện trang tải đơn giản: **"Đang tải tài liệu..."**.
  - C mở DevTools (phím **F12**), chọn tab **Network**.
  - Thấy request chạy ngầm: `POST http://localhost:3000/api/cap-nhat-thong-bao`, Cookie: `SESSION_ID=...`, Status: `200 OK`.
- **Lời thoại Bảo Nghi (C):** *"Ủa gì vậy? Mình có làm gì đâu? Để mở DevTools lên xem thử... Khoan... Mình đang coi tài liệu thôi mà? Sao bên EduPortal lại vừa có thao tác?"*
- **Thao tác trên máy:** Chuyển sang tab EduPortal (`http://localhost:3000/dashboard.html` *(hoặc link Render: `.../dashboard.html`)*). Màn hình hiện thông báo mới: *"Cập nhật thành công"*.
- **Lời thoại Bảo Nghi (C):** *"Vậy là web bên ngoài vừa khiến EduPortal thực hiện thao tác bằng phiên đăng nhập của mình? Để note lại lỗi này."*

#### 7. Hiển thị chi tiết lỗi truy vấn SQL ra màn hình (Lỗi 7)
- **Lời thoại Bảo Nghi (C):** *"Test tới đây coi như tạm ổn phần chính. Còn cái ô tìm mã sinh viên nữa..."*
- **Thao tác trên máy:**
  - Vào trang **"Tìm Kiếm"** (`http://localhost:3000/timkiem` *(hoặc link Render: `.../timkiem`)*).
  - Nhập vào ô tìm kiếm chuỗi:
    ```
    12a"
    ```
  - Bấm **"Tra cứu"**.
- **Màn hình hiển thị:** Khối lỗi SQL chi tiết màu đỏ xuất hiện:  
  `Error: SQLSTATE[42000]: Syntax error or access violation: 1064 You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near "SELECT * FROM diem WHERE ma_sv = '12a'" at line 1`
- **Lời thoại Bảo Nghi (C):** *"Cái gì đây... nó hiện luôn cả cấu trúc bên trong. Web này đúng kiểu cái gì cũng để lộ."*

#### 10. Để lộ mật khẩu kết nối Database trong file HTML (Lỗi 10)
- **Lời thoại Bảo Nghi (C):** *"Test xong phần tìm kiếm rồi, giờ qua trang thông tin chung coi UI ổn không."*
- **Thao tác trên máy:**
  - Vào trang **"Thông Tin Chung"** (`http://localhost:3000/thong-tin` *(hoặc link Render: `.../thong-tin`)*).
  - Nhấp chuột phải vào trang, chọn **"Xem nguồn trang" (View Page Source)** hoặc nhấn tổ hợp phím **Ctrl + U**.
  - Cuộn xuống đáy trang HTML.
- **Màn hình hiển thị:** Thấy dòng chú thích của lập trình viên:
  ```html
  <!-- DB_HOST=localhost DB_USER=root DB_PASS=Edu@2024 -->
  ```
- **Lời thoại Bảo Nghi (C):** *(Dừng lại, bất ngờ)* *"...cái này là gì vậy? Thông tin đăng nhập database nằm ngay trong code gửi về trình duyệt luôn á? (C định nhắn báo ngay cho A, rồi khựng lại, chụp màn hình lưu riêng) ...để coi thử cái này dùng được gì không đã, báo sau."*

#### 11. Lộ cấu trúc thư mục Git ra môi trường web (Lỗi 11)
- **Lời thoại Bảo Nghi (C):** *"Thử coi cái thư mục git lúc đẩy code lên server còn sót không ha."*
- **Thao tác trên máy:**
  - Gõ trên URL trình duyệt:
    ```
    http://localhost:3000/.git/config
    (hoặc link Render: https://<web>/.git/config)
    ```
  - Nhấn **Enter**.
- **Màn hình hiển thị:** Toàn bộ nội dung tập tin cấu hình mã nguồn `.git/config` hiện ra.
- **Lời thoại Bảo Nghi (C):** *"Còn luôn á? Vậy ai rảnh cũng lấy được nguyên code tụi mình viết luôn chứ gì. (Lại định báo rồi thôi) Thôi, để tổng hợp một lượt rồi báo luôn cho gọn."*

#### 12. Cấu hình CORS lỏng lẻo cho phép mọi domain gọi API (Lỗi 12)
- **Lời thoại Bảo Nghi (C):** *"Để coi API có cho website bên ngoài đọc dữ liệu không."*
- **Thao tác trên máy:**
  - Mở tab mới vào trang kiểm thử bên ngoài:
    ```
    http://localhost:4000/test-site.html
    ```
  - Bấm nút **"Thực hiện gọi API http://localhost:3000/api/diem"**.
  - Mở tab DevTools (**F12**), xem Response Headers thấy:
    ```http
    Access-Control-Allow-Origin: *
    ```
- **Màn hình hiển thị:** Trang ngoài đọc được trọn vẹn điểm số của sinh viên:  
  *Nguyễn A — Cơ sở dữ liệu: 8.5 — An toàn thông tin: 9.0...*
- **Lời thoại Bảo Nghi (C):** *"Ơ... trang ngoài EduPortal mà vẫn đọc được response API luôn? Để lưu lại lỗi này luôn."*

#### 13. Dùng thư viện JavaScript cũ dính lỗ hổng (Lỗi 13)
- **Thao tác trên máy:**
  - Tại trang EduPortal, mở DevTools (**F12**), bấm vào tab **Console**.
- **Màn hình hiển thị:** Xuất hiện dòng cảnh báo màu vàng:
  ```
  JQMIGRATE: jQuery 1.8.3 — deprecated, known vulnerabilities
  ```
- **Lời thoại Bảo Nghi (C):** *"Ủa sao Console cứ cảnh báo cái này vậy ta."*
- **Thao tác trên máy:** Mở Google gõ thử `jQuery 1.8.3 CVE`.
- **Lời thoại Bảo Nghi (C):** *(Trầm ngâm)* *"Thư viện cũ vậy mà tụi mình vẫn còn dùng à... đúng ra phải update lâu rồi."*

#### 14. Mã JWT Token sinh ra không được kiểm tra chữ ký (Lỗi 14)
- **Bản chất kỹ thuật (Giải thích rõ cho diễn viên & đạo diễn):**
  - Hệ thống dùng chuỗi **JWT Token** lưu trong trình duyệt để nhận diện quyền của người dùng.
  - Token ban đầu của C là tài khoản sinh viên: phần nội dung (Payload) chứa quyền `{"role": "sinhvien"}`.
  - Lập trình viên thiết lập bảo mật sai lầm (`"alg": "none"` — không kiểm tra chữ ký). Do đó, chỉ cần người dùng tự ý đổi chuỗi thành quyền `{"role": "admin"}` thì máy chủ vẫn tin tưởng tuyệt đối và trao quyền Quản trị viên tối cao!
- **Thao tác trên máy (C làm tuần tự):**
  1. **Bước 1:** C thử gõ đường dẫn trang Quản trị trên thanh URL:
     ```
     http://localhost:3000/admin
     (hoặc link Render: https://<web>/admin)
     ```
     - **Màn hình hiển thị:** Khung đỏ chặn lại:  
       `403 Forbidden: Quyền của bạn là [sinhvien]. Chỉ tài khoản có role [admin] mới được truy cập!`
  2. **Lời thoại Bảo Nghi (C):** *"Chỉ tài khoản admin mới vào được à... Để coi token này được xác thực kiểu gì."*
  3. **Bước 2:** C mở DevTools (**F12**) $\rightarrow$ chọn tab **Application** $\rightarrow$ ở cột bên trái chọn **Local Storage** $\rightarrow$ bấm vào `http://localhost:3000`.
     - C nhìn thấy dòng có tên khóa là **`edu_jwt_token`**.
  4. **Bước 3:** C nhấp đúp chuột vào ô giá trị (Value) của dòng `edu_jwt_token`, xóa đoạn mã cũ đi và dán chuỗi token quyền Admin đã chuẩn bị sẵn:
     ```text
     eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJtYV9zdiI6IlNWMDAxIiwicm9sZSI6ImFkbWluIn0.
     ```
     *(Ghi chú: Diễn viên copy sẵn mã này vào Notepad để lúc quay chỉ cần Ctrl+C và Ctrl+V vào ô)*.
  5. **Bước 4:** C nhấn phím **F5** (hoặc bấm nút *"Kiểm tra lại quyền"* ngay trên màn hình).
- **Màn hình hiển thị:** Lập tức dòng lỗi 403 biến mất! Toàn bộ **BẢNG ĐIỀU KHIỂN QUẢN TRỊ CẤP CAO (SYSTEM ADMIN)** màu đỏ rực bung ra với thông số 1,248 sinh viên, 142 đề tài, quyền Root / Admin cấp cao!
- **Lời thoại Bảo Nghi (C):** *(Ngạc nhiên rồi sững người)* *"Khoan... Token bị sửa rồi mà server vẫn chấp nhận? Vậy backend không kiểm tra chữ ký token đúng cách rồi."*

---

### 🎬 CẢNH 3: VĂN PHÒNG KHOA - A VÀ B RÀ SOÁT TRƯỚC GIỜ G
*Bối cảnh: Vài ngày sau tại văn phòng khoa. A và Cô B ngồi trước máy tính rà soát lại hệ thống. C lảng vảng gần đó giả vờ bận rộn vì đã biết trước các lỗi.*

#### 8. API lộ thông tin cá nhân của giảng viên (Lỗi 8)
- **Thao tác trên máy:**
  - B mở mục **"Giảng Viên"** (`http://localhost:3000/giangvien` *(hoặc link Render: `.../giangvien`)*).
- **Lời thoại Cô Hồng Ngọc (B):** *"Để cô xem thử phần thông tin giảng viên. Em bấm vào cô này cho cô coi."*
- **Thao tác trên máy:** A bấm vào thẻ giảng viên mã số 12.
- **Lời thoại Cô Hồng Ngọc (B):** *"Ừ, phần này hiện bình thường. Nhưng dữ liệu này lấy ở đâu vậy em?"*
- **Lời thoại Bảo Ngọc (A):** *"Dạ, em lấy từ API của hệ thống ạ. Ví dụ giảng viên này có mã 12 thì đường dẫn là: http://localhost:3000/api/giangvien/12 (hoặc link Render: .../api/giangvien/12) nè cô."*
- **Lời thoại Cô Hồng Ngọc (B):** *"Vậy để cô thử mở thẳng đường dẫn đó xem."*
- **Thao tác trên máy:**
  - B copy link `http://localhost:3000/api/giangvien/12 (hoặc link Render: .../api/giangvien/12)`.
  - Mở một **cửa sổ ẩn danh mới (Ctrl + Shift + N)** để chắc chắn chưa hề đăng nhập.
  - Dán đường dẫn và Enter.
- **Màn hình hiển thị:** Màn hình trả về trực tiếp chuỗi JSON:
  ```json
  {
    "ho_ten": "Bảo Ngọc",
    "so_dien_thoai": "0912345678",
    "dia_chi": "Số 123 Đường Võ Văn Ngân, TP. Thủ Đức, TP. HCM"
  }
  ```
- **Lời thoại Cô Hồng Ngọc (B):** *"Ủa? Không đăng nhập mà vẫn xem được? Với nó trả cả số điện thoại với địa chỉ luôn này."*
- **Lời thoại Bảo Ngọc (A):** *"Chắc lúc làm API em cho nó trả hơi nhiều dữ liệu."*
- **Lời thoại Cô Hồng Ngọc (B):** *"Ừ, cái này phải coi lại. Người ngoài đâu được biết hết mấy thông tin này."*
- **Lời thoại Bảo Ngọc (A):** *"Dạ... để em sửa sau ạ."*

#### 9. Không giới hạn số lần nhập sai mật khẩu - Brute-Force (Lỗi 9)
- **Thao tác trên máy:** B mở lại trang đăng nhập `http://localhost:3000/login` *(hoặc link Render: `.../login`)*.
- **Lời thoại Cô Hồng Ngọc (B):** *"Để cô thử thêm cái này."*
- **Thao tác trên máy:**
  - B nhập username `admin`, gõ sai mật khẩu liên tục nhiều lần (15 lần).
  - Hệ thống chỉ báo đỏ *"Tên đăng nhập hoặc mật khẩu không chính xác! (Thử lần: 15)"*, hoàn toàn không khóa tài khoản hay hiện CAPTCHA.
  - Đến lần thứ 16, B gõ đúng mật khẩu: `admin@123` rồi bấm Đăng nhập -> Vào thẳng Dashboard.
- **Lời thoại Cô Hồng Ngọc (B):** *"Sao nhập sai cả chục lần mà nó không khóa tài khoản vậy?"*
- **Lời thoại Bảo Ngọc (A):** *(Bận gõ chỗ khác)* *"Dạ để em thêm sau, giờ deadline gấp quá cô ơi."*

#### 15. Bật chế độ Debug hiển thị lỗi trên server thật (Lỗi 15)
- **Thao tác trên máy:** A bấm vào liên kết **"Kiểm tra Báo cáo Lỗi Máy chủ"** (`http://localhost:3000/debug-error` *(hoặc link Render: `.../debug-error`)*).
- **Màn hình hiển thị:** Toàn màn hình hiện giao diện lỗi Debug Whoops đỏ rực với chi tiết:  
  `FatalErrorException: Call to a member function getStatus() on null in SystemReportController.php line 84`  
  Hiển thị cả đường dẫn tệp mã nguồn và các biến môi trường lộ mật khẩu MySQL: `DB_PASSWORD=Edu@2024`.
- **Lời thoại Bảo Ngọc (A):** *"Ủa sao lỗi này lại hiện chi tiết vậy ta..."*
- **Lời thoại Cô Hồng Ngọc (B):** *"Chắc do em để chế độ debug từ hồi code cho dễ tìm lỗi, quên tắt lại khi đẩy lên server thật rồi."*
- **Lời thoại Bảo Ngọc (A):** *(Gãi đầu)* *"Dạ, để em tắt."*  
*(C đứng gần đó nhìn màn hình lướt qua, ghi nhận thêm một lỗi vào danh sách riêng).*

#### 16. Thiếu các HTTP Security Headers cơ bản - Clickjacking (Lỗi 16)
- **Thao tác trên máy:**
  - B mở DevTools (**F12**) → tab **Network** → chọn request trang chủ `http://localhost:3000/` *(hoặc trang chủ Render)* → phần **Response Headers**.
- **Lời thoại Cô Hồng Ngọc (B):** *"Để cô kiểm tra mấy HTTP header bảo mật xem."*
- **Màn hình hiển thị:** Headers hoàn toàn không có `X-Frame-Options` hay `Content-Security-Policy`.
- **Lời thoại Cô Hồng Ngọc (B):** *"Không thấy X-Frame-Options, cũng không có frame-ancestors."*
- **Lời thoại Bảo Ngọc (A):** *"Hai cái đó dùng để ngăn trang bị nhúng vào iframe đúng không cô?"*
- **Lời thoại Cô Hồng Ngọc (B):** *"Ừ. Để cô thử luôn."*
- **Thao tác trên máy:**
  - B mở tệp `test.html` (hoặc vào `http://localhost:4000/test-clickjacking.html`).
- **Màn hình hiển thị:** Toàn bộ giao diện EduPortal hiển thị nguyên vẹn bên trong khung iframe màu đỏ.
- **Lời thoại Cô Hồng Ngọc (B):** *"Nhúng vào bình thường thật rồi này. Lỡ ai làm giả một trang y hệt rồi nhúng cái này vào, sinh viên đâu biết mình đang bấm nhầm trang giả."*
- **Lời thoại Bảo Ngọc (A):** *"Dạ, để em note lại lỗi."*

---

### 🎬 CẢNH 4: VĂN PHÒNG KHOA - SỰ THẬT PHƠI BÀY
*Bối cảnh: Vẫn tại văn phòng khoa ngay sau đó.*

#### 17. Truyền Session ID lộ liễu trên thanh URL (Lỗi 17)
- **Thao tác trên máy:** A mở một đường link EduPortal mà C từng gửi:
  ```
  http://localhost:3000/dashboard?session=8f3a1c9d0e
   (hoặc link Render: https://<web>/dashboard?session=8f3a1c9d0e)
  ```
- **Màn hình hiển thị:** Vào thẳng tài khoản A mà không cần đăng nhập.
- **Lời thoại Cô Hồng Ngọc (B):** *(Xem link, thấy đoạn &session=8f3a1c9d0e ngay giữa URL)* *"Cái này... sao đường link đọc tài liệu bình thường lại có nguyên đoạn mã phiên đăng nhập của em nằm ngay trên URL vậy?"*
- **Lời thoại Bảo Ngọc (A):** *(Chợt hiểu, mặt tái đi)* *"Ủa... vậy ai có cái link này là vào được tài khoản em luôn?"*
- **Lời thoại Cô Hồng Ngọc (B):** *"Link này còn có thể bị lưu vào lịch sử trình duyệt, log hoặc bị chia sẻ nhầm nữa."*

#### 18. Không tự động thu hồi Cookie/Session khi đăng xuất (Lỗi 18)
- **Lời thoại Cô Hồng Ngọc (B):** *"Để cô test thử coi sau khi đăng xuất session đó còn dùng được không."*
- **Thao tác trên máy:**
  - A bấm nút **"Đăng xuất"** trên giao diện EduPortal.
  - B mở một cửa sổ ẩn danh khác (hoặc trình duyệt khác), dán lại đường link cũ:  
    `http://localhost:3000/dashboard?session=8f3a1c9d0e
   (hoặc link Render: https://<web>/dashboard?session=8f3a1c9d0e)` và nhấn Enter.
- **Màn hình hiển thị:** Vẫn vào thẳng tài khoản A như bình thường dù vừa đăng xuất!
- **Lời thoại Cô Hồng Ngọc (B):** *(Thở dài)* *"Đăng xuất hẳn hoi rồi mà phiên cũ vẫn còn dùng được á. Đăng xuất coi như chỉ đóng giao diện thôi, chứ đâu thật sự khóa lại gì đâu."*

#### 19. Sửa tham số bỏ qua kiểm duyệt đề tài của trưởng bộ môn (Lỗi 19)
- **Hành động (Phân cảnh hồi tưởng hoặc C thao tác):**
  - C đăng nhập tài khoản sinh viên Quân (`SV001` / `quan123`).
  - C vào trang đề tài của mình: `http://localhost:3000/detai` *(hoặc link Render: `.../detai`)*.
  - Màn hình hiện: **Đề tài #87 — Trạng thái: Chờ duyệt** (Huy hiệu màu cam).
  - C mở DevTools (**F12**) → tab **Console** (hoặc Network).
  - C gửi request cập nhật đề tài:
    ```javascript
    fetch('/api/detai/87', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trang_thai: 'da_duyet' })
    }).then(res => res.json()).then(console.log);
    ```
  - Server trả về: `200 OK`.
  - C nhấn **F5 tải lại trang**.
- **Màn hình hiển thị:** Huy hiệu lập tức đổi sang màu xanh lá cây với chữ: **"ĐÃ DUYỆT (Đủ điều kiện bảo vệ)"**!
- **Lời thoại Bảo Nghi (C):** *"Ủa... sửa được thật à..."* *(C nhìn màn hình một lúc rồi lặng lẽ đóng DevTools).*

#### 20. Chỉ xác thực dữ liệu đầu vào bằng JavaScript ở client thay vì backend (Lỗi 20)
- **Thao tác trên máy (A thực hiện tại bàn làm việc):**
  - A vào trang **"Nhật Ký Máy Chủ"** (`http://localhost:3000/logs` *(hoặc link Render: `.../logs`)*).
- **Màn hình hiển thị:** Dòng nhật ký bôi đỏ nổi bật:  
  `PUT /api/detai/87 - Payload: {"trang_thai": "da_duyet"} - Tài khoản: Bảo Nghi (C) - Cảnh báo: Gửi thẳng request PUT cập nhật trạng thái không qua phê duyệt của Trưởng bộ môn!`
- **Lời thoại Bảo Ngọc (A):** *(Mặt biến sắc, quay sang nói với cô B)* *"Cái này đâu phải bấm nút trên web ra được, phải tự tay soạn hẳn một yêu cầu gửi thẳng lên server mới ra vầy chứ. Mà sao gửi bậy vậy vẫn được server chấp nhận luôn, đâu ai kiểm tra lại gì hết á?"*

---

### 🎬 ĐOẠN KẾT: ĐỐI CHẤT & BÀI HỌC CUỐI CÙNG
*(A và Cô B cùng quay sang nhìn C đang đứng cúi gằm mặt).*

- **Lời thoại Bảo Nghi (C):** *(Nghẹn ngào, ngồi sụp xuống ghế)* *"Dạ... em xin lỗi cô, xin lỗi A. Em test giùm mà phát hiện toàn lỗi, em định báo lại... nhưng em đang trượt đề tài, em sợ quá nên..."*
- **Lời thoại Cô Hồng Ngọc (B):** *(Giọng trầm, nghiêm nghị nhưng ấm áp)* *"Quân, cô hiểu áp lực của em. Nhưng đáng lẽ ra, chính lúc em phát hiện những lỗi này trong lúc test, đó là cơ hội để em giúp cả nhóm sửa nó — không phải cơ hội để lợi dụng."*
- **Lời thoại Bảo Ngọc (A):** *(Thấm thía)* *"Mà đúng thật ha cô, tụi em cũng đâu phải không biết cách sửa, mà cứ mỗi lần thấy gì lạ lúc demo, tụi em đều nghĩ 'thôi kệ, để sau' rồi cho qua..."*
- **Lời thoại Cô Hồng Ngọc (B):** *(Kết phim - Nhìn thẳng vào ống kính hoặc nhìn cả nhóm)* *"Và đó chính là điều nguy hiểm nhất. Không phải vì không ai biết cách sửa, mà vì không ai chịu dừng lại để sửa ngay khi vừa phát hiện điều bất thường."*

---
*(Hết kịch bản)*

