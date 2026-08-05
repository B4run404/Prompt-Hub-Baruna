const projectService = require('../services/projectService');

const createProject = async (req, res, next) => {
    try {
        const project = await projectService.create(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: project });
    } catch (err) { next(err); }
};
const getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getAll(req.user.id);
        res.status(200).json({ status: 'success', data: projects });
    } catch (err) { next(err); }
};
const getProjectById = async (req, res, next) => {
    try {
        const project = await projectService.getById(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: project });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Project not found' });
        next(err);
    }
};
const updateProject = async (req, res, next) => {
    try {
        const project = await projectService.update(req.user.id, req.params.id, req.body);
        res.status(200).json({ status: 'success', data: project });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Project not found' });
        next(err);
    }
};
const deleteProject = async (req, res, next) => {
    try {
        await projectService.remove(req.user.id, req.params.id);
        res.status(204).send();
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Project not found' });
        next(err);
    }
};

const addPromptToProject = async (req, res, next) => {
    try {
        await projectService.addPrompt(req.user.id, req.params.id, req.params.promptId);
        res.status(200).json({ status: 'success', message: 'Prompt added to project successfully' });
    } catch (err) {
        if (err.message === 'PROJECT_NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Project not found' });
        if (err.message === 'PROMPT_NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Prompt not found' });
        next(err);
    }
};

const removePromptFromProject = async (req, res, next) => {
    try {
        await projectService.removePrompt(req.user.id, req.params.id, req.params.promptId);
        res.status(200).json({ status: 'success', message: 'Prompt removed from project successfully' });
    } catch (err) {
        if (err.message === 'PROJECT_NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Project not found' });
        if (err.message === 'PROMPT_NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Prompt not found' });
        if (err.message === 'PROMPT_NOT_IN_PROJECT') return res.status(400).json({ status: 'error', message: 'Prompt is not in this project' });
        next(err);
    }
};

const toggleFavorite = async (req, res, next) => {
    try {
        const result = await projectService.toggleFavorite(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Project not found' });
        next(err);
    }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, addPromptToProject, removePromptFromProject, toggleFavorite };
