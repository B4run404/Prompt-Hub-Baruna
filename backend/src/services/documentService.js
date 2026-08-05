const documentRepo = require('../repositories/documentRepo');

const create = async (userId, data) => {
    return await documentRepo.create({ ...data, user_id: userId });
};

const getAll = async (userId) => {
    return await documentRepo.findManyByUserId(userId);
};

const getById = async (userId, documentId) => {
    const document = await documentRepo.findByIdAndUserId(documentId, userId);
    if (!document) throw new Error('NOT_FOUND');
    return document;
};

const update = async (userId, documentId, updateData) => {
    const existing = await documentRepo.findByIdAndUserId(documentId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await documentRepo.update(documentId, updateData);
};

const remove = async (userId, documentId) => {
    const existing = await documentRepo.findByIdAndUserId(documentId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await documentRepo.remove(documentId);
};

const toggleFavorite = async (userId, documentId) => {
    const existing = await documentRepo.findByIdAndUserId(documentId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await documentRepo.toggleFavorite(documentId, !existing.is_favorite);
};

module.exports = { create, getAll, getById, update, remove, toggleFavorite };
