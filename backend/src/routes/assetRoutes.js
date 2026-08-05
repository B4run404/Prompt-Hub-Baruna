const express = require('express');
const router = express.Router();
const multer = require('multer');
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/auth');

// Multer memory storage configuration with 10MB limit
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

router.use(authMiddleware);

router.post('/', upload.single('file'), assetController.createAsset);
router.get('/', assetController.getAssets);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
