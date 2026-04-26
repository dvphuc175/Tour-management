-- ============================================
-- CẬP NHẬT DESCRIPTION CHI TIẾT CHO CÁC TOUR
-- Sử dụng cấu trúc sections: highlights, itinerary, services, pricing
-- Tương thích với CKEditor form admin
-- ============================================

USE tour_db;

-- Tour 1: Hà Nội - Hạ Long - Sapa 4N3Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Khám phá thủ đô Hà Nội với các di tích lịch sử nổi tiếng: Lăng Chủ tịch Hồ Chí Minh, Chùa Một Cột, Văn Miếu - Quốc Tử Giám</li>
<li>Chiêm ngưỡng vẻ đẹp kỳ vĩ của Vịnh Hạ Long - Di sản thiên nhiên thế giới với hàng nghìn đảo lớn nhỏ rải rác</li>
<li>Trải nghiệm chèo thuyền kayak khám phá hang động bí ẩn trong lòng vịnh</li>
<li>Khám phá Sapa - thị trấn mờ sương với ruộng bậc thang Mường Hoa tuyệt đẹp</li>
<li>Tham quan bản Cat Cat - nơi sinh sống của người H''Mông, tìm hiểu văn hóa dân tộc độc đáo</li>
<li>Thưởng thức ẩm thực đặc sắc 3 miền: phở Hà Nội, chả mực Hạ Long, thắng cố Sapa</li>
<li>Hướng dẫn viên nhiệt tình, giàu kinh nghiệm phục vụ suốt hành trình</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Hà Nội - Khám phá thủ đô ngàn năm văn hiến</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Đón khách tại sân bay Nội Bài, di chuyển về khách sạn trung tâm thành phố nhận phòng nghỉ ngơi</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại nhà hàng địa phương với món phở bò truyền thống</li>
<li><strong>Chiều (14:00):</strong> Tham quan Lăng Bác, Chùa Một Cột - biểu tượng văn hóa ngàn năm, Văn Miếu - Quốc Tử Giám - trường đại học đầu tiên của Việt Nam</li>
<li><strong>Tối (18:30):</strong> Ăn tối tại nhà hàng, đi dạo quanh Hồ Gươm ngắm Tháp Rùa, cầu Thê Húc lung linh về đêm</li>
</ul>

<h4>Ngày 2: Hà Nội - Hạ Long - Vịnh di sản thế giới</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Khởi hành đi Hạ Long bằng xe giường nằm cao cấp</li>
<li><strong>Trưa (11:30):</strong> Check-in tàu du lịch 4 sao, ăn trưa buffet trên tàu với hải sản tươi sống</li>
<li><strong>Chiều (14:00):</strong> Khám phá hang động Sửng Sốt - hang động lớn nhất Vịnh Hạ Long, chèo thuyền kayak tự khám phá các hang động nhỏ</li>
<li><strong>Tối (19:00):</strong> Ăn tối trên tàu, tham gia chương trình câu mực đêm, nghỉ đêm trên tàu trong cabin tiện nghi</li>
</ul>

<h4>Ngày 3: Hạ Long - Sapa - Thị trấn trong sương</h4>
<ul>
<li><strong>Sáng (06:00):</strong> Ngắm bình minh trên vịnh, tắm biển tại đảo Titop với bãi cát trắng mịn</li>
<li><strong>Trưa (10:00):</strong> Trả tàu về bến, ăn trưa tại nhà hàng Hạ Long</li>
<li><strong>Chiều (13:00):</strong> Di chuyển về Sapa bằng xe limousine, check-in khách sạn 4 sao trung tâm thị trấn</li>
<li><strong>Tối (17:30):</strong> Tham quan bản Cat Cat, tìm hiểu nghề dệt thổ cẩm truyền thống, ăn tối với đặc sản thắng cố, đồ nướng</li>
</ul>

<h4>Ngày 4: Sapa - Fansipan - Hà Nội</h4>
<ul>
<li><strong>Sáng (06:30):</strong> Đi cáp treo Fansipan - hệ thống cáp treo 3 dây dài nhất thế giới, chinh phục đỉnh Fansipan 3.143m - nóc nhà Đông Dương</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa buffet tại nhà hàng trên đỉnh núi với view panorama tuyệt đẹp</li>
<li><strong>Chiều (14:00):</strong> Di chuyển về Hà Nội, mua sắm đặc sản tại chợ Đồng Xuân</li>
<li><strong>Tối (19:00):</strong> Đưa khách ra sân bay Nội Bài, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đời mới đưa đón theo lịch trình (xe limousine cao cấp, máy lạnh)</li>
<li>Khách sạn 3-4 sao tiêu chuẩn (2 người/phòng), nghỉ đêm trên tàu 4 sao tại Hạ Long</li>
<li>Vé tham quan các điểm du lịch: Văn Miếu, Chùa Một Cột, Vịnh Hạ Long, bản Cat Cat, Fansipan</li>
<li>Tàu du lịch thăm vịnh Hạ Long 4 sao, chèo thuyền kayak</li>
<li>Bữa ăn đầy đủ theo chương trình: 3 bữa sáng, 4 bữa trưa, 3 bữa tối với các món đặc sản địa phương</li>
<li>Hướng dẫn viên tiếng Việt chuyên nghiệp, nhiệt tình phục vụ suốt tuyến</li>
<li>Bảo hiểm du lịch với mức bồi thường tối đa 50.000.000đ/người</li>
<li>Nước uống, khăn lạnh trên xe phục vụ liên tục</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 5.500.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 4.200.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ, ăn suất riêng)</li>
<li>Phụ thu phòng đơn: 2.500.000đ/tour</li>
<li>Phụ thu dịp lễ Tết: 500.000đ/người</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 1;

-- Tour 2: Hà Giang - Cao Nguyên Đá Đồng Văn 3N2Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Chinh phục đèo Mã Pí Lèng - một trong tứ đại đỉnh đèo của Việt Nam, ngắm cảnh đại ngàn hùng vĩ</li>
<li>Ngắm nhìn biển hoa tam giác mạch bạt ngàn khi vào mùa (tháng 9-11 hàng năm)</li>
<li>Thăm Cột cờ Lũng Cú - điểm cực Bắc thiêng liêng của Tổ quốc</li>
<li>Khám phá dinh thự vua Mèo Vương Chí Sình - kiến trúc độc đáo giữa cao nguyên đá</li>
<li>Tìm hiểu văn hóa độc đáo của người H''Mông, Dao, Tày tại các bản làng</li>
<li>Trải nghiệm chợ phiên Đồng Văn đặc sắc vào sáng chủ nhật hàng tuần</li>
<li>Lưu trú tại khách sạn/homestay view núi non trùng điệp</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Hà Nội - Hà Giang - Quản Bạ</h4>
<ul>
<li><strong>Sáng (06:00):</strong> Xe đón khách tại điểm hẹn trung tâm Hà Nội, khởi hành đi Hà Giang</li>
<li><strong>Trưa (12:00):</strong> Dừng chân ăn trưa tại nhà hàng Tuyên Quang với đặc sản bánh chưng đen, chè Thái Nguyên</li>
<li><strong>Chiều (15:00):</strong> Đến Quản Bạ, tham quan Cổng trời Quản Bạ - nơi giao thoa giữa đất và trời</li>
<li><strong>Tối (18:00):</strong> Check-in khách sạn 3 sao tại thị trấn Tam Sơn, ăn tối với các món đặc sản: thịt trâu gác bếp, rau cải mèo, cháo ấu tẩu</li>
</ul>

<h4>Ngày 2: Quản Bạ - Đồng Văn - Mã Pí Lèng</h4>
<ul>
<li><strong>Sáng (07:00):</strong> Ăn sáng tại khách sạn, khởi hành đi Đồng Văn qua đèo Mã Pí Lèng</li>
<li><strong>Trưa (11:30):</strong> Dừng tại điểm dừng chân Mã Pí Lèng Panorama ngắm cảnh sông Nho Quế uốn lượn giữa hai dãy núi, chụp ảnh check-in</li>
<li><strong>Chiều (14:00):</strong> Thăm Cột cờ Lũng Cú - nơi địa đầu Tổ quốc, thắp hương tưởng nhớ các anh hùng đã ngã xuống vì biên cương</li>
<li><strong>Tối (17:30):</strong> Thăm dinh thự vua Mèo, check-in khách sạn tại Đồng Văn, ăn tối, tự do dạo phố cổ Đồng Văn về đêm</li>
</ul>

