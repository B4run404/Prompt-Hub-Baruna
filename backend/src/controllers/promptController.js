const promptService = require('../services/promptService');

const createPrompt = async (req, res) => {
    try {
        const userId = req.user.id;
        const promptData = req.body;
        const newPrompt = await promptService.create(userId, promptData);
        res.status(201).json(newPrompt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllPrompts = async (req, res) => {
    try {
        const userId = req.user.id;
        const prompts = await promptService.getAll(userId);
        res.status(200).json(prompts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPromptById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const prompt = await promptService.getById(userId, id);
        
        if (!prompt) {
            return res.status(404).json({ message: 'Prompt not found' });
        }
        
        res.status(200).json(prompt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePrompt = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedPrompt = await promptService.update(userId, id, updateData);
        res.status(200).json(updatedPrompt);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Prompt not found' });
        }
        res.status(400).json({ message: error.message });
    }
};

const deletePrompt = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        await promptService.remove(userId, id);
        res.status(200).json({ message: 'Prompt deleted successfully' });
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Prompt not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPrompt,
    getAllPrompts,
    getPromptById,
    updatePrompt,
    deletePrompt
};
