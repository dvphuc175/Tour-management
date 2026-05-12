const express    = require('express');
const router     = express.Router();
const { isAuth, isAdmin } = require('../../middlewares/auth');

// Bảo vệ toàn bộ /admin: yêu cầu đã đăng nhập trước, sau đó kiểm tra quyền admin
router.use(isAuth, isAdmin);

// Dashboard tạm
router.get('/', (req, res) =>
  res.render('admin/dashboard', { title: 'Dashboard', currentPath: req.path })
);

router.use('/categories', require('./categories'));
router.use('/tours', require('./tours'));
router.use('/schedules', require('./schedules'));
router.use('/bookings',   require('./bookings'));
router.use('/users',    require('./users'));
router.use('/reviews',  require('./reviews'));
module.exports = router;