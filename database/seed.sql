USE tour_db;

-- ============================================
-- 1. BẢNG USERS (15 records)
-- ============================================
INSERT INTO USERS (fullname, email, password, phone, role, status, created_at) VALUES
('Admin System', 'admin@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234567', 'admin', 'active', '2024-01-01 08:00:00'),
('Nguyễn Văn An', 'nguyenvanan@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0912345678', 'customer', 'active', '2024-01-15 10:30:00'),
('Trần Thị Bình', 'tranthibinh@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0923456789', 'customer', 'active', '2024-02-01 14:20:00'),
('Lê Hoàng Cường', 'lehoangcuong@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0934567890', 'customer', 'active', '2024-02-10 09:15:00'),
('Phạm Thị Dung', 'phamthidung@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0945678901', 'customer', 'active', '2024-02-20 16:45:00'),
('Hoàng Văn Em', 'hoangvanem@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0956789012', 'customer', 'active', '2024-03-05 11:00:00'),
('Vũ Thị Hương', 'vuthihuong@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0967890123', 'customer', 'locked', '2024-03-12 08:30:00'),
('Đặng Văn Giang', 'dangvangiang@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0978901234', 'customer', 'active', '2024-03-18 13:20:00'),
('Bùi Thị Hoa', 'buithihoa@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0989012345', 'customer', 'active', '2024-03-25 15:10:00'),
('Ngô Văn Hùng', 'ngovanhung@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0990123456', 'customer', 'active', '2024-04-01 10:00:00'),
('Dương Thị Lan', 'duongthilan@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901122334', 'customer', 'active', '2024-04-08 09:45:00'),
('Trịnh Văn Khánh', 'trinhvankhanh@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0912233445', 'customer', 'active', '2024-04-15 14:30:00'),
('Lý Thị Mai', 'lythimai@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0923344556', 'customer', 'active', '2024-04-20 11:15:00'),
('Hồ Văn Nam', 'hovannam@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0934455667', 'customer', 'active', '2024-04-25 16:00:00'),
('Tô Thị Oanh', 'tothioanh@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0945566778', 'customer', 'active', '2024-04-30 08:20:00');

-- ============================================
-- 2. BẢNG CATEGORIES (12 records)
-- ============================================
INSERT INTO CATEGORIES (name, slug, description, status, created_at) VALUES
('Tour Miền Bắc', 'tour-mien-bac', 'Khám phá vẻ đẹp thiên nhiên và văn hóa miền Bắc Việt Nam', 'active', '2024-01-01 08:00:00'),
('Tour Miền Trung', 'tour-mien-trung', 'Tham quan di sản thế giới và biển đảo miền Trung', 'active', '2024-01-01 08:00:00'),
('Tour Miền Nam', 'tour-mien-nam', 'Trải nghiệm sông nước miệt vườn và thành phố sôi động', 'active', '2024-01-01 08:00:00'),
('Tour Biển Đảo', 'tour-bien-dao', 'Nghỉ dưỡng tại các bãi biển đẹp nhất Việt Nam', 'active', '2024-01-05 10:00:00'),
('Tour Núi Rừng', 'tour-nui-rung', 'Trekking và khám phá thiên nhiên hoang sơ', 'active', '2024-01-10 09:30:00'),
('Tour Văn Hóa', 'tour-van-hoa', 'Tìm hiểu lịch sử và di sản văn hóa dân tộc', 'active', '2024-01-15 14:00:00'),
('Tour Ẩm Thực', 'tour-am-thuc', 'Khám phá nền ẩm thực đa dạng của Việt Nam', 'active', '2024-01-20 11:00:00'),
('Tour Nghỉ Dưỡng', 'tour-nghi-duong', 'Thư giãn tại các resort cao cấp và spa', 'active', '2024-02-01 08:00:00'),
('Tour Mạo Hiểm', 'tour-mao-hiem', 'Các hoạt động thể thao và phiêu lưu', 'active', '2024-02-10 13:00:00'),
('Tour Gia Đình', 'tour-gia-dinh', 'Chuyến đi phù hợp cho cả gia đình', 'active', '2024-02-15 09:00:00'),
('Tour Tuần Trăng Mật', 'tour-trang-mat', 'Kỳ nghỉ lãng mạn cho cặp đôi mới cưới', 'active', '2024-03-01 10:00:00'),
('Team Building', 'team-building', 'Các chương trình gắn kết cho doanh nghiệp', 'active', '2024-03-10 15:00:00');

