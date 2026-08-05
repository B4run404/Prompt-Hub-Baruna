const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

// Task 1: Export Database to JSON
router.get('/export', backupController.exportData);

module.exports = router;
