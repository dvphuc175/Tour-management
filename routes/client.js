const express = require('express'); 
const router = express.Router(); 
const ClientController = require('../controllers/ClientController'); 
router.get('/', ClientController.home); 
router.get('/tours', ClientController.tourList);
router.get('/tours/:slug', ClientController.tourDetail);
module.exports = router;