-- ============================================
-- 3. BẢNG TOURS (18 records)
-- ============================================
INSERT INTO TOURS (category_id, name, slug, description, status, price_adult, price_child, images, created_at) VALUES
(1, 'Hà Nội - Hạ Long - Sapa 4N3Đ', 'ha-noi-ha-long-sapa-4n3d', 'Khám phá thủ đô ngàn năm văn hiến, vịnh Hạ Long kỳ quan thiên nhiên và Sapa mờ sương', 'active', 4500000, 3200000, '["https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80","https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80"]', '2024-01-10 09:00:00'),
(1, 'Hà Giang - Cao Nguyên Đá Đồng Văn 3N2Đ', 'ha-giang-cao-nguyen-da-3n2d', 'Chinh phục cung đường đèo đẹp nhất Việt Nam, ngắm hoa tam giác mạch', 'active', 3800000, 2800000, '["https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80"]', '2024-01-15 10:00:00'),
(2, 'Huế - Đà Nẵng - Hội An 4N3Đ', 'hue-da-nang-hoi-an-4n3d', 'Tham quan cố đô Huế, phố cổ Hội An và biển Mỹ Khê', 'active', 5200000, 3800000, '["https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800&q=80","https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"]', '2024-01-20 08:00:00'),
(2, 'Phong Nha - Kẻ Bàng 2N1Đ', 'phong-nha-ke-bang-2n1d', 'Khám phá hang động lớn nhất thế giới và sông Chày', 'active', 2800000, 2000000, '["https://images.unsplash.com/photo-1583306346313-e9295d87f9eb?w=800&q=80"]', '2024-02-01 14:00:00'),
(3, 'TP.HCM - Mỹ Tho - Cần Thơ 3N2Đ', 'tphcm-mytho-cantho-3n2d', 'Trải nghiệm sông nước miệt vườn và chợ nổi Cái Răng', 'active', 3500000, 2500000, '["https://images.unsplash.com/photo-1597165309222-d5c746940c78?w=800&q=80"]', '2024-02-05 11:00:00'),
(3, 'Phú Quốc - Đảo Ngọc 3N2Đ', 'phu-quoc-dao-ngoc-3n2d', 'Nghỉ dưỡng tại bãi Sao, câu cá, lặn ngắm san hô', 'active', 6800000, 4800000, '["https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&q=80"]', '2024-02-10 09:30:00'),
(4, 'Nha Trang - Vinpearl 4N3Đ', 'nha-trang-vinpearl-4n3d', 'Thiên đường biển với cáp treo và công viên giải trí', 'active', 5800000, 4200000, '["https://images.unsplash.com/photo-1566896022336-7702e477123d?w=800&q=80"]', '2024-02-15 10:00:00'),
(4, 'Đà Nẵng - Bà Nà Hills 3N2Đ', 'da-nang-ba-na-hills-3n2d', 'Khám phá làng Pháp trên đỉnh núi và cầu Vàng', 'active', 4200000, 3000000, '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"]', '2024-02-20 08:00:00'),
(5, 'Sapa - Fansipan 2N1Đ', 'sapa-fansipan-2n1d', 'Chinh phục nóc nhà Đông Dương bằng tàu hỏa leo núi', 'active', 3200000, 2400000, '["https://images.unsplash.com/photo-1548266652-99cf27701ced?w=800&q=80"]', '2024-03-01 09:00:00'),
(6, 'Hà Nội - Ninh Bình - Bái Đính - Tràng An', 'ha-noi-ninh-binh-trang-an', 'Tham quan chùa Bái Đính và di sản thế giới Tràng An', 'active', 1800000, 1300000, '["https://images.unsplash.com/photo-1586495981346-94c06fb90f91?w=800&q=80"]', '2024-03-05 14:00:00'),
(7, 'Hội An - Tour Ẩm Thực Đêm', 'hoi-an-am-thuc-dem', 'Khám phá ẩm thực đường phố Hội An và đèn lồng', 'active', 850000, 600000, '["https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80"]', '2024-03-10 11:00:00'),
(8, 'Đà Lạt - Thành Phố Ngàn Hoa 4N3Đ', 'da-lat-thanh-pho-ngan-hoa', 'Nghỉ dưỡng tại resort cao cấp, tham quan vườn hoa', 'active', 4800000, 3500000, '["https://images.unsplash.com/photo-1584172459597-619bb936a093?w=800&q=80"]', '2024-03-15 08:30:00'),
(9, 'Mộc Châu - Trekking Hang Táu 2N1Đ', 'moc-chau-trekking-hang-tau', 'Cắm trại và trekking tại hang động hoang sơ', 'active', 2200000, 1600000, '["https://images.unsplash.com/photo-1506905920300-13f10d3d4b3e?w=800&q=80"]', '2024-03-20 13:00:00'),
(10, 'Phan Thiết - Mũi Né Resort 3N2Đ', 'phan-thiet-mui-ne-resort', 'Resort 4 sao với hồ bơi và bãi biển riêng cho gia đình', 'active', 4200000, 3000000, '["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"]', '2024-03-25 10:00:00'),
(11, 'Nha Trang - Tour Trăng Mật 4N3Đ', 'nha-trang-trang-mat-4n3d', 'Romantic package với bữa tối bãi biển và spa cho 2 người', 'active', 8500000, 0, '["https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80"]', '2024-04-01 09:00:00'),
(12, 'Vũng Tàu - Team Building 2N1Đ', 'vung-tau-team-building', 'Chương trình gắn kết với games bãi biển và gala dinner', 'active', 1500000, 1000000, '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"]', '2024-04-05 15:00:00'),
(4, 'Quy Nhơn - Eo Gió 3N2Đ', 'quy-nhon-eo-gio-3n2d', 'Khám phá Kỳ Co, Eo Gió - Maldives của Việt Nam', 'active', 3900000, 2800000, '["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"]', '2024-04-10 11:00:00'),
(2, 'Quảng Bình - Sông Chày - Hang Tối', 'quang-binh-song-chay-hang-toi', 'Zipline và bơi thuyền kayak tại hang động', 'active', 2500000, 1800000, '["https://images.unsplash.com/photo-1533050487297-09b450131914?w=800&q=80"]', '2024-04-15 14:00:00');

