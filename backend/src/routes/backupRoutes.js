const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

// Task 1: Export Database to JSON
router.get('/export', backupController.exportData);

// Task 2: Import JSON to Database
router.post('/import', upload.single('backup'), backupController.importData);

module.exports = router;
