const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const authMiddleware = require('../middlewares/auth');

// Proteksi semua route prompt dengan auth middleware
router.use(authMiddleware);

// Create
router.post('/', promptController.createPrompt);

// Read All
router.get('/', promptController.getAllPrompts);

// Read One
router.get('/:id', promptController.getPromptById);

// Update
router.put('/:id', promptController.updatePrompt);

// Delete
router.delete('/:id', promptController.deletePrompt);


// Sprint 9 Task 1: Toggle Favorite
router.patch('/:id/favorite', promptController.toggleFavorite);

module.exports = router;
