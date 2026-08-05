const categoryRepo = require('../repositories/categoryRepo');

exports.create = async (userId, data) => {
    if (!data.name) throw new Error('Category name is required');
    return await categoryRepo.create({ ...data, user_id: userId });
};

exports.getAll = async (userId) => {
    return await categoryRepo.findAll(userId);
};

exports.update = async (userId, id, data) => {
    const existing = await categoryRepo.findById(id, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await categoryRepo.update(id, data);
};

exports.remove = async (userId, id) => {
    const existing = await categoryRepo.findById(id, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await categoryRepo.remove(id);
};
