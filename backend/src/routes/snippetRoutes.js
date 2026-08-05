const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', snippetController.createSnippet);
router.get('/', snippetController.getSnippets);
router.get('/:id', snippetController.getSnippetById);
router.put('/:id', snippetController.updateSnippet);
router.delete('/:id', snippetController.deleteSnippet);
router.patch('/:id/favorite', snippetController.toggleFavorite);

module.exports = router;