<h4>Ngày 3: Đồng Văn - Chợ Phiên - Hà Nội</h4>
<ul>
<li><strong>Sáng (06:00):</strong> Tham gia chợ phiên Đồng Văn (nếu vào chủ nhật), mua sắm đặc sản: mật ong rừng, thảo quả, tam giác mạch</li>
<li><strong>Trưa (10:00):</strong> Ăn trưa tại nhà hàng địa phương</li>
<li><strong>Chiều (13:00):</strong> Khởi hành về Hà Nội, dừng chân nghỉ ngơi tại các điểm trên đường</li>
<li><strong>Tối (20:00):</strong> Về đến Hà Nội, kết thúc tour, tạm biệt và hẹn gặp lại</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe ô tô đời mới máy lạnh (xe limousine 9 chỗ hoặc xe 29 chỗ tùy số lượng khách)</li>
<li>Khách sạn 2-3 sao tại Quản Bạ và Đồng Văn (2 người/phòng)</li>
<li>Vé tham quan: Cổng trời Quản Bạ, Cột cờ Lũng Cú, dinh thự vua Mèo</li>
<li>Bữa ăn đầy đủ: 2 bữa sáng buffet, 3 bữa trưa, 2 bữa tối với đặc sản địa phương</li>
<li>Hướng dẫn viên địa phương am hiểu văn hóa, lịch sử vùng cao</li>
<li>Nước uống, khăn lạnh phục vụ trên xe</li>
<li>Bảo hiểm du lịch suốt hành trình</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 3.800.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 2.800.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
<li>Phụ thu phòng đơn: 1.200.000đ/tour</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 2;

-- Tour 3: Huế - Đà Nẵng - Hội An 4N3Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Tham quan Đại Nội Huế - Di sản văn hóa thế giới với hệ thống lăng tẩm, điện thờ nguy nga tráng lệ</li>
<li>Chùa Thiên Mụ - ngôi chùa cổ nhất Huế với tháp Phước Duyên 7 tầng nổi tiếng</li>
<li>Đèo Hải Vân - hành trình qua cung đường biển đẹp nhất Việt Nam</li>
<li>Bà Nà Hills - Làng Pháp trên đỉnh núi với Cầu Vàng biểu tượng mới của du lịch Việt Nam</li>
<li>Biển Mỹ Khê - một trong 6 bãi biển đẹp nhất hành tinh do Forbes bình chọn</li>
<li>Phố cổ Hội An - Di sản văn hóa thế giới với hệ thống nhà cổ, đèn lồng rực rỡ</li>
<li>Thưởng thức đặc sản miền Trung: Cao Lầu Hội An, Mì Quảng Đà Nẵng, bún bò Huế</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Đà Nẵng - Huế - Cố đô thơ mộng</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Đón khách tại sân bay/điểm hẹn Đà Nẵng, khởi hành đi Huế qua hầm Hải Vân</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại nhà hàng Huế với bún bò đặc trưng</li>
<li><strong>Chiều (14:00):</strong> Tham quan Đại Nội - Hoàng thành triều Nguyễn với Ngọ Môn, điện Thái Hòa, Tử Cấm Thành</li>
<li><strong>Tối (18:00):</strong> Ăn tối với cơm hoàng cung, thưởng thức ca Huế trên sông Hương (chi phí tự túc), nghỉ đêm tại khách sạn 4 sao Huế</li>
</ul>

<h4>Ngày 2: Huế - Đà Nẵng - Bà Nà Hills</h4>
<ul>
<li><strong>Sáng (07:00):</strong> Thăm chùa Thiên Mụ - ngôi chùa cổ nhất xứ Huế, viếng lăng Khải Định với kiến trúc độc đáo</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại Huế, di chuyển về Đà Nẵng qua đèo Hải Vân ngắm cảnh biển tuyệt đẹp</li>
<li><strong>Chiều (15:00):</strong> Đi cáp treo Bà Nà Hills - cáp treo dài nhất thế giới, tham quan Làng Pháp, Cầu Vàng đi bộ giữa trời mây</li>
<li><strong>Tối (19:00):</strong> Nghỉ đêm tại khách sạn 4 sao Đà Nẵng, tự do khám phá thành phố về đêm</li>
</ul>

<h4>Ngày 3: Đà Nẵng - Hội An - Phố cổ đèn lồng</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Đi biển Mỹ Khê tắm biển, tham quan Ngũ Hành Sơn - danh thắng nổi tiếng với các hang động đẹp</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa với Mì Quảng đặc sản Đà Nẵng</li>
<li><strong>Chiều (14:00):</strong> Di chuyển đi Hội An (30 phút), tham quan phố cổ: Chùa Cầu, nhà cổ Tấn Ký, hội quán Phúc Kiến</li>
<li><strong>Tối (18:00):</strong> Ăn tối Cao Lầu Hội An, thả đèn hoa đăng trên sông Hoài, ngắm phố cổ rực rỡ đèn lồng, nghỉ đêm tại Hội An</li>
</ul>

<h4>Ngày 4: Hội An - Đà Nẵng</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Mua sắm đặc sản Hội An: bánh đậu xanh, mỳ sống, đèn lồng, quần áo may sẵn</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa, trở về Đà Nẵng</li>
<li><strong>Chiều (14:00):</strong> Đưa khách ra sân bay Đà Nẵng, kết thúc tour tạm biệt và hẹn gặp lại</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đời mới đưa đón theo lịch trình (xe limousine cao cấp)</li>
<li>Khách sạn 3-4 sao tiêu chuẩn tại Huế, Đà Nẵng, Hội An (2 người/phòng)</li>
<li>Vé tham quan: Đại Nội Huế, chùa Thiên Mụ, lăng Khải Định, Bà Nà Hills, Ngũ Hành Sơn</li>
<li>Vé cáp treo Bà Nà Hills khứ hồi</li>
<li>Bữa ăn đầy đủ: 3 bữa sáng buffet, 4 bữa trưa, 3 bữa tối với đặc sản địa phương</li>
<li>Hướng dẫn viên tiếng Việt chuyên nghiệp am hiểu văn hóa miền Trung</li>
<li>Nước uống, khăn lạnh trên xe</li>
<li>Bảo hiểm du lịch suốt hành trình</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 5.200.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 3.800.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
<li>Phụ thu phòng đơn: 2.000.000đ/tour</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 3;

-- Tour 4: Phong Nha - Kẻ Bàng 2N1Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Khám phá động Thiên Đường - hang động khô dài nhất châu Á với hệ thống nhũ đá kỳ ảo</li>
<li>Tham quan động Phong Nha - Di sản thiên nhiên thế giới với dòng sông ngầm huyền bí</li>
<li>Trải nghiệm zipline 400m qua thung lũng sông Chày đầy mạo hiểm</li>
<li>Chèo thuyền kayak khám phá Hang Tối - hang động hoang sơ chưa được khai thác điện</li>
<li>Tắm bùn thiên nhiên tại suối Moọc - trải nghiệm độc đáo giữa rừng nhiệt đới</li>
<li>Khám phá hệ sinh thái rừng nhiệt đới nguyên sinh tại Vườn quốc gia Phong Nha - Kẻ Bàng</li>
<li>Tham quan bảo tàng động vật hoang dã và vườn thú mở Thiên Đường</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Đồng Hới - Phong Nha - Khám phá hang động kỳ vĩ</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Đón khách tại sân bay/ga Đồng Hới, khởi hành đi Phong Nha (45 phút)</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại nhà hàng địa phương với các món đặc sản: khoai lang mật, gà đồi, cá tiến vua</li>
<li><strong>Chiều (13:30):</strong> Tham quan động Thiên Đường - đi bộ 2km khám phá hang động khô dài nhất châu Á, ngắm nhũ đá kỳ ảo</li>
<li><strong>Tối (17:30):</strong> Tham quan động Phong Nha bằng thuyền, chèo qua các hang động trên sông Son, check-in khách sạn, ăn tối</li>
</ul>

<h4>Ngày 2: Sông Chày - Hang Tối - Mạo hiểm và khám phá</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Ăn sáng tại khách sạn, di chuyển đi sông Chày</li>
<li><strong>Trưa (09:00):</strong> Trải nghiệm zipline 400m qua thung lũng sông Chày, tắm bùn thiên nhiên tại suối Moọc</li>
<li><strong>Chiều (11:30):</strong> Ăn trưa picnic giữa rừng nhiệt đới</li>
<li><strong>Tối (14:00):</strong> Chèo thuyền kayak khám phá Hang Tối hoang sơ (hang tối không đèn điện), trở về Đồng Hới, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đưa đón sân bay/ga Đồng Hới - Phong Nha</li>
<li>Khách sạn 2-3 sao tại Phong Nha (1 đêm, 2 người/phòng)</li>
<li>Vé tham quan: động Thiên Đường, động Phong Nha (bao gồm thuyền tham quan)</li>
<li>Thiết bị zipline đạt chuẩn an toàn quốc tế</li>
<li>Thuyền kayak chuyên dụng, áo phao, đèn pin khám phá hang tối</li>
<li>Bữa ăn đầy đủ: 1 bữa sáng, 2 bữa trưa, 1 bữa tối</li>
<li>Hướng dẫn viên địa phương am hiểu về hang động và sinh thái</li>
<li>Bảo hiểm du lịch mạo hiểm</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 2.800.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 2.000.000đ/người</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 4;

