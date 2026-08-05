const express = require('express');
const router = express.Router();
const multer = require('multer');
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/auth');

// Multer memory storage configuration
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/', upload.single('file'), assetController.createAsset);
router.get('/', assetController.getAssets);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
