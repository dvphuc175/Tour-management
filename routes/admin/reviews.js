const express          = require('express');
const router           = express.Router();
const AdminUserCtrl    = require('../../controllers/AdminUserController');
const ReviewController = require('../../controllers/ReviewController');

router.get('/',        AdminUserCtrl.reviewIndex);
router.delete('/:id', ReviewController.adminDelete); 

module.exports = router;