const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const authMiddleware = require('../middlewares/auth');
const { validate, templateSchema } = require('../middlewares/validator');

router.use(authMiddleware);

router.post('/', validate(templateSchema), templateController.createTemplate);
router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplateById);
router.put('/:id', validate(templateSchema), templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
