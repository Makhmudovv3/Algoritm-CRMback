const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, searchController.globalSearch);


// Standard CRUD
router.get('/', searchController.getAll);
router.get('/:id', searchController.getById);
router.post('/', searchController.create);
router.put('/:id', searchController.update);
router.delete('/:id', searchController.delete);

module.exports = router;
