const express = require('express');
const router = express.Router();

router.get('/:id/edit', (req, res) => res.send('Trang sửa lịch trình'));

module.exports = router;