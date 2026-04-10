USE tour_db; 
INSERT INTO CATEGORIES (name, slug, description)
VALUES  ('Biển đảo', 'bien-dao', 'Các tour du lịch biển đảo hấp dẫn'), 
        ('Di sản văn hóa', 'di-san-van-hoa', 'Khám phá di sản thế giới tại Việt Nam'), 
        ('Núi rừng', 'nui-rung', 'Trekking và khám phá thiên nhiên'); 
INSERT INTO USERS (fullname, email, password, role) 
VALUES ('Admin System', 'admin@tour.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin')