-- Tour 5: TP.HCM - Mỹ Tho - Cần Thơ 3N2Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Trải nghiệm đời sống sông nước miệt vườn Nam Bộ đặc trưng với xuồng ba lá</li>
<li>Tham quan chợ nổi Cái Răng - nét văn hóa độc đáo của người miền Tây</li>
<li>Khám phá vườn trái cây trĩu quả tại Cù Lao Thới Sơn, thưởng thức trái cây tươi</li>
<li>Chèo xuồng ba lá len lỏi qua rạch nhỏ, tận hưởng không gian yên bình</li>
<li>Thưởng thức đặc sản miền Tây: bánh xèo Nam Bộ, hủ tiếu Sa Đéc, lẩu mắm</li>
<li>Tham quan Bến Tre - xứ dừa, tìm hiểu nghề làm kẹo dừa truyền thống</li>
<li>Tham quan vườn cò Tân Long - hệ sinh thái đa dạng</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: TP.HCM - Mỹ Tho - Cù Lao Thới Sơn</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Đón khách tại điểm hẹn TP.HCM, khởi hành đi Mỹ Tho (75km)</li>
<li><strong>Trưa (10:30):</strong> Đi tàu thăm Cù Lao Thới Sơn, ăn trưa tại vườn trái cây với đặc sản cá tai tượng chiên xù, trái cây tươi miệt vườn</li>
<li><strong>Chiều (13:30):</strong> Chèo xuồng ba lá len lỏi qua rạch nhỏ, thăm trại ong mật, thưởng thức trà mật ong</li>
<li><strong>Tối (17:00):</strong> Di chuyển về Mỹ Tho, check-in khách sạn 3 sao, tự do khám phá thành phố về đêm</li>
</ul>

<h4>Ngày 2: Mỹ Tho - Cần Thơ - Chợ nổi Cái Răng</h4>
<ul>
<li><strong>Sáng (06:00):</strong> Ăn sáng tại khách sạn, khởi hành đi Cần Thơ (120km)</li>
<li><strong>Trưa (09:00):</strong> Tham quan vườn cò Tân Long, ngắm chim cò bay về tổ (mùa sinh sản)</li>
<li><strong>Chiều (11:30):</strong> Ăn trưa tại Cần Thơ với lẩu mắm đặc sản</li>
<li><strong>Tối (14:00):</strong> Check-in khách sạn 4 sao Cần Thơ, nghỉ ngơi. Buổi tối tự do đi chợ đêm Tây Đô, ăn tối hủ tiếu Sa Đéc</li>
</ul>

<h4>Ngày 3: Cần Thơ - Chợ nổi - TP.HCM</h4>
<ul>
<li><strong>Sáng (05:30):</strong> Tham quan chợ nổi Cái Răng - chợ nổi lớn nhất miền Tây, tận mắt chứng kiến cảnh mua bán trên sông đặc trưng</li>
<li><strong>Trưa (08:30):</strong> Ăn sáng trên chợ nổi với bún riêu, hủ tiếu. Thăm vườn cây ăn trái Phong Điền</li>
<li><strong>Chiều (11:00):</strong> Ăn trưa, khởi hành về TP.HCM</li>
<li><strong>Tối (17:00):</strong> Về đến TP.HCM, đưa khách về điểm hẹn, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đời mới máy lạnh đưa đón suốt tuyến</li>
<li>Khách sạn 2-3 sao tại Mỹ Tho và Cần Thơ (2 người/phòng)</li>
<li>Vé tham quan: Cù Lao Thới Sơn, vườn cò Tân Long, chợ nổi Cái Răng (bao gồm tàu tham quan)</li>
<li>Xuồng ba lá tham quan rạch nhỏ</li>
<li>Bữa ăn đầy đủ: 2 bữa sáng, 3 bữa trưa, 2 bữa tối với đặc sản miền Tây</li>
<li>Hướng dẫn viên tiếng Việt am hiểu văn hóa miền Tây</li>
<li>Nước suối, khăn lạnh trên xe</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 3.500.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 2.500.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 5;

-- Tour 6: Phú Quốc - Đảo Ngọc 3N2Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Thư giãn tại Bãi Sao - bãi biển đẹp nhất Phú Quốc với bãi cát trắng mịn và nước biển xanh trong veo</li>
<li>Lặn ngắm san hô tại đảo Út - khám phá thế giới đại dương đa sắc màu</li>
<li>Câu cá đêm trên biển - trải nghiệm độc đáo và thưởng thức thành quả tại chỗ</li>
<li>Tham quan nhà tù Phú Quốc - di tích lịch sử với hệ thống nhà lao khét tiếng Phú Quốc</li>
<li>Khám phá chợ đêm Dinh Cậu, thưởng thức hải sản tươi sống giá địa phương</li>
<li>Tham quan cơ sở sản xuất nước mắm truyền thống Phú Quốc nổi tiếng khắp cả nước</li>
<li>Thưởng thức rượu sim đặc sản Phú Quốc, mua sắm ngọc trai tại xưởng sản xuất</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: TP.HCM - Phú Quốc - Khám phá đảo ngọc</h4>
<ul>
<li><strong>Sáng (07:00):</strong> Bay từ TP.HCM đến Phú Quốc, đón khách tại sân bay, nhận phòng khách sạn 4 sao gần biển</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại nhà hàng với đặc sản gỏi cá trích, cơm ghẹ</li>
<li><strong>Chiều (14:00):</strong> Tham quan nhà tù Phú Quốc - di tích lịch sử cấp quốc gia, suối Tranh - thác nước tuyệt đẹp giữa rừng</li>
<li><strong>Tối (18:00):</strong> Đi Bãi Sao tắm biển hoàng hôn, ăn tối buffet hải sản tươi sống tại nhà hàng biển, tự do khám phá chợ đêm Dinh Cậu</li>
</ul>

<h4>Ngày 2: Phú Quốc - Đảo Út - Câu cá đêm</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Đi tàu cao tốc ra đảo Út (Hòn Thơm), lặn ngắm san hô với thiết bị đầy đủ, tắm biển tại bãi biển hoang sơ</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa trên đảo với hải sản tươi vừa đánh bắt</li>
<li><strong>Chiều (14:00):</strong> Trở về đất liền, tham quan cơ sở nước mắm Phú Quốc truyền thống, tìm hiểu quy trình ủ chượp</li>
<li><strong>Tối (19:00):</strong> Đi tàu câu cá đêm - trải nghiệm độc đáo, nướng hải sản tươi ngay trên tàu, thưởng thức thành quả</li>
</ul>

<h4>Ngày 3: Phú Quốc - TP.HCM</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tham quan vườn tiêu Phú Quốc, xưởng sản xuất rượu sim, ngọc trai</li>
<li><strong>Trưa (10:30):</strong> Mua sắm đặc sản tại chợ Dương Đông: nước mắm, rượu sim, hải sản khô, ngọc trai</li>
<li><strong>Chiều (12:00):</strong> Ăn trưa, ra sân bay Phú Quốc bay về TP.HCM</li>
<li><strong>Tối (15:00):</strong> Về đến TP.HCM, kết thúc tour đảo ngọc</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Vé máy bay khứ hồi TP.HCM - Phú Quốc (Vietnam Airlines hoặc Vietjet)</li>
<li>Khách sạn 3-4 sao gần biển tại Phú Quốc (2 đêm, 2 người/phòng)</li>
<li>Vé tham quan: nhà tù Phú Quốc, suối Tranh, tàu đi đảo Út, vé lặn ngắm san hô</li>
<li>Thiết bị lặn: kính lặn, ống thở, chân vịt, áo phao</li>
<li>Tàu câu cá đêm trang bị đầy đủ, hướng dẫn viên câu cá chuyên nghiệp</li>
<li>Bữa ăn đầy đủ: 2 bữa sáng buffet, 3 bữa trưa, 2 bữa tối (bao gồm buffet hải sản và câu cá đêm)</li>
<li>Hướng dẫn viên địa phương am hiểu về đảo ngọc</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 6.800.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 4.800.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
<li>Phụ thu phòng đơn: 2.500.000đ/tour</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 6;

