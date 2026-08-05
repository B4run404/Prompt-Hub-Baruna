const projectRepo = require('../repositories/projectRepo');

const create = async (userId, data) => {
    return await projectRepo.create({ ...data, user_id: userId });
};
const getAll = async (userId) => projectRepo.findManyByUserId(userId);
const getById = async (userId, projectId) => {
    const project = await projectRepo.findByIdAndUserId(projectId, userId);
    if (!project) throw new Error('NOT_FOUND');
    return project;
};
const update = async (userId, projectId, updateData) => {
    const existing = await projectRepo.findByIdAndUserId(projectId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await projectRepo.update(projectId, updateData);
};
const remove = async (userId, projectId) => {
    const existing = await projectRepo.findByIdAndUserId(projectId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await projectRepo.remove(projectId);
};
module.exports = { create, getAll, getById, update, remove };
