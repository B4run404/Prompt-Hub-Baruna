const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');
const authMiddleware = require('../middlewares/auth');
const { validate, snippetSchema } = require('../middlewares/validator');

router.use(authMiddleware);

router.post('/', validate(snippetSchema), snippetController.createSnippet);
router.get('/', snippetController.getSnippets);
router.get('/:id', snippetController.getSnippetById);
router.put('/:id', validate(snippetSchema), snippetController.updateSnippet);
router.delete('/:id', snippetController.deleteSnippet);
router.patch('/:id/favorite', snippetController.toggleFavorite);

module.exports = router;