-- Tour 7: Nha Trang - Vinpearl 4N3Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Nghỉ dưỡng tại Vinpearl Land - công viên giải trí lớn nhất miền Trung với đầy đủ tiện nghi 5 sao</li>
<li>Trải nghiệm cáp treo vượt biển dài nhất Việt Nam (3.320m) với view biển tuyệt đẹp</li>
<li>Thư giãn tại bãi biển Nha Trang - một trong những bãi biển đẹp nhất Việt Nam</li>
<li>Khám phá thủy cung Vinpearl - một trong những thủy cung lớn nhất Đông Nam Á</li>
<li>Tham gia các trò chơi cảm giác mạnh tại công viên giải trí Vinpearl Land</li>
<li>Spa và massage thư giãn tại resort cao cấp với các liệu pháp chăm sóc sức khỏe</li>
<li>Thưởng thức ẩm thực đa dạng tại các nhà hàng trong resort</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Nha Trang - Vinpearl - Cáp treo vượt biển</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Đón khách tại sân bay/điểm hẹn Nha Trang, đi cáp treo vượt biển ra đảo Vinpearl (3.320m)</li>
<li><strong>Trưa (11:00):</strong> Check-in resort Vinpearl 5 sao, ăn trưa buffet tại nhà hàng resort</li>
<li><strong>Chiều (14:00):</strong> Tham quan thủy cung Vinpearl - ngắm hàng trăm loài sinh vật biển đa dạng</li>
<li><strong>Tối (18:00):</strong> Ăn tối buffet, tự do khám phá công viên giải trí về đêm, nghỉ đêm tại resort view biển</li>
</ul>

<h4>Ngày 2: Vinpearl Land - Công viên giải trí</h4>
<ul>
<li><strong>Sáng (08:30):</strong> Ăn sáng buffet tại resort, tham gia các trò chơi cảm giác mạnh: tàu lượn siêu tốc, đu quay dây văng</li>
<li><strong>Trưa (12:00):</strong> Ăn trưa tại nhà hàng trong công viên</li>
<li><strong>Chiều (14:00):</strong> Xem show cá heo, chim cánh cụt, tham quan vườn thú mở Vinpearl Safari (nếu có)</li>
<li><strong>Tối (17:00):</strong> Spa, massage thư giãn tại resort, ăn tối, nghỉ đêm</li>
</ul>

<h4>Ngày 3: Vinpearl - Nha Trang City Tour</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Trả phòng, đi cáp treo về đất liền</li>
<li><strong>Trưa (10:00):</strong> Tham quan Viện Hải dương học - nơi nuôi dưỡng bộ xương cá voi khổng lồ, chợ Đầm sắm đồ lưu niệm</li>
<li><strong>Chiều (12:00):</strong> Ăn trưa với nem nướng Nha Trang, tắm biển Mỹ Khê</li>
<li><strong>Tối (15:00):</strong> Check-in khách sạn 4 sao trung tâm, tự do khám phá thành phố, ăn tối</li>
</ul>

<h4>Ngày 4: Nha Trang - Kết thúc</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tự do tắm biển, mua sắm đặc sản: yến sào, nem nướng, hải sản khô</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa</li>
<li><strong>Chiều (13:00):</strong> Đưa khách ra sân bay Cam Ranh, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Vé cáp treo khứ hồi Nha Trang - Vinpearl</li>
<li>Resort Vinpearl 5 sao (2 đêm) với đầy đủ tiện nghi: hồ bơi, spa, gym</li>
<li>Vé Vinpearl Land - công viên giải trí (trò chơi không giới hạn)</li>
<li>Vé thủy cung Vinpearl</li>
<li>Khách sạn 4 sao trung tâm Nha Trang (1 đêm)</li>
<li>Bữa ăn đầy đủ: 3 bữa sáng buffet, 3 bữa trưa, 3 bữa tối buffet</li>
<li>Hướng dẫn viên địa phương</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 5.800.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 4.200.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
<li>Phụ thu phòng đơn: 3.000.000đ/tour</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 7;

-- Tour 8: Đà Nẵng - Bà Nà Hills 3N2Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Check-in Cầu Vàng - biểu tượng du lịch mới của Việt Nam, đi bộ giữa biển mây tuyệt đẹp</li>
<li>Tham quan Làng Pháp trên đỉnh núi Bà Nà với kiến trúc châu Âu cổ kính</li>
<li>Trải nghiệm cáp treo Bà Nà - một trong những hệ thống cáp treo dài nhất thế giới</li>
<li>Vui chơi tại Fantasy Park - công viên giải trí trong nhà lớn nhất Đông Nam Á</li>
<li>Tham quan Ngũ Hành Sơn - danh thắng nổi tiếng với các hang động linh thiêng</li>
<li>Tắm biển Mỹ Khê - bãi biển được Forbes bình chọn là một trong 6 bãi biển đẹp nhất hành tinh</li>
<li>Ngắm Cầu Rồng phun lửa và nước vào tối thứ 7 hàng tuần</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Đà Nẵng - Bà Nà Hills - Cầu Vàng</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Đón khách tại sân bay/điểm hẹn Đà Nẵng, khởi hành đi Bà Nà Hills</li>
<li><strong>Trưa (10:00):</strong> Đi cáp treo lên đỉnh núi (dài 5.801m), ăn trưa buffet tại nhà hàng Làng Pháp</li>
<li><strong>Chiều (13:30):</strong> Tham quan Cầu Vàng - đi bộ trên đôi tay khổng lồ nâng đỡ cây cầu, check-in biển mây tuyệt đẹp</li>
<li><strong>Tối (16:30):</strong> Vui chơi tại Fantasy Park với các trò chơi trong nhà, về khách sạn Đà Nẵng, ăn tối, nghỉ đêm</li>
</ul>

<h4>Ngày 2: Đà Nẵng City Tour - Mỹ Khê - Ngũ Hành Sơn</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Đi biển Mỹ Khê tắm biển, tham quan Ngũ Hành Sơn - thăm động Huyền Không, động Linh Nham, chùa Linh Ứng trên núi Thủy Sơn</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa với Mì Quảng đặc sản Đà Nẵng</li>
<li><strong>Chiều (14:00):</strong> Tham quan Cầu Rồng - biểu tượng Đà Nẵng, chợ Hàn mua sắm đặc sản: chả bò, mực rim, bánh khô mè</li>
<li><strong>Tối (18:30):</strong> Ăn tối bánh tráng cuốn thịt heo, tự do dạo bờ sông Hàn ngắm thành phố về đêm (nếu đúng tối thứ 7 xem Cầu Rồng phun lửa)</li>
</ul>

<h4>Ngày 3: Đà Nẵng - Kết thúc</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tự do tắm biển, mua sắm đặc sản</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa</li>
<li><strong>Chiều (13:00):</strong> Trả phòng, đưa khách ra sân bay Đà Nẵng, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Vé cáp treo Bà Nà Hills khứ hồi</li>
<li>Khách sạn 3-4 sao trung tâm Đà Nẵng (2 đêm, 2 người/phòng)</li>
<li>Vé tham quan Ngũ Hành Sơn (bao gồm thang máy lên núi)</li>
<li>Vé Fantasy Park (trò chơi không giới hạn)</li>
<li>Bữa ăn đầy đủ: 2 bữa sáng buffet, 2 bữa trưa, 2 bữa tối</li>
<li>Hướng dẫn viên địa phương</li>
<li>Nước uống, khăn lạnh trên xe</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 4.200.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 3.000.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 8;

-- Tour 9: Sapa - Fansipan 2N1Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Chinh phục đỉnh Fansipan 3.143m - nóc nhà Đông Dương bằng cáp treo hoặc trekking</li>
<li>Trải nghiệm tàu hỏa leo núi Mường Hoa - tuyến tàu hỏa trên cao hiện đại nhất Việt Nam</li>
<li>Ngắm ruộng bậc thang Mường Hoa tuyệt đẹp - di sản văn hóa thế giới</li>
<li>Khám phá bản Cát Cát - làng văn hóa người H''Mông với nghề dệt thổ cẩm truyền thống</li>
<li>Thưởng thức đặc sản Sapa: thắng cố, thịt trâu gác bếp, rượu ngô, cơm lam</li>
<li>Check-in tại nhà thờ đá Sapa - biểu tượng kiến trúc Pháp cổ giữa thị trấn mờ sương</li>
<li>Thăm chợ tình Sapa (nếu vào thứ 7) - nét văn hóa độc đáo của người dân tộc</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Hà Nội - Sapa - Tàu hỏa leo núi</h4>
<ul>
<li><strong>Sáng (06:30):</strong> Xe đón khách tại điểm hẹn Hà Nội, khởi hành đi Sapa bằng xe limousine cao cấp</li>
<li><strong>Trưa (12:00):</strong> Ăn trưa tại nhà hàng Lào Cai, tiếp tục di chuyển lên Sapa</li>
<li><strong>Chiều (15:00):</strong> Đến Sapa, check-in khách sạn 3 sao trung tâm thị trấn, nghỉ ngơi</li>
<li><strong>Tối (17:30):</strong> Tham quan bản Cát Cát - tìm hiểu văn hóa người H''Mông, xem biểu diễn múa dân tộc, ăn tối với thắng cố, đồ nướng, thưởng thức chợ tình (thứ 7)</li>
</ul>

