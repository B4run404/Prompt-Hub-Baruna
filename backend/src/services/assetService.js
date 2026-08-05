const assetRepo = require('../repositories/assetRepo');

const create = async (userId, data) => {
    return await assetRepo.create({ ...data, user_id: userId });
};

const getAll = async (userId) => {
    return await assetRepo.findManyByUserId(userId);
};

const getById = async (userId, assetId) => {
    const asset = await assetRepo.findByIdAndUserId(assetId, userId);
    if (!asset) throw new Error('NOT_FOUND');
    return asset;
};

const remove = async (userId, assetId) => {
    const existing = await assetRepo.findByIdAndUserId(assetId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await assetRepo.remove(assetId);
};

module.exports = { create, getAll, getById, remove };
