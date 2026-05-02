const express             = require('express');
const router              = express.Router();
const AdminBookingCtrl    = require('../../controllers/AdminBookingController');

router.get('/',                          AdminBookingCtrl.index);
router.get('/:id',                       AdminBookingCtrl.detail);
router.put('/:id/confirm',              AdminBookingCtrl.confirm);   
router.put('/:id/complete',             AdminBookingCtrl.complete);  
router.put('/:id/cancel',               AdminBookingCtrl.cancel);

module.exports = router;