<h4>Ngày 2: Fansipan - Nóc nhà Đông Dương - Hà Nội</h4>
<ul>
<li><strong>Sáng (06:00):</strong> Ăn sáng tại khách sạn, đi tàu hỏa leo núi Mường Hoa đến ga cáp treo Fansipan</li>
<li><strong>Trưa (09:00):</strong> Đi cáp treo lên đỉnh Fansipan (3.143m), tham quan chùa Kim Sơn Bảo Thắng, chụp ảnh tại nóc nhà Đông Dương</li>
<li><strong>Chiều (12:00):</strong> Ăn trưa buffet tại nhà hàng trên đỉnh Fansipan</li>
<li><strong>Tối (14:00):</strong> Xuống núi, di chuyển về Hà Nội, về đến Hà Nội tối, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe limousine đưa đón Hà Nội - Sapa khứ hồi</li>
<li>Vé tàu hỏa leo núi Mường Hoa</li>
<li>Vé cáp treo Fansipan khứ hồi</li>
<li>Khách sạn 2-3 sao trung tâm Sapa (1 đêm, 2 người/phòng)</li>
<li>Vé tham quan bản Cát Cát</li>
<li>Bữa ăn đầy đủ: 1 bữa sáng buffet, 2 bữa trưa, 1 bữa tối với đặc sản Sapa</li>
<li>Hướng dẫn viên địa phương am hiểu văn hóa vùng cao</li>
<li>Nước uống, khăn lạnh trên xe</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 3.200.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 2.400.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 9;

-- Tour 10: Hà Nội - Ninh Bình - Bái Đính - Tràng An
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Tham quan chùa Bái Đính - ngôi chùa lớn nhất Việt Nam với 500 tượng La Hán và tượng Phật bằng đồng lớn nhất châu Á</li>
<li>Di sản thế giới kép Tràng An - danh thắng kết hợp văn hóa và thiên nhiên</li>
<li>Chèo thuyền tam bản khám phá hệ thống hang động: động Lam Cốc, động Vọng Nguyệt, động Thanh Cao</li>
<li>Tham quan đền vua Đinh Tiên Hoàng, đền vua Lê Đại Hành tại cố đô Hoa Lư</li>
<li>Động Tam Cốc - "Vịnh Hạ Long trên cạn" với cảnh sông nước, núi non trùng điệp</li>
<li>Trekking lên núi Múa ngắm toàn cảnh Tam Cốc tuyệt đẹp</li>
<li>Thưởng thức đặc sản Ninh Bình: cơm cháy, dê núi, cá kho gáo, rượu Kim Sơn</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Hà Nội - Ninh Bình - Bái Đính</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Xe đón khách tại điểm hẹn Hà Nội, khởi hành đi Ninh Bình (100km)</li>
<li><strong>Trưa (10:30):</strong> Đến chùa Bái Đính - tham quan quần thể chùa lớn nhất Việt Nam, ngắm 500 tượng La Hán, tượng Phật Thích Ca bằng đồng cao 100 tấn</li>
<li><strong>Chiều (13:00):</strong> Ăn trưa buffet chay tại chùa hoặc nhà hàng địa phương</li>
<li><strong>Tối (15:00):</strong> Check-in khách sạn 3 sao Ninh Bình, nghỉ ngơi. Tối ăn cơm cháy, dê núi Ninh Bình</li>
</ul>

<h4>Ngày 2: Tràng An - Tam Cốc - Hà Nội</h4>
<ul>
<li><strong>Sáng (07:00):</strong> Ăn sáng tại khách sạn, đi Tràng An, chèo thuyền tam bản thăm hệ thống hang động: động Lam Cốc, Vọng Nguyệt, Thanh Cao</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa tại nhà hàng, di chuyển đi Tam Cốc</li>
<li><strong>Chiều (13:30):</strong> Chèo thuyền thăm Tam Cốc (Ba hang: Hang Cả, Hang Hai, Hang Ba), trek lên núi Múa ngắm toàn cảnh Tam Cốc</li>
<li><strong>Tối (16:30):</strong> Thăm cố đô Hoa Lư - đền vua Đinh, vua Lế, khởi hành về Hà Nội, về đến Hà Nội tối, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đời mới đưa đón Hà Nội - Ninh Bình khứ hồi</li>
<li>Khách sạn 2-3 sao tại Ninh Bình (1 đêm, 2 người/phòng)</li>
<li>Vé tham quan: chùa Bái Đính, Tràng An (bao gồm thuyền), Tam Cốc (bao gồm thuyền), cố đô Hoa Lư</li>
<li>Bữa ăn đầy đủ: 1 bữa sáng, 2 bữa trưa, 1 bữa tối với đặc sản Ninh Bình</li>
<li>Hướng dẫn viên chuyên nghiệp</li>
<li>Nước uống, khăn lạnh trên xe</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 1.800.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 1.300.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 10;

-- Tour 11: Hội An - Tour Ẩm Thực Đêm
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Khám phá ẩm thực đường phố Hội An - nơi giao thoa văn hóa Việt - Hoa - Nhật</li>
<li>Thưởng thức bánh mì Phượng nổi tiếng thế giới với hương vị độc đáo</li>
<li>Trải nghiệm Cao Lầu - món ăn biểu tượng chỉ có tại Hội An</li>
<li>Ngắm phố cổ Hội An lung linh đèn lồng đủ màu sắc về đêm</li>
<li>Tham quan các quán ăn cổ truyền thống với không gian kiến trúc độc đáo</li>
<li>Học làm bánh xèo, bánh đúc dưới sự hướng dẫn của đầu bếp địa phương</li>
<li>Thả đèn hoa đăng trên sông Hoài cầu nguyện bình an</li>
<li>Tham quan chợ đêm Hội An sôi động với đa dạng đặc sản</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Đà Nẵng - Hội An - Khám phá ẩm thực đêm</h4>
<ul>
<li><strong>Sáng (14:00):</strong> Đón khách tại Đà Nẵng, di chuyển đi Hội An (30 phút), check-in khách sạn boutique phố cổ</li>
<li><strong>Trưa (15:00):</strong> Bắt đầu tour ẩm thực, thưởng thức bánh mì Phượng - được tạp chí Travel + Leisure bình chọn là một trong những món bánh mì ngon nhất thế giới</li>
<li><strong>Chiều (16:00):</strong> Tham quan quán cà phơi màu, học làm bánh tráng thuần Hội An, thưởng thức Cao Lầu tại quán cổ truyền thống</li>
<li><strong>Tối (18:00):</strong> Đi chợ đêm Hội An, thưởng thức các món ăn vặt: chè đậu đỏ, bánh bao, bánh vạc, bánh khoai</li>
<li><strong>Tối (19:30):</strong> Tham gia lớp học nấu ăn tại nhà hàng: làm bánh xèo, bánh đúc, thưởng thức thành phẩm</li>
<li><strong>Tối (21:00):</strong> Thả đèn hoa đăng trên sông Hoài, dạo phố cổ ngắm đèn lồng, nghỉ đêm tại Hội An</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đưa đón Đà Nẵng - Hội An khứ hồi</li>
<li>Khách sạn boutique 3 sao ngay phố cổ Hội An (1 đêm, 2 người/phòng)</li>
<li>Vé tham quan: các quán ăn cổ, lớp học nấu ăn, chợ đêm</li>
<li>Tất cả các bữa ăn trong lịch trình: bánh mì, Cao Lầu, bánh tráng, đồ ăn vặt, bữa tối học nấu ăn</li>
<li>Đèn hoa đăng để thả trên sông Hoài</li>
<li>Hướng dẫn viên ẩm thực chuyên nghiệp am hiểu văn hóa ẩm thực Hội An</li>
<li>Nước uống, khăn lạnh</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 850.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 600.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 11;

