const snippetService = require('../services/snippetService');

const createSnippet = async (req, res, next) => {
    try {
        const newSnippet = await snippetService.create(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: newSnippet });
    } catch (err) {
        next(err);
    }
};

const getSnippets = async (req, res, next) => {
    try {
        const snippets = await snippetService.getAll(req.user.id);
        res.status(200).json({ status: 'success', data: snippets });
    } catch (err) {
        next(err);
    }
};

const getSnippetById = async (req, res, next) => {
    try {
        const snippet = await snippetService.getById(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: snippet });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Snippet not found' });
        next(err);
    }
};

const updateSnippet = async (req, res, next) => {
    try {
        const updated = await snippetService.update(req.user.id, req.params.id, req.body);
        res.status(200).json({ status: 'success', data: updated });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Snippet not found' });
        next(err);
    }
};

const deleteSnippet = async (req, res, next) => {
    try {
        await snippetService.remove(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', message: 'Snippet deleted successfully' });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Snippet not found' });
        next(err);
    }
};

const toggleFavorite = async (req, res, next) => {
    try {
        const result = await snippetService.toggleFavorite(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Snippet not found' });
        next(err);
    }
};

module.exports = { createSnippet, getSnippets, getSnippetById, updateSnippet, deleteSnippet, toggleFavorite };
