const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middlewares/auth');
const { validate, documentSchema } = require('../middlewares/validator');

router.use(authMiddleware);

router.post('/', validate(documentSchema), documentController.createDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.put('/:id', validate(documentSchema), documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.patch('/:id/favorite', documentController.toggleFavorite);

module.exports = router;