-- Tour 12: Đà Lạt - Thành Phố Ngàn Hoa 4N3Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Khám phá thành phố ngàn hoa với các vườn hoa cẩm chướng, hoa cúc, hoa lavender đẹp mê hồn</li>
<li>Tham quan Dinh Bảo Đại - dinh thự của vị vua cuối cùng triều Nguyễn với kiến trúc Pháp độc đáo</li>
<li>Thung lũng Tình Yêu - thiên đường lãng mạn với hoa và thiên nhiên tuyệt đẹp</li>
<li>Đèo Pongour - một trong những con đèo đẹp nhất Tây Nguyên với view hùng vĩ</li>
<li>Thác Datanla - thác nước hoang sơ với máng trượt alpine coaster độc đáo</li>
<li>Vườn dâu tây Đà Lạt - hái và thưởng thức dâu tươi ngay tại vườn</li>
<li>Chợ đêm Đà Lạt - không gian mua sắm sôi động với đặc sản địa phương</li>
<li>Ga xe lửa Đà Lạt - nhà ga cổ kính với kiến trúc độc đáo</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: TP.HCM - Đà Lạt - Thung lũng Tình Yêu</h4>
<ul>
<li><strong>Sáng (07:00):</strong> Bay từ TP.HCM đến Đà Lạt, đón khách tại sân bay Liên Khương, nhận phòng khách sạn 4 sao</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa với bánh căn, nem nướng Đà Lạt</li>
<li><strong>Chiều (14:00):</strong> Tham quan thung lũng Tình Yêu - ngắm hoa, chụp ảnh tại các góc check-in lãng mạn</li>
<li><strong>Tối (17:30):</strong> Ăn tối lẩu gà lá é - đặc sản Đà Lạt, tự do dạo chợ đêm, nghỉ đêm</li>
</ul>

<h4>Ngày 2: Đà Lạt City Tour - Dinh Bảo Đại - Vườn Hoa</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tham quan Dinh III Bảo Đại - dinh thự xa hoa của vua Bảo Đại với kiến trúc Pháp</li>
<li><strong>Trưa (11:00):</strong> Tham quan vườn hoa thành phố - ngắm hoa cẩm chướng, hoa cúc, hoa lavender, ăn trưa</li>
<li><strong>Chiều (14:00):</strong> Tham quan Ga xe lửa Đà Lạt - nhà ga đẹp nhất Đông Dương, chùa Linh Phước - chùa ve chai độc đáo</li>
<li><strong>Tối (17:00):</strong> Tham quan chợ Đà Lạt mua sắm đặc sản: dâu tây, mứt, rau củ, ăn tối</li>
</ul>

<h4>Ngày 3: Đà Lạt - Đèo Pongour - Thác Datanla</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Khởi hành đi đèo Pongour (40km) - ngắm cảnh đồi núi Tây Nguyên hùng vĩ</li>
<li><strong>Trưa (11:00):</strong> Tham quan thác Datanla - trải nghiệm máng trượt alpine coaster xuyên rừng thông, ăn trưa picnic</li>
<li><strong>Chiều (14:00):</strong> Thăm vườn dâu tây - hái dâu tươi, thưởng thức tại vườn, mua dâu về làm quà</li>
<li><strong>Tối (16:30):</strong> Trở về trung tâm, ăn tối, nghỉ ngơi</li>
</ul>

<h4>Ngày 4: Đà Lạt - TP.HCM</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tự do mua sắm đặc sản: cà phê chồn, mứt, rau củ Đà Lạt, len dệt</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa, ra sân bay Liên Khương</li>
<li><strong>Chiều (13:00):</strong> Bay về TP.HCM, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Vé máy bay khứ hồi TP.HCM - Đà Lạt</li>
<li>Khách sạn 3-4 sao trung tâm Đà Lạt (3 đêm, 2 người/phòng)</li>
<li>Vé tham quan: thung lũng Tình Yêu, Dinh Bảo Đại, vườn hoa, ga xe lửa, chùa Linh Phước, thác Datanla, vườn dâu tây</li>
<li>Vé máng trượt alpine coaster tại thác Datanla</li>
<li>Bữa ăn đầy đủ: 3 bữa sáng buffet, 3 bữa trưa, 3 bữa tối với đặc sản Đà Lạt</li>
<li>Hướng dẫn viên địa phương</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 4.800.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 3.500.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
<li>Phụ thu phòng đơn: 2.000.000đ/tour</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 12;

-- Tour 13: Mộc Châu - Trekking Hang Táu 2N1Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Trekking khám phá hang Táu - hang động hoang sơ với hệ thống nhũ đá kỳ ảo chưa được khai thác du lịch đại trà</li>
<li>Cắm trại qua đêm giữa thiên nhiên hoang sơ, đốt lửa trại, ngắm sao trời</li>
<li>Khám phá văn hóa người Thái tại bản Pa Phách - tìm hiểu nghề dệt thổ cẩm, ẩm thực dân tộc</li>
<li>Thưởng thức chè Shan Tuyết Mộc Châu - một trong những loại trà ngon nhất Việt Nam</li>
<li>Check-in tại đồi chè trái tim Mộc Châu - biểu tượng nông trường chè</li>
<li>Ngắm hoa mận, hoa đào nở trắng núi rừng (mùa xuân tháng 1-2)</li>
<li>Thác Dải Yếm - thác nước hùng vĩ giữa núi rừng Tây Bắc</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Hà Nội - Mộc Châu - Trekking Hang Táu</h4>
<ul>
<li><strong>Sáng (06:00):</strong> Xe đón khách tại Hà Nội, khởi hành đi Mộc Châu (200km)</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại thị trấn Mộc Châu với đặc sản cá suối, rau cải mèo</li>
<li><strong>Chiều (13:30):</strong> Trekking từ bản Pa Phách đến hang Táu (3km), khám phá hang động hoang sơ với nhũ đá kỳ ảo</li>
<li><strong>Tối (17:00):</strong> Dựng lều trại tại khu vực cắm trại, đốt lửa trại BBQ, thưởng thức rượu ngô, cơm lam, gà nướng, ngủ lều giữa thiên nhiên</li>
</ul>

<h4>Ngày 2: Mộc Châu - Đồi Chè - Hà Nội</h4>
<ul>
<li><strong>Sáng (06:00):</strong> Dậy sớm ngắm bình minh, ăn sáng tại trại, thu dọn lều trại</li>
<li><strong>Trưa (09:00):</strong> Tham quan đồi chè trái tim Mộc Châu - check-in, chụp ảnh, thưởng thức chè Shan Tuyết tại vườn</li>
<li><strong>Chiều (11:00):</strong> Tham quan thác Dải Yếm, ăn trưa tại nhà hàng địa phương</li>
<li><strong>Tối (14:00):</strong> Khởi hành về Hà Nội, về đến Hà Nội tối, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đưa đón Hà Nội - Mộc Châu khứ hồi</li>
<li>Lều trại 2 người/lều, túi ngủ, đệm hơi chất lượng cao</li>
<li>Thiết bị trekking: gậy leo núi, đèn pin đội đầu, áo mưa</li>
<li>Bữa ăn đầy đủ: 1 bữa sáng, 2 bữa trưa, 1 bữa tối BBQ, đồ ăn nhẹ trekking</li>
<li>Nước uống, trà chè Shan Tuyết</li>
<li>Hướng dẫn viên trekking chuyên nghiệp có chứng chỉ</li>
<li>Bảo hiểm du lịch mạo hiểm</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 2.200.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 1.600.000đ/người</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 13;

-- Tour 14: Phan Thiết - Mũi Né Resort 3N2Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Nghỉ dưỡng tại resort 4 sao với hồ bơi riêng view biển Mũi Né tuyệt đẹp</li>
<li>Bãi biển Mũi Né - bãi biển đẹp với bãi cát vàng, nước biển xanh ngọc bích</li>
<li>Tham quan đồi cát Mũi Né - "sa mạc nhỏ" của Việt Nam với những đồi cát trải dài</li>
<li>Trải nghiệm trượt cát từ đồi cao - trò chơi thú vị cho mọi lứa tuổi</li>
<li>Thưởng thức hải sản tươi sống: tôm hùm, ghẹ, mực, cá các loại</li>
<li>Làng chài Mũi Né - tìm hiểu đời sống ngư dân, mua hải sản tươi giá gốc</li>
<li>Suối Tiên - dòng suối nước ngọt chảy giữa rừng cây cổ thụ</li>
<li>Tháp Chàm Poshanư - di tích văn hóa Chăm Pa cổ kính</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: TP.HCM - Phan Thiết - Mũi Né Resort</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Xe đón khách tại TP.HCM, khởi hành đi Phan Thiết (200km)</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại Phan Thiết với bánh căn, bánh xèo miền Trung</li>
<li><strong>Chiều (14:00):</strong> Check-in resort 4 sao Mũi Né, nhận phòng view biển, tự do tắm hồ bơi, biển</li>
<li><strong>Tối (18:00):</strong> Ăn tối buffet hải sản tươi sống tại nhà hàng resort, nghỉ đêm</li>
</ul>

