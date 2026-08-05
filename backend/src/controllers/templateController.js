const templateService = require('../services/templateService');

const createTemplate = async (req, res, next) => {
    try {
        const newTemplate = await templateService.create(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: newTemplate });
    } catch (err) {
        next(err);
    }
};

const getTemplates = async (req, res, next) => {
    try {
        const templates = await templateService.getAll(req.user.id);
        res.status(200).json({ status: 'success', data: templates });
    } catch (err) {
        next(err);
    }
};

const getTemplateById = async (req, res, next) => {
    try {
        const template = await templateService.getById(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: template });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Template not found' });
        next(err);
    }
};

const updateTemplate = async (req, res, next) => {
    try {
        const updated = await templateService.update(req.user.id, req.params.id, req.body);
        res.status(200).json({ status: 'success', data: updated });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Template not found' });
        next(err);
    }
};

const deleteTemplate = async (req, res, next) => {
    try {
        await templateService.remove(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', message: 'Template deleted successfully' });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Template not found' });
        next(err);
    }
};

module.exports = {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate
};
