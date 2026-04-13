const express = require('express');
const router = express.Router();
const TourController = require('../../controllers/TourController');
const ScheduleController = require('../../controllers/ScheduleController');


router.get('/', TourController.index);
router.get('/create', TourController.showCreate);
router.post('/', (req, res) => res.send('Đang xử lý tạo tour...')); // Tạm thời
router.get('/:id/edit', TourController.showEdit);


router.get('/:tourId/schedules', ScheduleController.index);
router.get('/:tourId/schedules/create', ScheduleController.showCreate);
module.exports = router;