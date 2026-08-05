const promptRepo = require('../repositories/promptRepo');

const create = async (userId, data) => {
    if (!data.title || !data.content) {
        throw new Error('Title and content are required');
    }
    
    return await promptRepo.create({
        ...data,
        user_id: userId
    });
};

const getAll = async (userId) => {
    return await promptRepo.findManyByUserId(userId);
};

const getById = async (userId, promptId) => {
    return await promptRepo.findByIdAndUserId(promptId, userId);
};

const update = async (userId, id, updateData) => {
    const existing = await promptRepo.findByIdAndUserId(id, userId);
    if (!existing) {
        throw new Error('NOT_FOUND');
    }

    // Trigger Simpan Versi Baru saat Update (Task 5)
    if (updateData.content && existing.content !== updateData.content) {
        const versionCount = await promptRepo.countVersions(id);
        await promptRepo.createVersion(id, existing.content, versionCount + 1);
    }

    return await promptRepo.update(id, updateData);
};

const remove = async (userId, promptId) => {
    // Pastikan prompt adalah milik user
    const existingPrompt = await promptRepo.findByIdAndUserId(promptId, userId);
    if (!existingPrompt) {
        throw new Error('NOT_FOUND');
    }
    
    return await promptRepo.remove(promptId);
};

// Sprint 9 Task 1: Toggle Favorite
const toggleFavorite = async (userId, promptId) => {
    const existing = await promptRepo.findByIdAndUserId(promptId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await promptRepo.toggleFavorite(promptId, !existing.is_favorite);
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    toggleFavorite
};
