const express = require('express');
const router = express.Router();
const AdminLogController = require('../../controllers/AdminLogController');

router.get('/', AdminLogController.index);

module.exports = router;
