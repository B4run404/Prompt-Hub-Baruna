const tagRepo = require('../repositories/tagRepo');

exports.create = async (userId, data) => {
    if (!data.name) throw new Error('Tag name is required');
    return await tagRepo.create({ ...data, user_id: userId });
};

exports.getAll = async (userId) => {
    return await tagRepo.findAll(userId);
};

exports.update = async (userId, id, data) => {
    const existing = await tagRepo.findById(id, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await tagRepo.update(id, data);
};

exports.remove = async (userId, id) => {
    const existing = await tagRepo.findById(id, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await tagRepo.remove(id);
};
