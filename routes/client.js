const express = require('express'); 
const router = express.Router(); 
const ClientController = require('../controllers/ClientController'); 
const ReviewController = require('../controllers/ReviewController');
const { isAuth } = require('../middlewares/auth');
router.get('/', ClientController.home);
router.get('/about', ClientController.about);
router.get('/contact', ClientController.contact);
router.post('/contact', ClientController.submitContact);
router.get('/tours', ClientController.tourList);
router.get('/tours/:slug', ClientController.tourDetail);
router.post('/reviews', isAuth, ReviewController.create);

// Account routes
router.get('/profile', isAuth, ClientController.showAccount);
router.put('/profile', isAuth, ClientController.updateProfile);
router.put('/profile/password', isAuth, ClientController.updatePassword);

module.exports = router;