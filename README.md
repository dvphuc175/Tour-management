# Hệ Thống Quản Lý Tour Du Lịch (Tour Management System)
 
Chào mừng bạn đến với dự án **Hệ Thống Quản Lý Tour Du Lịch — Vi Vu Việt Nam**. Đây là đồ án chuyên đề thuộc chuyên ngành Công nghệ phần mềm, xây dựng một website đặt tour trực tuyến hoàn chỉnh: từ phía khách hàng (tìm kiếm — đặt tour — thanh toán — đánh giá) cho tới phía quản trị (quản lý tour, lịch trình, đơn đặt, người dùng, báo cáo doanh thu).
 
> Demo: <https://adaptable-joy-production-bcfb.up.railway.app/>
 
---
 
## Mục Tiêu Dự Án
 
Hệ thống hướng tới việc số hóa toàn bộ quy trình kinh doanh của một công ty lữ hành quy mô vừa và nhỏ, thay thế cách quản lý thủ công bằng Excel hoặc fanpage Facebook:
 
- **Tự động hóa** vòng đời một đơn đặt tour — từ tìm kiếm, đặt chỗ, thanh toán online cho đến đánh giá sau chuyến đi.
- **Quản lý tập trung** thông tin tour, lịch khởi hành, danh mục, người dùng và đánh giá trên một hệ thống duy nhất.
- **Tích hợp thanh toán** qua cổng VNPay (sandbox) song song với phương thức thanh toán tiền mặt tại văn phòng.
- **Tối ưu vận hành** bằng các tác vụ định kỳ (cron) tự động: hủy đơn quá hạn, đánh dấu tour hoàn thành.
- **Báo cáo & Thống kê** doanh thu, số lượng đơn, top tour theo khoảng thời gian.
 
---
 
## Các Chức Năng Chính
 
- **Khách hàng:**
  - Đăng ký / Đăng nhập, quản lý đơn đặt tour cá nhân.
  - Tìm kiếm, lọc tour theo danh mục, từ khóa và khoảng giá.
  - Xem chi tiết tour (gallery ảnh, lịch trình, bảng giá theo từng lịch khởi hành).
  - Đặt tour, lựa chọn số lượng khách (người lớn / trẻ em), nhập yêu cầu đặc biệt.
  - Thanh toán **VNPay** (giữ chỗ 15 phút) hoặc **Tiền mặt** (giữ chỗ 24 giờ).
  - Tự hủy đơn khi đơn đang ở trạng thái *Chờ xác nhận*.
  - Đánh giá tour (1–5 sao + nhận xét) sau khi tour hoàn thành.
- **Quản trị (Admin / Staff):**
  - Dashboard tổng quan: tổng đơn, doanh thu, top tour, biểu đồ doanh thu theo tháng.
  - CRUD **Tour, Lịch trình, Danh mục**.
  - Upload ảnh tour lên Cloudinary (tối đa 10 ảnh, mỗi ảnh ≤ 5 MB).
  - Quản lý **Đơn đặt tour**: lọc theo trạng thái / phương thức / khoảng thời gian; xác nhận, hoàn thành, hủy đơn.
  - Quản lý **Người dùng**: đổi vai trò, khóa / mở khóa tài khoản.
  - Quản lý **Đánh giá**: xóa đánh giá vi phạm.
  - **Báo cáo & Thống kê** doanh thu theo ngày, biểu đồ trực quan.
- **Hệ thống (Cron):**
  - Cứ 1 phút: tự động hủy đơn VNPay chưa thanh toán quá 15 phút.
  - Cứ 1 phút: tự động hủy đơn Tiền mặt chưa thanh toán quá 24 giờ.
  - Mỗi 00:00 hàng ngày: tự động đánh dấu *Hoàn thành* cho các tour đã qua ngày kết thúc.
- **Tích hợp ngoài:** VNPay (thanh toán), Cloudinary (CDN ảnh), Gmail SMTP (email xác nhận đơn / thanh toán / hủy).
 
---
 
## Công Nghệ Và Nền Tảng Sử Dụng
 
