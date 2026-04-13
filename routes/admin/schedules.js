const express = require('express');
const router = express.Router();
const ScheduleController = require('../../controllers/ScheduleController');

router.get('/:id/edit', (req, res) => res.send('Trang sửa lịch trình'));

module.exports = router;