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

// Task 1: Relasi Project-Prompt
const promptRepo = require('../repositories/promptRepo');

const addPrompt = async (userId, projectId, promptId) => {
    // 1. Verify Project belongs to User
    const project = await projectRepo.findByIdAndUserId(projectId, userId);
    if (!project) throw new Error('PROJECT_NOT_FOUND');
    
    // 2. Verify Prompt belongs to User
    const prompt = await promptRepo.findByIdAndUserId(promptId, userId);
    if (!prompt) throw new Error('PROMPT_NOT_FOUND');

    return await projectRepo.addPromptToProject(projectId, promptId);
};

const removePrompt = async (userId, projectId, promptId) => {
    // 1. Verify Project belongs to User
    const project = await projectRepo.findByIdAndUserId(projectId, userId);
    if (!project) throw new Error('PROJECT_NOT_FOUND');
    
    // 2. Verify Prompt belongs to User
    const prompt = await promptRepo.findByIdAndUserId(promptId, userId);
    if (!prompt) throw new Error('PROMPT_NOT_FOUND');

    // Pastikan prompt benar-benar di dalam project ini
    if (prompt.project_id !== projectId) {
        throw new Error('PROMPT_NOT_IN_PROJECT');
    }

    return await projectRepo.removePromptFromProject(promptId);
};

module.exports = { create, getAll, getById, update, remove, addPrompt, removePrompt };
