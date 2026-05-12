-- Migration: enforce UNIQUE(tour_id, user_id) trên REVIEWS
-- Áp dụng cho DB đã chạy trước đợt PR validate review.
-- Chạy: mysql -u <user> -p tour_db < database/migrations/2026-05-12-reviews-unique-constraint.sql

USE tour_db;

-- Bước 1: nếu (do bug cũ) tồn tại review trùng (cùng tour_id + user_id),
-- giữ lại bản ghi mới nhất, xoá các bản cũ hơn.
DELETE r1 FROM REVIEWS r1
JOIN REVIEWS r2
  ON r1.tour_id = r2.tour_id
 AND r1.user_id = r2.user_id
 AND r1.id < r2.id;

-- Bước 2: thêm unique index (idempotent: bỏ qua nếu đã có).
SET @idx_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'REVIEWS'
    AND INDEX_NAME = 'uq_review_tour_user'
);
SET @sql := IF(
  @idx_exists = 0,
  'ALTER TABLE REVIEWS ADD UNIQUE KEY uq_review_tour_user (tour_id, user_id)',
  'SELECT ''index already exists, skip'' AS msg'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
