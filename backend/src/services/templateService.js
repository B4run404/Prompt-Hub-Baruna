const templateRepo = require('../repositories/templateRepo');

const create = async (userId, data) => {
    return await templateRepo.create({ ...data, user_id: userId });
};

const getAll = async (userId) => {
    return await templateRepo.findManyByUserId(userId);
};

const getById = async (userId, id) => {
    const template = await templateRepo.findByIdAndUserId(id, userId);
    if (!template) throw new Error('NOT_FOUND');
    return template;
};

const update = async (userId, id, data) => {
    const existing = await templateRepo.findByIdAndUserId(id, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await templateRepo.update(id, data);
};

const remove = async (userId, id) => {
    const existing = await templateRepo.findByIdAndUserId(id, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await templateRepo.remove(id);
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};
