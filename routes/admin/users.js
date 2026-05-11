const express             = require('express');
const router              = express.Router();
const AdminUserController = require('../../controllers/AdminUserController');

router.get('/',                   AdminUserController.index);
router.put('/:id/toggle-status', AdminUserController.toggleStatus);

module.exports = router;