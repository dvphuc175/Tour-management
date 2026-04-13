const express    = require('express');
const router     = express.Router();
const { isAdmin }= require('../../middlewares/auth');

// Bảo vệ toàn bộ /admin bằng isAdmin
router.use(isAdmin);

// Dashboard tạm
router.get('/', (req, res) =>
  res.render('admin/dashboard', { title: 'Dashboard', currentPath: req.path })
);

router.use('/categories', require('./categories'));
router.use('/tours', require('./tours'));
router.use('/schedules', require('./schedules'));

module.exports = router;