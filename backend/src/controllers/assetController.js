const assetService = require('../services/assetService');

const createAsset = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }
        
        // Pass file buffer and metadata to service
        const newAsset = await assetService.create(req.user.id, req.file, req.body.project_id);
        res.status(201).json({ status: 'success', data: newAsset });
    } catch (err) {
        next(err);
    }
};

const getAssets = async (req, res, next) => {
    try {
        const assets = await assetService.getAll(req.user.id);
        res.status(200).json({ status: 'success', data: assets });
    } catch (err) {
        next(err);
    }
};

const deleteAsset = async (req, res, next) => {
    try {
        await assetService.remove(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', message: 'Asset deleted successfully' });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Asset not found' });
        next(err);
    }
};

module.exports = { createAsset, getAssets, deleteAsset };
