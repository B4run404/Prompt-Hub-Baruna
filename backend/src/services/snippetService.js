const snippetRepo = require('../repositories/snippetRepo');

const create = async (userId, data) => {
    return await snippetRepo.create({ ...data, user_id: userId });
};

const getAll = async (userId) => {
    return await snippetRepo.findManyByUserId(userId);
};

const getById = async (userId, snippetId) => {
    const snippet = await snippetRepo.findByIdAndUserId(snippetId, userId);
    if (!snippet) throw new Error('NOT_FOUND');
    return snippet;
};

const update = async (userId, snippetId, updateData) => {
    const existing = await snippetRepo.findByIdAndUserId(snippetId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await snippetRepo.update(snippetId, updateData);
};

const remove = async (userId, snippetId) => {
    const existing = await snippetRepo.findByIdAndUserId(snippetId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await snippetRepo.remove(snippetId);
};

const toggleFavorite = async (userId, snippetId) => {
    const existing = await snippetRepo.findByIdAndUserId(snippetId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await snippetRepo.toggleFavorite(snippetId, !existing.is_favorite);
};

module.exports = { create, getAll, getById, update, remove, toggleFavorite };
