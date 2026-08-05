const promptService = require('../services/promptService');

const createPrompt = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const promptData = req.body;
        const newPrompt = await promptService.create(userId, promptData);
        res.status(201).json(newPrompt);
    } catch (error) {
        next(error);
    }
};

const getAllPrompts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const prompts = await promptService.getAll(userId);
        res.status(200).json(prompts);
    } catch (error) {
        next(error);
    }
};

const getPromptById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const prompt = await promptService.getById(userId, id);
        
        if (!prompt) {
            return next(new Error('NOT_FOUND'));
        }
        
        res.status(200).json(prompt);
    } catch (error) {
        next(error);
    }
};

const updatePrompt = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedPrompt = await promptService.update(userId, id, updateData);
        res.status(200).json(updatedPrompt);
    } catch (error) {
        next(error);
    }
};

const deletePrompt = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        await promptService.remove(userId, id);
        res.status(200).json({ message: 'Prompt deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const toggleFavorite = async (req, res, next) => {
    try {
        const result = await promptService.toggleFavorite(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Prompt not found' });
        next(err);
    }
};

module.exports = {
    createPrompt,
    getAllPrompts,
    getPromptById,
    updatePrompt,
    deletePrompt,
    toggleFavorite
};