<h4>Ngày 2: Mũi Né - Đồi Cát - Làng Chài</h4>
<ul>
<li><strong>Sáng (05:00):</strong> Ngắm bình minh trên biển (tùy chọn), ăn sáng buffet tại resort</li>
<li><strong>Trưa (09:00):</strong> Tham quan đồi cát Mũi Né - trượt cát, chụp ảnh với những đồi cát vàng tuyệt đẹp</li>
<li><strong>Chiều (11:30):</strong> Thăm làng chài Mũi Né, mua hải sản tươi, ăn trưa tại nhà hàng làng chài</li>
<li><strong>Tối (15:00):</strong> Tham quan suối Tiên, tháp Chàm Poshanư, trở về resort tắm biển, ăn tối, nghỉ đêm</li>
</ul>

<h4>Ngày 3: Phan Thiết - TP.HCM</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tự do tắm biển, mua sắm đặc sản: thanh long, nước mắm, hải sản khô</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa, trả phòng</li>
<li><strong>Chiều (13:00):</strong> Khởi hành về TP.HCM, về đến TP.HCM chiều, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Resort 4 sao Mũi Né (2 đêm, 2 người/phòng, view biển/hồ bơi)</li>
<li>Bữa ăn đầy đủ: 2 bữa sáng buffet, 2 bữa trưa, 2 bữa tối (bao gồm buffet hải sản)</li>
<li>Vé tham quan: đồi cát, suối Tiên, tháp Chàm</li>
<li>Dụng cụ trượt cát: ván trượt, tăng tốc</li>
<li>Xe đưa đón TP.HCM - Phan Thiết khứ hồi</li>
<li>Hướng dẫn viên địa phương</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 4.200.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 3.000.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
<li>Phụ thu phòng đơn: 2.000.000đ/tour</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 14;

-- Tour 15: Nha Trang - Tour Trăng Mật 4N3Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Gói trăng mật lãng mạn dành riêng cho cặp đôi mới cưới với nhiều ưu đãi đặc biệt</li>
<li>Bữa tối bãi biển lãng mạn với nến, hoa hồng và rượu vang</li>
<li>Spa trị liệu cho 2 người tại resort 5 sao với các liệu pháp thư giãn</li>
<li>Resort view biển đẹp với phòng nghỉ trang trí hoa tươi, nến thơm</li>
<li>Chụp ảnh cưới ngoại cảnh tại bãi biển Nha Trang với nhiếp ảnh gia chuyên nghiệp (tùy chọn)</li>
<li>Du thuyền tham quan vịnh Nha Phu riêng tư dành cho 2 người</li>
<li>Tặng kèm bánh kem, rượu vang, hoa tươi trong phòng</li>
<li>Ưu tiên dịch vụ tốt nhất, lịch trình riêng tư không gộp đoàn</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: TP.HCM - Nha Trang - Check-in Resort 5 sao</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Bay từ TP.HCM đến Nha Trang, đón riêng bằng xe limousine, nhận phòng resort 5 sao view biển đã trang trí hoa, nến</li>
<li><strong>Trưa (12:00):</strong> Ăn trưa tại nhà hàng resort, nghỉ ngơi</li>
<li><strong>Chiều (15:00):</strong> Spa trị liệu cặp đôi 90 phút: massage, tắm bùn, xông hơi</li>
<li><strong>Tối (18:30):</strong> Bữa tối lãng mạn bãi biển riêng với nến, hoa hồng, rượu vang, hải sản tươi</li>
</ul>

<h4>Ngày 2: Nha Trang - Thư giãn & Riêng tư</h4>
<ul>
<li><strong>Sáng (09:00):</strong> Dậy muộn, ăn sáng tại phòng (room service), tự do tắm biển, hồ bơi</li>
<li><strong>Trưa (12:00):</strong> Ăn trưa, nghỉ ngơi tại resort</li>
<li><strong>Chiều (15:00):</strong> Spa, massage chân, tắm Jacuzzi</li>
<li><strong>Tối (19:00):</strong> Ăn tối tại nhà hàng resort, tự do dạo phố biển</li>
</ul>

<h4>Ngày 3: Nha Trang - Du Thuyền Vịnh Nha Phu</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Du thuyền riêng tham quan vịnh Nha Phu, lặn ngắm san hô, tắm biển tại bãi biển hoang sơ</li>
<li><strong>Trưa (12:00):</strong> Ăn trưa trên du thuyền với hải sản tươi, rượu vang</li>
<li><strong>Chiều (15:00):</strong> Trở về resort, nghỉ ngơi</li>
<li><strong>Tối (18:30):</strong> Bữa tối lãng mạn cuối cùng tại nhà hàng resort, tặng bánh kem trăng mật</li>
</ul>

<h4>Ngày 4: Nha Trang - TP.HCM</h4>
<ul>
<li><strong>Sáng (09:00):</strong> Ăn sáng tại phòng, mua sắm đặc sản: yến sào, ngọc trai, hải sản khô</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa, trả phòng, ra sân bay Cam Ranh</li>
<li><strong>Chiều (14:00):</strong> Bay về TP.HCM, kết thúc tour trăng mật</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Vé máy bay khứ hồi TP.HCM - Nha Trang (hạng thương gia tùy chọn)</li>
<li>Resort 5 sao view biển (3 đêm, phòng đôi tiêu chuẩn honeymoon)</li>
<li>Trang trí phòng: hoa tươi, nến, giường trải cánh hoa</li>
<li>Spa trị liệu cho 2 người: 2 buổi, mỗi buổi 90 phút</li>
<li>Du thuyền riêng tham quan vịnh Nha Phu (1 ngày)</li>
<li>Bữa ăn đầy đủ: 3 bữa sáng (1 bữa room service), 3 bữa trưa, 3 bữa tối (2 bữa lãng mạn bãi biển)</li>
<li>Bánh kem trăng mật, rượu vang, hoa tươi</li>
<li>Xe limousine đón tiễn sân bay riêng</li>
<li>Bảo hiểm du lịch cao cấp</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Cặp đôi: 8.500.000đ/2 người (phòng đôi)</li>
<li>Tour không nhận trẻ em đi kèm</li>
<li>Phụ thu nâng hạng vé máy bay lên thương gia: 3.000.000đ/người</li>
<li>Phụ thu chụp ảnh cưới ngoại cảnh: 2.000.000đ (bao gồm 50 ảnh chỉnh sửa)</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 15;

-- Tour 16: Vũng Tàu - Team Building 2N1Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Chương trình team building chuyên nghiệp do công ty tổ chức sự kiện có uy tín thiết kế và điều hành</li>
<li>Các trò chơi bãi biển sôi động: kéo co, đua thuyền, bóng chuyền bãi biển, đập niêu</li>
<li>Gala dinner đêm thứ 2 với MC chuyên nghiệp, âm thanh ánh sáng hoành tráng</li>
<li>Tham quan tượng Chúa Kitô trên núi Nhỏ - bức tượng Chúa lớn nhất châu Á</li>
<li>Check-in tại Bãi Trước - bãi biển đẹp nhất Vũng Tàu với tượng Chúa phía xa</li>
<li>Hồ Bàu Trũng - cảnh quan thiên nhiên đẹp với hồ nước trong xanh</li>
<li>Bảo tàng vũ khí - tìm hiểu lịch sử quân sự Việt Nam</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: TP.HCM - Vũng Tàu - Team Building Bãi Biển</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Xe đón công ty tại TP.HCM, khởi hành đi Vũng Tàu (125km), chia đội, phát đồng phục</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa tại nhà hàng Vũng Tàu, check-in khách sạn 3-4 sao</li>
<li><strong>Chiều (13:30):</strong> Team building tại bãi biển: kéo co, đua thuyền kayak, bóng chuyền bãi biển, đập niêu, bịt mắt đập nắp chai, tìm kho báu</li>
<li><strong>Tối (18:00):</strong> Gala dinner tại nhà hàng với MC chuyên nghiệp, âm thanh ánh sáng, trao giải, chụp ảnh tập thể, nghỉ đêm</li>
</ul>