Dự án xây dựng theo hướng **monolith server-rendered** dùng Express + Pug, nhẹ và phù hợp với phạm vi đồ án.
 
### Backend
 
- **Ngôn ngữ:** JavaScript (Node.js)
- **Framework:** Express 5
- **View engine:** Pug (template SSR)
- **Cơ sở dữ liệu:** MySQL 8 (sử dụng driver `mysql2` với connection pool)
- **Xác thực:** `express-session` lưu session trong MySQL (`express-mysql-session`), băm mật khẩu bằng `bcryptjs`.
- **Bảo mật:** middleware CSRF (token + `timingSafeEqual`), `sanitize-html` chống XSS cho rich text, cookie HttpOnly/SameSite.
- **Validation:** Joi 18
- **Upload ảnh:** `multer` + `multer-storage-cloudinary` lưu lên Cloudinary CDN.
- **Thanh toán:** VNPay sandbox (SDK `vnpay@^2.5.0`, sử dụng Return URL).
- **Email:** `nodemailer` (Gmail SMTP với App Password).
- **Tác vụ nền:** `node-cron` cho 3 cron job định kỳ.
- **Khác:** `connect-flash`, `method-override`, `cookie-parser`, `slugify`, `dotenv`.
 
### Frontend
 
- **HTML/CSS thuần** + Pug template, không dùng framework SPA.
- **JavaScript** vanilla cho các tương tác phía client (tour gallery, quantity control, form validation, password strength).
- **Chart.js** cho biểu đồ ở Admin Dashboard và Báo cáo.
- **Font:** Google Fonts — *Be Vietnam Pro* (body) và *Sora* (heading).
 
### DevOps & Công cụ
 
- **Quản lý mã nguồn:** Git & GitHub
- **Triển khai:** Railway (xem demo)
- **Tài liệu:** SRS, SDD.
 
---
 
## Cấu Trúc Dự Án (MVC)
 
```text
Tour-management/
│
├── app.js                      # Entry point: cấu hình Express, session, middleware, routes
├── package.json                # Dependencies & scripts
├── .env.example                # Mẫu biến môi trường (copy → .env)
│
├── config/
│   ├── db.js                   # Khởi tạo MySQL connection pool
│   ├── cloudinary.js           # Cấu hình Cloudinary CDN
│   └── vnpay.js                # Cấu hình VNPay SDK
│
├── routes/                     # Định tuyến URL
│   ├── auth.js                 # /login, /register, /logout
│   ├── client.js               # /, /tours, /tours/:slug, /my-bookings,...
│   ├── booking.js              # /booking/:scheduleId
│   ├── payment.js              # /payment/vnpay/*
│   └── admin/                  # /admin/* (tours, schedules, categories, bookings, users, reviews)
│
├── controllers/                # Xử lý request, gọi model, trả view
│   ├── AuthController.js
│   ├── ClientController.js
│   ├── BookingController.js
│   ├── PaymentController.js
│   ├── TourController.js
│   ├── ScheduleController.js
│   ├── CategoryController.js
│   ├── ReviewController.js
│   ├── AdminBookingController.js
│   ├── AdminUserController.js
│   └── AdminDashboardController.js
│
├── models/                     # Truy vấn MySQL (raw SQL + connection pool)
│   ├── UserModel.js
│   ├── TourModel.js
│   ├── ScheduleModel.js
│   ├── CategoryModel.js
│   ├── BookingModel.js
│   ├── PaymentModel.js
│   ├── ReviewModel.js
│   └── ReportModel.js
│
├── middlewares/
│   ├── auth.js                 # isAuth, isAdmin, isStaff
│   └── csrf.js                 # CSRF token middleware
│
├── validators/                 # Schema Joi cho từng entity
│
├── services/
│   └── emailService.js         # Nodemailer wrapper (3 luồng email)
│
├── cron/
│   └── index.js                # 3 cron job (hủy VNPay/Cash quá hạn, complete tour)
│
├── helpers/                    # Hàm tiện ích chung (format, parse,...)
│
├── public/                     # Tài nguyên tĩnh (CSS, JS, images)
│   └── assets/
│       ├── css/                # main.css, admin.css
│       ├── js/                 # tour-gallery, quantity-control, ...
│       └── images/
│
├── views/                      # Pug templates
│   ├── layout.pug              # Layout phía khách
│   ├── index.pug, 404.pug, error.pug
│   ├── auth/                   # login, register
│   ├── client/                 # tours/, booking/, my-bookings/, payment/
│   ├── partials/               # tour-card, pagination, navbar, footer
│   └── admin/                  # dashboard, reports, tours/, schedules/,
│                                 bookings/, categories/, users/, reviews/
│
└── database/
    ├── schema.sql              # Tạo 7 bảng: USERS, CATEGORIES, TOURS,
    │                              TOUR_SCHEDULES, BOOKINGS, PAYMENTS, REVIEWS
    ├── seed.sql                # Dữ liệu mẫu
```
 
