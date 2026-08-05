const projectRepo = require('../repositories/projectRepo');

// Task 4: Perhitungan Progress Bar
const calculateProgressAndStatus = (data) => {
    if (data.status === 'Completed') {
        data.progress = 100;
    } else if (data.progress >= 100) {
        data.progress = 100;
        data.status = 'Completed';
    } else if (data.progress < 0) {
        data.progress = 0;
    }
    return data;
};

const create = async (userId, data) => {
    const computedData = calculateProgressAndStatus({ ...data });
    return await projectRepo.create({ ...computedData, user_id: userId });
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
    const computedData = calculateProgressAndStatus({ ...updateData });
    return await projectRepo.update(projectId, computedData);
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

const toggleFavorite = async (userId, projectId) => {
    const existing = await projectRepo.findByIdAndUserId(projectId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    return await projectRepo.toggleFavorite(projectId, !existing.is_favorite);
};

module.exports = { create, getAll, getById, update, remove, addPrompt, removePrompt, toggleFavorite };