<h4>Ngày 2: Vũng Tàu - Tham Quan - TP.HCM</h4>
<ul>
<li><strong>Sáng (07:00):</strong> Ăn sáng, check-out, tham quan tượng Chúa Kitô - leo 800 bậc thang lên đỉnh núi Nhỏ ngắm toàn cảnh Vũng Tàu</li>
<li><strong>Trưa (10:00):</strong> Tham quan Bãi Trước, chụp ảnh tập thể, ăn trưa</li>
<li><strong>Chiều (13:00):</strong> Tham quan bảo tàng vũ khí (tùy chọn), mua sắm đặc sản: bánh khọt, hải sản khô</li>
<li><strong>Tối (15:00):</strong> Khởi hành về TP.HCM, về đến TP.HCM chiều, kết thúc chương trình</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đưa đón TP.HCM - Vũng Tàu khứ hồi (xe 45 chỗ chất lượng cao)</li>
<li>Khách sạn 3-4 sao tại Vũng Tàu (1 đêm, 2-3 người/phòng)</li>
<li>Chương trình team building chuyên nghiệp do đơn vị tổ chức sự kiện uy tín đảm nhiệm</li>
<li>Thiết bị team building đầy đủ: thuyền kayak, dây thừng, bóng, loa đài, bục giải</li>
<li>Gala dinner với MC chuyên nghiệp, âm thanh ánh sáng, sân khấu</li>
<li>Giải thưởng team building: cúp, huy chương, giấy chứng nhận</li>
<li>Bữa ăn đầy đủ: 1 bữa sáng, 2 bữa trưa, 1 bữa tối gala</li>
<li>Nước uống, khăn lạnh suốt hành trình</li>
<li>Bảo hiểm du lịch cho toàn bộ thành viên</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 1.500.000đ/người (tối thiểu 20 người/đoàn)</li>
<li>Trẻ em (5-11 tuổi): 1.000.000đ/người</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí</li>
<li>Giảm 5% cho đoàn trên 50 người</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 16;

-- Tour 17: Quy Nhơn - Eo Gió 3N2Đ
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Kỳ Co - bãi biển hoang sơ đẹp nhất Quy Nhơn với bãi cát trắng mịn, nước biển 3 màu</li>
<li>Eo Gió - "Maldives của Việt Nam" với eo biển ôm trọn giữa hai dãy núi</li>
<li>Tháp Đôi - công trình kiến trúc Chăm Pa cổ độc đáo ngay giữa thành phố</li>
<li>Thưởng thức đặc sản bún chả cá, bánh xèo tôm nhảy, chả ram tôm đất</li>
<li>Hầm Hô - sông nước xanh ngọc bích chảy qua rừng núi</li>
<li>Chùa Núi Vàng - chùa linh thiêng trên đỉnh núi với view thành phố</li>
<li>Làng chài Nhơn Hải - cuộc sống bình dị của ngư dân miền biển</li>
<li>Cù Lao Xanh - đảo hoang sơ với hệ sinh thái san hô đa dạng</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: TP.HCM - Quy Nhơn - Eo Gió - Kỳ Co</h4>
<ul>
<li><strong>Sáng (07:00):</strong> Bay từ TP.HCM đến Quy Nhơn, đón khách tại sân bay Phù Cát, nhận phòng khách sạn 4 sao</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa với bún chả cá Quy Nhơn đặc sản</li>
<li><strong>Chiều (14:00):</strong> Đi cano ra Kỳ Co - bãi biển đẹp nhất Quy Nhơn, tắm biển, chụp ảnh</li>
<li><strong>Tối (17:00):</strong> Tham quan Eo Gió - ngắm cảnh hoàng hôn tuyệt đẹp, ăn tối hải sản tươi, nghỉ đêm</li>
</ul>

<h4>Ngày 2: Quy Nhơn City Tour - Tháp Đôi - Hầm Hô</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tham quan Tháp Đôi - kiến trúc Chăm Pa cổ, chợ Quy Nhơn mua sắm</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa với bánh xèo tôm nhảy, nem nướng</li>
<li><strong>Chiều (14:00):</strong> Tham quan Hầm Hô - đi thuyền trên sông Kút ngắm cảnh thiên nhiên, chùa Núi Vàng</li>
<li><strong>Tối (17:30):</strong> Ăn tối, tự do dạo biển Quy Nhơn, nghỉ đêm</li>
</ul>

<h4>Ngày 3: Quy Nhơn - TP.HCM</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Tham quan làng chài Nhơn Hải, mua sắm đặc sản: chả ram tôm đất, rong biển, cá khô</li>
<li><strong>Trưa (11:00):</strong> Ăn trưa, trả phòng, ra sân bay Phù Cát</li>
<li><strong>Chiều (14:00):</strong> Bay về TP.HCM, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Vé máy bay khứ hồi TP.HCM - Quy Nhơn</li>
<li>Khách sạn 3-4 sao trung tâm Quy Nhơn (2 đêm, 2 người/phòng)</li>
<li>Vé tham quan: Kỳ Co, Eo Gió, Tháp Đôi, Hầm Hô (bao gồm thuyền)</li>
<li>Cano đi Kỳ Co khứ hồi</li>
<li>Bữa ăn đầy đủ: 2 bữa sáng buffet, 2 bữa trưa, 2 bữa tối với đặc sản Quy Nhơn</li>
<li>Hướng dẫn viên địa phương</li>
<li>Bảo hiểm du lịch</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 3.900.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 2.800.000đ/người (ngủ chung giường với bố mẹ)</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí (ngủ chung giường với bố mẹ)</li>
<li>Phụ thu phòng đơn: 1.500.000đ/tour</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 17;

-- Tour 18: Quảng Bình - Sông Chày - Hang Tối
UPDATE TOURS SET description = '<!-- SECTION:highlights -->
<h3>Điểm nổi bật của tour</h3>
<ul>
<li>Zipline 400m qua thung lũng sông Chày - trải nghiệm mạo hiểm đầy cảm giác</li>
<li>Chèo thuyền kayak khám phá Hang Tối - hang động hoang sơ chưa có đèn điện</li>
<li>Tắm bùn thiên nhiên tại suối Moọc - liệu pháp làm đẹp độc đáo</li>
<li>Động Phong Nha - Di sản thiên nhiên thế giới với hệ thống hang động kỳ vĩ</li>
<li>Sông Chày - dòng sông xanh ngọc chảy qua thung lũng đá vôi</li>
<li>Trải nghiệm thiên nhiên hoang dã tại Vườn quốc gia Phong Nha - Kẻ Bàng</li>
<li>Bãi biển Bảo Ninh - bãi biển hoang sơ còn nguyên vẹn nét đẹp tự nhiên</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:itinerary -->
<h3>Lịch trình chi tiết</h3>

<h4>Ngày 1: Đồng Hới - Phong Nha - Sông Chày</h4>
<ul>
<li><strong>Sáng (08:00):</strong> Đón khách tại sân bay/ga Đồng Hới, khởi hành đi Phong Nha</li>
<li><strong>Trưa (11:30):</strong> Ăn trưa tại nhà hàng địa phương với đặc sản: cháo canh, bánh bột lọc, khoai lang mật</li>
<li><strong>Chiều (14:00):</strong> Tham quan động Phong Nha bằng thuyền - ngắm nhũ đá kỳ ảo, khám phá hang Bi Ký, hang Cô Tiên</li>
<li><strong>Tối (17:00):</strong> Check-in khách sạn Phong Nha, ăn tối, nghỉ đêm</li>
</ul>

<h4>Ngày 2: Sông Chày - Hang Tối - Zipline - Đồng Hới</h4>
<ul>
<li><strong>Sáng (07:30):</strong> Ăn sáng, di chuyển đi sông Chày</li>
<li><strong>Trưa (09:00):</strong> Trải nghiệm zipline 400m qua thung lũng sông Chày, tắm bùn thiên nhiên tại suối Moọc</li>
<li><strong>Chiều (11:00):</strong> Ăn trưa picnic, chèo thuyền kayak khám phá Hang Tối hoang sơ (hang không đèn điện, sử dụng đèn pin đội đầu)</li>
<li><strong>Tối (15:00):</strong> Trở về Đồng Hới, tham quan bãi biển Bảo Ninh, ăn tối hải sản, kết thúc tour</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:services -->
<h3>Dịch vụ bao gồm</h3>
<ul>
<li>Xe đưa đón sân bay/ga Đồng Hới - Phong Nha - Đồng Hới</li>
<li>Khách sạn 2-3 sao tại Phong Nha (1 đêm, 2 người/phòng)</li>
<li>Vé tham quan: động Phong Nha (bao gồm thuyền), sông Chày</li>
<li>Thiết bị zipline đạt chuẩn an toàn</li>
<li>Thuyền kayak, đèn pin đội đầu, áo phao khám phá Hang Tối</li>
<li>Bùn tắm thiên nhiên tại suối Moọc</li>
<li>Bữa ăn đầy đủ: 1 bữa sáng, 2 bữa trưa, 1 bữa tối</li>
<li>Hướng dẫn viên địa phương am hiểu về hang động</li>
<li>Bảo hiểm du lịch mạo hiểm</li>
</ul>
<!-- ENDSECTION -->

<!-- SECTION:pricing -->
<h3>Bảng giá chi tiết</h3>
<ul>
<li>Người lớn (từ 12 tuổi): 2.500.000đ/người</li>
<li>Trẻ em (5-11 tuổi): 1.800.000đ/người</li>
<li>Trẻ em dưới 5 tuổi: Miễn phí</li>
</ul>
<!-- ENDSECTION -->' WHERE id = 18;
