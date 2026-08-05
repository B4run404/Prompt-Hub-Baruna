const tagService = require('../services/tagService');

exports.createTag = async (req, res, next) => {
    try {
        const result = await tagService.create(req.user.id, req.body);
        res.status(201).json(result);
    } catch (error) { next(error); }
};

exports.getAllTags = async (req, res, next) => {
    try {
        const result = await tagService.getAll(req.user.id);
        res.status(200).json(result);
    } catch (error) { next(error); }
};

exports.updateTag = async (req, res, next) => {
    try {
        const result = await tagService.update(req.user.id, req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) { next(error); }
};

exports.deleteTag = async (req, res, next) => {
    try {
        await tagService.remove(req.user.id, req.params.id);
        res.status(200).json({ message: 'Tag deleted' });
    } catch (error) { next(error); }
};
