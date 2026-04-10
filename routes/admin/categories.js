const express             = require('express');
const router              = express.Router();
const CategoryController  = require('../../controllers/CategoryController');

router.get('/',              CategoryController.index);
router.get('/create',       CategoryController.showCreate);
router.post('/',             CategoryController.create);
router.get('/:id/edit',     CategoryController.showEdit);
router.put('/:id',           CategoryController.update);    // method-override PUT
router.delete('/:id',        CategoryController.delete);    // method-override DELETE

module.exports = router;