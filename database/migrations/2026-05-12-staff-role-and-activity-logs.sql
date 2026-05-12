-- Migration: thêm role 'staff' và bảng ACTIVITY_LOGS cho audit log.
-- Idempotent: an toàn khi chạy lại.
-- Chạy: mysql -u <user> -p tour_db < database/migrations/2026-05-12-staff-role-and-activity-logs.sql

USE tour_db;

-- Bước 1: mở rộng ENUM của USERS.role để thêm 'staff'.
-- MySQL không có "ADD VALUE IF NOT EXISTS" cho ENUM, nên kiểm tra COLUMN_TYPE rồi mới ALTER.
SET @needs_alter := (
  SELECT IF(
    INSTR(COLUMN_TYPE, "'staff'") = 0,
    1,
    0
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'USERS'
    AND COLUMN_NAME = 'role'
);
SET @sql := IF(
  @needs_alter = 1,
  "ALTER TABLE USERS MODIFY COLUMN role ENUM('admin','staff','customer') DEFAULT 'customer'",
  "SELECT 'staff already in USERS.role enum, skip' AS msg"
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bước 2: tạo bảng ACTIVITY_LOGS nếu chưa có.
CREATE TABLE IF NOT EXISTS ACTIVITY_LOGS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_id INT NULL,
    actor_role ENUM('admin','staff','customer') NULL,
    action VARCHAR(50) NOT NULL,
    target_type VARCHAR(30) NULL,
    target_id INT NULL,
    metadata JSON NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_id) REFERENCES USERS(id) ON DELETE SET NULL,
    INDEX idx_logs_created_at (created_at),
    INDEX idx_logs_action (action),
    INDEX idx_logs_actor (actor_id)
);
