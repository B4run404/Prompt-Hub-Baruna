const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', assetController.createAsset);
router.get('/', assetController.getAssets);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