---
 
## Hướng Dẫn Cài Đặt (Getting Started)
 
### 1. Yêu cầu hệ thống
 
- [Node.js 18+](https://nodejs.org/) (khuyến nghị LTS)
- [MySQL 8](https://dev.mysql.com/downloads/)
- Tài khoản [Cloudinary](https://cloudinary.com/) (free tier) — để upload ảnh tour
- Tài khoản **VNPay Sandbox** (đăng ký tại [sandbox.vnpayment.vn](https://sandbox.vnpayment.vn/))
- Một tài khoản Gmail có bật xác minh 2 bước + **App Password** — để gửi email
 
### 2. Cài đặt và khởi chạy
 
**Bước 1:** Clone repository về máy:
 
```bash
git clone https://github.com/dvphuc175/Tour-management.git
cd Tour-management
```
 
**Bước 2:** Cài đặt dependencies:
 
```bash
yarn install
```
 
**Bước 3:** Tạo file `.env` từ `.env.example` rồi điền thông tin của bạn:
 
```bash
cp .env.example .env
```
 
Các biến môi trường cần điền:
 
| Biến | Mô tả |
|---|---|
| `PORT` | Cổng chạy app (mặc định `3000`) |
| `NODE_ENV` | `development` / `production` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Thông tin MySQL |
| `SESSION_SECRET` | Chuỗi bí mật ký session |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Khóa Cloudinary |
| `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_URL`, `VNPAY_RETURN_URL` | Cấu hình VNPay Sandbox |
| `EMAIL_USER`, `EMAIL_PASS` | Gmail + App Password (16 ký tự, KHÔNG dùng mật khẩu thường) |
 
**Bước 4:** Khởi tạo cơ sở dữ liệu:
 
```bash
# Tạo schema 7 bảng
mysql -u <user> -p < database/schema.sql
 
# Nạp dữ liệu mẫu (tài khoản admin, tour, danh mục,...)
mysql -u <user> -p tour_db < database/seed.sql
```
 
**Bước 5:** Khởi chạy ứng dụng:
 
```bash
yarn start
```
 
Lệnh trên sẽ chạy `nodemon --inspect app.js` (auto-reload khi sửa code). Truy cập:
 
- Trang khách hàng: <http://localhost:3000/>
- Trang quản trị: <http://localhost:3000/admin>
 
**Tài khoản mẫu** (từ `seed.sql`):
 
- Admin: `admin@email.com` / `123456`
- Khách hàng: `nguyenvanan@gmail.com` / `123456`
 
---
 
## Tài Liệu Liên Quan
 
- **SRS** — Đặc tả yêu cầu phần mềm.
- **SDD** — Tài liệu thiết kế.
 
---
 
## Đội Ngũ Phát Triển
 
Dự án được phát triển bởi nhóm sinh viên chuyên đề.
 
- **Đỗ Văn Phúc** - (2221050687)
- **Cao Văn Quyết**
 
**Giảng viên hướng dẫn:** ThS. Nguyễn Thị Thanh
*Trường Đại học Mỏ - Địa chất Hà Nội | Hà Nội, Năm 2026*
