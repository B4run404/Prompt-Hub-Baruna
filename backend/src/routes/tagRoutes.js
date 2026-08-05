const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', tagController.createTag);
router.get('/', tagController.getAllTags);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;
