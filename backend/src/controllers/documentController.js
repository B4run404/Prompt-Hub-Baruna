const documentService = require('../services/documentService');

const createDocument = async (req, res, next) => {
    try {
        const newDocument = await documentService.create(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: newDocument });
    } catch (err) {
        next(err);
    }
};

const getDocuments = async (req, res, next) => {
    try {
        const documents = await documentService.getAll(req.user.id);
        res.status(200).json({ status: 'success', data: documents });
    } catch (err) {
        next(err);
    }
};

const getDocumentById = async (req, res, next) => {
    try {
        const document = await documentService.getById(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: document });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Document not found' });
        next(err);
    }
};

const updateDocument = async (req, res, next) => {
    try {
        const updated = await documentService.update(req.user.id, req.params.id, req.body);
        res.status(200).json({ status: 'success', data: updated });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Document not found' });
        next(err);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        await documentService.remove(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', message: 'Document deleted successfully' });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Document not found' });
        next(err);
    }
};

const toggleFavorite = async (req, res, next) => {
    try {
        const result = await documentService.toggleFavorite(req.user.id, req.params.id);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: 'Document not found' });
        next(err);
    }
};

module.exports = { createDocument, getDocuments, getDocumentById, updateDocument, deleteDocument, toggleFavorite };
