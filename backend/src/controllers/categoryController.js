const categoryService = require('../services/categoryService');

exports.createCategory = async (req, res, next) => {
    try {
        const result = await categoryService.create(req.user.id, req.body);
        res.status(201).json(result);
    } catch (error) { next(error); }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const result = await categoryService.getAll(req.user.id);
        res.status(200).json(result);
    } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const result = await categoryService.update(req.user.id, req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        await categoryService.remove(req.user.id, req.params.id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) { next(error); }
};
