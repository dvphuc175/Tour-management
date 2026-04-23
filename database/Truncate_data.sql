USE tour_db;

-- Tắt kiểm tra khóa ngoại tạm thời
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE bookings;
TRUNCATE TABLE categories;
TRUNCATE TABLE payments;
TRUNCATE TABLE reviews;
TRUNCATE TABLE sessions;
TRUNCATE TABLE tour_schedules;
TRUNCATE TABLE tours;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
-- ============================================
-- HOÀN TẤT
-- ============================================
SELECT '✅ Đã xóa tất cả dữ liệu, sẵn sàng seed lại!' AS message;