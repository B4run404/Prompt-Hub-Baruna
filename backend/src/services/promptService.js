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

const update = async (userId, promptId, updateData) => {
    // Pastikan prompt adalah milik user
    const existingPrompt = await promptRepo.findByIdAndUserId(promptId, userId);
    if (!existingPrompt) {
        throw new Error('NOT_FOUND');
    }
    
    return await promptRepo.update(promptId, updateData);
};

const remove = async (userId, promptId) => {
    // Pastikan prompt adalah milik user
    const existingPrompt = await promptRepo.findByIdAndUserId(promptId, userId);
    if (!existingPrompt) {
        throw new Error('NOT_FOUND');
    }
    
    return await promptRepo.remove(promptId);
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};
