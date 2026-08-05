const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/auth');
const { validate, projectSchema } = require('../middlewares/validator');

router.use(authMiddleware);

router.post('/', validate(projectSchema), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', validate(projectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Task 1: API Relasi Project-Prompt
router.post('/:id/prompts/:promptId', projectController.addPromptToProject);
router.delete('/:id/prompts/:promptId', projectController.removePromptFromProject);

// Sprint 9 Task 1: Toggle Favorite
router.patch('/:id/favorite', projectController.toggleFavorite);

module.exports = router;