-- ============================================
-- 4. BẢNG TOUR_SCHEDULES (20 records)
-- ============================================
INSERT INTO TOUR_SCHEDULES (tour_id, departure_location, start_date, end_date, total_slots, available_slots, status) VALUES
(1, 'Hà Nội', '2025-05-01', '2025-05-04', 30, 12, 'active'),
(1, 'Hà Nội', '2025-05-15', '2025-05-18', 30, 25, 'active'),
(2, 'Hà Nội', '2025-04-25', '2025-04-27', 25, 8, 'active'),
(3, 'Đà Nẵng', '2025-05-10', '2025-05-13', 40, 35, 'active'),
(3, 'Đà Nẵng', '2025-05-20', '2025-05-23', 40, 0, 'full'),
(4, 'Đồng Hới', '2025-04-30', '2025-05-01', 20, 18, 'active'),
(5, 'TP.HCM', '2025-05-05', '2025-05-07', 35, 20, 'active'),
(6, 'Phú Quốc', '2025-05-01', '2025-05-03', 50, 30, 'active'),
(6, 'Phú Quốc', '2025-05-15', '2025-05-17', 50, 45, 'active'),
(7, 'Nha Trang', '2025-04-28', '2025-05-01', 45, 10, 'active'),
(8, 'Đà Nẵng', '2025-05-08', '2025-05-10', 35, 28, 'active'),
(9, 'Sapa', '2025-05-12', '2025-05-13', 25, 15, 'active'),
(10, 'Hà Nội', '2025-05-02', '2025-05-02', 50, 40, 'active'),
(11, 'Hội An', '2025-04-26', '2025-04-26', 20, 12, 'active'),
(12, 'Đà Lạt', '2025-05-01', '2025-05-04', 30, 22, 'active'),
(13, 'Mộc Châu', '2025-05-10', '2025-05-11', 15, 5, 'active'),
(14, 'Phan Thiết', '2025-04-29', '2025-05-01', 40, 18, 'active'),
(15, 'Nha Trang', '2025-05-20', '2025-05-23', 20, 16, 'active'),
(16, 'Vũng Tàu', '2025-05-03', '2025-05-04', 60, 55, 'active'),
(17, 'Quy Nhơn', '2025-05-12', '2025-05-14', 30, 24, 'active');

