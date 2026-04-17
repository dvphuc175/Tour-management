const express = require('express'); 
const router = express.Router(); 
const multer = require('multer'); 
const { storage } = require('../../config/cloudinary'); 
const TourController = require('../../controllers/TourController'); 
const ScheduleController = require('../../controllers/ScheduleController');
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); 
    } else {
        cb(new Error('NOT_AN_IMAGE'), false);
    }
};
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter 
}).array('images', 10);

const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            if (err.message === 'NOT_AN_IMAGE') {
                req.flash('error', 'Chỉ được phép upload file ảnh (JPG, PNG, GIF, WEBP...)!');
            } else if (err.code === 'LIMIT_FILE_SIZE') {
                req.flash('error', 'Kích thước ảnh quá lớn! Tối đa chỉ 5MB/ảnh.');
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                req.flash('error', 'Chỉ được upload tối đa 10 ảnh cùng một lúc!');
            } else {
                req.flash('error', 'Đã xảy ra lỗi khi upload ảnh: ' + err.message);
            }
            return req.session.save(() => {
                res.redirect('/admin/tours/create');
            });
        }
        next(); 
    });
};
// Tours CRUD 
router.get('/', TourController.index); router.get('/create', TourController.showCreate);
router.post('/', uploadMiddleware, TourController.create);
router.get('/:id/edit', TourController.showEdit);
router.put('/:id', uploadMiddleware, TourController.update);
router.delete('/:id', TourController.delete); 
// Schedules — nested dưới tour 
router.get('/:tourId/schedules', ScheduleController.index); 
router.get('/:tourId/schedules/create', ScheduleController.showCreate); 
router.post('/:tourId/schedules', ScheduleController.create); 
module.exports = router;