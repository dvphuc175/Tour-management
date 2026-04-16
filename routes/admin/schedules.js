const express = require('express'); 
const router = express.Router(); 
const ScheduleController = require('../../controllers/ScheduleController'); 
router.get('/:id/edit', ScheduleController.showEdit); 
router.put('/:id', ScheduleController.update); 
router.delete('/:id', ScheduleController.delete); 
module.exports = router;