-- ============================================
-- 5. BẢNG BOOKINGS (18 records)
-- ============================================
INSERT INTO BOOKINGS (user_id, schedule_id, contact_name, contact_email, contact_phone, adult_count, child_count, total_price, special_request, status, created_at) VALUES
(2, 1, 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0912345678', 2, 1, 12200000, 'Ăn chay, phòng không chung', 'confirmed', '2025-03-01 10:00:00'),
(3, 1, 'Trần Thị Bình', 'tranthibinh@gmail.com', '0923456789', 4, 0, 18000000, 'Gần cửa sổ', 'pending', '2025-03-05 14:30:00'),
(4, 3, 'Lê Hoàng Cường', 'lehoangcuong@gmail.com', '0934567890', 2, 0, 7600000, 'Cần xe đưa đón từ sân bay', 'confirmed', '2025-03-10 09:00:00'),
(5, 5, 'Phạm Thị Dung', 'phamthidung@gmail.com', '0945678901', 2, 2, 18000000, 'Em bé 3 tuổi cần nôi', 'confirmed', '2025-03-12 16:00:00'),
(6, 6, 'Hoàng Văn Em', 'hoangvanem@gmail.com', '0956789012', 6, 0, 40800000, 'Đoàn công ty, cần phòng liền kề', 'completed', '2025-03-15 11:30:00'),
(8, 7, 'Đặng Văn Giang', 'dangvangiang@gmail.com', '0978901234', 2, 1, 9500000, NULL, 'cancelled', '2025-03-18 08:00:00'),
(9, 8, 'Bùi Thị Hoa', 'buithihoa@gmail.com', '0989012345', 3, 0, 20400000, 'Không ăn hải sản', 'confirmed', '2025-03-20 13:00:00'),
(10, 9, 'Ngô Văn Hùng', 'ngovanhung@gmail.com', '0990123456', 2, 0, 11600000, 'Muốn thuê xe máy riêng', 'pending', '2025-03-22 10:00:00'),
(11, 10, 'Dương Thị Lan', 'duongthilan@gmail.com', '0901122334', 4, 1, 8000000, 'Gia đình có người cao tuổi', 'confirmed', '2025-03-25 09:30:00'),
(12, 12, 'Trịnh Văn Khánh', 'trinhvankhanh@gmail.com', '0912233445', 2, 0, 9600000, 'Sinh nhật vợ, cần bánh kem', 'confirmed', '2025-03-28 15:00:00'),
(13, 13, 'Lý Thị Mai', 'lythimai@gmail.com', '0923344556', 10, 0, 22000000, 'Team building công ty ABC', 'confirmed', '2025-03-30 11:00:00'),
(14, 14, 'Hồ Văn Nam', 'hovannam@gmail.com', '0934455667', 2, 2, 14400000, 'Trẻ em 5 và 8 tuổi', 'pending', '2025-04-01 08:00:00'),
(15, 15, 'Tô Thị Oanh', 'tothioanh@gmail.com', '0945566778', 2, 0, 17000000, 'Tuần trăng mật, cần phòng view đẹp', 'confirmed', '2025-04-03 14:00:00'),
(2, 16, 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0912345678', 30, 10, 55000000, 'Công ty XYZ, cần hóa đơn đỏ', 'confirmed', '2025-04-05 10:00:00'),
(4, 17, 'Lê Hoàng Cường', 'lehoangcuong@gmail.com', '0934567890', 2, 0, 7800000, NULL, 'confirmed', '2025-04-08 09:00:00'),
(6, 18, 'Hoàng Văn Em', 'hoangvanem@gmail.com', '0956789012', 4, 0, 13600000, 'Cần hướng dẫn viên tiếng Anh', 'pending', '2025-04-10 16:00:00'),
(10, 19, 'Ngô Văn Hùng', 'ngovanhung@gmail.com', '0990123456', 2, 1, 10700000, 'Người nhà bị dị ứng hải sản', 'confirmed', '2025-04-12 11:00:00'),
(12, 20, 'Trịnh Văn Khánh', 'trinhvankhanh@gmail.com', '0912233445', 3, 0, 11700000, 'Check-in sớm lúc 10h', 'pending', '2025-04-15 13:30:00');

-- ============================================
-- 6. BẢNG PAYMENTS (16 records)
-- ============================================
INSERT INTO PAYMENTS (booking_id, amount, method, status, transaction_id, paid_at, created_at) VALUES
(1, 12200000, 'vnpay', 'success', 'VNPAY123456789', '2025-03-01 10:30:00', '2025-03-01 10:00:00'),
(3, 7600000, 'cash', 'success', NULL, '2025-03-10 09:30:00', '2025-03-10 09:00:00'),
(4, 18000000, 'vnpay', 'success', 'VNPAY987654321', '2025-03-12 16:15:00', '2025-03-12 16:00:00'),
(5, 20000000, 'vnpay', 'success', 'VNPAY555666777', '2025-03-15 12:00:00', '2025-03-15 11:30:00'),
(7, 20400000, 'vnpay', 'pending', NULL, NULL, '2025-03-20 13:00:00'),
(9, 8000000, 'cash', 'success', NULL, '2025-03-25 10:00:00', '2025-03-25 09:30:00'),
(10, 9600000, 'vnpay', 'success', 'VNPAY111222333', '2025-03-28 15:30:00', '2025-03-28 15:00:00'),
(11, 22000000, 'vnpay', 'success', 'VNPAY444555666', '2025-03-30 11:30:00', '2025-03-30 11:00:00'),
(13, 17000000, 'vnpay', 'success', 'VNPAY777888999', '2025-04-03 14:30:00', '2025-04-03 14:00:00'),
(14, 55000000, 'cash', 'success', NULL, '2025-04-05 11:00:00', '2025-04-05 10:00:00'),
(15, 7800000, 'vnpay', 'success', 'VNPAY000111222', '2025-04-08 09:30:00', '2025-04-08 09:00:00'),
(17, 10700000, 'vnpay', 'success', 'VNPAY333444555', '2025-04-12 11:30:00', '2025-04-12 11:00:00'),
(2, 9000000, 'vnpay', 'pending', NULL, NULL, '2025-03-05 14:30:00'),
(6, 9500000, 'vnpay', 'failed', 'VNPAYFAILED001', NULL, '2025-03-18 08:00:00'),
(12, 14400000, 'cash', 'pending', NULL, NULL, '2025-04-01 08:00:00'),
(16, 13600000, 'vnpay', 'pending', NULL, NULL, '2025-04-10 16:00:00');

-- ============================================
-- 7. BẢNG REVIEWS (17 records)
-- ============================================
INSERT INTO REVIEWS (tour_id, user_id, rating, comment, created_at) VALUES
(1, 2, 5, 'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, khách sạn đẹp. Sapa mờ sương đúng như mơ!', '2025-05-05 20:00:00'),
(1, 3, 4, 'Hành trình ổn, đồ ăn ngon nhưng xe đi Sapa hơi mệt. Tổng thể vẫn đáng đồng tiền.', '2025-05-06 15:30:00'),
(3, 4, 5, 'Huế cố đô rất có chất, Hội An lung linh đèn lồng. Đây là tour đáng nhớ nhất!', '2025-05-15 10:00:00'),
(3, 5, 5, 'Gia đình mình rất thích, đặc biệt là các bé. Biển Mỹ Khê sạch và đẹp.', '2025-05-16 08:00:00'),
(6, 6, 5, 'Phú Quốc đúng là thiên đường! Resort 5 sao, dịch vụ chuẩn quốc tế.', '2025-05-05 18:00:00'),
(6, 9, 4, 'Biển đẹp nhưng giá hơi cao. Tuy nhiên vẫn recommend cho cặp đôi.', '2025-05-18 14:00:00'),
(7, 10, 3, 'Nha Trang nắng đẹp nhưng đông quá. Vinpearl thì tuyệt vời!', '2025-05-02 09:00:00'),
(8, 11, 5, 'Cầu Vàng đẹp xuất sắc! Làng Pháp như châu Âu thu nhỏ.', '2025-05-11 16:00:00'),
(10, 12, 4, 'Chùa Bái Đính hoành tráng, Tràng An thơ mộng. Ngày đi hơi ngắn.', '2025-05-03 11:00:00'),
(11, 13, 5, 'Ẩm thực Hội An tuyệt đỉnh! Bánh mì Phượng, cao lầu đều ngon.', '2025-04-27 21:00:00'),
(12, 14, 4, 'Đà Lạt se lạnh, hoa đẹp. Resort view thung lũng tuyệt đẹp.', '2025-05-06 08:30:00'),
(14, 2, 4, 'Mũi Né resort tốt, hồ bơi rộng. Phan Thiết nắng nhiều nên nhớ mang kem chống nắng.', '2025-05-02 19:00:00'),
(15, 15, 5, 'Tuần trăng mật hoàn hảo! Bữa tối bãi biển lãng mạn khỏi chê.', '2025-05-25 22:00:00'),
(16, 4, 4, 'Team building thành công, mọi người đều vui. Games vui và gắn kết.', '2025-05-05 17:00:00'),
(17, 6, 5, 'Kỳ Co đẹp như Maldives! Eo Gió gió thổi mát rượi.', '2025-05-15 20:00:00'),
(18, 10, 4, 'Zipline tại Hang Tối thử thách nhưng rất vui. Sông Chày trong xanh.', '2025-05-18 09:00:00'),
(4, 8, 4, 'Phong Nha hang động hùng vĩ, nhưng đi bộ hơi mệt. Nên mang giày tốt.', '2025-05-03 12:00:00');
