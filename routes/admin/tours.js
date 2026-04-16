const express = require('express'); 
const router = express.Router(); 
const multer = require('multer'); 
const { storage } = require('../../config/cloudinary'); 
const TourController = require('../../controllers/TourController'); 
const ScheduleController = require('../../controllers/ScheduleController');
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB/ảnh
// Tours CRUD 
router.get('/', TourController.index); router.get('/create', TourController.showCreate);
router.post('/', upload.array('images', 5), TourController.create); // max 5 ảnh
router.get('/:id/edit', TourController.showEdit);
router.put('/:id', upload.array('images', 5), TourController.update);
router.delete('/:id', TourController.delete); 
// Schedules — nested dưới tour 
router.get('/:tourId/schedules', ScheduleController.index); 
router.get('/:tourId/schedules/create', ScheduleController.showCreate); 
router.post('/:tourId/schedules', ScheduleController.create); 
module.exports = router;