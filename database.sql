CREATE DATABASE IF NOT EXISTS tour_db;
USE tour_db;

-- 1. Bảng USERS
CREATE TABLE USERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('admin', 'customer') DEFAULT 'customer',
    status ENUM('active', 'locked') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng CATEGORIES
CREATE TABLE CATEGORIES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('active','hidden') DEFAULT 'active'
);

-- 3. Bảng TOURS
CREATE TABLE TOURS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price_adult DECIMAL(10, 2) NOT NULL,
    price_child DECIMAL(10, 2) NOT NULL,
    images TEXT, -- Lưu dạng JSON mảng URL ảnh
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(id) ON DELETE SET NULL
);

-- 4. Bảng TOUR_SCHEDULES
CREATE TABLE TOUR_SCHEDULES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    departure_location VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_slots INT NOT NULL,
    available_slots INT NOT NULL,
    status ENUM('active','full','cancelled') DEFAULT 'active',
    FOREIGN KEY (tour_id) REFERENCES TOURS(id) ON DELETE CASCADE
);

-- 5. Bảng BOOKINGS
CREATE TABLE BOOKINGS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    schedule_id INT NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(100) NOT NULL,
    adult_count INT DEFAULT 1,
    child_count INT DEFAULT 0,
    total_price DECIMAL(12, 2) NOT NULL,
    special_request TEXT,
    status ENUM('pending', 'confirmed', 'cancelled','completed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (schedule_id) REFERENCES TOUR_SCHEDULES(id)
);

-- 6. Bảng PAYMENTS
CREATE TABLE PAYMENTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    method ENUM('vnpay', 'cash') NOT NULL,
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES BOOKINGS(id) ON DELETE CASCADE
);

-- 7. Bảng REVIEWS
CREATE TABLE REVIEWS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES TOURS(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);