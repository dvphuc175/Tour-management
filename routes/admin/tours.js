const express = require('express');
const router = express.Router();
const TourController = require('../../controllers/TourController');


router.get('/', TourController.index);
router.get('/create', TourController.showCreate);
router.post('/', (req, res) => res.send('Đang xử lý tạo tour...')); // Tạm thời
router.get('/:id/edit', TourController.showEdit);


router.get('/:tourId/schedules', (req, res) => res.render('admin/schedules/index', { title: 'Lịch trình tour' }));

module.exports = router;